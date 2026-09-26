import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, PiggyBank, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  cancelWhatsAppAutoFunding,
  createWhatsAppWalletTopup,
  formatIlsFromMinor,
  startWhatsAppAutoFunding,
  updateWhatsAppLowBalanceThreshold,
  type WhatsAppFundsOverview,
} from "../../../../../api/whatsappWalletApi";
import { getTextDirection } from "../../../../../i18n/localeUtils";
import {
  minorToIlsInput,
  validateAmountInput,
  type AmountValidationCode,
} from "./whatsappFundsAmount";
import "./whatsappBilling.css";

type Props = {
  open: boolean;
  businessId: string;
  funds: WhatsAppFundsOverview | null;
  phoneNumber?: string | null;
  onClose: () => void;
  onUpdated: () => void | Promise<void>;
  initialPanel?: "manage" | "topup";
};

const TEAL = "#0d9488";

function AmountField({
  id,
  label,
  value,
  onChange,
  disabled,
  currencySymbol = "₪",
  error,
  presets,
  onPreset,
  selectedPresetMinor,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  currencySymbol?: string;
  error?: string | null;
  presets?: number[];
  onPreset?: (minor: number) => void;
  selectedPresetMinor?: number | null;
}) {
  return (
    <div className="wa-funds-amount">
      <label className="wa-funds-amount__label" htmlFor={id}>
        {label}
      </label>
      <div
        className={`wa-funds-amount__control${
          error ? " wa-funds-amount__control--error" : ""
        }`}
      >
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
        />
        <span className="wa-funds-amount__currency" aria-hidden>
          {currencySymbol}
        </span>
      </div>
      {presets && presets.length > 0 && onPreset ? (
        <div className="wa-funds-presets" role="group" aria-label={label}>
          {presets.map((m) => (
            <button
              key={m}
              type="button"
              className={`wa-funds-preset${
                selectedPresetMinor === m ? " wa-funds-preset--active" : ""
              }`}
              disabled={disabled}
              onClick={() => onPreset(m)}
            >
              {formatIlsFromMinor(m)}
            </button>
          ))}
        </div>
      ) : null}
      {error ? <p className="wa-funds-field-error">{error}</p> : null}
    </div>
  );
}

export default function WhatsAppManageFundsModal({
  open,
  businessId,
  funds,
  phoneNumber,
  onClose,
  onUpdated,
  initialPanel = "manage",
}: Props) {
  const { t, i18n } = useTranslation();
  const dir = getTextDirection(i18n.language);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [panel, setPanel] = useState<"manage" | "topup">(initialPanel);
  const [busy, setBusy] = useState(false);

  const f = funds?.funds;
  const balanceMinor = f?.balanceMinor ?? 0;
  const availableMinor = f?.availableMinor ?? 0;
  const subscriptionActive = Boolean(
    f?.autoFundingEnabled &&
      ["active", "past_due", "checkout_pending"].includes(
        String(f?.autoFundingStatus || "")
      )
  );

  const [autoEnabled, setAutoEnabled] = useState(false);
  const [thresholdInput, setThresholdInput] = useState("50");
  const [rechargeInput, setRechargeInput] = useState("200");
  const [topupInput, setTopupInput] = useState("100");
  const [formError, setFormError] = useState<string | null>(null);
  const [thresholdError, setThresholdError] = useState<string | null>(null);
  const [rechargeError, setRechargeError] = useState<string | null>(null);
  const [topupError, setTopupError] = useState<string | null>(null);

  const quickAmounts = funds?.quickTopupAmountsMinor || [
    5000, 10000, 20000, 50000,
  ];
  const autoPresets = funds?.autoFundingPresetsMinor || [10000, 20000, 50000];
  const lowPresets = funds?.lowBalancePresetsMinor || [1000, 2000, 5000, 10000];
  const minTopup = funds?.minTopupMinor || 5000;
  const minAuto = funds?.minAutoFundingMinor || minTopup;

  useEffect(() => {
    if (!open) return;
    setPanel(initialPanel);
    setBusy(false);
    setFormError(null);
    setThresholdError(null);
    setRechargeError(null);
    setTopupError(null);
    if (f) {
      setAutoEnabled(Boolean(f.autoFundingEnabled));
      setThresholdInput(
        minorToIlsInput(f.lowBalanceThresholdMinor || 5000) || "50"
      );
      setRechargeInput(
        minorToIlsInput(f.autoFundingAmountMinor || 20000) || "200"
      );
    }
    setTopupInput(minorToIlsInput(10000) || "100");
  }, [open, initialPanel, f]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  const effectiveTopup = useMemo(
    () => validateAmountInput(topupInput, { minMinor: 1 }),
    [topupInput]
  );
  const balanceAfter =
    balanceMinor +
    (effectiveTopup.ok ? Math.max(0, effectiveTopup.minor) : 0);

  const thresholdMinorParsed = useMemo(
    () => validateAmountInput(thresholdInput, { minMinor: 1 }),
    [thresholdInput]
  );
  const rechargeMinorParsed = useMemo(
    () => validateAmountInput(rechargeInput, { minMinor: minAuto }),
    [rechargeInput, minAuto]
  );

  const amountErrorMessage = (code: AmountValidationCode, minMinor: number) => {
    switch (code) {
      case "required":
        return t("whatsapp.funds.validation.required");
      case "not_numeric":
        return t("whatsapp.funds.validation.notNumeric");
      case "not_positive":
        return t("whatsapp.funds.validation.notPositive");
      case "below_minimum":
        return t("whatsapp.funds.validation.belowMinimum", {
          amount: formatIlsFromMinor(minMinor),
        });
      default:
        return t("whatsapp.funds.validation.invalid");
    }
  };

  if (!open) return null;

  const startTopup = async () => {
    setTopupError(null);
    setFormError(null);
    const parsed = validateAmountInput(topupInput, { minMinor: minTopup });
    if (!parsed.ok) {
      setTopupError(amountErrorMessage(parsed.code, minTopup));
      return;
    }
    setBusy(true);
    try {
      const result = await createWhatsAppWalletTopup(businessId, parsed.minor);
      const url = result.checkoutUrl || result.url;
      if (!url) throw new Error("Missing checkout URL");
      window.location.href = url;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || t("whatsapp.funds.errors.topupFailed");
      setFormError(msg);
      toast.error(msg);
      setBusy(false);
    }
  };

  const saveThresholdOnly = async () => {
    setThresholdError(null);
    setFormError(null);
    const parsed = validateAmountInput(thresholdInput, { minMinor: 1 });
    if (!parsed.ok) {
      setThresholdError(amountErrorMessage(parsed.code, 1));
      return;
    }
    setBusy(true);
    try {
      await updateWhatsAppLowBalanceThreshold(businessId, parsed.minor);
      toast.success(t("whatsapp.funds.toasts.thresholdSaved"));
      await onUpdated();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || t("whatsapp.funds.errors.saveFailed");
      setFormError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const enableAutoRecharge = async () => {
    setThresholdError(null);
    setRechargeError(null);
    setFormError(null);

    const threshold = validateAmountInput(thresholdInput, { minMinor: 1 });
    const recharge = validateAmountInput(rechargeInput, { minMinor: minAuto });
    let valid = true;
    if (!threshold.ok) {
      setThresholdError(amountErrorMessage(threshold.code, 1));
      valid = false;
    }
    if (!recharge.ok) {
      setRechargeError(amountErrorMessage(recharge.code, minAuto));
      valid = false;
    }
    if (!valid) {
      setFormError(t("whatsapp.funds.validation.autoRequiresBoth"));
      return;
    }

    setBusy(true);
    try {
      await updateWhatsAppLowBalanceThreshold(businessId, threshold.minor);
      const result = await startWhatsAppAutoFunding(
        businessId,
        recharge.minor
      );
      const url = result.checkoutUrl || result.url;
      if (!url) throw new Error("Missing checkout URL");
      window.location.href = url;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || t("whatsapp.funds.errors.autoStartFailed");
      setFormError(msg);
      toast.error(msg);
      setBusy(false);
    }
  };

  const disableAutoRecharge = async () => {
    setBusy(true);
    setFormError(null);
    try {
      await cancelWhatsAppAutoFunding(businessId);
      toast.success(t("whatsapp.funds.toasts.autoCancelScheduled"));
      setAutoEnabled(false);
      await onUpdated();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || t("whatsapp.funds.errors.autoCancelFailed");
      setFormError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const onToggleAuto = () => {
    if (busy) return;
    if (autoEnabled && subscriptionActive) {
      void disableAutoRecharge();
      return;
    }
    if (autoEnabled) {
      setAutoEnabled(false);
      setFormError(null);
      setThresholdError(null);
      setRechargeError(null);
      return;
    }
    setAutoEnabled(true);
  };

  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;
  const AddIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <div className="wa-billing-modal-root" role="presentation" dir={dir}>
      {/* Backdrop must paint under the dialog (see .wa-billing-modal-root CSS). */}
      <button
        type="button"
        className="wa-billing-modal-backdrop"
        aria-label={t("whatsapp.funds.close")}
        tabIndex={-1}
        disabled={busy}
        onClick={() => !busy && onClose()}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="wa-billing-modal wa-funds-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="wa-funds-modal__header">
          <div className="wa-funds-modal__heading">
            <h2 id={titleId} className="wa-funds-modal__title">
              <PiggyBank size={18} aria-hidden />
              {t("whatsapp.funds.manageTitle")}
            </h2>
            {phoneNumber ? (
              <p className="wa-funds-modal__phone">{phoneNumber}</p>
            ) : (
              <p className="wa-funds-modal__phone wa-funds-modal__phone--muted">
                {t("whatsapp.funds.prepaidBalance")}
              </p>
            )}
          </div>
          <button
            type="button"
            className="wa-billing-modal__close"
            onClick={onClose}
            disabled={busy}
            aria-label={t("whatsapp.funds.close")}
          >
            <X size={18} />
          </button>
        </header>

        <div className="wa-funds-modal__progress" aria-hidden>
          <span
            className={
              panel === "manage"
                ? "wa-funds-modal__progress-fill"
                : "wa-funds-modal__progress-fill wa-funds-modal__progress-fill--full"
            }
          />
        </div>

        {panel === "manage" ? (
          <div className="wa-billing-modal__body wa-funds-modal__body">
            <section className="wa-funds-section">
              <p className="wa-funds-section__eyebrow">
                {t("whatsapp.funds.currentBalance")}
              </p>
              <p className="wa-funds-section__balance">
                {formatIlsFromMinor(availableMinor)}
              </p>
              {f?.reservedMinor ? (
                <p className="wa-funds-section__hint">
                  {t("whatsapp.funds.reserved", {
                    amount: formatIlsFromMinor(f.reservedMinor),
                  })}
                </p>
              ) : null}
            </section>

            <section className="wa-funds-card">
              <div className="wa-funds-card__head">
                <div>
                  <p className="wa-funds-card__title">
                    {t("whatsapp.funds.autoRecharge")}
                  </p>
                  <p className="wa-funds-card__desc">
                    {t("whatsapp.funds.autoRechargeDesc")}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoEnabled || subscriptionActive}
                  aria-label={t("whatsapp.funds.autoRecharge")}
                  disabled={busy}
                  onClick={onToggleAuto}
                  className={`wa-funds-switch${
                    autoEnabled || subscriptionActive
                      ? " wa-funds-switch--on"
                      : ""
                  }`}
                >
                  <span className="wa-funds-switch__knob" />
                </button>
              </div>

              <div className="wa-funds-card__fields">
                <AmountField
                  id="wa-funds-threshold"
                  label={t("whatsapp.funds.balanceThreshold")}
                  value={thresholdInput}
                  onChange={(v) => {
                    setThresholdInput(v);
                    setThresholdError(null);
                  }}
                  disabled={busy}
                  error={thresholdError}
                  presets={lowPresets}
                  selectedPresetMinor={
                    thresholdMinorParsed.ok ? thresholdMinorParsed.minor : null
                  }
                  onPreset={(m) => {
                    setThresholdInput(minorToIlsInput(m));
                    setThresholdError(null);
                  }}
                />
                <AmountField
                  id="wa-funds-recharge"
                  label={t("whatsapp.funds.rechargeAmount")}
                  value={rechargeInput}
                  onChange={(v) => {
                    setRechargeInput(v);
                    setRechargeError(null);
                  }}
                  disabled={busy || subscriptionActive}
                  error={rechargeError}
                  presets={autoPresets}
                  selectedPresetMinor={
                    rechargeMinorParsed.ok ? rechargeMinorParsed.minor : null
                  }
                  onPreset={(m) => {
                    if (subscriptionActive) return;
                    setRechargeInput(minorToIlsInput(m));
                    setRechargeError(null);
                  }}
                />
              </div>

              {subscriptionActive ? (
                <button
                  type="button"
                  className="wa-billing-btn wa-billing-btn--ghost"
                  disabled={busy}
                  onClick={() => void saveThresholdOnly()}
                >
                  {t("whatsapp.funds.saveThreshold")}
                </button>
              ) : autoEnabled ? (
                <button
                  type="button"
                  className="wa-billing-btn wa-billing-btn--primary"
                  style={{ background: TEAL, borderColor: TEAL }}
                  disabled={busy}
                  onClick={() => void enableAutoRecharge()}
                >
                  {busy ? <Loader2 className="animate-spin" size={16} /> : null}
                  {t("whatsapp.funds.enableAutoRecharge")}
                </button>
              ) : null}

              {f?.nextAutoFundingAt ? (
                <p className="wa-funds-section__hint">
                  {t("whatsapp.funds.nextAutoTopup", {
                    date: new Date(f.nextAutoFundingAt).toLocaleDateString(
                      i18n.language
                    ),
                  })}
                </p>
              ) : null}

              {f?.autoFundingStatus === "past_due" ||
              f?.autoFundingStatus === "failed" ? (
                <p className="wa-funds-field-error">
                  {t("whatsapp.funds.autoFailed")}
                </p>
              ) : null}
            </section>

            {formError ? (
              <p className="wa-funds-field-error" role="alert">
                {formError}
              </p>
            ) : null}

            <button
              type="button"
              className="wa-billing-btn wa-billing-btn--primary wa-funds-cta"
              style={{ background: TEAL, borderColor: TEAL }}
              disabled={busy}
              onClick={() => {
                setFormError(null);
                setPanel("topup");
              }}
            >
              <AddIcon size={16} aria-hidden />
              {t("whatsapp.funds.addFunds")}
            </button>

            <div className="wa-funds-modal__footer">
              <button
                type="button"
                className="wa-billing-btn wa-billing-btn--ghost"
                disabled={busy}
                onClick={onClose}
              >
                <BackIcon size={14} aria-hidden />
                {t("whatsapp.funds.back")}
              </button>
            </div>
          </div>
        ) : (
          <div className="wa-billing-modal__body wa-funds-modal__body">
            <section className="wa-funds-section">
              <p className="wa-funds-section__eyebrow">
                {t("whatsapp.funds.currentBalance")}
              </p>
              <p className="wa-funds-section__balance wa-funds-section__balance--sm">
                {formatIlsFromMinor(availableMinor)}
              </p>
            </section>

            <AmountField
              id="wa-funds-topup"
              label={t("whatsapp.funds.amountToAdd")}
              value={topupInput}
              onChange={(v) => {
                setTopupInput(v);
                setTopupError(null);
              }}
              disabled={busy}
              error={topupError}
              presets={quickAmounts}
              selectedPresetMinor={
                effectiveTopup.ok ? effectiveTopup.minor : null
              }
              onPreset={(m) => {
                setTopupInput(minorToIlsInput(m));
                setTopupError(null);
              }}
            />

            <p className="wa-funds-section__hint">
              {t("whatsapp.funds.balanceAfter", {
                amount: formatIlsFromMinor(balanceAfter),
              })}
            </p>
            <p className="wa-funds-section__hint">
              {t("whatsapp.funds.minTopupHint", {
                amount: formatIlsFromMinor(minTopup),
              })}
            </p>

            {formError ? (
              <p className="wa-funds-field-error" role="alert">
                {formError}
              </p>
            ) : null}

            <button
              type="button"
              className="wa-billing-btn wa-billing-btn--primary wa-funds-cta"
              style={{ background: TEAL, borderColor: TEAL }}
              disabled={busy}
              onClick={() => void startTopup()}
            >
              {busy ? <Loader2 className="animate-spin" size={16} /> : null}
              {t("whatsapp.funds.continueCheckout")}
            </button>

            <div className="wa-funds-modal__footer">
              <button
                type="button"
                className="wa-billing-btn wa-billing-btn--ghost"
                disabled={busy}
                onClick={() => {
                  setFormError(null);
                  setTopupError(null);
                  setPanel("manage");
                }}
              >
                <BackIcon size={14} aria-hidden />
                {t("whatsapp.funds.back")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
