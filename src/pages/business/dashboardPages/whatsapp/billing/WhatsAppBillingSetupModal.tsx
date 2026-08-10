import React, { useEffect, useId, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  cancelWhatsAppBilling,
  createWhatsAppBillingCheckout,
  reactivateWhatsAppBilling,
  type WhatsAppBillingUsageOverview,
} from "../../../../../api/whatsappBillingApi";
import {
  formatHeDate,
  formatHeIls,
  resolveWhatsAppUnitPriceIls,
} from "./whatsappBillingFormat";
import "./whatsappBilling.css";

type ModalMode = "setup" | "manage";

type Props = {
  open: boolean;
  businessId: string;
  usage: WhatsAppBillingUsageOverview | null;
  initialMode?: ModalMode;
  /** Where Stripe should return after checkout. Defaults to WhatsApp settings. */
  returnTo?: "automations" | "whatsapp";
  onClose: () => void;
  onUsageUpdated: () => void | Promise<void>;
};

const ACTIVE_LIKE = new Set(["active", "trialing", "past_due"]);

export default function WhatsAppBillingSetupModal({
  open,
  businessId,
  usage,
  initialMode = "setup",
  returnTo = "whatsapp",
  onClose,
  onUsageUpdated,
}: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<ModalMode>(initialMode);
  const [busy, setBusy] = useState(false);

  const unitPrice = resolveWhatsAppUnitPriceIls(usage?.unitPriceIls);
  const status = String(usage?.subscription?.status || "").toLowerCase();
  const hasActiveLike = ACTIVE_LIKE.has(status);
  const cancelAtPeriodEnd = Boolean(usage?.subscription?.cancelAtPeriodEnd);
  const periodEndLabel =
    formatHeDate(usage?.subscription?.currentPeriodEnd) ||
    formatHeDate(usage?.usage?.periodEnd);

  useEffect(() => {
    if (!open) {
      setBusy(false);
      return;
    }
    setMode(initialMode);
  }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
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
  }, [open, onClose, busy, mode]);

  if (!open) return null;

  const startCheckout = async () => {
    setBusy(true);
    try {
      const result = await createWhatsAppBillingCheckout(businessId, {
        returnTo,
      });
      if (!result?.url) {
        toast.error("לא הצלחנו להתחיל את הגדרת החיוב. נסו שוב.");
        setBusy(false);
        return;
      }
      window.location.assign(result.url);
    } catch {
      toast.error("לא הצלחנו להתחיל את הגדרת החיוב. נסו שוב.");
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    setBusy(true);
    try {
      await cancelWhatsAppBilling(businessId);
      toast.success("החיוב יבוטל בסוף תקופת החיוב הנוכחית.");
      await onUsageUpdated();
      onClose();
    } catch {
      toast.error("לא הצלחנו לבטל את החיוב. נסו שוב.");
    } finally {
      setBusy(false);
    }
  };

  const handleReactivate = async () => {
    setBusy(true);
    try {
      await reactivateWhatsAppBilling(businessId);
      toast.success("הביטול בוטל והחיוב יישאר פעיל.");
      await onUsageUpdated();
      onClose();
    } catch {
      toast.error("לא הצלחנו להשאיר את החיוב פעיל.");
    } finally {
      setBusy(false);
    }
  };

  const heading =
    mode === "manage" && hasActiveLike
      ? "ניהול חיוב WhatsApp"
      : "הגדרת חיוב WhatsApp";

  return (
    <div
      className="wa-billing-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="wa-billing-modal"
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
          disabled={busy}
        >
          <X size={16} />
        </button>

        <h2 id={titleId}>{heading}</h2>

        {mode === "setup" || !hasActiveLike ? (
          <>
            <p>נדרש אמצעי תשלום עבור הודעות WhatsApp</p>
            <p>
              האוטומציות והשליחה מחויבות לפי שימוש בפועל — אין חבילות הודעות
              מראש.
            </p>
            <div className="wa-billing-modal__price">
              <strong>חיוב לפי שימוש</strong>
              <span>{formatHeIls(unitPrice)} להודעה</span>
            </div>
            <div className="wa-billing-modal__actions">
              <button
                type="button"
                className="wa-billing-btn wa-billing-btn--secondary"
                onClick={onClose}
                disabled={busy}
              >
                ביטול
              </button>
              <button
                type="button"
                className="wa-billing-btn wa-billing-btn--primary"
                onClick={() => void startCheckout()}
                disabled={busy}
              >
                {busy ? <Loader2 size={14} className="wa-billing-spin" /> : null}
                התחלת הגדרת תשלום
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              חיוב לפי שימוש · {formatHeIls(unitPrice)} להודעה
              {periodEndLabel ? ` · תקופה עד ${periodEndLabel}` : ""}
            </p>
            {cancelAtPeriodEnd ? (
              <>
                <p>
                  החיוב מתוכנן לביטול
                  {periodEndLabel ? ` ב־${periodEndLabel}` : ""}. אפשר להשאיר
                  אותו פעיל.
                </p>
                <div className="wa-billing-modal__actions">
                  <button
                    type="button"
                    className="wa-billing-btn wa-billing-btn--secondary"
                    onClick={onClose}
                    disabled={busy}
                  >
                    סגור
                  </button>
                  <button
                    type="button"
                    className="wa-billing-btn wa-billing-btn--primary"
                    onClick={() => void handleReactivate()}
                    disabled={busy}
                  >
                    {busy ? (
                      <Loader2 size={14} className="wa-billing-spin" />
                    ) : null}
                    השארת החיוב פעיל
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>
                  אפשר לבטל את החיוב לסוף התקופה הנוכחית. עד אז ניתן להמשיך
                  לשלוח הודעות לפי השימוש.
                </p>
                <div className="wa-billing-modal__actions">
                  <button
                    type="button"
                    className="wa-billing-btn wa-billing-btn--secondary"
                    onClick={onClose}
                    disabled={busy}
                  >
                    סגור
                  </button>
                  <button
                    type="button"
                    className="wa-billing-btn wa-billing-btn--danger"
                    onClick={() => void handleCancel()}
                    disabled={busy}
                  >
                    {busy ? (
                      <Loader2 size={14} className="wa-billing-spin" />
                    ) : null}
                    ביטול בסוף התקופה
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
