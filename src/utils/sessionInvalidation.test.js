import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

import axios from "axios";
import {
  __sessionInvalidationTestUtils,
  clearPersistedAuthState,
  handleSessionInvalidated,
  isSessionInvalidAuthCode,
  isSessionInvalidAuthError,
  isSessionInvalidated,
  registerAuthRetryAbort,
  resetSessionInvalidationGuard,
  SESSION_INVALID_CODES,
} from "./sessionInvalidation";
import { isRefreshDead } from "./tokenRefresh";

describe("sessionInvalidation", () => {
  beforeEach(() => {
    __sessionInvalidationTestUtils.resetForTests();
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();

    localStorage.setItem("token", "stale.jwt.token");
    localStorage.setItem("businessDetails", JSON.stringify({ name: "Amir" }));
    localStorage.setItem("dashboardStats", "{}");
    localStorage.setItem("impersonatedBy", "admin-1");

    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        pathname: "/business/abc/dashboard",
        href: "https://app.test/business/abc/dashboard",
        replace: vi.fn(),
      },
    });
  });

  it("recognizes only SESSION_REVOKED and AUTH_VERSION_MISMATCH", () => {
    expect(SESSION_INVALID_CODES).toEqual([
      "SESSION_REVOKED",
      "AUTH_VERSION_MISMATCH",
    ]);
    expect(isSessionInvalidAuthCode("SESSION_REVOKED")).toBe(true);
    expect(isSessionInvalidAuthCode("AUTH_VERSION_MISMATCH")).toBe(true);
    expect(isSessionInvalidAuthCode("TOKEN_EXPIRED")).toBe(false);
    expect(isSessionInvalidAuthCode("NO_REFRESH_TOKEN")).toBe(false);
    expect(
      isSessionInvalidAuthError({ response: { data: { code: "SESSION_REVOKED" } } })
    ).toBe(true);
    expect(
      isSessionInvalidAuthError({ response: { data: { code: "TOKEN_EXPIRED" } } })
    ).toBe(false);
  });

  it("atomically clears auth state and redirects once to /login", () => {
    const abortRetries = vi.fn();
    registerAuthRetryAbort(abortRetries);

    const first = handleSessionInvalidated({ code: "SESSION_REVOKED" });
    const second = handleSessionInvalidated({ code: "AUTH_VERSION_MISMATCH" });

    expect(first.alreadyHandled).toBe(false);
    expect(second.alreadyHandled).toBe(true);
    expect(isSessionInvalidated()).toBe(true);
    expect(abortRetries).toHaveBeenCalledTimes(1);

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("businessDetails")).toBeNull();
    expect(localStorage.getItem("dashboardStats")).toBeNull();
    expect(localStorage.getItem("impersonatedBy")).toBeNull();
    expect(isRefreshDead()).toBe(true);

    expect(window.location.replace).toHaveBeenCalledTimes(1);
    expect(window.location.replace).toHaveBeenCalledWith("/login");
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/logout$/),
      null,
      { withCredentials: true }
    );
  });

  it("does not redirect-loop when already on /login", () => {
    window.location.pathname = "/login";
    handleSessionInvalidated({ code: "AUTH_VERSION_MISMATCH" });
    expect(window.location.replace).not.toHaveBeenCalled();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("resetSessionInvalidationGuard allows a fresh login session", () => {
    handleSessionInvalidated({ code: "SESSION_REVOKED", redirect: false });
    expect(isSessionInvalidated()).toBe(true);

    resetSessionInvalidationGuard();
    expect(isSessionInvalidated()).toBe(false);
    expect(isRefreshDead()).toBe(false);

    localStorage.setItem("token", "new.token");
    const again = handleSessionInvalidated({
      code: "AUTH_VERSION_MISMATCH",
      redirect: false,
    });
    expect(again.alreadyHandled).toBe(false);
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("clearPersistedAuthState removes auth keys without redirect", () => {
    clearPersistedAuthState({ clearDashboardRoute: false });
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("businessDetails")).toBeNull();
    expect(window.location.replace).not.toHaveBeenCalled();
  });
});