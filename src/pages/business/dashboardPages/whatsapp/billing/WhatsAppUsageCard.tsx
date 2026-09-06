import React from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { useLocaleDir } from "../../../../../hooks/useLocaleDir";
import {
  WHATSAPP_BILLING_API_CODES,
  normalizeWhatsAppBillingPublicCode,
  type WhatsAppBillingUsageOverview,
} from "../../../../../api/whatsappBillingApi";
import {
  formatHeDate,
  formatHeDateTime,
  formatHeIls,
  formatHeNumber,
  resolveWhatsAppUnitPriceIls,
} from "./whatsappBillingFormat";
import "./whatsappBilling.css";

type Props = {
  businessId: string;
  usage: WhatsAppBillingUsageOverview | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onOpenSetup: () => void;
  onOpenManage: () => void;
  onReactivate: () => void;
};

const ACTIVE_LIKE = new Set(["active", "trialing", "past_due"]);

function isSetupReason(reason: string | null | undefined) {
  return (
    normalizeWhatsAppBillingPublicCode(reason) ===
    WHATSAPP_BILLING_API_CODES.SETUP_REQUIRED
  );
}

function isBlockedReason(reason: string | null | undefined) {
  return (
    normalizeWhatsAppBillingPublicCode(reason) ===
    WHATSAPP_BILLING_API_CODES.BILLING_BLOCKED
  );
}

export default function WhatsAppUsageCard({
  businessId: _businessId,
  usage,
  loading,
  error,
  onRetry,
  onOpenSetup,
  onOpenManage,
  onReactivate,
}: Props) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  if (loading && !usage) {
    return (
      <div className="wa-billing-card wa-billing-card--skeleton" aria-busy="true">
        <div className="wa-billing-skeleton__line wa-billing-skeleton__line--lg" />
        <div className="wa-billing-skeleton__line" />
        <div className="wa-billing-skeleton__bar" />
      </div>
    );
  }

  if (error && !usage) {
    return (
      <div className="wa-billing-card wa-billing-card--error" role="status">
        <p>{t("whatsapp.billing.loadError")}</p>
        <button type="button" className="wa-billing-btn wa-billing-btn--secondary" onClick={onRetry}>
          <RefreshCw size={14} />
          {t("whatsapp.billing.retry")}
        </button>
      </div>
    );
  }

  if (!usage || !usage.billingEnabled) return null;

  const unitPrice = resolveWhatsAppUnitPriceIls(usage.unitPriceIls);
  const status = String(usage.subscription?.status || "").toLowerCase();
  const hasActiveLike = ACTIVE_LIKE.has(status);
  const hasPaymentMethod = Boolean(usage.subscription?.hasPaymentMethod);
  const needsSetup =
    !hasActiveLike ||
    !hasPaymentMethod ||
    isSetupReason(usage.blockReason) ||
    (!usage.canSend && isSetupReason(usage.blockReason));
  const paymentBlocked =
    !usage.canSend &&
    (isBlockedReason(usage.blockReason) ||
      status === "past_due" ||
      status === "unpaid" ||
      status === "canceled" ||
      status === "incomplete" ||
      status === "incomplete_expired");
  const inPaymentGrace =
    usage.canSend &&
    (Boolean(usage.subscription?.paymentGraceEndsAt) || status === "past_due");
  const messageCount = usage.usage?.messageCount ?? 0;
  const chargeIls = usage.usage?.chargeIls ?? messageCount * unitPrice;
  const periodEndLabel = formatHeDate(usage.usage?.periodEnd);
  const graceLabel = formatHeDateTime(usage.subscription?.paymentGraceEndsAt);
  const cancelDateLabel =
    formatHeDate(usage.subscription?.currentPeriodEnd) || periodEndLabel;

  if (needsSetup && !hasActiveLike) {
    return (
      <div className="wa-billing-card wa-billing-card--setup" dir={dir}>
        <div className="wa-billing-card__body">
          <strong>{t("whatsapp.billing.title")}</strong>
          <p className="wa-billing-card__plan">{t("whatsapp.billing.payAsYouGo")}</p>
          <p className="wa-billing-card__counts">
            {t("whatsapp.billing.perMessage", { price: formatHeIls(unitPrice) })}
          </p>
          <p className="wa-billing-card__status" role="status">
            {t("whatsapp.billing.notConfigured")}
          </p>
        </div>
        <button
          type="button"
          className="wa-billing-btn wa-billing-btn--primary"
          onClick={onOpenSetup}
        >
          {t("whatsapp.billing.setupCta")}
        </button>
      </div>
    );
  }

  const cardMod = paymentBlocked
    ? "wa-billing-card--blocked"
    : inPaymentGrace
      ? "wa-billing-card--warn"
      : "";

  return (
    <div className={`wa-billing-card ${cardMod}`.trim()} dir={dir}>
      {error ? (
        <div className="wa-billing-card__inline-error" role="status">
          <span>{t("whatsapp.billing.loadError")}</span>
          <button
            type="button"
            className="wa-billing-btn wa-billing-btn--secondary"
            onClick={onRetry}
          >
            <RefreshCw size={14} />
            {t("whatsapp.billing.retry")}
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="wa-billing-card__refresh" aria-live="polite">
          <Loader2 size={14} className="wa-billing-spin" />
          {t("whatsapp.billing.updating")}
        </div>
      ) : null}

      <div className="wa-billing-card__header">
        <div>
          <h3 className="wa-billing-card__title">{t("whatsapp.billing.title")}</h3>
          <p className="wa-billing-card__plan">{t("whatsapp.billing.payAsYouGo")}</p>
          <p className="wa-billing-card__status wa-billing-card__status--active">
            {t("whatsapp.billing.active")}
          </p>
        </div>
        <button
          type="button"
          className="wa-billing-btn wa-billing-btn--secondary"
          onClick={onOpenManage}
        >
          {t("whatsapp.billing.manage")}
        </button>
      </div>

      <p className="wa-billing-card__counts">
        {t("whatsapp.billing.perMessage", { price: formatHeIls(unitPrice) })}
      </p>
      <p className="wa-billing-card__counts">
        {t("whatsapp.billing.messagesThisMonth", {
          count: formatHeNumber(messageCount),
        })}
      </p>
      <p className="wa-billing-card__counts">
        {t("whatsapp.billing.estimatedCharge")}{" "}
        <strong>{formatHeIls(chargeIls)}</strong>
      </p>

      <div className="wa-billing-card__meta">
        {periodEndLabel ? (
          <span>{t("whatsapp.billing.periodEnd", { date: periodEndLabel })}</span>
        ) : null}
      </div>

      <p className="wa-billing-card__note">{t("whatsapp.billing.noPackages")}</p>

      {inPaymentGrace ? (
        <div className="wa-billing-alert wa-billing-alert--warn" role="status">
          <AlertTriangle size={16} aria-hidden />
          <div>
            <strong>{t("whatsapp.billing.paymentIssue")}</strong>
            <p>
              {t("whatsapp.billing.paymentIssueBody")}
              {graceLabel ? t("whatsapp.billing.until", { date: graceLabel }) : ""}
            </p>
            <button
              type="button"
              className="wa-billing-btn wa-billing-btn--primary"
              onClick={onOpenManage}
            >
              {t("whatsapp.billing.managePayment")}
            </button>
          </div>
        </div>
      ) : null}

      {paymentBlocked ? (
        <div className="wa-billing-alert wa-billing-alert--blocked" role="alert">
          <AlertTriangle size={16} aria-hidden />
          <div>
            <strong>{t("whatsapp.billing.sendBlocked")}</strong>
            <p>{t("whatsapp.billing.sendBlockedBody")}</p>
            <button
              type="button"
              className="wa-billing-btn wa-billing-btn--primary"
              onClick={isSetupReason(usage.blockReason) ? onOpenSetup : onOpenManage}
            >
              {isSetupReason(usage.blockReason)
                ? t("whatsapp.billing.setupCta")
                : t("whatsapp.billing.settlePayment")}
            </button>
          </div>
        </div>
      ) : null}

      {usage.subscription?.cancelAtPeriodEnd ? (
        <div className="wa-billing-card__cancel-note" role="status">
          <p>
            {t("whatsapp.billing.cancelScheduled")}
            {cancelDateLabel
              ? t("whatsapp.billing.cancelScheduledOn", { date: cancelDateLabel })
              : ""}
          </p>
          <button
            type="button"
            className="wa-billing-btn wa-billing-btn--secondary"
            onClick={onReactivate}
          >
            {t("whatsapp.billing.keepActive")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
