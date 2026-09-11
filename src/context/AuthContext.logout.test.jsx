import React, { useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const clearPushEnabledPreferenceCache = vi.fn();
const markRefreshDead = vi.fn();
const apiPost = vi.fn().mockResolvedValue({ data: {} });
const setAuthToken = vi.fn();

vi.mock("../utils/pushPreference", () => ({
  clearPushEnabledPreferenceCache: (...args) =>
    clearPushEnabledPreferenceCache(...args),
}));

vi.mock("../api", () => ({
  default: {
    post: (...args) => apiPost(...args),
    get: vi.fn(),
    defaults: { headers: { common: {} } },
  },
  setAuthToken: (...args) => setAuthToken(...args),
}));

vi.mock("../socket", () => ({
  default: vi.fn(),
}));

vi.mock("../utils/tokenRefresh", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    shouldAttemptRefresh: vi.fn(() => false),
    refreshAccessTokenOnce: vi.fn(),
    getValidAccessToken: vi.fn(async () => null),
    isAccessTokenExpired: vi.fn(() => true),
    markRefreshDead: (...args) => markRefreshDead(...args),
    clearRefreshDead: vi.fn(),
  };
});

vi.mock("../utils/publicSiteHost", () => ({
  isPublicCustomerSiteHost: () => false,
}));

vi.mock("../i18n/persistLanguage", () => ({
  syncLanguageOnLogin: vi.fn(),
}));

vi.mock("../components/AdminSoftphone", () => ({
  disconnectSoftphoneVoip: vi.fn(),
}));

import { AuthProvider, useAuth } from "./AuthContext";

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="path">{location.pathname}</div>;
}

function AuthProbe({ apiRef }) {
  const auth = useAuth();

  useEffect(() => {
    apiRef.current = auth;
  }, [auth, apiRef]);

  return (
    <div>
      <span data-testid="loading">{String(auth.loading)}</span>
      <span data-testid="initialized">{String(auth.initialized)}</span>
      <span data-testid="user">{auth.user?.email || ""}</span>
      <span data-testid="token">{auth.token || ""}</span>
    </div>
  );
}

function renderAuth(apiRef) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  queryClient.setQueryData(["business", "crm", "biz-1"], { secret: "tenant-a" });

  const view = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/business/biz-1/dashboard/dashboard"]}>
        <AuthProvider>
          <AuthProbe apiRef={apiRef} />
          <LocationProbe />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );

  return { ...view, queryClient };
}

describe("AuthContext logout resilience", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    clearPushEnabledPreferenceCache.mockReset();
    clearPushEnabledPreferenceCache.mockImplementation(() => {});
    markRefreshDead.mockReset();
    apiPost.mockReset();
    apiPost.mockResolvedValue({ data: {} });
    setAuthToken.mockReset();
  });

  async function seedAuthenticatedSession(apiRef) {
    await waitFor(() => {
      expect(apiRef.current?.initialized).toBe(true);
    });

    await act(async () => {
      apiRef.current.loginWithToken(
        {
          email: "owner@example.com",
          role: "business",
          businessId: "biz-1",
          hasAccess: true,
          hasPaid: true,
        },
        "access-token-1",
        { skipRedirect: true }
      );
    });

    await waitFor(() => {
      expect(apiRef.current?.user?.email).toBe("owner@example.com");
      expect(apiRef.current?.token).toBe("access-token-1");
    });
  }

  it("clears auth state, React Query cache, and navigates to /login", async () => {
    const apiRef = { current: null };
    const { queryClient, getByTestId } = renderAuth(apiRef);

    await seedAuthenticatedSession(apiRef);
    expect(queryClient.getQueryData(["business", "crm", "biz-1"])).toEqual({
      secret: "tenant-a",
    });

    await act(async () => {
      await apiRef.current.logout();
    });

    await waitFor(() => {
      expect(getByTestId("loading").textContent).toBe("false");
      expect(getByTestId("user").textContent).toBe("");
      expect(getByTestId("token").textContent).toBe("");
      expect(getByTestId("path").textContent).toBe("/login");
    });

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("businessDetails")).toBeNull();
    expect(queryClient.getQueryData(["business", "crm", "biz-1"])).toBeUndefined();
    expect(clearPushEnabledPreferenceCache).toHaveBeenCalled();
    expect(markRefreshDead).toHaveBeenCalled();
    expect(setAuthToken).toHaveBeenCalledWith(null);
  });

  it("still completes logout when clearPushEnabledPreferenceCache throws", async () => {
    clearPushEnabledPreferenceCache.mockImplementation(() => {
      throw new Error("push cache boom");
    });

    const apiRef = { current: null };
    const { queryClient, getByTestId } = renderAuth(apiRef);

    await seedAuthenticatedSession(apiRef);

    await act(async () => {
      await apiRef.current.logout();
    });

    await waitFor(() => {
      expect(getByTestId("loading").textContent).toBe("false");
      expect(getByTestId("user").textContent).toBe("");
      expect(getByTestId("path").textContent).toBe("/login");
    });

    expect(queryClient.getQueryData(["business", "crm", "biz-1"])).toBeUndefined();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("login after logout clears sticky loading and restores user", async () => {
    const apiRef = { current: null };
    const { getByTestId } = renderAuth(apiRef);

    await seedAuthenticatedSession(apiRef);

    await act(async () => {
      await apiRef.current.logout();
    });

    await waitFor(() => {
      expect(getByTestId("loading").textContent).toBe("false");
      expect(getByTestId("path").textContent).toBe("/login");
    });

    apiPost.mockResolvedValueOnce({
      data: {
        accessToken: "access-token-2",
        user: {
          email: "other@example.com",
          role: "business",
          businessId: "biz-2",
          hasAccess: true,
          hasPaid: true,
        },
      },
    });

    await act(async () => {
      await apiRef.current.login("other@example.com", "secret", {
        skipRedirect: true,
      });
    });

    await waitFor(() => {
      expect(getByTestId("loading").textContent).toBe("false");
      expect(getByTestId("user").textContent).toBe("other@example.com");
      expect(getByTestId("token").textContent).toBe("access-token-2");
    });
  });

  it("survives repeated logout/login cycles without sticky loading", async () => {
    const apiRef = { current: null };
    const { getByTestId } = renderAuth(apiRef);

    await waitFor(() => {
      expect(apiRef.current?.initialized).toBe(true);
    });

    for (let i = 0; i < 3; i += 1) {
      apiPost.mockResolvedValueOnce({
        data: {
          accessToken: `token-${i}`,
          user: {
            email: `user${i}@example.com`,
            role: "business",
            businessId: `biz-${i}`,
            hasAccess: true,
            hasPaid: true,
          },
        },
      });

      await act(async () => {
        await apiRef.current.login(`user${i}@example.com`, "secret", {
          skipRedirect: true,
        });
      });

      await waitFor(() => {
        expect(getByTestId("loading").textContent).toBe("false");
        expect(getByTestId("user").textContent).toBe(`user${i}@example.com`);
      });

      await act(async () => {
        await apiRef.current.logout();
      });

      await waitFor(() => {
        expect(getByTestId("loading").textContent).toBe("false");
        expect(getByTestId("user").textContent).toBe("");
        expect(getByTestId("path").textContent).toBe("/login");
      });
    }
  });
});
