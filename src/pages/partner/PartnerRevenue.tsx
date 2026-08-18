import React, { useEffect, useState } from "react";
import { fetchPartnerLedger, partnerApiError } from "../../lib/partnerApi";
import type { AmountDue } from "../../types/partner";

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
    <div className="space-y-4">
      <h2 className="text-xl font-black">הסכום לתשלום ל-Bizuply החודש</h2>
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-4xl font-black">{ils(due?.amountDueToBizuply)}</p>
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <p>מנוי חודשי: {ils(due?.breakdown.monthlySubscription)}</p>
          <p>דמי הקמה: {ils(due?.breakdown.unpaidSetupFee)}</p>
          <p>סיטונאות: {ils(due?.breakdown.wholesaleSubscriptions)}</p>
          <p>חלק Bizuply מהעמלה: {ils(due?.breakdown.bizuplyMarkupShare)}</p>
          <p>שימוש: {ils(due?.breakdown.usage)}</p>
          <p>תוספים: {ils(due?.breakdown.addOns)}</p>
          <p>תשלומים ששולמו: {ils(due?.breakdown.payments)}</p>
        </div>
      </section>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
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
      </section>
    </div>
  );
}
