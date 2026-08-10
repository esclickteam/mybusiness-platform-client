import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { AutomationBillingUsageOverview } from "../../../../../api/automationBillingApi";
import { AUTOMATION_PLAN_KEYS } from "../../../../../api/automationBillingApi";
import AutomationUsageCard from "./AutomationUsageCard";
import { formatHeNumber } from "./automationBillingFormat";

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
  ToastContainer: () => null,
}));

vi.mock("./automationBillingAnalytics", () => ({
  trackAutomationBillingEvent: vi.fn(),
}));

function baseUsage(
  overrides: Partial<AutomationBillingUsageOverview> = {}
): AutomationBillingUsageOverview {
  return {
    billingEnabled: true,
    exempt: false,
    plan: {
      key: AUTOMATION_PLAN_KEYS.BASIC,
      name: "Automation Basic",
      nameHe: "Automation Basic",
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

function renderCard(
  usage: AutomationBillingUsageOverview | null,
  extra: Partial<React.ComponentProps<typeof AutomationUsageCard>> = {}
) {
  const onRetry = vi.fn();
  const onOpenPlans = vi.fn();
  const onOpenManage = vi.fn();
  const onReactivate = vi.fn();
  const result = render(
    <AutomationUsageCard
      businessId="biz-1"
      usage={usage}
      loading={false}
      error={null}
      onRetry={onRetry}
      onOpenPlans={onOpenPlans}
      onOpenManage={onOpenManage}
      onReactivate={onReactivate}
      {...extra}
    />
  );
  return { ...result, onRetry, onOpenPlans, onOpenManage, onReactivate };
}

describe("AutomationUsageCard", () => {
  it('no plan shows pricing CTA "בחירת חבילה"', () => {
    const { onOpenPlans } = renderCard(
      baseUsage({
        plan: null,
        usage: null,
        canPublish: false,
        canExecute: false,
        blockReason: "no_automation_plan",
      })
    );
    const cta = screen.getByRole("button", { name: "בחירת חבילה" });
    expect(cta).toBeInTheDocument();
    fireEvent.click(cta);
    expect(onOpenPlans).toHaveBeenCalledWith("no_plan");
  });

  it("active Basic renders 2,500 limit via formatHeNumber", () => {
    renderCard(baseUsage());
    expect(screen.getByText(formatHeNumber(2500))).toBeInTheDocument();
    expect(screen.getByText(/חבילת Automation Basic/)).toBeInTheDocument();
  });

  it("active plan progress renders with aria-valuenow", () => {
    renderCard(
      baseUsage({
        usage: {
          used: 500,
          limit: 2500,
          remaining: 2000,
          percentage: 20,
          periodStart: "2026-08-01T00:00:00.000Z",
          periodEnd: "2026-09-01T00:00:00.000Z",
        },
      })
    );
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "20");
  });

  it("80% warning state", () => {
    renderCard(
      baseUsage({
        usage: {
          used: 2000,
          limit: 2500,
          remaining: 500,
          percentage: 80,
          periodStart: "2026-08-01T00:00:00.000Z",
          periodEnd: "2026-09-01T00:00:00.000Z",
        },
      })
    );
    expect(document.querySelector(".ax-billing-card--warn")).toBeTruthy();
    expect(screen.getByRole("button", { name: "שדרוג חבילה" })).toBeInTheDocument();
  });

  it("95% critical warning", () => {
    renderCard(
      baseUsage({
        usage: {
          used: 2375,
          limit: 2500,
          remaining: 125,
          percentage: 95,
          periodStart: "2026-08-01T00:00:00.000Z",
          periodEnd: "2026-09-01T00:00:00.000Z",
        },
      })
    );
    expect(document.querySelector(".ax-billing-card--critical")).toBeTruthy();
    expect(
      screen.getByText("הגעתם כמעט למכסת הפעולות החודשית")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "שדרוג עכשיו" })).toBeInTheDocument();
  });

  it("100% quota exhausted state", () => {
    const { onOpenPlans } = renderCard(
      baseUsage({
        canExecute: false,
        blockReason: "quota_exhausted",
        usage: {
          used: 2500,
          limit: 2500,
          remaining: 0,
          percentage: 100,
          periodStart: "2026-08-01T00:00:00.000Z",
          periodEnd: "2026-09-01T00:00:00.000Z",
        },
      })
    );
    expect(
      screen.getByText("מכסת הפעולות החודשית נוצלה")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "שדרוג חבילה" }));
    expect(onOpenPlans).toHaveBeenCalledWith("quota_exhausted");
  });

  it("QUOTA_EXHAUSTED path opens upgrade messaging on usage card", () => {
    const { onOpenPlans } = renderCard(
      baseUsage({
        canExecute: false,
        blockReason: "AUTOMATION_QUOTA_EXHAUSTED",
        usage: {
          used: 2500,
          limit: 2500,
          remaining: 0,
          percentage: 100,
          periodStart: "2026-08-01T00:00:00.000Z",
          periodEnd: "2026-09-01T00:00:00.000Z",
        },
      })
    );
    expect(screen.getByText(/שדרוג החבילה/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "שדרוג חבילה" }));
    expect(onOpenPlans).toHaveBeenCalledWith("quota_exhausted");
  });

  it("exempt account does not show quota pressure / progress", () => {
    renderCard(
      baseUsage({
        exempt: true,
        exemption: { type: "permanent", endsAt: null },
        plan: null,
        usage: null,
      })
    );
    expect(screen.getByText("האוטומציות פעילות בחשבון")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByText("בחירת חבילה")).not.toBeInTheDocument();
    expect(screen.queryByText(/ניצלתם/)).not.toBeInTheDocument();
  });

  it("temporary transition card shows Hebrew copy and CTA without quota pressure", () => {
    const endsAt = new Date(Date.now() + 20 * 86400000).toISOString();
    renderCard(
      baseUsage({
        exempt: true,
        exemption: { type: "temporary", endsAt },
        plan: null,
        usage: null,
      })
    );
    expect(screen.getByText("חבילת מעבר לאוטומציות")).toBeInTheDocument();
    expect(
      screen.getByText(/האוטומציות שלך ימשיכו לפעול ללא שינוי עד/)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "בחירת חבילה" })).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByText(/grandfather|exempt|migration/i)).not.toBeInTheDocument();
  });

  it("<=7 day warning strengthens CTA", () => {
    const endsAt = new Date(Date.now() + 5 * 86400000).toISOString();
    renderCard(
      baseUsage({
        exempt: true,
        exemption: { type: "temporary", endsAt },
        plan: null,
        usage: null,
      })
    );
    expect(
      screen.getByText(/חבילת המעבר מסתיימת בעוד 5 ימים/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "בחירת חבילת אוטומציות" })
    ).toBeInTheDocument();
  });

  it("expired transition falls through to no-plan UX when not exempt", () => {
    renderCard(
      baseUsage({
        exempt: false,
        exemption: null,
        plan: null,
        usage: null,
      })
    );
    expect(screen.getByText(/אוטומציות בתשלום לפי שימוש/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "בחירת חבילה" })).toBeInTheDocument();
  });

  it("past_due grace warning (paymentGraceEndsAt + canExecute)", () => {
    renderCard(
      baseUsage({
        canExecute: true,
        plan: {
          key: AUTOMATION_PLAN_KEYS.BASIC,
          name: "Automation Basic",
          status: "past_due",
          priceIls: 39,
          executionLimit: 2500,
        },
        subscription: {
          cancelAtPeriodEnd: false,
          pendingDowngradePlanKey: null,
          paymentGraceEndsAt: "2026-09-05T18:00:00.000Z",
          currentPeriodEnd: "2026-09-01T00:00:00.000Z",
        },
      })
    );
    expect(
      screen.getByText("יש בעיה בתשלום עבור חבילת האוטומציות")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ניהול תשלום" })).toBeInTheDocument();
  });

  it("billing blocked state (!canExecute unpaid/past_due)", () => {
    renderCard(
      baseUsage({
        canExecute: false,
        blockReason: "past_due",
        plan: {
          key: AUTOMATION_PLAN_KEYS.BASIC,
          name: "Automation Basic",
          status: "unpaid",
          priceIls: 39,
          executionLimit: 2500,
        },
      })
    );
    expect(
      screen.getByText("חבילת האוטומציות אינה פעילה")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "הסדרת תשלום" })).toBeInTheDocument();
  });

  it("cancelAtPeriodEnd state rendered", () => {
    renderCard(
      baseUsage({
        subscription: {
          cancelAtPeriodEnd: true,
          pendingDowngradePlanKey: null,
          paymentGraceEndsAt: null,
          currentPeriodEnd: "2026-09-01T00:00:00.000Z",
        },
      })
    );
    expect(screen.getByText(/החבילה מתוכננת לביטול/)).toBeInTheDocument();
  });

  it("reactivate action button present when cancelAtPeriodEnd", () => {
    const { onReactivate } = renderCard(
      baseUsage({
        subscription: {
          cancelAtPeriodEnd: true,
          pendingDowngradePlanKey: null,
          paymentGraceEndsAt: null,
          currentPeriodEnd: "2026-09-01T00:00:00.000Z",
        },
      })
    );
    const btn = screen.getByRole("button", { name: "השארת החבילה פעילה" });
    fireEvent.click(btn);
    expect(onReactivate).toHaveBeenCalled();
  });

  it("usage API failure card shows retry and does not imply no plan", () => {
    renderCard(null, {
      error: "לא הצלחנו לטעון את נתוני החבילה כרגע.",
      loading: false,
    });
    expect(
      screen.getByText("לא הצלחנו לטעון את נתוני החבילה כרגע.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /נסו שוב/ })).toBeInTheDocument();
    expect(screen.queryByText("בחירת חבילה")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/אוטומציות בתשלום לפי שימוש/)
    ).not.toBeInTheDocument();
  });

  it("mobile layout smoke: UsageCard key texts and ax-billing-card class", () => {
    const { container } = renderCard(baseUsage());
    expect(container.querySelector(".ax-billing-card")).toBeTruthy();
    expect(screen.getByText("שימוש באוטומציות החודש")).toBeInTheDocument();
    expect(screen.getByText(formatHeNumber(2500))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ניהול חבילה" })).toBeInTheDocument();
  });
});
