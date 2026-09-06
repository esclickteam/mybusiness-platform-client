import React, { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  cancelAutomationPlan,
  type AutomationBillingUsageOverview,
} from "../../../../../api/automationBillingApi";
import { trackAutomationBillingEvent } from "./automationBillingAnalytics";
import { formatHeDate } from "./automationBillingFormat";

type Props = {
  open: boolean;
  businessId: string;
  usage: AutomationBillingUsageOverview | null;
  onClose: () => void;
  onCancelled: () => void;
};

export default function AutomationCancelConfirmModal({
  open,
  businessId,
  usage,
  onClose,
  onCancelled,
}: Props) {
  const { t } = useTranslation();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setSubmitting(false);
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
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
  }, [open, onClose, submitting]);

  if (!open) return null;

  const periodEnd =
    formatHeDate(usage?.subscription?.currentPeriodEnd) ||
    formatHeDate(usage?.usage?.periodEnd);

  const handleCancel = async () => {
    setSubmitting(true);
    trackAutomationBillingEvent("automation_plan_cancel_requested", {
      businessId,
      planKey: usage?.plan?.key || null,
    });
    try {
      const result = await cancelAutomationPlan(businessId);
      const endLabel = formatHeDate(result.currentPeriodEnd) || periodEnd;
      toast.success(
        endLabel
          ? t("automations.billing.cancel.toastWithDate", {
              date: endLabel,
              defaultValue: "החבילה תבוטל בסוף תקופת החיוב ({{date}})",
            })
          : t(
              "automations.billing.cancel.toast",
              "החבילה תבוטל בסוף תקופת החיוב"
            )
      );
      onCancelled();
      onClose();
    } catch {
      toast.error(
        t(
          "automations.billing.cancel.error",
          "לא הצלחנו לבטל את החבילה כרגע. נסו שוב."
        )
      );
      setSubmitting(false);
    }
  };

  return (
    <div
      className="ax-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="ax-billing-modal ax-billing-cancel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="ax-billing-modal__close"
          aria-label={t("automations.billing.close")}
          disabled={submitting}
          onClick={onClose}
        >
          <X size={16} />
        </button>

        <h2 id={titleId}>{t("automations.billing.cancelPlan")}</h2>
        <p>
          {t(
            "automations.billing.cancel.stayActive",
            "החבילה תישאר פעילה עד סוף תקופת החיוב הנוכחית."
          )}
        </p>
        <p>
          {t(
            "automations.billing.cancel.afterCancel",
            "לאחר מכן אוטומציות לא יוכלו להתחיל פעולות חדשות עד לבחירת חבילה חדשה."
          )}
        </p>
        {periodEnd ? (
          <p className="ax-billing-cancel__date">
            {t("automations.billing.cancel.periodEnd", {
              date: periodEnd,
              defaultValue: "סוף התקופה: {{date}}",
            })}
          </p>
        ) : null}

        <div className="ax-billing-modal__actions">
          <button
            type="button"
            className="ax-btn ax-btn--secondary"
            disabled={submitting}
            onClick={onClose}
          >
            {t("automations.billing.back")}
          </button>
          <button
            type="button"
            className="ax-btn ax-btn--danger"
            disabled={submitting}
            onClick={() => void handleCancel()}
          >
            {submitting ? <Loader2 size={16} className="ax-billing-spin" /> : null}
            {t("automations.billing.cancel.confirm", "ביטול החבילה")}
          </button>
        </div>
      </div>
    </div>
  );
}