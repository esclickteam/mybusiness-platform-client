import React, { useId, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
        <p>{t("automations.billing.loadError")}</p>
        <button type="button" className="ax-btn ax-btn--secondary" onClick={onRetry}>
          <RefreshCw size={14} />
          {t("automations.billing.tryAgain")}
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
      let ctaLabel = t("automations.billing.choosePlan");
      if (daysLeft <= 1) {
        warning = t("automations.billing.endsTomorrow");
        ctaLabel = t("automations.billing.chooseAutomationsPlan");
      } else if (daysLeft <= 7) {
        warning = t("automations.billing.endsInDays", { count: daysLeft });
        ctaLabel = t("automations.billing.chooseAutomationsPlan");
      }

      return (
        <div
          className={`ax-billing-card ax-billing-card--transition${
            warning ? " ax-billing-card--warn" : ""
          }`}
          role="status"
        >
          <div className="ax-billing-card__body">
            <strong>{t("automations.billing.transitionTitle")}</strong>
            <p>
              {t("automations.billing.transitionUntil", {
                date: dateLabel || t("automations.billing.transitionEndFallback"),
              })}
            </p>
            <p>{t("automations.billing.transitionAfter")}</p>
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
        <p>{t("automations.billing.exemptActive")}</p>
      </div>
    );
  }

  const plan = usage.plan;
  const hasPlan = Boolean(plan?.key);
  const used = usage.usage?.used ?? 0;
  const limit =
    usage.usage?.limit ?? plan?.actionLimit ?? plan?.executionLimit ?? 0;
  const percentage = usage.usage?.percentage ?? 0;
  const severity = getUsageSeverity(percentage);
  const periodEndLabel = formatHeDate(usage.usage?.periodEnd);
  const graceLabel = formatHeDateTime(usage.subscription?.paymentGraceEndsAt);
  const cancelDateLabel =
    formatHeDate(usage.subscription?.currentPeriodEnd) || periodEndLabel;
  const pendingKey = usage.subscription?.pendingDowngradePlanKey || null;
  const pendingName = pendingKey ? getAutomationPlanDisplayName(pendingKey, t) : null;
  const planName = getAutomationPlanDisplayName(plan?.key, t);
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
  /**
   * Action quota is independent of workflow execution eligibility.
   * Prefer canPerformBillableAction; fall back to legacy canExecute+blockReason.
   */
  const quotaBlocked =
    !paymentBlocked &&
    (typeof usage.canPerformBillableAction === "boolean"
      ? usage.canExecute && usage.canPerformBillableAction === false
      : !usage.canExecute &&
        (severity === "exhausted" || isQuotaBlockReason(usage.blockReason)));

  if (!hasPlan) {
    return (
      <div className="ax-billing-card ax-billing-card--no-plan">
        <div className="ax-billing-card__body">
          <strong>{t("automations.billing.payAsYouGoTitle")}</strong>
          <p>{t("automations.billing.payAsYouGoText")}</p>
        </div>
        <button
          type="button"
          className="ax-btn ax-btn--primary"
          onClick={() => onOpenPlans("no_plan")}
        >
          {t("automations.billing.choosePlan")}
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
          <span>{t("automations.billing.loadError")}</span>
          <button type="button" className="ax-btn ax-btn--secondary" onClick={onRetry}>
            <RefreshCw size={14} />
            {t("automations.billing.tryAgain")}
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="ax-billing-card__refresh" aria-live="polite">
          <Loader2 size={14} className="ax-billing-spin" />
          {t("automations.billing.updating")}
        </div>
      ) : null}

      <div className="ax-billing-card__header">
        <div>
          <h3 className="ax-billing-card__title">{t("automations.billing.usageTitle")}</h3>
          <p className="ax-billing-card__plan">{t("automations.billing.planOf", { plan: planName })}</p>
        </div>
        <button
          type="button"
          className="ax-btn ax-btn--secondary"
          onClick={onOpenManage}
        >
          {t("automations.billing.managePlan")}
        </button>
      </div>

      <div className="ax-billing-card__usage-row">
        <p className="ax-billing-card__counts">
          <strong>{formatHeNumber(used)}</strong>
          {" / "}
          <strong>{formatHeNumber(limit)}</strong>
          <button
            type="button"
            className="ax-billing-tip-btn"
            aria-expanded={tipOpen}
            aria-controls={tipId}
            aria-label={t("automations.billing.whatIsActionAria")}
            onClick={() => setTipOpen((v) => !v)}
          >
            <HelpCircle size={15} />
          </button>
        </p>
        {tipOpen ? (
          <div id={tipId} className="ax-billing-tip" role="note">
            <strong>{t("automations.billing.whatIsActionTitle")}</strong>
            <p>{t("automations.billing.whatIsActionText")}</p>
          </div>
        ) : null}
      </div>

      <div
        className="ax-billing-progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.max(0, Math.min(100, Math.round(percentage)))}
        aria-label={t("automations.billing.quotaAria")}
      >
        <div
          className="ax-billing-progress__fill"
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        />
      </div>

      <div className="ax-billing-card__meta">
        <span>{t("automations.billing.usedPercent", { percent: formatHeNumber(Number(percentage.toFixed(2))) })}</span>
        {periodEndLabel ? <span>{t("automations.billing.resetsOn", { date: periodEndLabel })}</span> : null}
      </div>

      {severity === "warn" && !quotaBlocked && !paymentBlocked ? (
        <div className="ax-billing-alert ax-billing-alert--warn" role="status">
          <AlertTriangle size={16} aria-hidden />
          <div>
            <strong>
              {t("automations.billing.warnUsed", {
                used: formatHeNumber(used),
                limit: formatHeNumber(limit),
              })}
            </strong>
            <p>{t("automations.billing.warnHint")}</p>
            <button
              type="button"
              className="ax-btn ax-btn--primary"
              onClick={() => openUpgrade("quota_warning")}
            >
              {t("automations.billing.upgradePlan")}
            </button>
          </div>
        </div>
      ) : null}

      {severity === "critical" && !quotaBlocked && !paymentBlocked ? (
        <div className="ax-billing-alert ax-billing-alert--critical" role="status">
          <AlertTriangle size={16} aria-hidden />
          <div>
            <strong>{t("automations.billing.almostQuota")}</strong>
            <p>
              {t("automations.billing.remainingActions", {
                count: formatHeNumber(Math.max(0, limit - used)),
              })}
            </p>
            <button
              type="button"
              className="ax-btn ax-btn--primary"
              onClick={() => openUpgrade("quota_critical")}
            >
              {t("automations.billing.upgradeNow")}
            </button>
          </div>
        </div>
      ) : null}

      {quotaBlocked ? (
        <div className="ax-billing-alert ax-billing-alert--blocked" role="alert">
          <AlertTriangle size={16} aria-hidden />
          <div>
            <strong>{t("automations.billing.quotaExhausted")}</strong>
            <p>{t("automations.billing.quotaExhaustedText")}</p>
            <button
              type="button"
              className="ax-btn ax-btn--primary"
              onClick={() => openUpgrade("quota_exhausted")}
            >
              {t("automations.billing.upgradePlan")}
            </button>
          </div>
        </div>
      ) : null}

      {inPaymentGrace ? (
        <div className="ax-billing-alert ax-billing-alert--warn" role="status">
          <AlertTriangle size={16} aria-hidden />
          <div>
            <strong>{t("automations.billing.paymentIssue")}</strong>
            <p>
              {t("automations.billing.paymentIssueText", {
                until: graceLabel
                  ? t("automations.billing.untilGrace", { date: graceLabel })
                  : "",
              })}
            </p>
            <button
              type="button"
              className="ax-btn ax-btn--primary"
              onClick={() => onOpenPlans("payment")}
            >
              {t("automations.billing.managePayment")}
            </button>
          </div>
        </div>
      ) : null}

      {paymentBlocked ? (
        <div className="ax-billing-alert ax-billing-alert--blocked" role="alert">
          <AlertTriangle size={16} aria-hidden />
          <div>
            <strong>{t("automations.billing.planInactive")}</strong>
            <p>{t("automations.billing.planInactiveText")}</p>
            <button
              type="button"
              className="ax-btn ax-btn--primary"
              onClick={() => onOpenPlans("payment")}
            >
              {t("automations.billing.settlePayment")}
            </button>
          </div>
        </div>
      ) : null}

      {pendingName ? (
        <p className="ax-billing-card__note" role="status">
          {t("automations.billing.nextRenewal", { plan: pendingName })}
        </p>
      ) : null}

      {usage.subscription?.cancelAtPeriodEnd ? (
        <div className="ax-billing-card__cancel-note" role="status">
          <p>
            {t("automations.billing.cancelScheduled", {
              when: cancelDateLabel
                ? t("automations.billing.cancelOn", { date: cancelDateLabel })
                : "",
            })}
          </p>
          <button type="button" className="ax-btn ax-btn--secondary" onClick={onReactivate}>
            {t("automations.billing.keepActive")}
          </button>
        </div>
      ) : null}
    </div>
  );
}