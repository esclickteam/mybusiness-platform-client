import React, { useEffect, useId, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import {
  getWhatsAppBillingUsage,
  type WhatsAppBillingUsageOverview,
} from "../../../../../api/whatsappBillingApi";
import "./whatsappBilling.css";

const POLL_MS = 1800;
const MAX_MS = 30_000;

const ACTIVE_STATUSES = new Set(["active", "trialing", "past_due"]);

type Props = {
  open: boolean;
  businessId: string;
  onDone: (usage: WhatsAppBillingUsageOverview) => void;
  onClose: () => void;
};

function isBillingReady(usage: WhatsAppBillingUsageOverview) {
  if (!usage.billingEnabled) return false;
  const status = String(usage.subscription?.status || "").toLowerCase();
  if (!ACTIVE_STATUSES.has(status)) return false;
  return Boolean(usage.subscription?.hasPaymentMethod) || usage.canSend;
}

export default function WhatsAppCheckoutProcessing({
  open,
  businessId,
  onDone,
  onClose,
}: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<"polling" | "success" | "timeout">(
    "polling"
  );

  useEffect(() => {
    if (!open) {
      setPhase("polling");
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const startedAt = Date.now();

    const poll = async () => {
      if (cancelled) return;
      try {
        const next = await getWhatsAppBillingUsage(businessId);
        if (cancelled) return;
        if (isBillingReady(next)) {
          setPhase("success");
          onDone(next);
          return;
        }
      } catch {
        // Keep polling while Stripe sync catches up.
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
  }, [open, businessId, onDone]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="wa-billing-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="wa-billing-modal wa-billing-processing"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir="rtl"
      >
        <button
          type="button"
          className="wa-billing-modal__close"
          aria-label="סגור"
          onClick={onClose}
        >
          <X size={16} />
        </button>

        {phase === "polling" ? (
          <>
            <div className="wa-billing-processing__spinner" aria-hidden>
              <Loader2 size={28} className="wa-billing-spin" />
            </div>
            <h2 id={titleId}>התשלום התקבל</h2>
            <p>מעדכנים את חיוב WhatsApp...</p>
          </>
        ) : null}

        {phase === "success" ? (
          <>
            <h2 id={titleId}>חיוב WhatsApp הופעל בהצלחה</h2>
            <p>אפשר לחזור ולשלוח הודעות — החיוב לפי השימוש בפועל.</p>
            <button
              type="button"
              className="wa-billing-btn wa-billing-btn--primary"
              onClick={onClose}
            >
              המשך
            </button>
          </>
        ) : null}

        {phase === "timeout" ? (
          <>
            <h2 id={titleId}>התשלום התקבל והעדכון עדיין מתבצע.</h2>
            <p>רוב העדכונים מסתיימים תוך זמן קצר.</p>
            <button
              type="button"
              className="wa-billing-btn wa-billing-btn--primary"
              onClick={onClose}
            >
              המשך
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
