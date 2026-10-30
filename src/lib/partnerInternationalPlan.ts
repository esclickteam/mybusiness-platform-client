import type { PartnerPlan, PartnerPlanKey } from "../types/partner";

export const INTERNATIONAL_PLAN_KEY = "partner_international" as const;

export const LEGACY_PLAN_KEYS = [
  "partner_basic",
  "partner_pro",
  "partner_premium",
  "partner_percent",
] as const;

export type LegacyPlanKey = (typeof LEGACY_PLAN_KEYS)[number];

/** Additive catalog row. Does not replace or reprice legacy keys. Live Stripe stays off. */
export const INTERNATIONAL_PARTNER_PLAN: PartnerPlan = {
  planKey: INTERNATIONAL_PLAN_KEY,
  nameHe: "שותף בינלאומי",
  nameEn: "International Partner",
  setupSku: "",
  monthlySku: "",
  currency: "usd",
  setupIls: 0,
  monthlyIls: 0,
  annualUsd: 5000,
  softwareDiscountCap: 0,
  humanServiceDiscountCap: 0,
  aiDiscountCap: 0,
  whatsappDiscountCap: 0,
  partnerMarkupShare: 0,
  additionalTeamUsers: 2,
  customDomainEligible: true,
  canHideBizuplyBranding: false,
  isPaid: true,
  commissionModel: "agreement_percent",
  saleCommissionRate: 0,
  oneTimeSaleCommissionRate: 0.1,
  recurringTiers: [
    { minCustomers: 1, maxCustomers: 19, rate: 0.3 },
    { minCustomers: 20, maxCustomers: 39, rate: 0.35 },
    { minCustomers: 40, maxCustomers: null, rate: 0.4 },
  ],
  billing: "annual",
  liveBillingEnabled: false,
};

export function isLegacyPlanKey(value: string) {
  return (LEGACY_PLAN_KEYS as readonly string[]).includes(value);
}

export function isInternationalPlanKey(value: string) {
  return value === INTERNATIONAL_PLAN_KEY;
}

export function isKnownPartnerPlanKey(value: string): value is PartnerPlanKey {
  return isLegacyPlanKey(value) || isInternationalPlanKey(value);
}

/** Never rewrite another plan onto partner_international. */
export function requireInternationalPlanKey(requested?: string | null) {
  const key = String(requested || "").trim();
  if (!key) {
    return {
      ok: false as const,
      error: "planKey is required and must be partner_international.",
    };
  }
  if (isLegacyPlanKey(key)) {
    return {
      ok: false as const,
      error: `planKey ${key} is an existing track and cannot be used on the international recruitment flow. Use partner_international.`,
    };
  }
  if (!isInternationalPlanKey(key)) {
    return {
      ok: false as const,
      error: `Unknown planKey ${key}. This flow accepts only partner_international.`,
    };
  }
  return { ok: true as const, planKey: INTERNATIONAL_PLAN_KEY };
}

export function resolvePartnerRegisterPlanKey(input: {
  requested?: string | null;
  lockedToInternational: boolean;
}) {
  const key = String(input.requested || "").trim();
  if (input.lockedToInternational) {
    return requireInternationalPlanKey(key || INTERNATIONAL_PLAN_KEY);
  }
  if (!key) {
    return { ok: true as const, planKey: "partner_basic" as PartnerPlanKey };
  }
  if (!isKnownPartnerPlanKey(key)) {
    return { ok: false as const, error: `Unknown planKey ${key}.` };
  }
  return { ok: true as const, planKey: key };
}

export function isInternationalRegisterLock(search: string | URLSearchParams) {
  const params = typeof search === "string" ? new URLSearchParams(search.replace(/^\?/, "")) : search;
  return params.get("planKey") === INTERNATIONAL_PLAN_KEY;
}

/** Generic /partner/register keeps listing legacy tracks only. */
export function plansForRegisterForm(plans: PartnerPlan[], lockedToInternational: boolean) {
  if (lockedToInternational) return [INTERNATIONAL_PARTNER_PLAN];
  return plans.filter((plan) => !isInternationalPlanKey(plan.planKey));
}

export function mergeInternationalCatalogRow(plans: PartnerPlan[]) {
  if (plans.some((plan) => plan.planKey === INTERNATIONAL_PLAN_KEY)) return plans;
  return [...plans, INTERNATIONAL_PARTNER_PLAN];
}

export function recurringRateForEligibleCustomers(count: number) {
  if (count >= 40) return 0.4;
  if (count >= 20) return 0.35;
  if (count >= 1) return 0.3;
  return 0;
}

export function internationalRecurringCommission(eligibleCount: number, subscriptionTotalUsd: number) {
  const rate = recurringRateForEligibleCustomers(eligibleCount);
  const commissionUsd = Math.round(Number(subscriptionTotalUsd || 0) * rate * 100) / 100;
  return { rate, commissionUsd, chargedLive: false as const };
}

export function internationalOneTimeCommission(amountUsd: number) {
  const rate = INTERNATIONAL_PARTNER_PLAN.oneTimeSaleCommissionRate || 0.1;
  const commissionUsd = Math.round(Number(amountUsd || 0) * rate * 100) / 100;
  return { rate, commissionUsd, chargedLive: false as const };
}

export function internationalAnnualFeeUsd() {
  return {
    amountUsd: INTERNATIONAL_PARTNER_PLAN.annualUsd || 5000,
    chargedLive: false as const,
    liveBillingEnabled: false as const,
  };
}

export function canOpenPartnerCenter(input: {
  role?: string | null;
  status?: string | null;
  planKey?: string | null;
  permissions?: string[] | null;
}) {
  const role = String(input.role || "").toLowerCase();
  if (role === "admin") return { ok: true as const, reason: "admin" };
  if (role !== "partner") {
    return { ok: false as const, reason: "Partner Center is limited to partner accounts." };
  }
  const status = String(input.status || "");
  const planKey = String(input.planKey || "");
  if (isInternationalPlanKey(planKey) && status !== "active" && status !== "payment_due") {
    return {
      ok: false as const,
      reason: "Partner Center opens only after admin approval (status active).",
    };
  }
  if (input.permissions && input.permissions.length === 0 && isInternationalPlanKey(planKey)) {
    return { ok: false as const, reason: "Partner Center requires partner permissions." };
  }
  return { ok: true as const, reason: "partner" };
}
