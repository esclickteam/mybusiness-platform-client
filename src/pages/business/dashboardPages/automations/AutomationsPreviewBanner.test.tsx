import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("../../../../context/AuthContext", () => ({
  useAuth: () => ({ user: { businessId: "biz-1" } }),
}));

vi.mock("../../../../hooks/useLocaleDir", () => ({
  useLocaleDir: () => "rtl",
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useParams: () => ({ businessId: "biz-1" }),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (_k: string, fallback?: string) => fallback || _k }),
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
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
    const { default: AutomationsMain } = await import("./AutomationsMain");
    render(<AutomationsMain />);
    expect(
      await screen.findByTestId("automations-preview-banner")
    ).toHaveTextContent(
      "סביבת תצוגה מקדימה — פעולות עריכה והפעלה חסומות"
    );
  });
});
