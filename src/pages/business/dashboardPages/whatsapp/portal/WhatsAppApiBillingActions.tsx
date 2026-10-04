import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, RefreshCw, RotateCcw, CreditCard } from "lucide-react";
import {
  getWhatsAppApiPaymentMethodUrl,
  portalSubscriptionState,
  resumeWhatsAppApiSubscription,
  startWhatsAppApiCheckout,
  type WhatsAppApiSubscriptionAccess,
} from "../../../../../api/whatsappApiPortal";

type Busy = "reactivate" | "resume" | "updatePayment" | null;

type Props = {
  access: WhatsAppApiSubscriptionAccess | null;
  businessId: string | null | undefined;
  onAccessChange: (access: WhatsAppApiSubscriptionAccess) => void;
  /** Lemon pages open in this tab; injectable for tests. */
  navigateTo?: (url: string) => void;
};

function errorCode(err: unknown): string {
  const data = (err as { response?: { data?: { code?: string } } })?.response?.data;
  return String(data?.code || "");
}

export default function WhatsAppApiBillingActions({
  access,
  businessId,
  onAccessChange,
  navigateTo = (url) => window.location.assign(url),
}: Props) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);
  const { state } = portalSubscriptionState(access);
  const actions = access?.actions;
  if (!businessId || !actions) return null;

  const showReactivate = actions.reactivate && (state === "expired" || state === "none");
  const showResume = actions.resume && state === "cancelsAtPeriodEnd";
  const showUpdatePayment = actions.updatePayment;
  if (!showReactivate && !showResume && !showUpdatePayment) return null;

  const run = async (kind: Exclude<Busy, null>, fn: () => Promise<void>) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(kind);
    setError(null);
    try {
      await fn();
    } catch (err) {
      inFlight.current = false;
      const code = errorCode(err);
      setError(
        code === "WHATSAPP_API_CHECKOUT_IN_PROGRESS"
          ? t("whatsappApiPortal.subscription.actions.checkoutInProgress")
          : code === "WHATSAPP_API_ALREADY_SUBSCRIBED"
            ? t("whatsappApiPortal.subscription.actions.alreadyActive")
            : t("whatsappApiPortal.subscription.actions.error")
      );
      setBusy(null);
    }
  };

  const reactivate = () =>
    run("reactivate", async () => {
      const { url } = await startWhatsAppApiCheckout(businessId);
      if (!url) throw new Error("missing checkout url");
      navigateTo(url);
    });

  const resume = () =>
    run("resume", async () => {
      const next = await resumeWhatsAppApiSubscription(businessId);
      onAccessChange(next);
      inFlight.current = false;
      setBusy(null);
    });

  const updatePayment = () =>
    run("updatePayment", async () => {
      const { url } = await getWhatsAppApiPaymentMethodUrl(businessId);
      if (!url) throw new Error("missing payment url");
      navigateTo(url);
    });

  const primary =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <div className="mt-4 border-t border-slate-100 pt-4" data-testid="wa-api-billing-actions">
      {showReactivate ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-slate-600">{t("whatsappApiPortal.subscription.actions.sameWorkspace")}</p>
          <button
            type="button"
            className={primary}
            onClick={() => void reactivate()}
            disabled={Boolean(busy)}
            aria-busy={busy === "reactivate"}
            data-testid="wa-api-reactivate"
          >
            {busy === "reactivate" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            )}
            {busy === "reactivate"
              ? t("whatsappApiPortal.subscription.actions.openingCheckout")
              : t("whatsappApiPortal.subscription.actions.reactivate")}
          </button>
        </div>
      ) : null}
      {showResume ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-slate-600">{t("whatsappApiPortal.subscription.actions.resumeHint")}</p>
          <button
            type="button"
            className={primary}
            onClick={() => void resume()}
            disabled={Boolean(busy)}
            aria-busy={busy === "resume"}
            data-testid="wa-api-resume"
          >
            {busy === "resume" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            )}
            {busy === "resume"
              ? t("whatsappApiPortal.subscription.actions.resuming")
              : t("whatsappApiPortal.subscription.actions.resume")}
          </button>
        </div>
      ) : null}
      {showUpdatePayment ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-amber-900">{t("whatsappApiPortal.subscription.actions.updatePaymentHint")}</p>
          <button
            type="button"
            className={primary}
            onClick={() => void updatePayment()}
            disabled={Boolean(busy)}
            aria-busy={busy === "updatePayment"}
            data-testid="wa-api-update-payment"
          >
            {busy === "updatePayment" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <CreditCard className="h-4 w-4" aria-hidden="true" />
            )}
            {t("whatsappApiPortal.subscription.actions.updatePayment")}
          </button>
        </div>
      ) : null}
      {error ? (
        <p role="alert" className="mt-2 text-xs font-bold text-rose-700" data-testid="wa-api-billing-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
