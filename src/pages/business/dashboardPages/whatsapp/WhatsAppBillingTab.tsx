import React from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { reactivateWhatsAppBilling } from "../../../../api/whatsappBillingApi";
import WhatsAppUsageCard from "./billing/WhatsAppUsageCard";
import { cardBase } from "../../../../styles/bizuplyUi";
import type { WhatsAppHubOutletContext } from "./WhatsAppMain";

export default function WhatsAppBillingTab() {
  const { t, i18n } = useTranslation();
  const {
    businessId,
    billingUsage,
    billingLoading,
    billingError,
    refreshBilling,
    openBillingSetup,
  } = useOutletContext<WhatsAppHubOutletContext>();

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

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-4">
      <div>
        <h2 className="text-lg font-black text-slate-900">
          {t("whatsapp.hub.billingTitle")}
        </h2>
        <p className="mt-0.5 text-sm font-semibold text-slate-500">
          {t("whatsapp.hub.billingSubtitle")}
        </p>
      </div>

      {businessId ? (
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

      {!billingLoading && billingUsage && !billingUsage.billingEnabled ? (
        <div className={`${cardBase} p-4 text-sm font-semibold text-slate-600`}>
          {t("whatsapp.hub.billingDisabledHint")}
        </div>
      ) : null}

      {!billingLoading && !billingUsage && !billingError ? (
        <div className={`${cardBase} p-4 text-sm font-semibold text-slate-500`}>
          {t("whatsapp.hub.noBillingData")}
        </div>
      ) : null}
    </div>
  );
}
