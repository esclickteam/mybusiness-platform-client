import API from "../api";

export const CLIENT_PORTAL_BILLING_CODES = {
  ENTITLEMENT_REQUIRED: "CLIENT_PORTAL_ENTITLEMENT_REQUIRED",
  ALREADY_ACTIVE: "CLIENT_PORTAL_ALREADY_ACTIVE",
} as const;

export type ClientPortalBillingSubscription = {
  addonKey?: string;
  status: string | null;
  planKey: string | null;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
};

export type ClientPortalBillingStatus = {
  ok?: boolean;
  businessId?: string;
  billingEnabled: boolean;
  productKey?: string;
  addonKey?: string;
  displayPriceLabel?: string;
  ctaLabel?: string;
  subscription: ClientPortalBillingSubscription | null;
  entitled: boolean;
  entitlementReason?: string | null;
  billingEnforced?: boolean;
};

export type ClientPortalCheckoutResult = {
  ok: boolean;
  url: string;
  sessionId?: string;
  planKey?: string;
  amountIls?: number;
  currency?: string;
  interval?: string;
  mode?: string;
};

export async function getClientPortalBillingStatus(): Promise<ClientPortalBillingStatus> {
  const { data } = await API.get("/client-portal-billing/status");
  return {
    billingEnabled: Boolean(data?.billingEnabled),
    entitled: Boolean(data?.entitled),
    subscription: data?.subscription || null,
    entitlementReason: data?.entitlementReason ?? null,
    billingEnforced: Boolean(data?.billingEnforced),
    displayPriceLabel: data?.displayPriceLabel,
    ctaLabel: data?.ctaLabel,
    businessId: data?.businessId,
    productKey: data?.productKey,
    addonKey: data?.addonKey,
    ok: data?.ok !== false,
  };
}

export async function createClientPortalCheckout(siteId?: string) {
  const { data } = await API.post("/client-portal-billing/checkout", {
    plan: "monthly",
    siteId: siteId || undefined,
  });
  return data as ClientPortalCheckoutResult;
}

export async function cancelClientPortalBilling() {
  const { data } = await API.post("/client-portal-billing/cancel", {});
  return data;
}

export async function reactivateClientPortalBilling() {
  const { data } = await API.post("/client-portal-billing/reactivate", {});
  return data;
}

export function isClientPortalCheckoutRequiredError(error: unknown): boolean {
  const anyErr = error as {
    status?: number;
    response?: { status?: number; data?: { code?: string; checkoutRequired?: boolean } };
  };
  const status = anyErr.response?.status ?? anyErr.status;
  const code = anyErr.response?.data?.code;
  return (
    status === 402 ||
    code === CLIENT_PORTAL_BILLING_CODES.ENTITLEMENT_REQUIRED ||
    Boolean(anyErr.response?.data?.checkoutRequired)
  );
}

const portalInflight = new Map<string, Promise<ClientPortalCheckoutResult>>();

export async function startClientPortalCheckout(siteId?: string) {
  const inflightKey = String(siteId || "");
  const existing = portalInflight.get(inflightKey);
  if (existing) return existing;

  const pending = (async () => {
    const result = await createClientPortalCheckout(siteId);
    if (!result?.url) {
      throw new Error("Checkout session did not return a Stripe URL");
    }
    if (typeof window !== "undefined") {
      window.location.assign(result.url);
    }
    return result;
  })().finally(() => {
    portalInflight.delete(inflightKey);
  });

  portalInflight.set(inflightKey, pending);
  return pending;
}
