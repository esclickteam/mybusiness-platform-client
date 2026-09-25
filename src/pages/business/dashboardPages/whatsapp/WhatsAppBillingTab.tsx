import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { reactivateWhatsAppBilling } from "../../../../api/whatsappBillingApi";
import WhatsAppUsageCard from "./billing/WhatsAppUsageCard";
import WhatsAppFundsCard from "./billing/WhatsAppFundsCard";
import { cardBase } from "../../../../styles/bizuplyUi";
import {
  formatHeDate,
  formatHeIls,
  formatHeNumber,
  resolveWhatsAppUnitPriceIls,
} from "./billing/whatsappBillingFormat";
import { useWhatsAppHubContext } from "../../../dev/useWhatsAppHubContext";
import { useWhatsAppVisualQaOverride } from "../../../dev/whatsappVisualQaContext";
import type { WhatsAppFundsOverview } from "../../../../api/whatsappWalletApi";

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

  const usage = billingUsage as
    | (NonNullable<typeof billingUsage> & {
        billingModel?: string;
        funds?: WhatsAppFundsOverview["funds"];
        alerts?: WhatsAppFundsOverview["alerts"];
        quickTopupAmountsMinor?: number[];
        minTopupMinor?: number;
        autoFundingPresetsMinor?: number[];
        lowBalancePresetsMinor?: number[];
        unitPriceAgorot?: number;
      })
    | null;

  const isWallet =
    usage?.billingModel === "prepaid_wallet" || Boolean(usage?.funds);

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

  const walletFunds =
    isWallet && usage?.funds
      ? ({
          billingModel: "prepaid_wallet" as const,
          unitPriceIls: usage.unitPriceIls ?? 0.2,
          unitPriceAgorot: usage.unitPriceAgorot ?? 20,
          funds: usage.funds,
          alerts: usage.alerts || {
            lowBalance: false,
            cannotSend: false,
            autoFundingFailed: false,
          },
          quickTopupAmountsMinor: usage.quickTopupAmountsMinor || [],
          minTopupMinor: usage.minTopupMinor || 5000,
          autoFundingPresetsMinor: usage.autoFundingPresetsMinor || [],
          lowBalancePresetsMinor: usage.lowBalancePresetsMinor || [],
        } satisfies WhatsAppFundsOverview)
      : null;

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-3">
      <div>
        <h2 className="text-base font-black text-slate-900">
          {isWallet ? "Funds" : t("whatsapp.hub.billingTitle")}
        </h2>
        <p className="text-xs font-semibold text-slate-500">
          {isWallet
            ? "Prepaid WhatsApp balance · Manual top-up · Monthly Auto Funding"
            : t("whatsapp.hub.billingSubtitle")}
        </p>
      </div>

      {isWallet && businessId ? (
        <WhatsAppFundsCard businessId={businessId} initialFunds={walletFunds} />
      ) : null}

      {!isWallet && (visualQa || usage?.billingEnabled) ? (
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

      {!isWallet && !visualQa && businessId ? (
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

      {!visualQa &&
      !billingLoading &&
      usage &&
      !usage.billingEnabled &&
      !isWallet ? (
        <div
          className={`${cardBase} px-3 py-2.5 text-xs font-semibold text-slate-600`}
        >
          {t("whatsapp.hub.billingDisabledHint")}
        </div>
      ) : null}

      {!visualQa && !billingLoading && !usage && !billingError ? (
        <div
          className={`${cardBase} px-3 py-2.5 text-xs font-semibold text-slate-500`}
        >
          {t("whatsapp.hub.noBillingData")}
        </div>
      ) : null}
    </div>
  );
}
