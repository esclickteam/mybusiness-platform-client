import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminCrmApi from "../../../api/adminCrmApi";
import { CrmCard, ErrorState, LoadingState } from "./AdminCrmUi";
import { formatIsraelDate } from "./adminCrmLabels";

type Metrics = {
  newLeadsToday: number;
  newLeadsThisWeek: number;
  leadsRequiringContact: number;
  overdueFollowUps: number;
  demosSent: number;
  awaitingPayment: number;
  wonThisMonth: number;
  lostThisMonth: number;
  conversionRate: number;
  activeCustomers: number;
  mrr: number;
  failedPayments: number;
  customersAtRisk: number;
  generatedAt?: string;
};

const CARDS: { key: keyof Metrics; label: string; tone: string }[] = [
  { key: "newLeadsToday", label: "לידים חדשים היום", tone: "from-violet-50 to-white" },
  { key: "newLeadsThisWeek", label: "לידים השבוע", tone: "from-sky-50 to-white" },
  { key: "leadsRequiringContact", label: "דורשים יצירת קשר", tone: "from-amber-50 to-white" },
  { key: "overdueFollowUps", label: "מעקבים באיחור", tone: "from-rose-50 to-white" },
  { key: "demosSent", label: "דמו שנשלח החודש", tone: "from-indigo-50 to-white" },
  { key: "awaitingPayment", label: "ממתינים לתשלום", tone: "from-orange-50 to-white" },
  { key: "wonThisMonth", label: "נסגרו החודש", tone: "from-emerald-50 to-white" },
  { key: "lostThisMonth", label: "אבודים החודש", tone: "from-slate-50 to-white" },
  { key: "conversionRate", label: "אחוז המרה", tone: "from-purple-50 to-white" },
  { key: "activeCustomers", label: "לקוחות פעילים", tone: "from-emerald-50 to-white" },
  { key: "mrr", label: "MRR ₪", tone: "from-cyan-50 to-white" },
  { key: "failedPayments", label: "תשלומים שנכשלו", tone: "from-rose-50 to-white" },
  { key: "customersAtRisk", label: "לקוחות בסיכון", tone: "from-amber-50 to-white" },
];

export default function AdminCrmOverview() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminCrmApi.dashboard();
      setMetrics(data.metrics);
    } catch (err: any) {
      setError(err?.response?.data?.error || "לא ניתן לטעון את הדשבורד");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!metrics) return <ErrorState message="אין נתונים" onRetry={load} />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => navigate("/admin/crm/customers")}
            className={`rounded-[24px] border border-purple-100 bg-gradient-to-br ${card.tone} p-4 text-right shadow-sm`}
          >
            <div className="text-xs font-bold text-slate-500">{card.label}</div>
            <div className="mt-2 text-3xl font-black text-purple-950">
              {card.key === "conversionRate"
                ? `${metrics[card.key]}%`
                : card.key === "mrr"
                  ? `₪${Number(metrics[card.key] || 0).toLocaleString("he-IL")}`
                  : metrics[card.key]}
            </div>
          </button>
        ))}
      </div>
      <CrmCard>
        <p className="text-sm font-bold text-slate-500">
          הנתונים מחושבים מרשומות CRM וממנויי האמת. עודכן{" "}
          {formatIsraelDate(metrics.generatedAt, true)}
        </p>
      </CrmCard>
    </div>
  );
}
