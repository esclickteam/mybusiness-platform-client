import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { AutomationBillingUsageOverview } from "../../../../../api/automationBillingApi";
import { AUTOMATION_PLAN_KEYS } from "../../../../../api/automationBillingApi";

const createAutomationPlanCheckout = vi.fn();
const changeAutomationPlan = vi.fn();
const reactivateAutomationPlan = vi.fn();
const cancelAutomationPlan = vi.fn();

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
  ToastContainer: () => null,
}));

vi.mock("./automationBillingAnalytics", () => ({
  trackAutomationBillingEvent: vi.fn(),
}));

vi.mock("../../../../../api/automationBillingApi", async () => {
  const actual = await vi.importActual<
    typeof import("../../../../../api/automationBillingApi")
  >("../../../../../api/automationBillingApi");
  return {
    ...actual,
    createAutomationPlanCheckout: (...args: unknown[]) =>
      createAutomationPlanCheckout(...args),
    changeAutomationPlan: (...args: unknown[]) => changeAutomationPlan(...args),
    reactivateAutomationPlan: (...args: unknown[]) =>
      reactivateAutomationPlan(...args),
    cancelAutomationPlan: (...args: unknown[]) => cancelAutomationPlan(...args),
  };
});

import AutomationPlanModal from "./AutomationPlanModal";
import AutomationCancelConfirmModal from "./AutomationCancelConfirmModal";

function baseUsage(
  overrides: Partial<AutomationBillingUsageOverview> = {}
): AutomationBillingUsageOverview {
  return {
    billingEnabled: true,
    exempt: false,
    plan: {
      key: AUTOMATION_PLAN_KEYS.BASIC,
      name: "Automation Basic",
      status: "active",
      priceIls: 39,
      executionLimit: 2500,
    },
    usage: {
      used: 100,
      limit: 2500,
      remaining: 2400,
      percentage: 4,
      periodStart: "2026-08-01T00:00:00.000Z",
      periodEnd: "2026-09-01T00:00:00.000Z",
    },
    subscription: {
      cancelAtPeriodEnd: false,
      pendingDowngradePlanKey: null,
      paymentGraceEndsAt: null,
      currentPeriodEnd: "2026-09-01T00:00:00.000Z",
    },
    canPublish: true,
    canExecute: true,
    blockReason: null,
    ...overrides,
  };
}

describe("AutomationPlanModal", () => {
  beforeEach(() => {
    createAutomationPlanCheckout.mockReset();
    changeAutomationPlan.mockReset();
    reactivateAutomationPlan.mockReset();
    cancelAutomationPlan.mockReset();
    createAutomationPlanCheckout.mockResolvedValue({
      ok: true,
      url: "https://checkout.stripe.test/session",
      planKey: AUTOMATION_PLAN_KEYS.BASIC,
    });
    changeAutomationPlan.mockResolvedValue({
      ok: true,
      action: "upgraded",
      planKey: AUTOMATION_PLAN_KEYS.GROWTH,
    });
    reactivateAutomationPlan.mockResolvedValue({
      ok: true,
      cancelAtPeriodEnd: false,
    });
    cancelAutomationPlan.mockResolvedValue({
      ok: true,
      cancelAtPeriodEnd: true,
      currentPeriodEnd: "2026-09-01T00:00:00.000Z",
    });
    vi.stubGlobal("location", { assign: vi.fn() });
  });

  it('Growth marked popular "הכי פופולרי"', () => {
    render(
      <AutomationPlanModal
        open
        businessId="biz-1"
        usage={baseUsage({ plan: null, usage: null })}
        onClose={vi.fn()}
        onUsageUpdated={vi.fn()}
        onOpenCancel={vi.fn()}
      />
    );
    expect(screen.getByText("הכי פופולרי")).toBeInTheDocument();
  });

  it("checkout sends planKey only — createAutomationPlanCheckout(businessId, planKey)", async () => {
    render(
      <AutomationPlanModal
        open
        businessId="biz-1"
        usage={baseUsage({ plan: null, usage: null })}
        onClose={vi.fn()}
        onUsageUpdated={vi.fn()}
        onOpenCancel={vi.fn()}
      />
    );
    const buttons = screen.getAllByRole("button", { name: "בחירת חבילה" });
    fireEvent.click(buttons[0]);
    await waitFor(() => {
      expect(createAutomationPlanCheckout).toHaveBeenCalledWith(
        "biz-1",
        AUTOMATION_PLAN_KEYS.BASIC
      );
    });
    expect(createAutomationPlanCheckout.mock.calls[0]).toHaveLength(2);
  });

  it("upgrade uses change-plan (changeAutomationPlan called)", async () => {
    render(
      <AutomationPlanModal
        open
        businessId="biz-1"
        usage={baseUsage()}
        onClose={vi.fn()}
        onUsageUpdated={vi.fn(async () => undefined)}
        onOpenCancel={vi.fn()}
      />
    );
    fireEvent.click(screen.getAllByRole("button", { name: "שדרוג" })[0]);
    expect(screen.getByText(/שדרוג ל-/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "אישור שדרוג" }));
    await waitFor(() => {
      expect(changeAutomationPlan).toHaveBeenCalledWith(
        "biz-1",
        AUTOMATION_PLAN_KEYS.GROWTH
      );
    });
  });

  it('downgrade copy says next renewal ("חידוש")', async () => {
    render(
      <AutomationPlanModal
        open
        businessId="biz-1"
        usage={baseUsage({
          plan: {
            key: AUTOMATION_PLAN_KEYS.GROWTH,
            name: "Automation Growth",
            status: "active",
            priceIls: 79,
            executionLimit: 10000,
          },
          usage: {
            used: 100,
            limit: 10000,
            remaining: 9900,
            percentage: 1,
            periodStart: "2026-08-01T00:00:00.000Z",
            periodEnd: "2026-09-01T00:00:00.000Z",
          },
        })}
        onClose={vi.fn()}
        onUsageUpdated={vi.fn()}
        onOpenCancel={vi.fn()}
      />
    );
    fireEvent.click(screen.getAllByRole("button", { name: "מעבר לחבילה זו" })[0]);
    expect(
      screen.getByText(/ייכנס לתוקף בחידוש הבא/)
    ).toBeInTheDocument();
    expect(screen.getByText(/חידוש/)).toBeInTheDocument();
  });

  it("cancel confirmation modal text / cancelAutomationPlan", async () => {
    const onCancelled = vi.fn();
    render(
      <AutomationCancelConfirmModal
        open
        businessId="biz-1"
        usage={baseUsage()}
        onClose={vi.fn()}
        onCancelled={onCancelled}
      />
    );
    expect(screen.getByText("ביטול חבילת האוטומציות")).toBeInTheDocument();
    expect(
      screen.getByText(/תישאר פעילה עד סוף תקופת החיוב/)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "ביטול החבילה" }));
    await waitFor(() => {
      expect(cancelAutomationPlan).toHaveBeenCalledWith("biz-1");
    });
    expect(onCancelled).toHaveBeenCalled();
  });

  it("reactivate action present in manage mode when cancelAtPeriodEnd", async () => {
    render(
      <AutomationPlanModal
        open
        businessId="biz-1"
        usage={baseUsage({
          subscription: {
            cancelAtPeriodEnd: true,
            pendingDowngradePlanKey: null,
            paymentGraceEndsAt: null,
            currentPeriodEnd: "2026-09-01T00:00:00.000Z",
          },
        })}
        initialMode="manage"
        onClose={vi.fn()}
        onUsageUpdated={vi.fn(async () => undefined)}
        onOpenCancel={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "ניהול" }));
    const reactivate = screen.getByRole("button", {
      name: "השארת החבילה פעילה",
    });
    fireEvent.click(reactivate);
    await waitFor(() => {
      expect(reactivateAutomationPlan).toHaveBeenCalledWith("biz-1");
    });
  });
});
