import API from "@api";

export const PUSH_BILLING_API_CODES = {
  ENTITLEMENT_REQUIRED: "PUSH_ENTITLEMENT_REQUIRED",
  PLAN_ALREADY_ACTIVE: "PUSH_PLAN_ALREADY_ACTIVE",
  PLAN_UNKNOWN: "PUSH_PLAN_UNKNOWN",
  PLAN_NOT_FOUND: "PUSH_PLAN_NOT_FOUND",
  BILLING_DISABLED: "PUSH_BILLING_DISABLED",
} as const;

export type PushBillingPlan = "monthly" | "annual";

export type PushBillingSubscription = {
  status: string | null;
  planKey: string | null;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  trialUsedAt?: string | null;
  stripeSubscriptionId?: string | null;
};

export type PushBillingStatus = {
  ok?: boolean;
  businessId?: string;
  billingEnabled: boolean;
  productKey?: string;
  subscription: PushBillingSubscription | null;
  entitled: boolean;
  entitlementReason?: string | null;
  billingEnforced?: boolean;
  evaluation?: {
    enabled?: boolean;
    reason?: string | null;
    cancelAtPeriodEnd?: boolean;
    status?: string | null;
  };
};

export type PushBillingCheckoutResult = {
  ok: boolean;
  url: string;
  sessionId?: string;
  plan?: string;
  planKey?: string;
};

export type PushBillingCancelResult = {
  ok: boolean;
  canceledImmediately?: boolean;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string | null;
  status?: string | null;
};

export type PushBillingReactivateResult = {
  ok: boolean;
  cancelAtPeriodEnd?: boolean;
  status?: string | null;
  currentPeriodEnd?: string | null;
};

const MONTHLY_KEY = "push_notifications_monthly_29_ils";
const ANNUAL_KEY = "push_notifications_annual_228_ils";

export function normalizePushPlan(planKey: string | null | undefined): PushBillingPlan | null {
  const raw = String(planKey || "").trim().toLowerCase();
  if (!raw) return null;
  if (raw === "monthly" || raw === MONTHLY_KEY) return "monthly";
  if (raw === "annual" || raw === "yearly" || raw === "year" || raw === ANNUAL_KEY) {
    return "annual";
  }
  return null;
}

export function pushPlanAmountIls(plan: PushBillingPlan | null | undefined): number | null {
  if (plan === "monthly") return 29;
  if (plan === "annual") return 228;
  return null;
}

export function pushPlanLabelHe(plan: PushBillingPlan | null | undefined): string {
  if (plan === "monthly") return "חודשי";
  if (plan === "annual") return "שנתי";
  return "מנוי Push";
}

export async function getPushBillingStatus(): Promise<PushBillingStatus> {
  const { data } = await API.get("/push-billing/status");
  return {
    billingEnabled: Boolean(data?.billingEnabled),
    entitled: Boolean(data?.entitled),
    subscription: data?.subscription || null,
    entitlementReason: data?.entitlementReason ?? null,
    billingEnforced: Boolean(data?.billingEnforced),
    evaluation: data?.evaluation,
    businessId: data?.businessId,
    productKey: data?.productKey,
    ok: data?.ok !== false,
  };
}

export async function createPushBillingCheckout(plan: PushBillingPlan) {
  const { data } = await API.post("/push-billing/checkout", { plan });
  return data as PushBillingCheckoutResult;
}

export async function cancelPushBilling() {
  const { data } = await API.post("/push-billing/cancel", {});
  return data as PushBillingCancelResult;
}

export async function reactivatePushBilling() {
  const { data } = await API.post("/push-billing/reactivate", {});
  return data as PushBillingReactivateResult;
}

export function readPushBillingErrorCode(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const anyErr = error as {
    code?: string;
    status?: number;
    response?: { status?: number; data?: { code?: string } };
  };
  const code = anyErr.response?.data?.code || anyErr.code;
  return typeof code === "string" && code.trim() ? code.trim() : null;
}

export function isPushEntitlementRequiredError(error: unknown): boolean {
  const anyErr = error as {
    status?: number;
    response?: { status?: number; data?: { code?: string } };
  };
  const status = anyErr.response?.status ?? anyErr.status;
  const code = readPushBillingErrorCode(error);
  return (
    status === 402 ||
    code === PUSH_BILLING_API_CODES.ENTITLEMENT_REQUIRED
  );
}