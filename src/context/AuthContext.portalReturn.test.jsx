import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const apiGet = vi.fn();

vi.mock("../api", () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: {} }),
    get: (...args) => apiGet(...args),
    defaults: { headers: { common: {} } },
  },
  setAuthToken: vi.fn(),
}));

vi.mock("../socket", () => ({ default: vi.fn(async () => null) }));

vi.mock("../utils/tokenRefresh", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    shouldAttemptRefresh: vi.fn(() => false),
    refreshAccessTokenOnce: vi.fn(),
    getValidAccessToken: vi.fn(async () => "access-token"),
    isAccessTokenExpired: vi.fn(() => false),
    markRefreshDead: vi.fn(),
    clearRefreshDead: vi.fn(),
  };
});

vi.mock("../utils/publicSiteHost", () => ({ isPublicCustomerSiteHost: () => false }));
vi.mock("../i18n/persistLanguage", () => ({ syncLanguageOnLogin: vi.fn() }));
vi.mock("../components/AdminSoftphone", () => ({ disconnectSoftphoneVoip: vi.fn() }));

import { AuthProvider } from "./AuthContext";

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="url">{`${location.pathname}${location.search}`}</div>;
}

function renderAt(url) {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={[url]}>
        <AuthProvider>
          <LocationProbe />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

const BILLING = "/business/biz-1/dashboard/whatsapp/billing";

describe("AuthContext bootstrap with a leftover post-login redirect", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("token", "access-token");
    apiGet.mockReset();
  });

  it("keeps the checkout return query for a WhatsApp API portal account", async () => {
    apiGet.mockResolvedValue({
      data: { email: "api@example.com", role: "business", businessId: "biz-1", subscriptionPlan: "whatsapp_api", hasAccess: true, hasPaid: true },
    });
    sessionStorage.setItem("postLoginRedirect", BILLING);
    const { getByTestId } = renderAt(`${BILLING}?checkout=whatsapp_api`);

    await waitFor(() => expect(apiGet).toHaveBeenCalled());
    await waitFor(() => expect(sessionStorage.getItem("postLoginRedirect")).toBeNull());
    expect(getByTestId("url").textContent).toBe(`${BILLING}?checkout=whatsapp_api`);
  });

  it("still replays the stored link for other business accounts", async () => {
    apiGet.mockResolvedValue({
      data: { email: "biz@example.com", role: "business", businessId: "biz-1", subscriptionPlan: "business", hasAccess: true, hasPaid: true },
    });
    sessionStorage.setItem("postLoginRedirect", "/business/biz-1/dashboard/crm");
    const { getByTestId } = renderAt("/business/biz-1/dashboard/crm?tab=x");

    await waitFor(() => expect(getByTestId("url").textContent).toBe("/business/biz-1/dashboard/crm"));
  });
});
