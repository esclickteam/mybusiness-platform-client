import React, { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, X } from "lucide-react";
import {
  getAutomationBillingUsage,
  type AutomationBillingUsageOverview,
} from "../../../../../api/automationBillingApi";
import { getAutomationPlanDisplayName } from "./automationPlanCatalog";

const POLL_MS = 1800;
const MAX_MS = 30_000;

const ACTIVE_STATUSES = new Set(["active", "trialing", "past_due"]);

type Props = {
  open: boolean;
  businessId: string;
  expectedPlanKey?: string | null;
  onDone: (usage: AutomationBillingUsageOverview) => void;
  onClose: () => void;
};

function isPlanReady(
  usage: AutomationBillingUsageOverview,
  expectedPlanKey?: string | null
) {
  if (!usage.billingEnabled || usage.exempt) return false;
  const plan = usage.plan;
  if (!plan?.key) return false;
  if (!ACTIVE_STATUSES.has(String(plan.status || "").toLowerCase())) return false;
  if (expectedPlanKey && String(plan.key) !== String(expectedPlanKey)) return false;
  return true;
}

export default function AutomationCheckoutProcessing({
  open,
  businessId,
  expectedPlanKey = null,
  onDone,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<"polling" | "success" | "timeout">("polling");
  const [usage, setUsage] = useState<AutomationBillingUsageOverview | null>(null);

  useEffect(() => {
    if (!open) {
      setPhase("polling");
      setUsage(null);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const startedAt = Date.now();

    const poll = async () => {
      if (cancelled) return;
      try {
        const next = await getAutomationBillingUsage(businessId);
        if (cancelled) return;
        setUsage(next);
        if (isPlanReady(next, expectedPlanKey)) {
          setPhase("success");
          onDone(next);
          return;
        }
      } catch {
        // Keep polling — never claim failure while waiting for sync.
      }

      if (Date.now() - startedAt >= MAX_MS) {
        if (!cancelled) setPhase("timeout");
        return;
      }
      timer = setTimeout(() => {
        void poll();
      }, POLL_MS);
    };

    void poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [open, businessId, expectedPlanKey, onDone]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
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
  }, [open, onClose, phase]);

  if (!open) return null;

  const planName =
    usage?.plan?.nameHe ||
    usage?.plan?.name ||
    getAutomationPlanDisplayName(expectedPlanKey || usage?.plan?.key);

  return (
    <div
      className="ax-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="ax-billing-modal ax-billing-processing"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="ax-billing-modal__close"
          aria-label={t("automations.billing.close")}
          onClick={onClose}
        >
          <X size={16} />
        </button>

        {phase === "polling" ? (
          <>
            <div className="ax-billing-processing__spinner" aria-hidden>
              <Loader2 size={28} className="ax-billing-spin" />
            </div>
            <h2 id={titleId}>
              {t("automations.billing.checkout.received", "התשלום התקבל")}
            </h2>
            <p>
              {t(
                "automations.billing.checkout.updating",
                "מעדכנים את חבילת האוטומציות..."
              )}
            </p>
          </>
        ) : null}

        {phase === "success" ? (
          <>
            <h2 id={titleId}>
              {t("automations.billing.checkout.activated", {
                plan: planName,
                defaultValue: "חבילת {{plan}} הופעלה בהצלחה",
              })}
            </h2>
            <p>
              {t(
                "automations.billing.checkout.continueHint",
                "אפשר לחזור ולהמשיך לעבוד עם האוטומציות."
              )}
            </p>
            <button type="button" className="ax-btn ax-btn--primary" onClick={onClose}>
              {t("automations.runs.backToAutomations")}
            </button>
          </>
        ) : null}

        {phase === "timeout" ? (
          <>
            <h2 id={titleId}>
              {t(
                "automations.billing.checkout.timeoutTitle",
                "התשלום התקבל והעדכון עדיין מתבצע."
              )}
            </h2>
            <p>
              {t(
                "automations.billing.checkout.timeoutHint",
                "רוב העדכונים מסתיימים תוך זמן קצר."
              )}
            </p>
            <button type="button" className="ax-btn ax-btn--primary" onClick={onClose}>
              {t("automations.runs.backToAutomations")}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}