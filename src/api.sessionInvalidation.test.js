import { beforeEach, describe, expect, it, vi } from "vitest";

const handleSessionInvalidated = vi.fn(() => ({ alreadyHandled: false }));
const isSessionInvalidAuthCode = vi.fn(
  (code) => code === "SESSION_REVOKED" || code === "AUTH_VERSION_MISMATCH"
);
const isSessionInvalidated = vi.fn(() => false);
const registerAuthRetryAbort = vi.fn();

vi.mock("./utils/sessionInvalidation", () => ({
  handleSessionInvalidated,
  isSessionInvalidAuthCode,
  isSessionInvalidated,
  registerAuthRetryAbort,
}));

vi.mock("./utils/tokenRefresh", () => ({
  getValidAccessToken: vi.fn(),
  isAccessTokenExpired: vi.fn(() => false),
  isHardRefreshFailure: vi.fn(() => false),
  isRefreshDead: vi.fn(() => false),
  registerAuthHeaderSetter: vi.fn((setter) => {
    setter?.(null);
  }),
  refreshAccessTokenOnce: vi.fn(),
  shouldAttemptRefresh: vi.fn(() => true),
}));

vi.mock("./utils/adminTenant", () => ({
  getAdminActiveBusinessId: () => null,
  getBusinessIdFromPath: () => null,
}));

describe("API interceptor session invalidation", () => {
  beforeEach(() => {
    vi.resetModules();
    handleSessionInvalidated.mockClear();
    isSessionInvalidAuthCode.mockClear();
    isSessionInvalidated.mockReturnValue(false);
    localStorage.clear();
  });

  it("logs out on SESSION_REVOKED without attempting refresh", async () => {
    const { refreshAccessTokenOnce } = await import("./utils/tokenRefresh");
    const API = (await import("./api")).default;

    await expect(
      API.get("/business/my/notifications", {
        adapter: async (config) => {
          const error = new Error("Unauthorized");
          error.config = config;
          error.response = {
            status: 401,
            headers: { "content-type": "application/json" },
            data: {
              code: "SESSION_REVOKED",
              error: "session cancelled",
            },
          };
          throw error;
        },
      })
    ).rejects.toThrow(/session cancelled/);

    expect(isSessionInvalidAuthCode).toHaveBeenCalledWith("SESSION_REVOKED");
    expect(handleSessionInvalidated).toHaveBeenCalledWith({
      code: "SESSION_REVOKED",
    });
    expect(refreshAccessTokenOnce).not.toHaveBeenCalled();
  });

  it("logs out on AUTH_VERSION_MISMATCH without attempting refresh", async () => {
    const { refreshAccessTokenOnce } = await import("./utils/tokenRefresh");
    const API = (await import("./api")).default;

    await expect(
      API.get("/auth/me", {
        adapter: async (config) => {
          const error = new Error("Unauthorized");
          error.config = config;
          error.response = {
            status: 401,
            headers: { "content-type": "application/json" },
            data: {
              code: "AUTH_VERSION_MISMATCH",
              error: "session cancelled",
            },
          };
          throw error;
        },
      })
    ).rejects.toThrow(/session cancelled/);

    expect(handleSessionInvalidated).toHaveBeenCalledWith({
      code: "AUTH_VERSION_MISMATCH",
    });
    expect(refreshAccessTokenOnce).not.toHaveBeenCalled();
  });

  it("still attempts refresh for ordinary TOKEN_EXPIRED 401s", async () => {
    isSessionInvalidAuthCode.mockImplementation(() => false);
    const { refreshAccessTokenOnce } = await import("./utils/tokenRefresh");
    refreshAccessTokenOnce.mockResolvedValue("new.token");
    localStorage.setItem("token", "old.token");

    const API = (await import("./api")).default;
    let calls = 0;

    const result = await API.get("/business/my/notifications", {
      adapter: async (config) => {
        calls += 1;
        if (calls === 1) {
          const error = new Error("Unauthorized");
          error.config = config;
          error.response = {
            status: 401,
            headers: { "content-type": "application/json" },
            data: { code: "TOKEN_EXPIRED", error: "expired" },
          };
          throw error;
        }
        return {
          data: { ok: true },
          status: 200,
          statusText: "OK",
          headers: { "content-type": "application/json" },
          config,
        };
      },
    });

    expect(refreshAccessTokenOnce).toHaveBeenCalledTimes(1);
    expect(handleSessionInvalidated).not.toHaveBeenCalled();
    expect(result.data).toEqual({ ok: true });
  });
});