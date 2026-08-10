import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../../../../context/AuthContext", () => ({
  useAuth: () => ({ user: { businessId: "biz-1" }, socket: null }),
}));

vi.mock("../../../../context/socketContext", () => ({
  useSocket: () => null,
}));

vi.mock("../../../../hooks/useLocaleDir", () => ({
  useLocaleDir: () => "rtl",
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_k: string, fallback?: string) => fallback || _k,
  }),
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
  ToastContainer: () => null,
}));

vi.mock("../../../../api/automationWorkflowApi", async () => {
  const actual = await vi.importActual<
    typeof import("../../../../api/automationWorkflowApi")
  >("../../../../api/automationWorkflowApi");
  return {
    ...actual,
    isAutomationsReadOnly: () => true,
    listAutomationWorkflows: vi.fn(async () => []),
    listAutomationRecipes: vi.fn(async () => ({
      recipes: [],
      aiAutomationsEntitled: false,
    })),
    getAutomationStats: vi.fn(async () => null),
  };
});

vi.mock("../../../../api/automationBillingApi", async () => {
  const actual = await vi.importActual<
    typeof import("../../../../api/automationBillingApi")
  >("../../../../api/automationBillingApi");
  return {
    ...actual,
    getAutomationBillingUsage: vi.fn(async () => null),
  };
});

vi.mock("../../../../api/whatsappBillingApi", async () => {
  const actual = await vi.importActual<
    typeof import("../../../../api/whatsappBillingApi")
  >("../../../../api/whatsappBillingApi");
  return {
    ...actual,
    getWhatsAppBillingUsage: vi.fn(async () => null),
  };
});

describe("Automations preview banner", () => {
  it("shows banner in read-only/preview mode", async () => {
    const { default: AutomationsLayout } = await import("./AutomationsLayout");
    const { default: AutomationsHomePage } = await import(
      "./AutomationsHomePage"
    );
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/business/biz-1/dashboard/automations"]}>
          <Routes>
            <Route
              path="/business/:businessId/dashboard/automations"
              element={<AutomationsLayout />}
            >
              <Route index element={<AutomationsHomePage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(
      await screen.findByTestId("automations-preview-banner")
    ).toHaveTextContent(
      "סביבת תצוגה מקדימה — פעולות עריכה והפעלה חסומות"
    );
  });
});
