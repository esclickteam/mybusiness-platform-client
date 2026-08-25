import React, { useEffect, useState } from "react";
import { fetchPartnerTransactions, partnerApiError } from "../../lib/partnerApi";
import { formatIls } from "../../lib/partnerMoney";
import { DateRangeBar } from "./PartnerDashboard";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import { partnerStatusLabel } from "../../lib/partnerLabels";

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
  { id: "eligible", label: "זמינה למשיכה" },
  { id: "withdrawal_requested", label: "בבקשת משיכה" },
  { id: "approved", label: "מאושרת" },
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
  const [client, setClient] = useState("");
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
        if (client) params.clientId = client;
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
  }, [preset, from, to, paymentStatus, commissionStatus, product, client]);

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow="עסקאות"
        title="עסקאות ועמלות"
        subtitle="כל העסקאות שנסגרו דרככם, כולל סטטוס תשלום ועמלה."
      />
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
          value={client}
          onChange={(e) => setClient(e.target.value)}
          placeholder="מזהה לקוח"
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold"
        />
        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="מוצר"
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
      <PartnerCard className="overflow-x-auto">
        <table className="min-w-full text-right text-sm">
          <thead className="bg-slate-50 text-xs font-black text-slate-500">
            <tr>
              <th className="px-3 py-3">תאריך</th>
              <th className="px-3 py-3">לקוח</th>
              <th className="px-3 py-3">Deal</th>
              <th className="px-3 py-3">מוצר</th>
              <th className="px-3 py-3">סכום העסקה</th>
              <th className="px-3 py-3">עמלה</th>
              <th className="px-3 py-3">חלק Bizuply</th>
              <th className="px-3 py-3">סטטוס תשלום</th>
              <th className="px-3 py-3">סטטוס עמלה</th>
              <th className="px-3 py-3">מקור</th>
              <th className="px-3 py-3">אסמכתת תשלום</th>
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
                <td className="px-3 py-3">{row.dealNumber || "—"}</td>
                <td className="px-3 py-3">{row.product || "—"}</td>
                <td className="px-3 py-3">{ils(row.customerFinalPrice)}</td>
                <td className="px-3 py-3 font-black">{ils(row.partnerCommissionAmount)}</td>
                <td className="px-3 py-3">{ils(row.bizuplyGrossAmount || row.bizuplyMarkupShare)}</td>
                <td className="px-3 py-3">{partnerStatusLabel(row.customerPaymentStatus)}</td>
                <td className="px-3 py-3">{partnerStatusLabel(row.commissionStatus)}</td>
                <td className="px-3 py-3">
                  {partnerStatusLabel(row.salesSource || row.sourceType || row.commissionType)}
                  {row.sourceType === "renewal" || row.commissionType === "customer_renewal"
                    ? " · חידוש"
                    : ""}
                </td>
                <td className="px-3 py-3 text-xs">
                  {row.stripePaymentIntentId || row.reference || row.transactionId}
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td className="px-3 py-8 text-center font-bold text-slate-400" colSpan={10}>
                  אין עסקאות בטווח שנבחר
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </PartnerCard>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}
