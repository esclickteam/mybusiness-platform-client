import API from "../api";
import { assertAutomationWritesAllowed } from "./automationPreviewGuard";

export const WHATSAPP_BILLING_API_CODES = {
  SETUP_REQUIRED: "WHATSAPP_BILLING_SETUP_REQUIRED",
  BILLING_BLOCKED: "WHATSAPP_BILLING_BLOCKED",
} as const;

export type WhatsAppBillingUsageOverview = {
  billingEnabled: boolean;
  unitPriceIls: number;
  unitPriceAgorot: number;
  canSend: boolean;
  blockReason: string | null;
  usage: null | {
    messageCount: number;
    chargeAgorot: number;
    chargeIls: number;
    periodStart: string;
    periodEnd: string;
  };
  subscription: {
    status: string | null;
    cancelAtPeriodEnd: boolean;
    paymentGraceEndsAt: string | null;
    currentPeriodEnd?: string | null;
    hasPaymentMethod?: boolean;
    productKey?: string;
  };
};

export type WhatsAppBillingCheckoutResult = {
  success?: boolean;
  ok: boolean;
  url: string;
  sessionId?: string;
  productKey?: string;
  unitPriceIls?: number;
  unitPriceAgorot?: number;
  reused?: boolean;
};

export type WhatsAppBillingCancelResult = {
  success?: boolean;
  ok: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd?: string | null;
};

export type WhatsAppBillingReactivateResult = {
  success?: boolean;
  ok: boolean;
  cancelAtPeriodEnd: boolean;
};

export type WhatsAppBillingMarginBusinessRow = {
  businessId: string;
  messageCount: number;
  chargeAgorot: number;
  chargeIls: number;
  metaCostAgorot: number;
  metaCostIls: number;
  marginAgorot: number;
  marginIls: number;
};

export type WhatsAppBillingMarginReport = {
  success?: boolean;
  from: string | null;
  to: string | null;
  businesses: WhatsAppBillingMarginBusinessRow[];
  totals: {
    messageCount: number;
    chargeAgorot: number;
    chargeIls: number;
    metaCostAgorot: number;
    metaCostIls: number;
    marginAgorot: number;
    marginIls: number;
  };
};

function withBusiness(businessId: string) {
  return { params: { businessId } };
}

export async function getWhatsAppBillingUsage(businessId: string) {
  const { data } = await API.get(
    "/whatsapp/billing/usage",
    withBusiness(businessId)
  );
  const {
    success: _success,
    ok: _ok,
    businessId: _businessId,
    ...overview
  } = (data || {}) as WhatsAppBillingUsageOverview & {
    success?: boolean;
    ok?: boolean;
    businessId?: string;
  };
  return overview as WhatsAppBillingUsageOverview;
}

export async function createWhatsAppBillingCheckout(
  businessId: string,
  options?: { returnTo?: "automations" | "whatsapp" }
) {
  assertAutomationWritesAllowed();
  const { data } = await API.post(
    "/whatsapp/billing/checkout",
    { returnTo: options?.returnTo || undefined },
    withBusiness(businessId)
  );
  return data as WhatsAppBillingCheckoutResult;
}

export async function cancelWhatsAppBilling(businessId: string) {
  assertAutomationWritesAllowed();
  const { data } = await API.post(
    "/whatsapp/billing/cancel",
    {},
    withBusiness(businessId)
  );
  return data as WhatsAppBillingCancelResult;
}

export async function reactivateWhatsAppBilling(businessId: string) {
  assertAutomationWritesAllowed();
  const { data } = await API.post(
    "/whatsapp/billing/reactivate",
    {},
    withBusiness(businessId)
  );
  return data as WhatsAppBillingReactivateResult;
}

export async function getAdminWhatsAppBillingMargin(params?: {
  from?: string | null;
  to?: string | null;
  businessId?: string | null;
}) {
  const { data } = await API.get("/admin/whatsapp-billing/margin", {
    params: {
      from: params?.from || undefined,
      to: params?.to || undefined,
      businessId: params?.businessId || undefined,
    },
  });
  return data as WhatsAppBillingMarginReport;
}

export function readWhatsAppBillingErrorCode(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const data = (error as { response?: { data?: { code?: string } } }).response
    ?.data;
  const code = data?.code;
  return typeof code === "string" && code.trim() ? code.trim() : null;
}

export function isWhatsAppBillingGateCode(code: string | null | undefined) {
  return (
    code === WHATSAPP_BILLING_API_CODES.SETUP_REQUIRED ||
    code === WHATSAPP_BILLING_API_CODES.BILLING_BLOCKED
  );
}

/** Normalize legacy/internal aliases to canonical public API codes. */
export function normalizeWhatsAppBillingPublicCode(
  code: string | null | undefined
): string | null {
  const raw = String(code || "").trim();
  if (!raw) return null;
  if (isWhatsAppBillingGateCode(raw)) return raw;
  const lower = raw.toLowerCase();
  if (
    lower === "setup_required" ||
    lower === "no_whatsapp_billing" ||
    lower === "payment_method_missing" ||
    raw === "SETUP_REQUIRED"
  ) {
    return WHATSAPP_BILLING_API_CODES.SETUP_REQUIRED;
  }
  if (
    lower === "billing_blocked" ||
    raw === "BILLING_BLOCKED" ||
    lower.includes("past_due") ||
    lower === "unpaid" ||
    lower === "canceled" ||
    lower === "cancelled" ||
    lower.startsWith("incomplete")
  ) {
    return WHATSAPP_BILLING_API_CODES.BILLING_BLOCKED;
  }
  return raw;
}
