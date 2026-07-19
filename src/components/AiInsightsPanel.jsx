import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Globe,
  MessageSquareWarning,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import API from "@/api";

const TYPE_ICONS = {
  followup: MessageSquareWarning,
  revenue: TrendingUp,
  schedule: CalendarDays,
  leads: Target,
  website: Globe,
  seo: Search,
};

const PRIORITY_STYLES = {
  high: {
    card: "border-rose-200 bg-gradient-to-br from-rose-50/80 to-white",
    accent: "border-r-rose-500",
    badge: "bg-rose-100 text-rose-700",
    badgeLabel: "דחוף",
  },
  medium: {
    card: "border-amber-200 bg-gradient-to-br from-amber-50/70 to-white",
    accent: "border-r-amber-500",
    badge: "bg-amber-100 text-amber-700",
    badgeLabel: "מומלץ",
  },
  low: {
    card: "border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white",
    accent: "border-r-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "מידע",
  },
};

export default function AiInsightsPanel({ insights = [], loading, businessId }) {
  const navigate = useNavigate();
  const [dismissedInsights, setDismissedInsights] = useState([]);

  const safeInsights = Array.isArray(insights) ? insights : [];
  const visibleInsights = useMemo(
    () =>
      safeInsights.filter(
        (insight) => insight?.id && !dismissedInsights.includes(insight.id)
      ),
    [safeInsights, dismissedInsights]
  );

  const groupedInsights = useMemo(() => {
    const order = ["high", "medium", "low"];
    return order
      .map((priority) => ({
        priority,
        items: visibleInsights.filter((item) => item.priority === priority),
      }))
      .filter((group) => group.items.length > 0);
  }, [visibleInsights]);

  if (loading) {
    return (
      <section
        dir="rtl"
        className="rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
        aria-label="טוען המלצות"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">טוען המלצות חכמות...</p>
            <p className="text-xs font-medium text-slate-500">מנתחים את הנתונים של העסק</p>
          </div>
        </div>
      </section>
    );
  }

  if (!visibleInsights.length || !businessId) {
    return null;
  }

  const basePath = `/business/${businessId}/dashboard`;

  const handleDismiss = async (insight) => {
    const id = insight?.id;
    if (!id) return;

    setDismissedInsights((prev) => (prev.includes(id) ? prev : [...prev, id]));

    try {
      await API.post("/ai/insights/dismiss", {
        businessId,
        insightId: id,
        stateHash: insight?.meta?.stateHash || null,
      });
    } catch (err) {
      console.error("Failed to dismiss insight", err);
    }
  };

  const handleAction = (insight) => {
    handleDismiss(insight);

    if (insight?.cta?.action === "navigate" && insight?.cta?.target) {
      navigate(insight.cta.target);
      return;
    }

    const conversationId = insight?.meta?.conversations?.[0];

    switch (insight?.id) {
      case "followup_needed":
      case "unanswered_client_messages":
        navigate(`${basePath}/messages`, {
          state: conversationId ? { threadId: conversationId } : undefined,
        });
        return;
      case "clients_without_appointments":
        navigate(`${basePath}/crm/appointments`);
        return;
      case "missing_work_hours":
        navigate(`${basePath}/crm/work-hours`);
        return;
      case "untreated_leads":
        navigate(`${basePath}/crm/leads`);
        return;
      case "no_published_website":
        navigate(`${basePath}/website/create`);
        return;
      case "missing_seo":
        if (insight?.meta?.siteId) {
          navigate(`${basePath}/website/sites/${insight.meta.siteId}/edit`);
        } else {
          navigate(`${basePath}/website`);
        }
        return;
      default:
        break;
    }
  };

  return (
    <section
      id="ai-insights-panel"
      dir="rtl"
      className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
      aria-label="המלצות AI"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-950">המלצות חכמות</h3>
            <p className="text-sm font-medium text-slate-500">
              {visibleInsights.length}{" "}
              {visibleInsights.length === 1 ? "פעולה מומלצת" : "פעולות מומלצות"} לשיפור העסק
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {groupedInsights.map(({ priority, items }) =>
          items.map((insight) => {
            const styles = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;
            const Icon = TYPE_ICONS[insight.type] || Sparkles;

            return (
              <article
                key={insight.id}
                className={`relative overflow-hidden rounded-[22px] border border-r-4 p-4 ${styles.card} ${styles.accent}`}
              >
                <button
                  type="button"
                  className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 text-slate-400 transition hover:bg-violet-600 hover:text-white"
                  onClick={() => handleDismiss(insight)}
                  aria-label="סגירת המלצה"
                >
                  <X size={14} />
                </button>

                <div className="flex items-start gap-3 pe-8">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-black text-slate-950">{insight.title}</h4>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-black ${styles.badge}`}
                      >
                        {styles.badgeLabel}
                      </span>
                    </div>

                    <p className="text-sm leading-6 text-slate-600">
                      {insight.metric ? (
                        <>
                          <strong className="text-slate-900">{insight.metric.value}</strong>{" "}
                          {insight.metric.label} — {insight.description}
                        </>
                      ) : (
                        insight.description
                      )}
                    </p>

                    {(insight.actionLabel || insight.cta?.label) && (
                      <button
                        type="button"
                        className="mt-3 rounded-xl bg-violet-600 px-4 py-2 text-xs font-black text-white transition hover:bg-violet-700"
                        onClick={() => handleAction(insight)}
                      >
                        {insight.actionLabel || insight.cta?.label}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
