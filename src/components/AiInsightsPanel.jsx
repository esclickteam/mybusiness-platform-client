import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { useLocaleDir } from "../hooks/useLocaleDir";

function buildSiteEditorUrl(basePath, siteId, { templateKey, openSeo = false } = {}) {
  const params = new URLSearchParams();
  const cleanTemplate = String(templateKey || "").trim();

  if (cleanTemplate) {
    params.set("template", cleanTemplate);
  }
  if (openSeo) {
    params.set("openSeo", "1");
  }

  const query = params.toString();
  return `${basePath}/website/sites/${siteId}/edit${query ? `?${query}` : ""}`;
}

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
    accent: "border-s-rose-500",
    badge: "bg-rose-100 text-rose-700",
    badgeKey: "aiInsights.priorityUrgent",
  },
  medium: {
    card: "border-amber-200 bg-gradient-to-br from-amber-50/70 to-white",
    accent: "border-s-amber-500",
    badge: "bg-amber-100 text-amber-700",
    badgeKey: "aiInsights.priorityRecommended",
  },
  low: {
    card: "border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white",
    accent: "border-s-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
    badgeKey: "aiInsights.priorityInfo",
  },
};

function localizeInsight(insight, t) {
  if (!insight?.id) return insight;

  const base = `aiInsights.cards.${insight.id}`;
  const title = t(`${base}.title`, { defaultValue: insight.title });
  const description = t(`${base}.description`, {
    defaultValue: insight.description,
    days: 7,
    name: insight?.meta?.siteName || "",
  });
  const actionLabel = t(`${base}.actionLabel`, {
    defaultValue: insight.actionLabel || insight?.cta?.label || "",
  });

  let metric = insight.metric;
  if (metric && typeof metric.value === "number") {
    const metricKey =
      metric.value === 1 ? `${base}.metricOne` : `${base}.metricOther`;
    metric = {
      ...metric,
      label: t(metricKey, { defaultValue: metric.label }),
    };
  }

  return {
    ...insight,
    title,
    description,
    actionLabel,
    metric,
  };
}

export default function AiInsightsPanel({ insights = [], loading, businessId }) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
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
        dir={dir}
        className="rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
        aria-label={t("aiInsights.loadingAria")}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">
              {t("aiInsights.loadingTitle")}
            </p>
            <p className="text-xs font-medium text-slate-500">
              {t("aiInsights.loadingSubtitle")}
            </p>
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

  const handleAction = async (insight) => {
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
      case "missing_seo": {
        const siteId = insight?.meta?.siteId;
        if (!siteId) {
          navigate(`${basePath}/website`);
          return;
        }

        let templateKey = String(insight?.meta?.templateKey || "").trim();
        if (!templateKey) {
          try {
            const res = await API.get(`/site-builder/sites/${siteId}`);
            templateKey = String(res.data?.site?.templateKey || "").trim();
          } catch {
            /* fall back to edit URL without template */
          }
        }

        navigate(
          buildSiteEditorUrl(basePath, siteId, {
            templateKey,
            openSeo: true,
          }),
          { state: { openSeo: true } }
        );
        return;
      }
      default:
        break;
    }
  };

  return (
    <section
      id="ai-insights-panel"
      dir={dir}
      className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
      aria-label={t("aiInsights.panelAria")}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-950">
              {t("aiInsights.title")}
            </h3>
            <p className="text-sm font-medium text-slate-500">
              {t("aiInsights.actionCount", { count: visibleInsights.length })}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {groupedInsights.map(({ priority, items }) =>
          items.map((rawInsight) => {
            const insight = localizeInsight(rawInsight, t);
            const styles = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;
            const Icon = TYPE_ICONS[insight.type] || Sparkles;

            return (
              <article
                key={insight.id}
                className={`relative overflow-hidden rounded-[22px] border border-s-4 p-4 ${styles.card} ${styles.accent}`}
              >
                <button
                  type="button"
                  className="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 text-slate-400 transition hover:bg-violet-600 hover:text-white"
                  onClick={() => handleDismiss(rawInsight)}
                  aria-label={t("aiInsights.dismissAria")}
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
                        {t(styles.badgeKey)}
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
                        onClick={() => handleAction(rawInsight)}
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
