import React, { useEffect, useState } from "react";
import { fetchPartnerLedger, partnerApiError } from "../../lib/partnerApi";
import type { AmountDue } from "../../types/partner";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import { PartnerCard } from "../../components/partner/partnerUi";

function ils(value?: number) {
  return `₪${Number(value || 0).toLocaleString("he-IL")}`;
}

export default function PartnerRevenue() {
  const [due, setDue] = useState<AmountDue | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPartnerLedger()
      .then((data) => {
        setDue(data);
        setItems(data.items || []);
      })
      .catch((err) => setError(partnerApiError(err, "שגיאה בטעינת חיוב")));
  }, []);

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow="דוחות"
        title="המנוי שלי"
        subtitle="סטטוס מנוי Partner והפירוט הכספי הפנימי."
      />
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}
      <section className="grid gap-4 lg:grid-cols-2">
        <PartnerCard className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">
            מנוי Partner שלי
          </p>
          <p className="mt-2 text-2xl font-black">
            {due?.partnerSubscription?.planName || "Partner"}
          </p>
          <p className="mt-1 font-bold text-slate-700">
            {ils(due?.partnerSubscription?.monthlyFeeIls)} לחודש ·{" "}
            {due?.partnerSubscription?.monthlyStatus === "active" ? "פעיל" : "לא פעיל"} /{" "}
            {due?.partnerSubscription?.currentMonthPayment === "paid" ? "שולם" : "לא שולם"}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-600">
            דמי הקמה {ils(due?.partnerSubscription?.setupFeeIls)}:{" "}
            {due?.partnerSubscription?.setupPayment === "paid" ||
            due?.partnerSubscription?.setupPayment === "waived"
              ? "שולם"
              : "לא שולם"}
          </p>
          <p className="mt-3 text-sm font-bold text-slate-500">
            חוב מנוי פתוח: {ils(due?.openPartnerSubscriptionDebtIls)}
          </p>
        </PartnerCard>
        <PartnerCard className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7C4DFF]">
            עסקאות לקוחות אינן חוב של Partner
          </p>
          <p className="mt-2 text-sm font-bold text-slate-600">
            הלקוח משלם ל-Bizuply. העמלות מופיעות במסך עסקאות ועמלות.
          </p>
        </PartnerCard>
      </section>
      <PartnerCard className="p-5">
        <div className="mt-0 grid gap-2 text-sm sm:grid-cols-2">
          <p>סיטונאות: {ils(due?.breakdown?.wholesaleSubscriptions)}</p>
          <p>חלק Bizuply מהעמלה: {ils(due?.breakdown?.bizuplyMarkupShare)}</p>
          <p>שימוש: {ils(due?.breakdown?.usage)}</p>
          <p>תוספים: {ils(due?.breakdown?.addOns)}</p>
          <p>תשלומי לקוחות/פעילות: {ils(due?.breakdown?.payments)}</p>
          <p>תשלומי מנוי Partner: {ils(due?.breakdown?.partnerPlanPayments)}</p>
        </div>
      </PartnerCard>
      <PartnerCard className="overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-xs font-black text-slate-500">
            <tr>
              <th className="px-4 py-3">סוג</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">סכום</th>
              <th className="px-4 py-3">תיאור</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-bold">{row.entryType}</td>
                <td className="px-4 py-3">{row.sku}</td>
                <td className="px-4 py-3">{ils(row.amountIls)}</td>
                <td className="px-4 py-3">{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PartnerCard>
    </div>
  );
}
