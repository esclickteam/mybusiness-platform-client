import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import type { AutomationBillingUsageOverview } from "../../../../../api/automationBillingApi";
import { AUTOMATION_PLAN_KEYS } from "../../../../../api/automationBillingApi";

const getAutomationBillingUsage = vi.fn();

vi.mock("../../../../../api/automationBillingApi", async () => {
  const actual = await vi.importActual<
    typeof import("../../../../../api/automationBillingApi")
  >("../../../../../api/automationBillingApi");
  return {
    ...actual,
    getAutomationBillingUsage: (...args: unknown[]) =>
      getAutomationBillingUsage(...args),
  };
});

import AutomationCheckoutProcessing from "./AutomationCheckoutProcessing";

function activeUsage(
  planKey = AUTOMATION_PLAN_KEYS.BASIC
): AutomationBillingUsageOverview {
  return {
    billingEnabled: true,
    exempt: false,
    plan: {
      key: planKey,
      name: "Automation Basic",
      nameHe: "Automation Basic",
      status: "active",
      priceIls: 39,
      executionLimit: 2500,
    },
    usage: {
      used: 0,
      limit: 2500,
      remaining: 2500,
      percentage: 0,
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
  };
}

function pendingUsage(): AutomationBillingUsageOverview {
  return {
    ...activeUsage(),
    plan: null,
    canPublish: false,
    canExecute: false,
    blockReason: "no_automation_plan",
  };
}

describe("AutomationCheckoutProcessing", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    getAutomationBillingUsage.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Checkout processing polls and succeeds when usage becomes active", async () => {
    const onDone = vi.fn();
    getAutomationBillingUsage
      .mockResolvedValueOnce(pendingUsage())
      .mockResolvedValueOnce(activeUsage());

    render(
      <AutomationCheckoutProcessing
        open
        businessId="biz-1"
        expectedPlanKey={AUTOMATION_PLAN_KEYS.BASIC}
        onDone={onDone}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("התשלום התקבל")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    await waitFor(() => {
      expect(onDone).toHaveBeenCalled();
    });
    expect(
      await screen.findByText(/הופעלה בהצלחה/)
    ).toBeInTheDocument();
  });

  it("polling timeout does not claim payment failure (soft Hebrew message)", async () => {
    getAutomationBillingUsage.mockResolvedValue(pendingUsage());

    render(
      <AutomationCheckoutProcessing
        open
        businessId="biz-1"
        expectedPlanKey={AUTOMATION_PLAN_KEYS.BASIC}
        onDone={vi.fn()}
        onClose={vi.fn()}
      />
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(31_000);
    });

    expect(
      await screen.findByText("התשלום התקבל והעדכון עדיין מתבצע.")
    ).toBeInTheDocument();
    expect(screen.queryByText(/נכשל/)).not.toBeInTheDocument();
    expect(screen.queryByText(/תשלום נכשל/)).not.toBeInTheDocument();
    expect(screen.queryByText(/failure/i)).not.toBeInTheDocument();
  });
});
