import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Loader2, PiggyBank, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  cancelWhatsAppAutoFunding,
  createWhatsAppWalletTopup,
  formatIlsFromMinor,
  startWhatsAppAutoFunding,
  updateWhatsAppLowBalanceThreshold,
  type WhatsAppFundsOverview,
} from "../../../../../api/whatsappWalletApi";
import "./whatsappBilling.css";

type Props = {
  open: boolean;
  businessId: string;
  funds: WhatsAppFundsOverview | null;
  onClose: () => void;
  onUpdated: () => void | Promise<void>;
  initialPanel?: "manage" | "topup";
};

const TEAL = "#0d9488";

export default function WhatsAppManageFundsModal({
  open,
  businessId,
  funds,
  onClose,
  onUpdated,
  initialPanel = "manage",
}: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [panel, setPanel] = useState<"manage" | "topup">(initialPanel);
  const [busy, setBusy] = useState(false);

  const f = funds?.funds;
  const balanceMinor = f?.balanceMinor ?? 0;
  const availableMinor = f?.availableMinor ?? 0;

  const [autoEnabled, setAutoEnabled] = useState(false);
  const [autoAmount, setAutoAmount] = useState(20000);
  const [lowThreshold, setLowThreshold] = useState(5000);
  const [topupAmount, setTopupAmount] = useState(10000);
  const [customTopup, setCustomTopup] = useState("");

  const quickAmounts = funds?.quickTopupAmountsMinor || [5000, 10000, 20000, 50000];
  const autoPresets = funds?.autoFundingPresetsMinor || [10000, 20000, 50000];
  const lowPresets = funds?.lowBalancePresetsMinor || [2000, 5000, 10000];
  const minTopup = funds?.minTopupMinor || 5000;

  useEffect(() => {
    if (!open) return;
    setPanel(initialPanel);
    setBusy(false);
    if (f) {
      setAutoEnabled(Boolean(f.autoFundingEnabled));
      setAutoAmount(f.autoFundingAmountMinor || 20000);
      setLowThreshold(f.lowBalanceThresholdMinor || 5000);
    }
  }, [open, initialPanel, f]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  const effectiveTopup = useMemo(() => {
    if (customTopup.trim()) {
      const ils = Number(customTopup.replace(/[^\d.]/g, ""));
      if (!Number.isFinite(ils)) return 0;
      return Math.round(ils * 100);
    }
    return topupAmount;
  }, [customTopup, topupAmount]);

  const balanceAfter = balanceMinor + Math.max(0, effectiveTopup);

  if (!open) return null;

  const startTopup = async () => {
    if (effectiveTopup < minTopup) {
      toast.error(`Minimum top-up is ${formatIlsFromMinor(minTopup)}`);
      return;
    }
    setBusy(true);
    try {
      const result = await createWhatsAppWalletTopup(businessId, effectiveTopup);
      const url = result.checkoutUrl || result.url;
      if (!url) throw new Error("Missing checkout URL");
      window.location.href = url;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Could not start top-up";
      toast.error(msg);
      setBusy(false);
    }
  };

  const saveLowBalance = async () => {
    setBusy(true);
    try {
      await updateWhatsAppLowBalanceThreshold(businessId, lowThreshold);
      toast.success("Low balance alert updated");
      await onUpdated();
    } catch {
      toast.error("Could not update low balance alert");
    } finally {
      setBusy(false);
    }
  };

  const toggleAutoFunding = async () => {
    if (autoEnabled && f?.autoFundingEnabled) {
      setBusy(true);
      try {
        await cancelWhatsAppAutoFunding(businessId);
        toast.success("Monthly Auto Funding will stop at period end");
        setAutoEnabled(false);
        await onUpdated();
      } catch {
        toast.error("Could not cancel Monthly Auto Funding");
      } finally {
        setBusy(false);
      }
      return;
    }
    setBusy(true);
    try {
      const result = await startWhatsAppAutoFunding(businessId, autoAmount);
      const url = result.checkoutUrl || result.url;
      if (!url) throw new Error("Missing checkout URL");
      window.location.href = url;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Could not start Monthly Auto Funding";
      toast.error(msg);
      setBusy(false);
    }
  };

  return (
    <div className="wa-billing-modal-root" role="presentation">
      <button
        type="button"
        className="wa-billing-modal-backdrop"
        aria-label="Close"
        disabled={busy}
        onClick={() => !busy && onClose()}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="wa-billing-modal"
        style={{ maxWidth: 480 }}
      >
        <header className="wa-billing-modal__header">
          <div>
            <h2 id={titleId} className="wa-billing-modal__title">
              <PiggyBank size={18} style={{ display: "inline", marginInlineEnd: 6 }} />
              Manage funds
            </h2>
            <p className="wa-billing-modal__sub">WhatsApp prepaid balance</p>
          </div>
          <button
            type="button"
            className="wa-billing-modal__close"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        {panel === "manage" ? (
          <div className="wa-billing-modal__body" style={{ display: "grid", gap: 16 }}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Current Balance
              </p>
              <p className="mt-1 text-3xl font-black text-slate-900">
                {formatIlsFromMinor(availableMinor)}
              </p>
              {f?.reservedMinor ? (
                <p className="mt-1 text-xs text-slate-500">
                  Reserved: {formatIlsFromMinor(f.reservedMinor)}
                </p>
              ) : null}
            </div>

            <section
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 14,
                display: "grid",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Monthly Auto Funding
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Automatically add{" "}
                    {formatIlsFromMinor(autoAmount)} to your WhatsApp balance
                    every month.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoEnabled || Boolean(f?.autoFundingEnabled)}
                  disabled={busy}
                  onClick={() => void toggleAutoFunding()}
                  style={{
                    width: 44,
                    height: 26,
                    borderRadius: 999,
                    border: "none",
                    background:
                      autoEnabled || f?.autoFundingEnabled ? TEAL : "#cbd5e1",
                    position: "relative",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      insetInlineStart:
                        autoEnabled || f?.autoFundingEnabled ? 22 : 3,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "inset-inline-start 0.15s",
                    }}
                  />
                </button>
              </div>

              {(autoEnabled || f?.autoFundingEnabled || true) && (
                <label className="text-xs font-semibold text-slate-600">
                  Top-up amount every month
                  <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                    {autoPresets.map((m) => (
                      <button
                        key={m}
                        type="button"
                        disabled={busy || Boolean(f?.autoFundingEnabled)}
                        onClick={() => setAutoAmount(m)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 8,
                          border:
                            autoAmount === m
                              ? `2px solid ${TEAL}`
                              : "1px solid #e2e8f0",
                          background: "#fff",
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        {formatIlsFromMinor(m)}
                      </button>
                    ))}
                  </div>
                </label>
              )}

              {f?.nextAutoFundingAt ? (
                <p className="text-xs text-slate-500">
                  Next automatic top-up scheduled for{" "}
                  {new Date(f.nextAutoFundingAt).toLocaleDateString("he-IL")}
                </p>
              ) : null}
              {f?.autoFundingStatus === "past_due" ||
              f?.autoFundingStatus === "failed" ? (
                <p className="text-xs font-semibold text-red-600">
                  Automatic top-up failed. Update your payment method or add
                  funds manually.
                </p>
              ) : null}
            </section>

            <section
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 14,
                display: "grid",
                gap: 10,
              }}
            >
              <p className="text-sm font-bold text-slate-900">Low Balance Alert</p>
              <p className="text-xs text-slate-500">
                Notify when available balance falls below this amount. This does
                not charge your card.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {lowPresets.map((m) => (
                  <button
                    key={m}
                    type="button"
                    disabled={busy}
                    onClick={() => setLowThreshold(m)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      border:
                        lowThreshold === m
                          ? `2px solid ${TEAL}`
                          : "1px solid #e2e8f0",
                      background: "#fff",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    {formatIlsFromMinor(m)}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="wa-billing-btn wa-billing-btn--ghost"
                disabled={busy}
                onClick={() => void saveLowBalance()}
              >
                Save alert threshold
              </button>
            </section>

            <button
              type="button"
              className="wa-billing-btn wa-billing-btn--primary"
              style={{ background: TEAL, borderColor: TEAL }}
              disabled={busy}
              onClick={() => setPanel("topup")}
            >
              {busy ? <Loader2 className="animate-spin" size={16} /> : null}
              Add funds
            </button>
            <button
              type="button"
              className="wa-billing-btn wa-billing-btn--ghost"
              disabled={busy}
              onClick={onClose}
            >
              Back
            </button>
          </div>
        ) : (
          <div className="wa-billing-modal__body" style={{ display: "grid", gap: 14 }}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Current Balance
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {formatIlsFromMinor(availableMinor)}
              </p>
            </div>

            <label className="text-xs font-semibold text-slate-600">
              Amount to add
              <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                {quickAmounts.map((m) => (
                  <button
                    key={m}
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setTopupAmount(m);
                      setCustomTopup("");
                    }}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border:
                        !customTopup && topupAmount === m
                          ? `2px solid ${TEAL}`
                          : "1px solid #e2e8f0",
                      background: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {formatIlsFromMinor(m)}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={minTopup / 100}
                step="1"
                placeholder="Other amount (₪)"
                value={customTopup}
                disabled={busy}
                onChange={(e) => setCustomTopup(e.target.value)}
                style={{
                  marginTop: 10,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  fontWeight: 600,
                }}
              />
            </label>

            <p className="text-sm font-semibold text-slate-700">
              Balance after top-up:{" "}
              <strong>{formatIlsFromMinor(balanceAfter)}</strong>
            </p>
            <p className="text-xs text-slate-500">
              Minimum {formatIlsFromMinor(minTopup)}. Balance is credited only
              after Lemon Squeezy confirms payment (webhook).
            </p>

            <button
              type="button"
              className="wa-billing-btn wa-billing-btn--primary"
              style={{ background: TEAL, borderColor: TEAL }}
              disabled={busy}
              onClick={() => void startTopup()}
            >
              {busy ? <Loader2 className="animate-spin" size={16} /> : null}
              Continue to checkout
            </button>
            <button
              type="button"
              className="wa-billing-btn wa-billing-btn--ghost"
              disabled={busy}
              onClick={() => setPanel("manage")}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
