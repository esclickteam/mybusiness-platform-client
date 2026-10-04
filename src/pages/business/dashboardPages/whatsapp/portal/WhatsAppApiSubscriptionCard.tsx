import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CreditCard } from "lucide-react";
import {
  portalSubscriptionState,
  type PortalSubscriptionState,
  type WhatsAppApiSubscriptionAccess,
} from "../../../../../api/whatsappApiPortal";
import { getIntlLocale } from "../../../../../i18n/localeUtils";
import { cardBase } from "../../../../../styles/bizuplyUi";

const STATE_TONE: Record<PortalSubscriptionState, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelsAtPeriodEnd: "border-amber-200 bg-amber-50 text-amber-900",
  pastDueGrace: "border-amber-200 bg-amber-50 text-amber-900",
  expired: "border-rose-200 bg-rose-50 text-rose-800",
  none: "border-slate-200 bg-slate-50 text-slate-700",
  unknown: "border-slate-200 bg-slate-50 text-slate-600",
};

type Props = {
  access: WhatsAppApiSubscriptionAccess | null;
  loading: boolean;
  businessId: string | null | undefined;
  /** Compact strip for the overview; full card for the billing page. */
  compact?: boolean;
};

export function useSubscriptionCopy(access: WhatsAppApiSubscriptionAccess | null) {
  const { t, i18n } = useTranslation();
  const { state, date } = portalSubscriptionState(access);
  const formatted = date
    ? new Date(date).toLocaleDateString(getIntlLocale(i18n.language), { dateStyle: "medium" })
    : "";
  const detailKey =
    state === "active" && !formatted ? "activeNoDate" : state === "expired" && !formatted ? "expiredNoDate" : state;
  return {
    state,
    label: t(`whatsappApiPortal.subscription.state.${state}`),
    detail: t(`whatsappApiPortal.subscription.detail.${detailKey}`, { date: formatted }),
  };
}

export default function WhatsAppApiSubscriptionCard({ access, loading, businessId, compact = false }: Props) {
  const { t } = useTranslation();
  const { state, label, detail } = useSubscriptionCopy(access);
  const billingTo = businessId ? `/business/${businessId}/dashboard/whatsapp/billing` : "#";
  const invoicesTo = businessId ? `/business/${businessId}/dashboard/billing` : "#";
  const metaCostsTo = businessId ? `/business/${businessId}/dashboard/whatsapp/meta-costs` : "#";

  return (
    <section
      className={`${cardBase} ${compact ? "px-3 py-3 sm:px-4" : "p-4 sm:p-5"}`}
      data-testid="wa-api-subscription"
      data-state={loading ? "loading" : state}
      aria-labelledby="wa-api-subscription-title"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
            <CreditCard className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h2 id="wa-api-subscription-title" className="text-sm font-black text-slate-900">
                {t("whatsappApiPortal.subscription.title")}
              </h2>
              {loading ? (
                <span className="h-5 w-16 animate-pulse rounded-md bg-slate-100" aria-hidden="true" />
              ) : (
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-black ${STATE_TONE[state]}`}
                  data-testid="wa-api-subscription-state"
                >
                  {label}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm font-bold text-slate-800">
              {t("whatsappApiPortal.subscription.price")}
              <span className="mx-1.5 text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="font-semibold text-slate-600">{t("whatsappApiPortal.subscription.oneNumber")}</span>
            </p>
            {!loading ? <p className="mt-1 text-xs font-semibold text-slate-500">{detail}</p> : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-1 text-xs font-black">
          {compact ? (
            <Link to={billingTo} className="text-emerald-700 hover:text-emerald-800">
              {t("whatsappApiPortal.subscription.manage")}
            </Link>
          ) : (
            <>
              <Link to={invoicesTo} className="text-emerald-700 hover:text-emerald-800">
                {t("whatsappApiPortal.subscription.invoices")}
              </Link>
              <Link to={metaCostsTo} className="text-slate-700 hover:text-emerald-700">
                {t("whatsappApiPortal.subscription.metaCosts")}
              </Link>
            </>
          )}
        </div>
      </div>
      {!compact ? (
        <ul className="mt-4 grid gap-2 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-600 sm:grid-cols-2">
          <li>{t("whatsappApiPortal.subscription.includes.api")}</li>
          <li>{t("whatsappApiPortal.subscription.includes.metaCosts")}</li>
        </ul>
      ) : null}
    </section>
  );
}
