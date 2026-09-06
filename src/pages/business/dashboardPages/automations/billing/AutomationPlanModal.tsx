import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  changeAutomationPlan,
  createAutomationPlanCheckout,
  reactivateAutomationPlan,
  type AutomationBillingUsageOverview,
} from "../../../../../api/automationBillingApi";
import { trackAutomationBillingEvent } from "./automationBillingAnalytics";
import { formatHeDate, formatHeNumber } from "./automationBillingFormat";
import {
  AUTOMATION_PLAN_DEFINITIONS,
  getAutomationPlanDisplayName,
  isDowngradePlan,
  isUpgradePlan,
  type AutomationPlanDefinition,
} from "./automationPlanCatalog";

type ModalMode = "pick" | "manage";
type ConfirmKind = "upgrade" | "downgrade";

type Props = {
  open: boolean;
  businessId: string;
  usage: AutomationBillingUsageOverview | null;
  initialMode?: ModalMode;
  onClose: () => void;
  onUsageUpdated: () => void | Promise<void>;
  onOpenCancel: () => void;
};

type ConfirmState = {
  kind: ConfirmKind;
  plan: AutomationPlanDefinition;
};

export default function AutomationPlanModal({
  open,
  businessId,
  usage,
  initialMode = "pick",
  onClose,
  onUsageUpdated,
  onOpenCancel,
}: Props) {
  const { t } = useTranslation();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<ModalMode>(initialMode);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [reactivating, setReactivating] = useState(false);

  const currentKey = usage?.plan?.key || null;
  const hasPlan = Boolean(currentKey);
  const pendingKey = usage?.subscription?.pendingDowngradePlanKey || null;
  const cancelAtPeriodEnd = Boolean(usage?.subscription?.cancelAtPeriodEnd);
  const periodEndLabel =
    formatHeDate(usage?.subscription?.currentPeriodEnd) ||
    formatHeDate(usage?.usage?.periodEnd);

  useEffect(() => {
    if (!open) {
      setConfirm(null);
      setBusyKey(null);
      setReactivating(false);
      return;
    }
    setMode(initialMode);
    trackAutomationBillingEvent("automation_plan_modal_opened", {
      businessId,
      mode: initialMode,
      planKey: currentKey,
    });
  }, [open, initialMode, businessId, currentKey]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busyKey && !reactivating) onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) || []
      ).filter((el) => !el.hasAttribute("disabled"));
    focusables()[0]?.focus();
    const onTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onTab);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keydown", onTab);
      prev?.focus?.();
    };
  }, [open, onClose, busyKey, reactivating, confirm, mode]);

  const heading = useMemo(() => {
    if (confirm?.kind === "upgrade") {
      return t("automations.billing.upgradeTo", {
        plan: getAutomationPlanDisplayName(confirm.plan.key, t),
      });
    }
    if (confirm?.kind === "downgrade") return t("automations.billing.downgradeTitle");
    if (mode === "manage" && hasPlan) return t("automations.billing.manageTitle");
    return t("automations.billing.pickTitle");
  }, [confirm, mode, hasPlan, t]);

  if (!open) return null;

  const startCheckout = async (plan: AutomationPlanDefinition) => {
    setBusyKey(plan.key);
    trackAutomationBillingEvent("automation_plan_checkout_started", {
      businessId,
      planKey: plan.key,
    });
    try {
      const result = await createAutomationPlanCheckout(businessId, plan.key);
      if (!result?.url) {
        toast.error(t("automations.billing.checkoutError"));
        setBusyKey(null);
        return;
      }
      window.location.assign(result.url);
    } catch {
      toast.error(t("automations.billing.checkoutError"));
      setBusyKey(null);
    }
  };

  const applyChange = async (plan: AutomationPlanDefinition, kind: ConfirmKind) => {
    setBusyKey(plan.key);
    trackAutomationBillingEvent(
      kind === "upgrade"
        ? "automation_plan_upgrade_requested"
        : "automation_plan_downgrade_requested",
      { businessId, planKey: plan.key, fromPlanKey: currentKey }
    );
    try {
      const result = await changeAutomationPlan(businessId, plan.key);
      if (kind === "downgrade" || result.action === "downgrade_scheduled") {
        toast.success(t("automations.billing.changeScheduled"));
      } else {
        toast.success(
          t("automations.billing.changedTo", {
            plan: getAutomationPlanDisplayName(plan.key, t),
          })
        );
      }
      setConfirm(null);
      await onUsageUpdated();
      onClose();
    } catch {
      toast.error(t("automations.billing.changeError"));
      setBusyKey(null);
    }
  };

  const handleSelect = (plan: AutomationPlanDefinition) => {
    if (!hasPlan) {
      void startCheckout(plan);
      return;
    }
    if (plan.key === currentKey) return;
    if (isUpgradePlan(currentKey, plan.key)) {
      setConfirm({ kind: "upgrade", plan });
      return;
    }
    if (isDowngradePlan(currentKey, plan.key)) {
      setConfirm({ kind: "downgrade", plan });
    }
  };

  const handleReactivate = async () => {
    setReactivating(true);
    trackAutomationBillingEvent("automation_plan_reactivate_requested", {
      businessId,
      planKey: currentKey,
    });
    try {
      await reactivateAutomationPlan(businessId);
      toast.success(t("automations.billing.reactivated"));
      await onUsageUpdated();
    } catch {
      toast.error(t("automations.billing.reactivateError"));
    } finally {
      setReactivating(false);
    }
  };

  const planCtaLabel = (plan: AutomationPlanDefinition) => {
    if (!hasPlan) return t("automations.billing.choosePlan");
    if (plan.key === currentKey) return t("automations.billing.currentPlan");
    if (isUpgradePlan(currentKey, plan.key)) return t("automations.billing.upgrade");
    if (isDowngradePlan(currentKey, plan.key)) return t("automations.billing.switchToThis");
    return t("automations.billing.select");
  };

  return (
    <div
      className="ax-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget && !busyKey && !reactivating) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="ax-billing-modal ax-billing-plans"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="ax-billing-modal__close"
          aria-label={t("automations.billing.close")}
          disabled={Boolean(busyKey) || reactivating}
          onClick={onClose}
        >
          <X size={16} />
        </button>

        <header className="ax-billing-plans__header">
          <h2 id={titleId}>{heading}</h2>
          {!confirm ? (
            <p>
              {hasPlan
                ? t("automations.billing.manageHint")
                : t("automations.billing.pickHint")}
            </p>
          ) : null}
        </header>

        {confirm ? (
          <div className="ax-billing-confirm">
            {confirm.kind === "upgrade" ? (
              <>
                <p>
                  {t("automations.billing.quotaWillGrow", {
                    count: formatHeNumber(confirm.plan.executionLimit),
                  })}
                </p>
                <p>{t("automations.billing.usageKept")}</p>
              </>
            ) : (
              <>
                <p>{t("automations.billing.downgradeAtRenewal")}</p>
                <p>{t("automations.billing.keepQuotaUntilThen")}</p>
                <p>
                  {t("automations.billing.newPlanLine", {
                    plan: getAutomationPlanDisplayName(confirm.plan.key, t),
                    count: formatHeNumber(confirm.plan.executionLimit),
                  })}
                </p>
              </>
            )}
            <div className="ax-billing-modal__actions">
              <button
                type="button"
                className="ax-btn ax-btn--secondary"
                disabled={Boolean(busyKey)}
                onClick={() => setConfirm(null)}
              >
                {t("automations.billing.back")}
              </button>
              <button
                type="button"
                className="ax-btn ax-btn--primary"
                disabled={Boolean(busyKey)}
                onClick={() => void applyChange(confirm.plan, confirm.kind)}
              >
                {busyKey === confirm.plan.key ? (
                  <Loader2 size={16} className="ax-billing-spin" />
                ) : null}
                {confirm.kind === "upgrade"
                  ? t("automations.billing.confirmUpgrade")
                  : t("automations.billing.confirmSwitch")}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="ax-billing-plans__grid">
              {AUTOMATION_PLAN_DEFINITIONS.map((plan) => {
                const isCurrent = plan.key === currentKey;
                const isPopular = Boolean(plan.popular);
                const busy = busyKey === plan.key;
                return (
                  <article
                    key={plan.key}
                    className={[
                      "ax-billing-plan",
                      isPopular ? "ax-billing-plan--popular" : "",
                      isCurrent ? "ax-billing-plan--current" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {isPopular ? (
                      <span className="ax-billing-plan__badge">{t("automations.billing.mostPopular")}</span>
                    ) : null}
                    {isCurrent ? (
                      <span className="ax-billing-plan__current">
                        <Check size={14} aria-hidden />
                        {t("automations.billing.currentPlan")}
                      </span>
                    ) : null}
                    <h3>{getAutomationPlanDisplayName(plan.key, t)}</h3>
                    <p className="ax-billing-plan__price">
                      <strong>{formatHeNumber(plan.priceIls)}</strong>
                      <span> {t("automations.billing.perMonth")}</span>
                    </p>
                    <p className="ax-billing-plan__limit">
                      {t("automations.billing.actionsPerMonth", {
                        count: formatHeNumber(plan.executionLimit),
                      })}
                    </p>
                    <button
                      type="button"
                      className={`ax-btn ${
                        isCurrent
                          ? "ax-btn--secondary"
                          : isPopular
                            ? "ax-btn--primary"
                            : "ax-btn--secondary"
                      }`}
                      disabled={isCurrent || Boolean(busyKey)}
                      onClick={() => handleSelect(plan)}
                    >
                      {busy ? <Loader2 size={16} className="ax-billing-spin" /> : null}
                      {planCtaLabel(plan)}
                    </button>
                  </article>
                );
              })}
            </div>

            <p className="ax-billing-plans__note">
              {t("automations.billing.extraCharges")}
            </p>

            {pendingKey ? (
              <p className="ax-billing-card__note" role="status">
                {t("automations.billing.nextRenewal", {
                  plan: getAutomationPlanDisplayName(pendingKey, t),
                })}
              </p>
            ) : null}

            {hasPlan ? (
              <section className="ax-billing-manage" aria-label={t("automations.billing.manageAria")}>
                <div className="ax-billing-manage__tabs">
                  <button
                    type="button"
                    className={
                      mode === "pick"
                        ? "ax-billing-manage__tab ax-billing-manage__tab--active"
                        : "ax-billing-manage__tab"
                    }
                    onClick={() => setMode("pick")}
                  >
                    {t("automations.billing.plansTab")}
                  </button>
                  <button
                    type="button"
                    className={
                      mode === "manage"
                        ? "ax-billing-manage__tab ax-billing-manage__tab--active"
                        : "ax-billing-manage__tab"
                    }
                    onClick={() => setMode("manage")}
                  >
                    {t("automations.billing.manageTab")}
                  </button>
                </div>

                {mode === "manage" ? (
                  <div className="ax-billing-manage__panel">
                    {cancelAtPeriodEnd ? (
                      <>
                        <p>
                          {t("automations.billing.cancelScheduled", {
                            when: periodEndLabel
                              ? t("automations.billing.cancelOn", { date: periodEndLabel })
                              : "",
                          })}
                        </p>
                        <button
                          type="button"
                          className="ax-btn ax-btn--primary"
                          disabled={reactivating}
                          onClick={() => void handleReactivate()}
                        >
                          {reactivating ? (
                            <Loader2 size={16} className="ax-billing-spin" />
                          ) : null}
                          {t("automations.billing.keepActive")}
                        </button>
                      </>
                    ) : (
                      <>
                        <p>{t("automations.billing.cancelTakesEffect")}</p>
                        <button
                          type="button"
                          className="ax-btn ax-btn--secondary"
                          onClick={onOpenCancel}
                        >
                          {t("automations.billing.cancelPlan")}
                        </button>
                      </>
                    )}
                  </div>
                ) : null}
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}