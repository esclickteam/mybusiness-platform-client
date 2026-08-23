import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminCrmApi from "../../../api/adminCrmApi";
import { CrmCard, ErrorState, LoadingState } from "./AdminCrmUi";
import { formatIsraelDate } from "./adminCrmLabels";

type Metrics = {
  newLeadsToday: number;
  newLeadsThisWeek: number;
  leadsRequiringContact: number;
  followUpsToday: number;
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

const CARDS: { key: keyof Metrics; label: string; to: string; tone: string }[] = [
  { key: "newLeadsToday", label: "לידים חדשים היום", to: "/admin/crm/customers", tone: "from-violet-50 to-white" },
  { key: "newLeadsThisWeek", label: "לידים חדשים השבוע", to: "/admin/crm/customers", tone: "from-sky-50 to-white" },
  { key: "leadsRequiringContact", label: "לידים שטרם נוצר איתם קשר", to: "/admin/crm/customers", tone: "from-amber-50 to-white" },
  { key: "followUpsToday", label: "מעקבים להיום", to: "/admin/crm/follow-ups?scope=today", tone: "from-indigo-50 to-white" },
  { key: "overdueFollowUps", label: "מעקבים באיחור", to: "/admin/crm/follow-ups?scope=overdue", tone: "from-rose-50 to-white" },
  { key: "demosSent", label: "דמואים שנשלחו", to: "/admin/crm/activities", tone: "from-violet-50 to-white" },
  { key: "awaitingPayment", label: "ממתינים לתשלום", to: "/admin/crm/pipeline", tone: "from-orange-50 to-white" },
  { key: "wonThisMonth", label: "עסקאות שנסגרו החודש", to: "/admin/crm/pipeline", tone: "from-emerald-50 to-white" },
  { key: "lostThisMonth", label: "עסקאות שאבדו", to: "/admin/crm/pipeline", tone: "from-slate-50 to-white" },
  { key: "activeCustomers", label: "לקוחות פעילים", to: "/admin/crm/customers", tone: "from-emerald-50 to-white" },
  { key: "mrr", label: "MRR", to: "/admin/crm/customers", tone: "from-cyan-50 to-white" },
  { key: "failedPayments", label: "חיובים שנכשלו", to: "/admin/crm/customers", tone: "from-rose-50 to-white" },
  { key: "customersAtRisk", label: "לקוחות בסיכון", to: "/admin/crm/customers", tone: "from-amber-50 to-white" },
];

const SHORTCUTS = [
  { label: "ליד חדש", to: "/admin/crm/customers?create=1" },
  { label: "משימה חדשה", to: "/admin/crm/tasks" },
  { label: "שליחת דמו", to: "/admin/crm/whatsapp" },
  { label: "מעקבים להיום", to: "/admin/crm/follow-ups?scope=today" },
  { label: "WhatsApp Inbox", to: "/admin/crm/whatsapp" },
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
      <div className="flex flex-wrap gap-2">
        {SHORTCUTS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => navigate(item.to)}
            className="min-h-11 rounded-2xl bg-[#7C4DFF] px-4 text-sm font-black text-white shadow-lg shadow-[#7C4DFF]/20"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => navigate(card.to)}
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
