import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { useWhatsAppHubContext } from "../../../dev/useWhatsAppHubContext";
import { useAuth } from "../../../../context/AuthContext";
import { isWhatsAppApiPortalUser } from "../../../../utils/whatsappApiPortal";
import { useWhatsAppApiSubscription } from "../../../../api/whatsappApiPortal";
import WhatsAppViaMetaCard from "./billing/WhatsAppViaMetaCard";
import WhatsAppApiSubscriptionCard from "./portal/WhatsAppApiSubscriptionCard";
import WhatsAppApiBillingActions from "./portal/WhatsAppApiBillingActions";

const CHECKOUT_POLL_MS = 3000;
const CHECKOUT_POLL_LIMIT = 40;

type CheckoutReturn = "processing" | "activated" | "delayed" | null;

export default function WhatsAppBillingTab() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { connection, businessId } = useWhatsAppHubContext();
  const { user, refreshUser } = useAuth();
  const apiPortal = isWhatsAppApiPortalUser(user);
  const { access, loading, reload, setAccess } = useWhatsAppApiSubscription(businessId, apiPortal);

  const [timedOut, setTimedOut] = useState(false);
  const polls = useRef(0);
  const finished = useRef(false);
  const activeNow = Boolean(access?.subscription?.active);
  const checkoutParam = apiPortal && searchParams.get("checkout") === "whatsapp_api";
  // Survives the remount that refreshing the account causes after activation.
  const activatedState = apiPortal && (location.state as { waApiCheckout?: string } | null)?.waApiCheckout === "activated";
  const checkoutReturn: CheckoutReturn = activatedState
    ? activeNow
      ? "activated"
      : null
    : !checkoutParam
      ? null
      : activeNow
        ? "activated"
        : timedOut
          ? "delayed"
          : "processing";

  useEffect(() => {
    if (checkoutParam && activeNow && !finished.current) {
      finished.current = true;
      const next = new URLSearchParams(searchParams);
      next.delete("checkout");
      const search = next.toString();
      navigate(
        { pathname: location.pathname, search: search ? `?${search}` : "" },
        { replace: true, state: { waApiCheckout: "activated" } }
      );
      Promise.resolve(refreshUser?.(true)).catch(() => {});
      return undefined;
    }
    if (checkoutReturn !== "processing" || loading) return undefined;
    const timer = window.setTimeout(() => {
      polls.current += 1;
      if (polls.current > CHECKOUT_POLL_LIMIT) setTimedOut(true);
      else reload();
    }, CHECKOUT_POLL_MS);
    return () => window.clearTimeout(timer);
  }, [activeNow, checkoutParam, checkoutReturn, loading, location.pathname, navigate, refreshUser, reload, searchParams]);

  const notice =
    checkoutReturn === "activated"
      ? { tone: "border-emerald-200 bg-emerald-50 text-emerald-900", text: t("whatsappApiPortal.subscription.checkout.activated") }
      : checkoutReturn === "processing"
        ? { tone: "border-sky-200 bg-sky-50 text-sky-900", text: t("whatsappApiPortal.subscription.checkout.processing") }
        : checkoutReturn === "delayed"
          ? { tone: "border-amber-200 bg-amber-50 text-amber-900", text: t("whatsappApiPortal.subscription.checkout.delayed") }
          : null;

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-3">
      {apiPortal && notice ? (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-lg border px-4 py-3 text-sm font-bold ${notice.tone}`}
          data-testid="wa-api-checkout-return"
          data-state={checkoutReturn || undefined}
        >
          {notice.text}
        </div>
      ) : null}
      {apiPortal ? (
        <WhatsAppApiSubscriptionCard
          access={access}
          loading={loading}
          businessId={businessId}
          footer={
            checkoutReturn === "processing" ? null : (
              <WhatsAppApiBillingActions
                access={access}
                businessId={businessId}
                onAccessChange={(next) => {
                  setAccess(next);
                  Promise.resolve(refreshUser?.(true)).catch(() => {});
                }}
              />
            )
          }
        />
      ) : null}
      <WhatsAppViaMetaCard
        connection={connection}
        onConnect={
          businessId
            ? () =>
                navigate(
                  `/business/${businessId}/dashboard/whatsapp/connection`
                )
            : undefined
        }
      />
    </div>
  );
}
