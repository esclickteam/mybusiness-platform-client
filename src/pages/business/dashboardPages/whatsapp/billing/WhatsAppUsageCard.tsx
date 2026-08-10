import React from "react";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";
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
        <p>לא הצלחנו לטעון את נתוני חיוב WhatsApp כרגע.</p>
        <button type="button" className="wa-billing-btn wa-billing-btn--secondary" onClick={onRetry}>
          <RefreshCw size={14} />
          נסו שוב
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
      <div className="wa-billing-card wa-billing-card--setup" dir="rtl">
        <div className="wa-billing-card__body">
          <strong>WhatsApp</strong>
          <p className="wa-billing-card__plan">חיוב לפי שימוש</p>
          <p className="wa-billing-card__counts">
            {formatHeIls(unitPrice)} להודעה
          </p>
          <p className="wa-billing-card__status" role="status">
            חיוב WhatsApp לא הוגדר
          </p>
        </div>
        <button
          type="button"
          className="wa-billing-btn wa-billing-btn--primary"
          onClick={onOpenSetup}
        >
          הגדרת חיוב WhatsApp
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
    <div className={`wa-billing-card ${cardMod}`.trim()} dir="rtl">
      {error ? (
        <div className="wa-billing-card__inline-error" role="status">
          <span>לא הצלחנו לטעון את נתוני חיוב WhatsApp כרגע.</span>
          <button
            type="button"
            className="wa-billing-btn wa-billing-btn--secondary"
            onClick={onRetry}
          >
            <RefreshCw size={14} />
            נסו שוב
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="wa-billing-card__refresh" aria-live="polite">
          <Loader2 size={14} className="wa-billing-spin" />
          מעדכנים...
        </div>
      ) : null}

      <div className="wa-billing-card__header">
        <div>
          <h3 className="wa-billing-card__title">WhatsApp</h3>
          <p className="wa-billing-card__plan">חיוב לפי שימוש</p>
          <p className="wa-billing-card__status wa-billing-card__status--active">
            חיוב WhatsApp פעיל
          </p>
        </div>
        <button
          type="button"
          className="wa-billing-btn wa-billing-btn--secondary"
          onClick={onOpenManage}
        >
          ניהול חיוב
        </button>
      </div>

      <p className="wa-billing-card__counts">
        {formatHeIls(unitPrice)} להודעה
      </p>
      <p className="wa-billing-card__counts">
        {formatHeNumber(messageCount)} הודעות החודש
      </p>
      <p className="wa-billing-card__counts">
        חיוב משוער: <strong>{formatHeIls(chargeIls)}</strong>
      </p>

      <div className="wa-billing-card__meta">
        {periodEndLabel ? <span>סוף תקופת החיוב: {periodEndLabel}</span> : null}
      </div>

      <p className="wa-billing-card__note">
        אין חבילות WhatsApp — מחויבים רק לפי הודעות שנשלחו בפועל.
      </p>

      {inPaymentGrace ? (
        <div className="wa-billing-alert wa-billing-alert--warn" role="status">
          <AlertTriangle size={16} aria-hidden />
          <div>
            <strong>יש בעיה בתשלום עבור חיוב WhatsApp</strong>
            <p>
              השליחה תמשיך זמנית. מומלץ להסדיר את התשלום כדי למנוע עצירה.
              {graceLabel ? ` עד ${graceLabel}.` : ""}
            </p>
            <button
              type="button"
              className="wa-billing-btn wa-billing-btn--primary"
              onClick={onOpenManage}
            >
              ניהול תשלום
            </button>
          </div>
        </div>
      ) : null}

      {paymentBlocked ? (
        <div className="wa-billing-alert wa-billing-alert--blocked" role="alert">
          <AlertTriangle size={16} aria-hidden />
          <div>
            <strong>שליחת WhatsApp חסומה עקב מצב החיוב</strong>
            <p>יש להסדיר אמצעי תשלום כדי להמשיך לשלוח הודעות.</p>
            <button
              type="button"
              className="wa-billing-btn wa-billing-btn--primary"
              onClick={isSetupReason(usage.blockReason) ? onOpenSetup : onOpenManage}
            >
              {isSetupReason(usage.blockReason)
                ? "הגדרת חיוב WhatsApp"
                : "הסדרת תשלום"}
            </button>
          </div>
        </div>
      ) : null}

      {usage.subscription?.cancelAtPeriodEnd ? (
        <div className="wa-billing-card__cancel-note" role="status">
          <p>
            החיוב מתוכנן לביטול
            {cancelDateLabel ? ` ב־${cancelDateLabel}` : ""}
          </p>
          <button
            type="button"
            className="wa-billing-btn wa-billing-btn--secondary"
            onClick={onReactivate}
          >
            השארת החיוב פעיל
          </button>
        </div>
      ) : null}
    </div>
  );
}
