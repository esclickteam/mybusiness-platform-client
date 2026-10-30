import React, { useState } from "react";
import { adminRecordPayment } from "../../lib/partnerApi";
import { validateManualInternationalPayment } from "../../lib/partnerInternationalPlan";

export type InternationalManualPaymentTarget = {
  partnerId: string;
  name: string;
  periodStart: string;
  periodEnd: string;
};

export default function InternationalManualPaymentForm({
  target,
  onClose,
  onSaved,
}: {
  target: InternationalManualPaymentTarget;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}) {
  const [amount, setAmount] = useState("5000");
  const [paidAt, setPaidAt] = useState("");
  const [reference, setReference] = useState("");
  const [periodStart, setPeriodStart] = useState(target.periodStart);
  const [periodEnd, setPeriodEnd] = useState(target.periodEnd);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const checked = validateManualInternationalPayment({
      amount,
      paidAt,
      reference,
      periodStart,
      periodEnd,
    });
    if (!checked.ok) {
      setError(checked.error);
      return;
    }
    setBusy(true);
    setError("");
    try {
      await adminRecordPayment(target.partnerId, checked.payload);
      await onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || "לא ניתן לתעד את התשלום");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      data-testid="international-manual-payment"
      className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-right"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-amber-800">גבייה ידנית · partner_international</p>
          <h2 className="mt-1 text-lg font-black text-slate-900">תיעוד תשלום עבור {target.name}</h2>
          <p className="mt-1 max-w-3xl text-sm font-bold text-slate-700">
            הגבייה מתבצעת מחוץ למערכת. הכפתור לא מחייב כרטיס ולא יוצר חיוב אוטומטי. תעדו את התשלום רק אחרי שהכסף התקבל בפועל.
          </p>
        </div>
        <button type="button" className="text-sm font-black text-slate-500" onClick={onClose}>
          סגירה
        </button>
      </div>
      {error ? <p className="mt-3 text-sm font-bold text-rose-700">{error}</p> : null}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-sm font-black text-slate-800">
          סכום שהתקבל (USD)
          <input
            data-testid="manual-payment-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold"
          />
        </label>
        <label className="text-sm font-black text-slate-800">
          תאריך קבלת הכסף
          <input
            data-testid="manual-payment-date"
            type="date"
            value={paidAt}
            onChange={(e) => setPaidAt(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold"
          />
        </label>
        <label className="text-sm font-black text-slate-800">
          אסמכתה
          <input
            data-testid="manual-payment-reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="מספר העברה או קבלה"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-black text-slate-800">
            תחילת תקופת חיוב
            <input
              data-testid="manual-payment-period-start"
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold"
            />
          </label>
          <label className="text-sm font-black text-slate-800">
            סוף תקופת חיוב
            <input
              data-testid="manual-payment-period-end"
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold"
            />
          </label>
        </div>
      </div>
      <button
        type="submit"
        disabled={busy}
        className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
      >
        {busy ? "שומר..." : "תיעוד תשלום מאומת"}
      </button>
    </form>
  );
}
