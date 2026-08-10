import API from "../api";
import { assertAutomationWritesAllowed } from "./automationPreviewGuard";

export const AUTOMATION_PLAN_KEYS = {
  BASIC: "automation_basic_39_ils",
  GROWTH: "automation_growth_79_ils",
  PRO: "automation_pro_149_ils",
} as const;

export type AutomationPlanKey =
  (typeof AUTOMATION_PLAN_KEYS)[keyof typeof AUTOMATION_PLAN_KEYS];

export const AUTOMATION_BILLING_API_CODES = {
  PLAN_REQUIRED: "AUTOMATION_PLAN_REQUIRED",
  QUOTA_EXHAUSTED: "AUTOMATION_QUOTA_EXHAUSTED",
  BILLING_BLOCKED: "AUTOMATION_BILLING_BLOCKED",
  PLAN_ALREADY_ACTIVE: "AUTOMATION_PLAN_ALREADY_ACTIVE",
  PLAN_UNKNOWN: "AUTOMATION_PLAN_UNKNOWN",
  PLAN_NOT_FOUND: "AUTOMATION_PLAN_NOT_FOUND",
  DOWNGRADE_SCHEDULED: "AUTOMATION_PLAN_DOWNGRADE_SCHEDULED",
} as const;

export type AutomationBillingExemption = {
  type: "temporary" | "permanent";
  endsAt: string | null;
};

export type AutomationBillingUsageOverview = {
  billingEnabled: boolean;
  exempt: boolean;
  exemption?: AutomationBillingExemption | null;
  plan: null | {
    key: string;
    name: string;
    nameHe?: string;
    status: string;
    priceIls: number;
    amountIls?: number;
    executionLimit: number;
  };
  usage: null | {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
    periodStart: string;
    periodEnd: string;
  };
  subscription: {
    cancelAtPeriodEnd: boolean;
    pendingDowngradePlanKey: string | null;
    paymentGraceEndsAt: string | null;
    currentPeriodEnd?: string | null;
  };
  canPublish: boolean;
  canExecute: boolean;
  blockReason: string | null;
};

export type AutomationPlanCheckoutResult = {
  success?: boolean;
  ok: boolean;
  url: string;
  sessionId?: string;
  planKey: string;
};

export type AutomationChangePlanResult = {
  success?: boolean;
  ok: boolean;
  action?: "upgraded" | "downgrade_scheduled";
  unchanged?: boolean;
  planKey: string;
  pendingDowngradePlanKey?: string;
  effectiveAt?: string;
  code?: string;
  prorationBehavior?: string;
  stripeSubscriptionId?: string;
};

export type AutomationCancelPlanResult = {
  success?: boolean;
  ok: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd?: string | null;
};

export type AutomationReactivatePlanResult = {
  success?: boolean;
  ok: boolean;
  cancelAtPeriodEnd: boolean;
};

function withBusiness(businessId: string) {
  return { params: { businessId } };
}

export async function getAutomationBillingUsage(businessId: string) {
  const { data } = await API.get(
    "/automations/billing/usage",
    withBusiness(businessId)
  );
  const {
    success: _success,
    ...overview
  } = (data || {}) as AutomationBillingUsageOverview & { success?: boolean };
  return overview as AutomationBillingUsageOverview;
}

/**
 * Server resolves Stripe price from planKey — never send priceId/amount.
 */
export async function createAutomationPlanCheckout(
  businessId: string,
  planKey: AutomationPlanKey | string
) {
  assertAutomationWritesAllowed();
  const { data } = await API.post(
    "/automations/billing/checkout",
    { planKey },
    withBusiness(businessId)
  );
  return data as AutomationPlanCheckoutResult;
}

export async function changeAutomationPlan(
  businessId: string,
  planKey: AutomationPlanKey | string
) {
  assertAutomationWritesAllowed();
  const { data } = await API.post(
    "/automations/billing/change-plan",
    { planKey },
    withBusiness(businessId)
  );
  return data as AutomationChangePlanResult;
}

export async function cancelAutomationPlan(businessId: string) {
  assertAutomationWritesAllowed();
  const { data } = await API.post(
    "/automations/billing/cancel",
    {},
    withBusiness(businessId)
  );
  return data as AutomationCancelPlanResult;
}

export async function reactivateAutomationPlan(businessId: string) {
  assertAutomationWritesAllowed();
  const { data } = await API.post(
    "/automations/billing/reactivate",
    {},
    withBusiness(businessId)
  );
  return data as AutomationReactivatePlanResult;
}

export function readAutomationBillingErrorCode(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const data = (error as { response?: { data?: { code?: string } } }).response
    ?.data;
  const code = data?.code;
  return typeof code === "string" && code.trim() ? code.trim() : null;
}

export function isAutomationBillingGateCode(code: string | null | undefined) {
  return (
    code === AUTOMATION_BILLING_API_CODES.PLAN_REQUIRED ||
    code === AUTOMATION_BILLING_API_CODES.QUOTA_EXHAUSTED ||
    code === AUTOMATION_BILLING_API_CODES.BILLING_BLOCKED
  );
}

/** Normalize legacy/internal aliases to canonical public API codes. */
export function normalizeAutomationBillingPublicCode(
  code: string | null | undefined
): string | null {
  const raw = String(code || "").trim();
  if (!raw) return null;
  if (isAutomationBillingGateCode(raw)) return raw;
  const lower = raw.toLowerCase();
  if (
    lower === "quota_exhausted" ||
    lower === "quota_exhausted".toLowerCase() ||
    raw === "QUOTA_EXHAUSTED"
  ) {
    return AUTOMATION_BILLING_API_CODES.QUOTA_EXHAUSTED;
  }
  if (
    lower === "plan_required" ||
    lower === "no_automation_plan" ||
    raw === "PLAN_REQUIRED"
  ) {
    return AUTOMATION_BILLING_API_CODES.PLAN_REQUIRED;
  }
  if (
    lower === "billing_blocked" ||
    raw === "BILLING_BLOCKED" ||
    lower.includes("past_due") ||
    lower === "unpaid" ||
    lower === "canceled" ||
    lower.startsWith("incomplete")
  ) {
    return AUTOMATION_BILLING_API_CODES.BILLING_BLOCKED;
  }
  return raw;
}
