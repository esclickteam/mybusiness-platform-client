import React, { useEffect, useId, useMemo, useRef, useState } from "react";
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
    if (confirm?.kind === "upgrade") return `שדרוג ל-${confirm.plan.name}`;
    if (confirm?.kind === "downgrade") return "מעבר לחבילה נמוכה יותר";
    if (mode === "manage" && hasPlan) return "ניהול חבילת האוטומציות";
    return "בחירת חבילת אוטומציות";
  }, [confirm, mode, hasPlan]);

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
        toast.error("לא הצלחנו להתחיל את התשלום. נסו שוב.");
        setBusyKey(null);
        return;
      }
      window.location.assign(result.url);
    } catch {
      toast.error("לא הצלחנו להתחיל את התשלום. נסו שוב.");
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
        toast.success("השינוי נקבע לחידוש הבא");
      } else {
        toast.success(`עברתם לחבילת ${plan.name}`);
      }
      setConfirm(null);
      await onUsageUpdated();
      onClose();
    } catch {
      toast.error("לא הצלחנו לעדכן את החבילה כרגע. נסו שוב.");
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
      toast.success("הביטול בוטל והחבילה תמשיך כרגיל.");
      await onUsageUpdated();
    } catch {
      toast.error("לא הצלחנו להשאיר את החבילה פעילה. נסו שוב.");
    } finally {
      setReactivating(false);
    }
  };

  const planCtaLabel = (plan: AutomationPlanDefinition) => {
    if (!hasPlan) return "בחירת חבילה";
    if (plan.key === currentKey) return "החבילה הנוכחית";
    if (isUpgradePlan(currentKey, plan.key)) return "שדרוג";
    if (isDowngradePlan(currentKey, plan.key)) return "מעבר לחבילה זו";
    return "בחירה";
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
          aria-label="סגור"
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
                ? "ניתן לשדרג מיידית או לתזמן מעבר לחבילה נמוכה יותר בחידוש הבא."
                : "בחרו מכסת הרצות חודשית להפעלת האוטומציות בעסק."}
            </p>
          ) : null}
        </header>

        {confirm ? (
          <div className="ax-billing-confirm">
            {confirm.kind === "upgrade" ? (
              <>
                <p>
                  המכסה תגדל ל-{formatHeNumber(confirm.plan.executionLimit)} הרצות
                  בחודש.
                </p>
                <p>השימוש שכבר בוצע החודש נשמר.</p>
              </>
            ) : (
              <>
                <p>המעבר לחבילה הנמוכה יותר ייכנס לתוקף בחידוש הבא.</p>
                <p>עד אז תמשיכו ליהנות מהמכסה הנוכחית.</p>
                <p>
                  החבילה החדשה: {confirm.plan.name} ·{" "}
                  {formatHeNumber(confirm.plan.executionLimit)} הרצות בחודש
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
                חזרה
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
                {confirm.kind === "upgrade" ? "אישור שדרוג" : "אישור מעבר"}
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
                      <span className="ax-billing-plan__badge">הכי פופולרי</span>
                    ) : null}
                    {isCurrent ? (
                      <span className="ax-billing-plan__current">
                        <Check size={14} aria-hidden />
                        החבילה הנוכחית
                      </span>
                    ) : null}
                    <h3>{plan.name}</h3>
                    <p className="ax-billing-plan__price">
                      <strong>{formatHeNumber(plan.priceIls)}</strong>
                      <span> ₪ / חודש</span>
                    </p>
                    <p className="ax-billing-plan__limit">
                      {formatHeNumber(plan.executionLimit)} הרצות בחודש
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
              הודעות WhatsApp, SMS ושימושי AI עשויים להיות מחויבים בנפרד בהתאם
              לשירות.
            </p>

            {pendingKey ? (
              <p className="ax-billing-card__note" role="status">
                בחידוש הבא: {getAutomationPlanDisplayName(pendingKey)}
              </p>
            ) : null}

            {hasPlan ? (
              <section className="ax-billing-manage" aria-label="ניהול חבילה">
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
                    חבילות
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
                    ניהול
                  </button>
                </div>

                {mode === "manage" ? (
                  <div className="ax-billing-manage__panel">
                    {cancelAtPeriodEnd ? (
                      <>
                        <p>
                          החבילה מתוכננת לביטול
                          {periodEndLabel ? ` ב־${periodEndLabel}` : ""}
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
                          השארת החבילה פעילה
                        </button>
                      </>
                    ) : (
                      <>
                        <p>ביטול חבילת האוטומציות ייכנס לתוקף בסוף תקופת החיוב.</p>
                        <button
                          type="button"
                          className="ax-btn ax-btn--secondary"
                          onClick={onOpenCancel}
                        >
                          ביטול חבילת האוטומציות
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