import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { reactivateWhatsAppBilling } from "../../../../api/whatsappBillingApi";
import WhatsAppUsageCard from "./billing/WhatsAppUsageCard";
import { cardBase } from "../../../../styles/bizuplyUi";
import {
  formatHeDate,
  formatHeIls,
  formatHeNumber,
  resolveWhatsAppUnitPriceIls,
} from "./billing/whatsappBillingFormat";
import { useWhatsAppHubContext } from "../../../dev/useWhatsAppHubContext";
import { useWhatsAppVisualQaOverride } from "../../../dev/whatsappVisualQaContext";

export default function WhatsAppBillingTab() {
  const { t, i18n } = useTranslation();
  const {
    businessId,
    billingUsage,
    billingLoading,
    billingError,
    refreshBilling,
    openBillingSetup,
  } = useWhatsAppHubContext();
  const visualQa = useWhatsAppVisualQaOverride();

  const handleReactivate = async () => {
    if (!businessId) return;
    try {
      await reactivateWhatsAppBilling(businessId);
      toast.success(t("automations.toasts.waReactivated"));
      await refreshBilling();
    } catch {
      toast.error(t("automations.toasts.waReactivateError"));
    }
  };

  const usage = billingUsage;
  const unitPrice = resolveWhatsAppUnitPriceIls(usage?.unitPriceIls ?? 0.2);
  const messageCount = visualQa ? 42 : usage?.usage?.messageCount ?? 0;
  const chargeIls = visualQa
    ? 42 * unitPrice
    : usage?.usage?.chargeIls ?? messageCount * unitPrice;
  const periodEnd = visualQa
    ? "19 באוגוסט"
    : formatHeDate(usage?.usage?.periodEnd);
  const periodStart = visualQa
    ? "20 ביולי"
    : formatHeDate(usage?.usage?.periodStart);

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-3">
      <div>
        <h2 className="text-base font-black text-slate-900">
          {t("whatsapp.hub.billingTitle")}
        </h2>
        <p className="text-xs font-semibold text-slate-500">
          {t("whatsapp.hub.billingSubtitle")}
        </p>
      </div>

      {visualQa || usage?.billingEnabled ? (
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <article className={`${cardBase} px-3 py-2.5`}>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
              {t("whatsapp.hub.billingPeriod")}
            </p>
            <p className="mt-1 text-sm font-black text-slate-900">
              {periodStart && periodEnd
                ? `${periodStart} – ${periodEnd}`
                : periodEnd || "—"}
            </p>
          </article>
          <article className={`${cardBase} px-3 py-2.5`}>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
              {t("whatsapp.hub.sent")}
            </p>
            <p className="mt-1 text-sm font-black text-slate-900">
              {formatHeNumber(messageCount)}
            </p>
          </article>
          <article className={`${cardBase} px-3 py-2.5`}>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
              {t("whatsapp.hub.currentCharge")}
            </p>
            <p className="mt-1 text-sm font-black text-slate-900">
              {formatHeIls(chargeIls)}
            </p>
          </article>
          <article className={`${cardBase} px-3 py-2.5`}>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
              {t("whatsapp.hub.billingModel")}
            </p>
            <p className="mt-1 text-sm font-black text-slate-900">
              {t("whatsapp.billing.payAsYouGo")}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
              {t("whatsapp.billing.perMessage", {
                price: formatHeIls(unitPrice),
              })}
            </p>
          </article>
        </div>
      ) : null}

      {!visualQa && businessId ? (
        <WhatsAppUsageCard
          businessId={businessId}
          usage={billingUsage}
          loading={billingLoading}
          error={billingError}
          onRetry={() => void refreshBilling()}
          onOpenSetup={() => openBillingSetup("setup")}
          onOpenManage={() => openBillingSetup("manage")}
          onReactivate={() => void handleReactivate()}
        />
      ) : null}

      {!visualQa && !billingLoading && usage && !usage.billingEnabled ? (
        <div className={`${cardBase} px-3 py-2.5 text-xs font-semibold text-slate-600`}>
          {t("whatsapp.hub.billingDisabledHint")}
        </div>
      ) : null}

      {!visualQa && !billingLoading && !usage && !billingError ? (
        <div className={`${cardBase} px-3 py-2.5 text-xs font-semibold text-slate-500`}>
          {t("whatsapp.hub.noBillingData")}
        </div>
      ) : null}
    </div>
  );
}
