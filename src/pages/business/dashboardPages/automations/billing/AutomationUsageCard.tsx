import React, { useId, useState } from "react";
import { AlertTriangle, HelpCircle, Loader2, RefreshCw } from "lucide-react";
import {
  AUTOMATION_BILLING_API_CODES,
  normalizeAutomationBillingPublicCode,
  type AutomationBillingUsageOverview,
} from "../../../../../api/automationBillingApi";
import { trackAutomationBillingEvent } from "./automationBillingAnalytics";
import {
  formatHeDate,
  formatHeDateTime,
  formatHeNumber,
  getUsageSeverity,
} from "./automationBillingFormat";
import { getAutomationPlanDisplayName } from "./automationPlanCatalog";

type OpenPlansReason =
  | "no_plan"
  | "upgrade"
  | "manage"
  | "payment"
  | "quota_warning"
  | "quota_critical"
  | "quota_exhausted";

type Props = {
  businessId: string;
  usage: AutomationBillingUsageOverview | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onOpenPlans: (reason: OpenPlansReason) => void;
  onOpenManage: () => void;
  onReactivate: () => void;
  /** Backend has no safe cancel-pending-downgrade API — do not wire a CTA. */
  onCancelPendingDowngrade?: never;
};

function isPaymentBlockReason(reason: string | null | undefined) {
  const normalized = normalizeAutomationBillingPublicCode(reason);
  if (!normalized) return false;
  if (normalized === AUTOMATION_BILLING_API_CODES.QUOTA_EXHAUSTED) return false;
  // Canonical billing-blocked + legacy eligibility reasons for backwards compat.
  if (normalized === AUTOMATION_BILLING_API_CODES.BILLING_BLOCKED) return true;
  if (normalized === AUTOMATION_BILLING_API_CODES.PLAN_REQUIRED) return true;
  const code = String(reason || "").trim().toLowerCase();
  return (
    code.includes("past_due") ||
    code === "unpaid" ||
    code === "canceled" ||
    code === "incomplete" ||
    code === "incomplete_expired" ||
    code === "no_automation_plan" ||
    code === "billing_blocked"
  );
}

function isQuotaBlockReason(reason: string | null | undefined) {
  return (
    normalizeAutomationBillingPublicCode(reason) ===
    AUTOMATION_BILLING_API_CODES.QUOTA_EXHAUSTED
  );
}

export default function AutomationUsageCard({
  businessId,
  usage,
  loading,
  error,
  onRetry,
  onOpenPlans,
  onOpenManage,
  onReactivate,
}: Props) {
  const tipId = useId();
  const [tipOpen, setTipOpen] = useState(false);

  if (loading && !usage) {
    return (
      <div className="ax-billing-card ax-billing-card--skeleton" aria-busy="true">
        <div className="ax-billing-skeleton__line ax-billing-skeleton__line--lg" />
        <div className="ax-billing-skeleton__line" />
        <div className="ax-billing-skeleton__bar" />
      </div>
    );
  }

  if (error && !usage) {
    return (
      <div className="ax-billing-card ax-billing-card--error" role="status">
        <p>לא הצלחנו לטעון את נתוני החבילה כרגע.</p>
        <button type="button" className="ax-btn ax-btn--secondary" onClick={onRetry}>
          <RefreshCw size={14} />
          נסו שוב
        </button>
      </div>
    );
  }

  if (!usage || !usage.billingEnabled) return null;

  if (usage.exempt) {
    const exemption = usage.exemption;
    const isTemporary = exemption?.type === "temporary" && exemption.endsAt;
    if (isTemporary) {
      const endsAt = exemption.endsAt as string;
      const endsMs = new Date(endsAt).getTime();
      const daysLeft = Math.ceil((endsMs - Date.now()) / 86400000);
      const dateLabel = formatHeDate(endsAt);
      let warning: string | null = null;
      let ctaLabel = "בחירת חבילה";
      if (daysLeft <= 1) {
        warning = "מחר מסתיימת חבילת המעבר";
        ctaLabel = "בחירת חבילת אוטומציות";
      } else if (daysLeft <= 7) {
        warning = `חבילת המעבר מסתיימת בעוד ${daysLeft} ימים`;
        ctaLabel = "בחירת חבילת אוטומציות";
      }

      return (
        <div
          className={`ax-billing-card ax-billing-card--transition${
            warning ? " ax-billing-card--warn" : ""
          }`}
          role="status"
        >
          <div className="ax-billing-card__body">
            <strong>חבילת מעבר לאוטומציות</strong>
            <p>
              האוטומציות שלך ימשיכו לפעול ללא שינוי עד{" "}
              {dateLabel || "סיום תקופת המעבר"}.
            </p>
            <p>
              לאחר מכן יהיה צורך לבחור חבילת הרצות כדי להמשיך להפעיל אוטומציות.
            </p>
            {warning ? (
              <p className="ax-billing-card__note" role="alert">
                {warning}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="ax-btn ax-btn--primary"
            onClick={() => onOpenPlans("no_plan")}
          >
            {ctaLabel}
          </button>
        </div>
      );
    }

    return (
      <div className="ax-billing-card ax-billing-card--exempt" role="status">
        <p>האוטומציות פעילות בחשבון</p>
      </div>
    );
  }

  const plan = usage.plan;
  const hasPlan = Boolean(plan?.key);
  const used = usage.usage?.used ?? 0;
  const limit = usage.usage?.limit ?? plan?.executionLimit ?? 0;
  const percentage = usage.usage?.percentage ?? 0;
  const severity = getUsageSeverity(percentage);
  const periodEndLabel = formatHeDate(usage.usage?.periodEnd);
  const graceLabel = formatHeDateTime(usage.subscription?.paymentGraceEndsAt);
  const cancelDateLabel =
    formatHeDate(usage.subscription?.currentPeriodEnd) || periodEndLabel;
  const pendingKey = usage.subscription?.pendingDowngradePlanKey || null;
  const pendingName = pendingKey ? getAutomationPlanDisplayName(pendingKey) : null;
  const planName = plan?.nameHe || plan?.name || getAutomationPlanDisplayName(plan?.key);
  const inPaymentGrace =
    usage.canExecute &&
    (Boolean(usage.subscription?.paymentGraceEndsAt) ||
      String(plan?.status || "").toLowerCase() === "past_due");
  const paymentBlocked =
    !usage.canExecute &&
    !isQuotaBlockReason(usage.blockReason) &&
    (isPaymentBlockReason(usage.blockReason) ||
      String(plan?.status || "").toLowerCase() === "past_due" ||
      String(plan?.status || "").toLowerCase() === "unpaid");
  const quotaBlocked =
    !usage.canExecute &&
    (severity === "exhausted" || isQuotaBlockReason(usage.blockReason));

  if (!hasPlan) {
    return (
      <div className="ax-billing-card ax-billing-card--no-plan">
        <div className="ax-billing-card__body">
          <strong>אוטומציות בתשלום לפי שימוש</strong>
          <p>בחרו חבילת הרצות כדי להפעיל תהליכים אוטומטיים בעסק.</p>
        </div>
        <button
          type="button"
          className="ax-btn ax-btn--primary"
          onClick={() => onOpenPlans("no_plan")}
        >
          בחירת חבילה
        </button>
      </div>
    );
  }

  const cardMod =
    paymentBlocked || quotaBlocked
      ? "ax-billing-card--blocked"
      : severity === "critical"
        ? "ax-billing-card--critical"
        : severity === "warn"
          ? "ax-billing-card--warn"
          : "";

  const openUpgrade = (reason: OpenPlansReason) => {
    trackAutomationBillingEvent("automation_quota_warning_clicked", {
      businessId,
      reason,
      percentage,
    });
    onOpenPlans(reason);
  };

  return (
    <div className={`ax-billing-card ${cardMod}`.trim()}>
      {error ? (
        <div className="ax-billing-card__inline-error" role="status">
          <span>לא הצלחנו לטעון את נתוני החבילה כרגע.</span>
          <button type="button" className="ax-btn ax-btn--secondary" onClick={onRetry}>
            <RefreshCw size={14} />
            נסו שוב
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="ax-billing-card__refresh" aria-live="polite">
          <Loader2 size={14} className="ax-billing-spin" />
          מעדכנים...
        </div>
      ) : null}

      <div className="ax-billing-card__header">
        <div>
          <h3 className="ax-billing-card__title">שימוש באוטומציות החודש</h3>
          <p className="ax-billing-card__plan">חבילת {planName}</p>
        </div>
        <button
          type="button"
          className="ax-btn ax-btn--secondary"
          onClick={onOpenManage}
        >
          ניהול חבילה
        </button>
      </div>

      <div className="ax-billing-card__usage-row">
        <p className="ax-billing-card__counts">
          <strong>{formatHeNumber(used)}</strong>
          {" מתוך "}
          <strong>{formatHeNumber(limit)}</strong>
          {" הרצות"}
          <button
            type="button"
            className="ax-billing-tip-btn"
            aria-expanded={tipOpen}
            aria-controls={tipId}
            aria-label="מהי הרצה?"
            onClick={() => setTipOpen((v) => !v)}
          >
            <HelpCircle size={15} />
          </button>
        </p>
        {tipOpen ? (
          <div id={tipId} className="ax-billing-tip" role="note">
            <strong>מהי הרצה?</strong>
            <p>
              בכל פעם שאוטומציה מופעלת, היא נחשבת להרצה אחת — ללא קשר למספר
              השלבים הרגילים בתהליך.
            </p>
          </div>
        ) : null}
      </div>

      <div
        className="ax-billing-progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.max(0, Math.min(100, Math.round(percentage)))}
        aria-label="שימוש במכסת ההרצות החודשית"
      >
        <div
          className="ax-billing-progress__fill"
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        />
      </div>

      <div className="ax-billing-card__meta">
        <span>נוצלו {formatHeNumber(Number(percentage.toFixed(2)))}%</span>
        {periodEndLabel ? <span>מתאפס ב־{periodEndLabel}</span> : null}
      </div>

      {severity === "warn" && !quotaBlocked && !paymentBlocked ? (
        <div className="ax-billing-alert ax-billing-alert--warn" role="status">
          <AlertTriangle size={16} aria-hidden />
          <div>
            <strong>
              ניצלתם {formatHeNumber(used)} מתוך {formatHeNumber(limit)} הרצות
              החודש
            </strong>
            <p>אם השימוש צפוי לגדול, אפשר לשדרג את החבילה.</p>
            <button
              type="button"
              className="ax-btn ax-btn--primary"
              onClick={() => openUpgrade("quota_warning")}
            >
              שדרוג חבילה
            </button>
          </div>
        </div>
      ) : null}

      {severity === "critical" && !quotaBlocked && !paymentBlocked ? (
        <div className="ax-billing-alert ax-billing-alert--critical" role="status">
          <AlertTriangle size={16} aria-hidden />
          <div>
            <strong>הגעתם כמעט למכסת ההרצות החודשית</strong>
            <p>נשארו {formatHeNumber(Math.max(0, limit - used))} הרצות.</p>
            <button
              type="button"
              className="ax-btn ax-btn--primary"
              onClick={() => openUpgrade("quota_critical")}
            >
              שדרוג עכשיו
            </button>
          </div>
        </div>
      ) : null}

      {quotaBlocked ? (
        <div className="ax-billing-alert ax-billing-alert--blocked" role="alert">
          <AlertTriangle size={16} aria-hidden />
          <div>
            <strong>מכסת ההרצות החודשית נוצלה</strong>
            <p>
              אוטומציות קיימות נשארות פעילות, אך הרצות חדשות לא יתחילו עד לחידוש
              המכסה או לשדרוג החבילה.
            </p>
            <button
              type="button"
              className="ax-btn ax-btn--primary"
              onClick={() => openUpgrade("quota_exhausted")}
            >
              שדרוג חבילה
            </button>
          </div>
        </div>
      ) : null}

      {inPaymentGrace ? (
        <div className="ax-billing-alert ax-billing-alert--warn" role="status">
          <AlertTriangle size={16} aria-hidden />
          <div>
            <strong>יש בעיה בתשלום עבור חבילת האוטומציות</strong>
            <p>
              האוטומציות ימשיכו לפעול זמנית. מומלץ להסדיר את התשלום כדי למנוע
              עצירה.
              {graceLabel ? ` עד ${graceLabel}.` : ""}
            </p>
            <button
              type="button"
              className="ax-btn ax-btn--primary"
              onClick={() => onOpenPlans("payment")}
            >
              ניהול תשלום
            </button>
          </div>
        </div>
      ) : null}

      {paymentBlocked ? (
        <div className="ax-billing-alert ax-billing-alert--blocked" role="alert">
          <AlertTriangle size={16} aria-hidden />
          <div>
            <strong>חבילת האוטומציות אינה פעילה</strong>
            <p>לא ניתן להתחיל הרצות חדשות עד להסדרת התשלום.</p>
            <button
              type="button"
              className="ax-btn ax-btn--primary"
              onClick={() => onOpenPlans("payment")}
            >
              הסדרת תשלום
            </button>
          </div>
        </div>
      ) : null}

      {pendingName ? (
        <p className="ax-billing-card__note" role="status">
          בחידוש הבא: {pendingName}
        </p>
      ) : null}

      {usage.subscription?.cancelAtPeriodEnd ? (
        <div className="ax-billing-card__cancel-note" role="status">
          <p>
            החבילה מתוכננת לביטול
            {cancelDateLabel ? ` ב־${cancelDateLabel}` : ""}
          </p>
          <button type="button" className="ax-btn ax-btn--secondary" onClick={onReactivate}>
            השארת החבילה פעילה
          </button>
        </div>
      ) : null}
    </div>
  );
}