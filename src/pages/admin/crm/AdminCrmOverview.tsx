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

const CARDS: { key: keyof Metrics; label: string; to: string; alert?: boolean }[] = [
  { key: "newLeadsToday", label: "לידים חדשים היום", to: "/admin/crm/customers" },
  { key: "newLeadsThisWeek", label: "לידים חדשים השבוע", to: "/admin/crm/customers" },
  { key: "leadsRequiringContact", label: "לידים שטרם נוצר איתם קשר", to: "/admin/crm/customers" },
  { key: "followUpsToday", label: "מעקבים להיום", to: "/admin/crm/follow-ups?scope=today" },
  { key: "overdueFollowUps", label: "מעקבים באיחור", to: "/admin/crm/follow-ups?scope=overdue", alert: true },
  { key: "demosSent", label: "דמואים שנשלחו", to: "/admin/crm/activities" },
  { key: "awaitingPayment", label: "ממתינים לתשלום", to: "/admin/crm/pipeline" },
  { key: "wonThisMonth", label: "עסקאות שנסגרו החודש", to: "/admin/crm/pipeline" },
  { key: "lostThisMonth", label: "עסקאות שאבדו", to: "/admin/crm/pipeline" },
  { key: "activeCustomers", label: "לקוחות פעילים", to: "/admin/crm/customers" },
  { key: "mrr", label: "MRR", to: "/admin/crm/customers" },
  { key: "failedPayments", label: "חיובים שנכשלו", to: "/admin/crm/customers", alert: true },
  { key: "customersAtRisk", label: "לקוחות בסיכון", to: "/admin/crm/customers", alert: true },
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
        {SHORTCUTS.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => navigate(item.to)}
            className={index === 0 ? "biz-btn" : "biz-btn biz-btn-secondary"}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="biz-stat-grid">
        {CARDS.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => navigate(card.to)}
            className={card.alert ? "biz-stat-card is-alert" : "biz-stat-card"}
          >
            <p>{card.label}</p>
            <strong>
              {card.key === "conversionRate"
                ? `${metrics[card.key]}%`
                : card.key === "mrr"
                  ? `₪${Number(metrics[card.key] || 0).toLocaleString("he-IL")}`
                  : metrics[card.key]}
            </strong>
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
