import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, Outlet } from "react-router-dom";

vi.mock("../../../../../context/AuthContext", () => ({
  useAuth: () => ({ user: { businessId: "biz-1" } }),
}));

vi.mock("../../../../../hooks/useLocaleDir", () => ({
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

vi.mock("../../../../../api/automationWorkflowApi", async () => {
  const actual = await vi.importActual<
    typeof import("../../../../../api/automationWorkflowApi")
  >("../../../../../api/automationWorkflowApi");
  return {
    ...actual,
    isAutomationsReadOnly: () => false,
    listAutomationWorkflows: vi.fn(async () => []),
    listAutomationRecipes: vi.fn(async () => ({
      recipes: [],
      aiAutomationsEntitled: false,
    })),
    getAutomationStats: vi.fn(async () => null),
  };
});

vi.mock("../../../../../api/automationBillingApi", async () => {
  const actual = await vi.importActual<
    typeof import("../../../../../api/automationBillingApi")
  >("../../../../../api/automationBillingApi");
  return {
    ...actual,
    getAutomationBillingUsage: vi.fn(async () => {
      throw new Error("usage failed");
    }),
  };
});

function HomeHarness() {
  return <Outlet context={{ businessId: "biz-1", readOnly: false }} />;
}

describe("AutomationsBillingHome smoke", () => {
  it("usage API failure still shows title אוטומציות and does not imply no plan", async () => {
    const { default: AutomationsHomePage } = await import(
      "../AutomationsHomePage"
    );

    render(
      <MemoryRouter initialEntries={["/business/biz-1/dashboard/automations"]}>
        <Routes>
          <Route path="/business/:businessId/dashboard/automations" element={<HomeHarness />}>
            <Route index element={<AutomationsHomePage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "אוטומציות" })).toBeInTheDocument();
    expect(
      await screen.findByText("לא הצלחנו לטעון את נתוני החבילה כרגע.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /נסו שוב/ })).toBeInTheDocument();
    expect(screen.queryByText("בחירת חבילה")).not.toBeInTheDocument();
  });
});
