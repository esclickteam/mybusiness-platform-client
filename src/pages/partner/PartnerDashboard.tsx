import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPartnerDashboard } from "../../lib/partnerApi";
import type { AmountDue, PartnerMe } from "../../types/partner";
import BizuplyLoader from "../../components/ui/BizuplyLoader";

function ils(value: number) {
  return `₪${Number(value || 0).toLocaleString("he-IL")}`;
}

export default function PartnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [partner, setPartner] = useState<PartnerMe | null>(null);
  const [due, setDue] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<AmountDue["breakdown"] | null>(null);
  const [clients, setClients] = useState({
    total: 0,
    active: 0,
    waitingPayment: 0,
    leads: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPartnerDashboard();
        setPartner(data.partner);
        setDue(Number(data.amountDueToBizuply || 0));
        setBreakdown(data.breakdown || null);
        setClients(data.clients || clients);
      } catch (err: any) {
        setError(err.response?.data?.error || "שגיאה בטעינת הדשבורד");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <BizuplyLoader fullScreen label="טוען לוח פרטנר..." />;

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}

      {partner?.status === "pending_setup" ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          החשבון ממתין להפעלת דמי הקמה ב-Staging (אדמין → פרטנרים → הפעל הקמה).
          אין Stripe LIVE ואין תשלום Production ב-Phase 1.
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold text-slate-500">הסכום לתשלום ל-Bizuply החודש</p>
        <p className="mt-1 text-4xl font-black text-slate-900">{ils(due)}</p>
        <p className="mt-2 text-sm font-bold text-slate-500">
          {partner?.name} · {partner?.plan?.nameHe || partner?.planKey} · {partner?.status}
        </p>
        <Link
          to="/partner/dashboard/revenue"
          className="mt-3 inline-block text-sm font-black text-[#7C4DFF]"
        >
          לפירוט החיוב →
        </Link>
      </section>

      {breakdown ? (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["מנוי חודשי", breakdown.monthlySubscription],
            ["דמי הקמה", breakdown.unpaidSetupFee],
            ["סיטונאות לקוחות", breakdown.wholesaleSubscriptions],
            ["חלק Bizuply מהעמלה", breakdown.bizuplyMarkupShare],
            ["שימוש", breakdown.usage],
            ["תוספים", breakdown.addOns],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold text-slate-500">{label}</p>
              <p className="text-xl font-black">{ils(Number(value))}</p>
            </div>
          ))}
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-4">
        {[
          ["כל הלקוחות", clients.total, "/partner/dashboard/crm"],
          ["פעילים", clients.active, "/partner/dashboard/crm"],
          ["ממתינים לתשלום", clients.waitingPayment, "/partner/dashboard/crm"],
          ["לידים", clients.leads, "/partner/dashboard/clients/new"],
        ].map(([label, value, href]) => (
          <Link
            key={String(label)}
            to={String(href)}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <p className="text-xs font-bold text-slate-500">{label}</p>
            <p className="text-2xl font-black">{value}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
