import type { PartnerPlan, PartnerPlanKey } from "../types/partner";

export const INTERNATIONAL_PLAN_KEY = "partner_international" as const;

export type InternationalBillingInterval = "monthly" | "annual";

export type InternationalBillingOption = {
  interval: InternationalBillingInterval;
  amountUsd: number;
  sku?: string;
  labelEn: string;
  labelHe: string;
  bestValue?: boolean;
  savingsUsd?: number;
};

/**
 * Display fallback only. Ledger amounts are calculated on the server.
 * These figures match the approved catalog: $499 / month and $5,000 / year.
 */
export const INTERNATIONAL_BILLING_OPTIONS: InternationalBillingOption[] = [
  {
    interval: "monthly",
    amountUsd: 499,
    labelEn: "Monthly Partner",
    labelHe: "שותף חודשי",
    bestValue: false,
  },
  {
    interval: "annual",
    amountUsd: 5000,
    labelEn: "Annual Partner",
    labelHe: "שותף שנתי",
    bestValue: true,
    savingsUsd: 988,
  },
];

export const INTERNATIONAL_BILLING_STORAGE_KEY = "bizuply.partnerInternational.billing";
export const INTERNATIONAL_REGISTER_STEP_KEY = "bizuply.partnerInternational.registerStep";

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

export function normalizeInternationalBillingInterval(value: unknown): InternationalBillingInterval | null {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "monthly" || raw === "month") return "monthly";
  if (raw === "annual" || raw === "yearly" || raw === "year") return "annual";
  return null;
}

export function internationalBillingOptionsFromPlan(plan?: {
  billingOptions?: InternationalBillingOption[] | null;
  annualUsd?: number | null;
  monthlyMembershipUsd?: number | null;
  annualSavingsUsd?: number | null;
} | null): InternationalBillingOption[] {
  const rows = Array.isArray(plan?.billingOptions) ? plan.billingOptions : [];
  const monthly = rows.find((row) => row.interval === "monthly");
  const annual = rows.find((row) => row.interval === "annual");
  if (monthly?.amountUsd && annual?.amountUsd) {
    return [
      { ...INTERNATIONAL_BILLING_OPTIONS[0], ...monthly, interval: "monthly" },
      {
        ...INTERNATIONAL_BILLING_OPTIONS[1],
        ...annual,
        interval: "annual",
        bestValue: true,
        savingsUsd: annual.savingsUsd || Math.round((monthly.amountUsd * 12 - annual.amountUsd) * 100) / 100,
      },
    ];
  }
  return INTERNATIONAL_BILLING_OPTIONS.map((row) => ({ ...row }));
}

export function readInternationalBillingInterval(search: string): InternationalBillingInterval {
  const params = new URLSearchParams(String(search || "").replace(/^\?/, ""));
  const fromUrl = normalizeInternationalBillingInterval(
    params.get("billing") || params.get("interval") || params.get("billingInterval")
  );
  if (fromUrl) return fromUrl;
  try {
    const stored = normalizeInternationalBillingInterval(sessionStorage.getItem(INTERNATIONAL_BILLING_STORAGE_KEY));
    if (stored) return stored;
  } catch {
    /* session storage is optional */
  }
  return "annual";
}

export function rememberInternationalBillingInterval(interval: InternationalBillingInterval) {
  try {
    sessionStorage.setItem(INTERNATIONAL_BILLING_STORAGE_KEY, interval);
  } catch {
    /* session storage is optional */
  }
}

export function readInternationalRegisterStep(search: string): "plan" | "account" {
  const params = new URLSearchParams(String(search || "").replace(/^\?/, ""));
  if (params.get("step") === "account") return "account";
  try {
    if (sessionStorage.getItem(INTERNATIONAL_REGISTER_STEP_KEY) === "account") return "account";
  } catch {
    /* session storage is optional */
  }
  return "plan";
}

export function rememberInternationalRegisterStep(step: "plan" | "account") {
  try {
    sessionStorage.setItem(INTERNATIONAL_REGISTER_STEP_KEY, step);
  } catch {
    /* session storage is optional */
  }
}

export function defaultManualAmountUsd(interval: InternationalBillingInterval, options = INTERNATIONAL_BILLING_OPTIONS) {
  return options.find((row) => row.interval === interval)?.amountUsd || (interval === "monthly" ? 499 : 5000);
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

export type ManualInternationalPaymentInput = {
  amount?: string | number | null;
  paidAt?: string | null;
  reference?: string | null;
  periodStart?: string | null;
  periodEnd?: string | null;
};

export function validateManualInternationalPayment(input: ManualInternationalPaymentInput) {
  const amount = Number(input.amount);
  const reference = String(input.reference || "").trim();
  const paidAt = String(input.paidAt || "").trim();
  const periodStart = String(input.periodStart || "").trim();
  const periodEnd = String(input.periodEnd || "").trim();
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false as const, error: "Payment amount is required." };
  }
  if (!paidAt) return { ok: false as const, error: "Payment date is required." };
  if (!reference) return { ok: false as const, error: "Payment reference is required." };
  if (!periodStart || !periodEnd || new Date(periodEnd).getTime() <= new Date(periodStart).getTime()) {
    return { ok: false as const, error: "Billing period is required." };
  }
  return {
    ok: true as const,
    payload: {
      amountUsd: amount,
      paidAt,
      reference,
      periodStart,
      periodEnd,
    },
  };
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
  feeReady?: boolean | null;
  agreementReady?: boolean | null;
}) {
  const role = String(input.role || "").toLowerCase();
  if (role === "admin") return { ok: true as const, reason: "admin" };
  if (role !== "partner") {
    return { ok: false as const, reason: "Partner Center is limited to partner accounts." };
  }
  const status = String(input.status || "");
  const planKey = String(input.planKey || "");
  if (isInternationalPlanKey(planKey)) {
    if (status !== "active") {
      return {
        ok: false as const,
        reason: "Partner Center opens only for an active international partner.",
      };
    }
    if (input.feeReady !== true) {
      return { ok: false as const, reason: "A $5,000 ledger entry is not proof of payment." };
    }
    if (input.agreementReady !== true) {
      return {
        ok: false as const,
        reason: "Partner Center opens after the partnership agreement is active.",
      };
    }
    if (input.permissions && input.permissions.length === 0) {
      return { ok: false as const, reason: "Partner Center requires partner permissions." };
    }
  }
  return { ok: true as const, reason: "partner" };
}
