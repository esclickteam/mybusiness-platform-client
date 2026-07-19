import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/api";
import "./AiInsights.css";

const ICONS = {
  followup: "📩",
  revenue: "💰",
  schedule: "📅",
  leads: "🎯",
  website: "🌐",
  seo: "🔍",
  operations: "⚙️",
  retention: "🔁",
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

  const highPriority = useMemo(
    () => visibleInsights.filter((i) => i?.priority === "high"),
    [visibleInsights]
  );
  const mediumPriority = useMemo(
    () => visibleInsights.filter((i) => i?.priority === "medium"),
    [visibleInsights]
  );

  if (loading) {
    return (
      <div className="ai-insights-loading" dir="rtl">
        טוען המלצות...
      </div>
    );
  }

  if (!visibleInsights.length) {
    return null;
  }

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

    const basePath = `/business/${businessId}/dashboard`;

    if (insight?.cta?.action === "navigate" && insight?.cta?.target) {
      navigate(insight.cta.target);
      return;
    }

    const conversationId = insight?.meta?.conversations?.[0];

    switch (insight?.id) {
      case "followup_needed":
      case "unanswered_client_messages":
        if (conversationId) {
          navigate(`${basePath}/messages`, { state: { threadId: conversationId } });
        } else {
          navigate(`${basePath}/messages`);
        }
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
    <section className="ai-insights-panel" dir="rtl" aria-label="המלצות AI">
      <div className="ai-insights-header">
        <h3>המלצות חכמות ✨</h3>
        <p>הצעות מותאמות אישית לשיפור העסק שלכם</p>
      </div>

      {highPriority.length > 0 && (
        <div className="ai-insights-high">
          {highPriority.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onDismiss={handleDismiss}
              onAction={handleAction}
              prominent
            />
          ))}
        </div>
      )}

      {mediumPriority.length > 0 && (
        <div className="ai-insights-medium">
          {mediumPriority.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onDismiss={handleDismiss}
              onAction={handleAction}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function InsightCard({ insight, onDismiss, onAction, prominent = false }) {
  return (
    <div
      className={`ai-insight-card priority-${insight.priority} ${
        prominent ? "prominent" : ""
      }`}
    >
      <button
        type="button"
        className="ai-insight-close"
        onClick={() => onDismiss(insight)}
        aria-label="סגירת המלצה"
      >
        ✕
      </button>

      <div className="icon">{ICONS[insight.type] || "💡"}</div>

      <div className="content">
        <h4>{insight.title}</h4>

        <p>
          {insight.metric ? (
            <>
              <strong>{insight.metric.value}</strong> {insight.metric.label} —{" "}
              {insight.description}
            </>
          ) : (
            insight.description
          )}
        </p>

        {(insight.actionLabel || insight.cta) && (
          <button
            type="button"
            className="action-btn"
            onClick={() => onAction(insight)}
          >
            {insight.actionLabel || insight.cta?.label}
          </button>
        )}
      </div>
    </div>
  );
}
