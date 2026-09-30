import React, { useState } from "react";
import API from "../../api";

const ATTESTATION =
  "I confirm that I have the customer's authorization to charge this payment method and that I have verified the customer's authority to use it.";

export default function PartnerFundedDiscountCard() {
  const [standardPrice, setStandardPrice] = useState("100");
  const [commissionPercent, setCommissionPercent] = useState("30");
  const [discount, setDiscount] = useState("0");
  const [confirmed, setConfirmed] = useState(false);
  const [quote, setQuote] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState("");

  async function calculate(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setQuote(null);
    try {
      const { data } = await API.post("/partner/customer-charges/quote", {
        standardPrice,
        commissionPercent,
        partnerFundedDiscount: discount,
        authorizationConfirmed: confirmed,
      });
      setQuote(data.quote);
    } catch (err: unknown) {
      const row = err as { response?: { data?: { error?: string } } };
      setError(row.response?.data?.error || "Could not calculate this charge.");
    }
  }

  return (
    <form onSubmit={calculate} className="rounded-3xl border border-slate-200 bg-white p-5" data-testid="partner-funded-discount">
      <h2 className="text-lg font-black">Customer payment confirmation</h2>
      <p className="mt-1 text-sm font-semibold text-slate-600">
        A partner-funded discount reduces the partner commission. It does not reduce Bizuply&apos;s share unless Bizuply approves an exception.
      </p>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <label className="text-xs font-black uppercase text-slate-500">Standard price<input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm font-semibold" value={standardPrice} onChange={(e) => setStandardPrice(e.target.value)} /></label>
        <label className="text-xs font-black uppercase text-slate-500">Commission %<input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm font-semibold" value={commissionPercent} onChange={(e) => setCommissionPercent(e.target.value)} /></label>
        <label className="text-xs font-black uppercase text-slate-500">Partner-funded discount<input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm font-semibold" value={discount} onChange={(e) => setDiscount(e.target.value)} /></label>
      </div>
      <label className="mt-3 flex items-start gap-2 text-sm font-semibold text-slate-800">
        <input type="checkbox" className="mt-1" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
        <span>{ATTESTATION}</span>
      </label>
      <button type="submit" className="mt-3 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white">Confirm charge calculation</button>
      {error ? <p className="mt-2 text-sm font-bold text-rose-800">{error}</p> : null}
      {quote ? (
        <dl className="mt-3 grid gap-1 text-sm font-semibold text-slate-800">
          <div>Standard customer price: {quote.standardPrice}</div>
          <div>Partner commission %: {quote.commissionPercent}</div>
          <div>Partner commission before discount: {quote.commissionBeforeDiscount}</div>
          <div>Partner-funded discount: {quote.partnerFundedDiscount}</div>
          <div>Customer final amount: {quote.customerFinalAmount}</div>
          <div>Bizuply amount: {quote.bizuplyAmount}</div>
          <div>Partner final commission: {quote.partnerFinalCommission}</div>
        </dl>
      ) : null}
    </form>
  );
}
