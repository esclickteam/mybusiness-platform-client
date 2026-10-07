import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const authState = vi.hoisted(() => ({ user: null as Record<string, unknown> | null }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "he" } }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: authState.user, loading: false, logout: vi.fn(), isImpersonating: false, loginWithToken: vi.fn(), socket: null }),
}));
vi.mock("@context/BusinessServicesContext", () => ({ BusinessServicesProvider: ({ children }: any) => <>{children}</> }));
vi.mock("../../context/AiContext", () => ({ AiProvider: ({ children }: any) => <>{children}</> }));
vi.mock("../../api", () => ({ default: { get: vi.fn(() => Promise.resolve({ data: {} })), post: vi.fn() } }));
vi.mock("../../utils/push", () => ({ ensurePushSubscription: vi.fn(), listenForPushSubscriptionChange: () => () => undefined }));
vi.mock("../../components/FacebookStyleNotifications", () => ({ default: () => null }));
vi.mock("../../components/BusinessWorkspaceNav", () => ({ default: () => null }));
vi.mock("../../components/LanguageSwitcher", () => ({ default: () => null }));
vi.mock("../../guidedDemo/GuidedDemoResetControl", () => ({ default: () => null }));

import BusinessDashboardLayout from "./BusinessDashboardLayout";

const BUSINESS_ID = "6ac4bf508f33d9c9db432a3f";

function renderAt(user: Record<string, unknown>) {
  authState.user = user;
  return render(
    <MemoryRouter initialEntries={[`/business/${BUSINESS_ID}/dashboard/whatsapp/overview`]}>
      <Routes>
        <Route path="/business/:businessId/dashboard/*" element={<BusinessDashboardLayout />}>
          <Route path="*" element={<div>portal page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

afterEach(() => {
  cleanup();
  authState.user = null;
});

describe("BusinessDashboardLayout floating-assistant clearance", () => {
  it("reserves bottom space in the WhatsApp API portal so checklist actions can scroll above the assistant button", () => {
    renderAt({ role: "business", businessId: BUSINESS_ID, subscriptionPlan: "whatsapp_api" });
    expect(screen.getByText("portal page")).toBeInTheDocument();
    expect(screen.getByTestId("wa-api-portal-badge")).toBeInTheDocument();
    expect(screen.getByTestId("business-dashboard-main").className).toMatch(/\bpb-28\b/);
  });

  it("leaves the Business Plan dashboard layout unchanged", () => {
    renderAt({ role: "business", businessId: BUSINESS_ID, subscriptionPlan: "monthly" });
    expect(screen.queryByTestId("wa-api-portal-badge")).toBeNull();
    expect(screen.getByTestId("business-dashboard-main").className).not.toMatch(/\bpb-28\b/);
  });
});
