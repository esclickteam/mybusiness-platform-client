import React, { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { useLocaleDir } from "../../../../../hooks/useLocaleDir";
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
  const { t } = useTranslation();
  const dir = useLocaleDir();
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
        toast.error(t("whatsapp.billing.setupFailed"));
        setBusy(false);
        return;
      }
      window.location.assign(result.url);
    } catch {
      toast.error(t("whatsapp.billing.setupFailed"));
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    setBusy(true);
    try {
      await cancelWhatsAppBilling(businessId);
      toast.success(t("whatsapp.billing.cancelSuccess"));
      await onUsageUpdated();
      onClose();
    } catch {
      toast.error(t("whatsapp.billing.cancelFailed"));
    } finally {
      setBusy(false);
    }
  };

  const handleReactivate = async () => {
    setBusy(true);
    try {
      await reactivateWhatsAppBilling(businessId);
      toast.success(t("whatsapp.billing.reactivateSuccess"));
      await onUsageUpdated();
      onClose();
    } catch {
      toast.error(t("whatsapp.billing.reactivateFailed"));
    } finally {
      setBusy(false);
    }
  };

  const heading =
    mode === "manage" && hasActiveLike
      ? t("whatsapp.billing.manageTitle")
      : t("whatsapp.billing.setupTitle");

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
        dir={dir}
      >
        <button
          type="button"
          className="wa-billing-modal__close"
          aria-label={t("whatsapp.billing.close")}
          onClick={onClose}
          disabled={busy}
        >
          <X size={16} />
        </button>

        <h2 id={titleId}>{heading}</h2>

        {mode === "setup" || !hasActiveLike ? (
          <>
            <p>{t("whatsapp.billing.needPayment")}</p>
            <p>{t("whatsapp.billing.usageOnly")}</p>
            <div className="wa-billing-modal__price">
              <strong>{t("whatsapp.billing.payAsYouGo")}</strong>
              <span>
                {t("whatsapp.billing.perMessage", {
                  price: formatHeIls(unitPrice),
                })}
              </span>
            </div>
            <div className="wa-billing-modal__actions">
              <button
                type="button"
                className="wa-billing-btn wa-billing-btn--secondary"
                onClick={onClose}
                disabled={busy}
              >
                {t("whatsapp.billing.cancel")}
              </button>
              <button
                type="button"
                className="wa-billing-btn wa-billing-btn--primary"
                onClick={() => void startCheckout()}
                disabled={busy}
              >
                {busy ? <Loader2 size={14} className="wa-billing-spin" /> : null}
                {t("whatsapp.billing.startPayment")}
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              {t("whatsapp.billing.manageLine", {
                price: formatHeIls(unitPrice),
              })}
              {periodEndLabel
                ? t("whatsapp.billing.periodUntil", { date: periodEndLabel })
                : ""}
            </p>
            {cancelAtPeriodEnd ? (
              <>
                <p>
                  {t("whatsapp.billing.cancelNote")}
                  {periodEndLabel
                    ? t("whatsapp.billing.cancelNoteOn", { date: periodEndLabel })
                    : ""}
                </p>
                <div className="wa-billing-modal__actions">
                  <button
                    type="button"
                    className="wa-billing-btn wa-billing-btn--secondary"
                    onClick={onClose}
                    disabled={busy}
                  >
                    {t("whatsapp.billing.close")}
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
                    {t("whatsapp.billing.keepActive")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>{t("whatsapp.billing.cancelAtEndBody")}</p>
                <div className="wa-billing-modal__actions">
                  <button
                    type="button"
                    className="wa-billing-btn wa-billing-btn--secondary"
                    onClick={onClose}
                    disabled={busy}
                  >
                    {t("whatsapp.billing.close")}
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
                    {t("whatsapp.billing.cancelAtEnd")}
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
