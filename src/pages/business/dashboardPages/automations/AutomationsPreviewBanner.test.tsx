import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../../../../context/AuthContext", () => ({
  useAuth: () => ({ user: { businessId: "biz-1" } }),
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

describe("Automations preview banner", () => {
  it("shows banner in read-only/preview mode", async () => {
    const { default: AutomationsLayout } = await import("./AutomationsLayout");
    const { default: AutomationsHomePage } = await import(
      "./AutomationsHomePage"
    );

    render(
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
    );

    expect(
      await screen.findByTestId("automations-preview-banner")
    ).toHaveTextContent(
      "סביבת תצוגה מקדימה — פעולות עריכה והפעלה חסומות"
    );
  });
});
