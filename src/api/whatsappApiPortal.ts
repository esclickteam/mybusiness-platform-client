import { useCallback, useEffect, useState } from "react";
import API from "../api";

export type WhatsAppApiSubscriptionSummary = {
  status: string;
  active: boolean;
  reason?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  graceEndsAt?: string | null;
};

/** Billing buttons the server allows for the current subscription. */
export type WhatsAppApiBillingActions = {
  reactivate: boolean;
  resume: boolean;
  updatePayment: boolean;
};

export type WhatsAppApiSubscriptionAccess = {
  gateEnabled?: boolean;
  allowed: boolean;
  via: "subscription" | "plan" | null;
  reason: string;
  subscription: WhatsAppApiSubscriptionSummary | null;
  actions?: WhatsAppApiBillingActions;
};

export type PortalSubscriptionState =
  | "active"
  | "cancelsAtPeriodEnd"
  | "pastDueGrace"
  | "expired"
  | "none"
  | "unknown";

export async function getWhatsAppApiSubscriptionStatus(businessId: string) {
  const { data } = await API.get("/whatsapp-api/status", { params: { businessId } });
  return data as WhatsAppApiSubscriptionAccess & { success: boolean };
}

/** Lemon checkout for this same workspace; repeat calls return the same open checkout. */
export async function startWhatsAppApiCheckout(businessId: string) {
  const { data } = await API.post("/whatsapp-api/checkout", { businessId });
  return data as { success: boolean; url: string; reused?: boolean };
}

export async function resumeWhatsAppApiSubscription(businessId: string) {
  const { data } = await API.post("/whatsapp-api/resume", { businessId });
  return data as WhatsAppApiSubscriptionAccess & { success: boolean };
}

export async function getWhatsAppApiPaymentMethodUrl(businessId: string) {
  const { data } = await API.post("/whatsapp-api/payment-method", { businessId });
  return data as { success: boolean; url: string };
}

/**
 * Collapse the server access payload into the four customer-facing states.
 * A cancelled subscription is never reported as plain "active".
 */
export function portalSubscriptionState(access: WhatsAppApiSubscriptionAccess | null | undefined): {
  state: PortalSubscriptionState;
  date: string | null;
} {
  if (!access) return { state: "unknown", date: null };
  const sub = access.subscription;
  if (!sub) return { state: "none", date: null };
  const reason = String(sub.reason || access.reason || "");
  const periodEnd = sub.currentPeriodEnd || null;

  if (!sub.active) return { state: "expired", date: periodEnd };
  if (reason === "payment_grace") {
    return { state: "pastDueGrace", date: sub.graceEndsAt || null };
  }
  if (reason === "active_until_period_end" || sub.cancelAtPeriodEnd || sub.status !== "active") {
    return { state: "cancelsAtPeriodEnd", date: periodEnd };
  }
  return { state: "active", date: periodEnd };
}

/** `unavailable` is true where the subscription API is not deployed (404). */
export function useWhatsAppApiSubscription(businessId: string | null | undefined, enabled = true) {
  const [result, setResult] = useState<{
    businessId: string;
    access: WhatsAppApiSubscriptionAccess | null;
    unavailable: boolean;
  } | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!enabled || !businessId) return undefined;
    let cancelled = false;
    getWhatsAppApiSubscriptionStatus(businessId)
      .then((data) => {
        if (!cancelled) setResult({ businessId, access: data, unavailable: false });
      })
      .catch(() => {
        if (!cancelled) setResult((prev) => (prev?.businessId === businessId && prev.access ? prev : { businessId, access: null, unavailable: true }));
      });
    return () => {
      cancelled = true;
    };
  }, [businessId, enabled, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const setAccess = useCallback(
    (access: WhatsAppApiSubscriptionAccess) => {
      if (businessId) setResult({ businessId, access, unavailable: false });
    },
    [businessId]
  );

  const current = enabled && businessId && result?.businessId === businessId ? result : null;
  return {
    access: current?.access ?? null,
    loading: Boolean(enabled && businessId && !current),
    unavailable: Boolean(current?.unavailable),
    reload,
    setAccess,
  };
}
