import React, { useEffect, useState } from "react";
import { fetchPartnerTransactions, partnerApiError } from "../../lib/partnerApi";
import { formatIls } from "../../lib/partnerMoney";
import { DateRangeBar } from "./PartnerDashboard";

const PAYMENT_STATUSES = [
  { id: "", label: "כל תשלומי הלקוח" },
  { id: "paid", label: "שולם" },
  { id: "unpaid", label: "לא שולם" },
  { id: "refunded", label: "הוחזר" },
  { id: "chargeback", label: "חיוב חוזר" },
];

const COMMISSION_STATUSES = [
  { id: "", label: "כל סטטוסי העמלה" },
  { id: "pending", label: "ממתינה" },
  { id: "eligible", label: "זכאית" },
  { id: "paid", label: "שולמה" },
  { id: "reversed", label: "הפוכה" },
];

function ils(value?: number) {
  return formatIls(Number(value || 0));
}

export default function PartnerTransactions() {
  const [preset, setPreset] = useState("month");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [commissionStatus, setCommissionStatus] = useState("");
  const [product, setProduct] = useState("");
  const [error, setError] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params: Record<string, string> = { preset, limit: "100" };
        if (preset === "custom") {
          if (from) params.from = from;
          if (to) params.to = to;
        }
        if (paymentStatus) params.paymentStatus = paymentStatus;
        if (commissionStatus) params.commissionStatus = commissionStatus;
        if (product) params.sku = product;
        const data = await fetchPartnerTransactions(params);
        if (!cancelled) {
          setRows(data.items || []);
          setTotals(data.totals || null);
          setError("");
        }
      } catch (err: unknown) {
        if (!cancelled) setError(partnerApiError(err, "שגיאה בטעינת עסקאות"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [preset, from, to, paymentStatus, commissionStatus, product]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black">עסקאות ועמלות</h2>
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}
      <DateRangeBar
        preset={preset}
        from={from}
        to={to}
        onPreset={setPreset}
        onFrom={setFrom}
        onTo={setTo}
      />
      <div className="flex flex-wrap gap-2">
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold"
        >
          {PAYMENT_STATUSES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          value={commissionStatus}
          onChange={(e) => setCommissionStatus(e.target.value)}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold"
        >
          {COMMISSION_STATUSES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="מוצר / SKU"
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold"
        />
      </div>
      {totals ? (
        <section className="grid gap-3 sm:grid-cols-4">
          <Kpi label="סך העסקאות" value={ils(totals.totalSales)} />
          <Kpi label="העמלה שלך" value={ils(totals.partnerCommission)} />
          <Kpi label="עמלה ממתינה" value={ils(totals.pendingCommission)} />
          <Kpi label="עמלה ששולמה" value={ils(totals.paidCommission)} />
        </section>
      ) : null}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
        <table className="min-w-full text-right text-sm">
          <thead className="bg-slate-50 text-xs font-black text-slate-500">
            <tr>
              <th className="px-3 py-3">תאריך</th>
              <th className="px-3 py-3">לקוח</th>
              <th className="px-3 py-3">מוצר/חבילה</th>
              <th className="px-3 py-3">סכום ששילם הלקוח</th>
              <th className="px-3 py-3">wholesale</th>
              <th className="px-3 py-3">עמלה נוספת</th>
              <th className="px-3 py-3">אחוז Partner</th>
              <th className="px-3 py-3">עמלת Partner ₪</th>
              <th className="px-3 py-3">חלק Bizuply ₪</th>
              <th className="px-3 py-3">סטטוס תשלום</th>
              <th className="px-3 py-3">סטטוס עמלה</th>
              <th className="px-3 py-3">reference</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id} className="border-t border-slate-100">
                <td className="px-3 py-3">
                  {row.transactionDate
                    ? new Date(row.transactionDate).toLocaleDateString("he-IL")
                    : "—"}
                </td>
                <td className="px-3 py-3 font-bold">{row.clientName || "—"}</td>
                <td className="px-3 py-3">{row.product || row.sku}</td>
                <td className="px-3 py-3">{ils(row.customerFinalPrice)}</td>
                <td className="px-3 py-3">{ils(row.wholesalePrice)}</td>
                <td className="px-3 py-3">{ils(row.additionalMarkup)}</td>
                <td className="px-3 py-3">{Number(row.partnerSharePercent || 0)}%</td>
                <td className="px-3 py-3 font-black">{ils(row.partnerCommissionAmount)}</td>
                <td className="px-3 py-3">{ils(row.bizuplyMarkupShare)}</td>
                <td className="px-3 py-3">{row.customerPaymentStatus}</td>
                <td className="px-3 py-3">{row.commissionStatus}</td>
                <td className="px-3 py-3 text-xs">{row.reference || row.transactionId}</td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td className="px-3 py-8 text-center font-bold text-slate-400" colSpan={12}>
                  אין עסקאות בטווח שנבחר
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}
