import React from "react";
import { describe, expect, it, vi } from "vitest";
import {
  MemoryRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { resolveWhatsAppHubRedirect } from "./hubNavigation";

vi.mock("../../../../context/AuthContext", () => ({
  useAuth: () => ({ user: { businessId: "biz-1" } }),
}));

vi.mock("../../../../api/whatsappApi", () => ({
  getWhatsAppStatus: vi.fn(async () => ({
    connected: true,
    readyToSend: true,
    readiness: "ready",
    verifiedName: "Test Biz",
    displayPhoneNumber: "+972500000000",
    qualityRating: "GREEN",
    messagingLimitTier: "TIER_1K",
    lastMetaSyncAt: new Date().toISOString(),
  })),
  syncWhatsAppAccountHealth: vi.fn(async () => ({})),
}));

vi.mock("./billing/useWhatsAppBilling", () => ({
  useWhatsAppBilling: () => ({
    usage: null,
    loading: false,
    error: null,
    refresh: async () => {},
    setUsage: () => {},
  }),
}));

vi.mock("./billing/WhatsAppBillingSetupModal", () => ({
  default: () => null,
}));

vi.mock("./billing/WhatsAppCheckoutProcessing", () => ({
  default: () => null,
}));

vi.mock("../../../../guidedDemo/GuidedDemoSandboxButton", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-i18next")>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: { language: "he" },
    }),
  };
});

vi.mock("../../../dev/whatsappVisualQaContext", () => ({
  useWhatsAppVisualQaOverride: () => null,
}));

import WhatsAppMain from "./WhatsAppMain";

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function HubHarness({ initial }: { initial: string }) {
  return (
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route
          path="/business/:businessId/dashboard/whatsapp"
          element={<WhatsAppMain />}
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route
            path="overview"
            element={<div data-testid="tab-overview">overview</div>}
          />
          <Route
            path="profile"
            element={<div data-testid="tab-profile">profile</div>}
          />
          <Route path="messages">
            <Route index element={<Navigate to="compose" replace />} />
            <Route
              path="compose"
              element={<div data-testid="tab-compose">compose</div>}
            />
            <Route
              path="lists"
              element={<div data-testid="tab-lists">lists</div>}
            />
          </Route>
          <Route
            path="inbox"
            element={<div data-testid="tab-inbox">inbox</div>}
          />
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Route>
      </Routes>
      <LocationProbe />
    </MemoryRouter>
  );
}

describe("WhatsApp hub tab navigation", () => {
  it("keeps messages/compose stable (no bounce to overview)", async () => {
    const path = "/business/biz-1/dashboard/whatsapp/messages/compose";
    expect(resolveWhatsAppHubRedirect(path)).toBeNull();

    render(<HubHarness initial={path} />);

    await waitFor(() => {
      expect(screen.getByTestId("tab-compose")).toBeInTheDocument();
    });
    expect(screen.getByTestId("location").textContent).toBe(path);
    expect(screen.getByText("whatsapp.hub.syncWithMeta")).toBeInTheDocument();
  });

  it("navigates overview → messages without rewriting to overview", async () => {
    render(
      <HubHarness initial="/business/biz-1/dashboard/whatsapp/overview" />
    );

    await waitFor(() => {
      expect(screen.getByTestId("tab-overview")).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("link", { name: /whatsapp\.nav\.messages/i })
    );

    await waitFor(() => {
      expect(screen.getByTestId("tab-compose")).toBeInTheDocument();
    });
    expect(screen.getByTestId("location").textContent).toBe(
      "/business/biz-1/dashboard/whatsapp/messages/compose"
    );
    expect(screen.queryByTestId("tab-overview")).not.toBeInTheDocument();
  });

  it("navigates across sibling tabs without bounce", async () => {
    render(
      <HubHarness initial="/business/biz-1/dashboard/whatsapp/overview" />
    );
    await waitFor(() => screen.getByTestId("tab-overview"));

    fireEvent.click(
      screen.getByRole("link", { name: /whatsapp\.nav\.profile/i })
    );
    await waitFor(() =>
      expect(screen.getByTestId("tab-profile")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole("link", { name: /whatsapp\.nav\.inbox/i }));
    await waitFor(() =>
      expect(screen.getByTestId("tab-inbox")).toBeInTheDocument()
    );

    fireEvent.click(
      screen.getByRole("link", { name: /whatsapp\.nav\.overview/i })
    );
    await waitFor(() =>
      expect(screen.getByTestId("tab-overview")).toBeInTheDocument()
    );
  });
});
