import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import CreateAutomationModal from "./CreateAutomationModal";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("../../../../api/automationWorkflowApi", () => ({
  AUTOMATION_PREVIEW_ACTION_TOOLTIP: "preview",
  AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE: "blocked",
  createAutomationWorkflow: vi.fn(),
  isAutomationsReadOnly: () => false,
}));

describe("CreateAutomationModal", () => {
  it("keeps blank + templates and hides AI quick-create", () => {
    render(
      <CreateAutomationModal
        open
        businessId="biz-1"
        readOnly={false}
        onClose={() => undefined}
      />
    );

    expect(
      screen.getByRole("heading", { name: "צור אוטומציה" })
    ).toBeTruthy();
    expect(screen.getByText("בחר איך להתחיל")).toBeTruthy();
    expect(screen.getByText("אוטומציה ריקה")).toBeTruthy();
    expect(screen.getByText("תבניות")).toBeTruthy();

    expect(screen.queryByText("מה תרצה להפוך לאוטומטי?")).toBeNull();
    expect(screen.queryByText("צור עם AI")).toBeNull();
    expect(screen.queryByText(/Beta/)).toBeNull();
    expect(screen.queryByRole("separator")).toBeNull();
    expect(screen.queryByPlaceholderText(/כשנכנס ליד חדש/)).toBeNull();
  });
});
