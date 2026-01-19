import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AiInsights.css";

const ICONS = {
  followup: "📩",
  revenue: "💰",
  schedule: "📅",
  operations: "⚙️",
  retention: "🔁",
};

export default function AiInsightsPanel({ insights = [], loading, businessId }) {
  const navigate = useNavigate();
  const [dismissedInsights, setDismissedInsights] = useState([]);

  if (loading) {
    return <div className="ai-insights-loading">Loading insights…</div>;
  }

  const visibleInsights = insights.filter(
    (insight) => !dismissedInsights.includes(insight.id)
  );

  if (!visibleInsights.length) {
  return null; // בדשבורד – לא מציגים כלום כשאין Insights
}


  const highPriority = visibleInsights.filter(
    (i) => i.priority === "high"
  );
  const mediumPriority = visibleInsights.filter(
    (i) => i.priority === "medium"
  );

  /* =========================
     Dismiss Insight (UI + DB)
  ========================= */
  const handleDismiss = async (insight) => {
    setDismissedInsights((prev) => [...prev, insight.id]);

    try {
      await fetch("/api/ai/insights/dismiss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          insightId: insight.id,
          stateHash: insight.meta?.stateHash || null,
        }),
      });
    } catch (err) {
      console.error("Failed to dismiss insight", err);
    }
  };

  /* =========================
     CTA Handler (generic)
  ========================= */
  const handleAction = (insight) => {
  // CTA גנרי (אם בעתיד תוסיפי)
  if (insight.cta?.action === "navigate") {
    navigate(insight.cta.target);
    return;
  }

  // 🔴 Follow-up
  if (
    insight.id === "followup_needed" &&
    insight.meta?.conversations?.length
  ) {
    navigate(`/business/${businessId}/dashboard/messages`, {
      state: { threadId: insight.meta.conversations[0] },
    });
    return;
  }

  // 🟠 Clients without appointments
  if (insight.id === "clients_without_appointments") {
    navigate(
      `/business/${businessId}/dashboard/crm/appointments`
    );
    return;
  }
};


  return (
    <section className="ai-insights-panel">
      {/* Header */}
      <div className="ai-insights-header">
        <h3>AI Insights ✨</h3>
        <p>Personalized suggestions to improve your business</p>
      </div>

      {/* 🔴 High Priority */}
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

      {/* 🟠 Medium Priority */}
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

/* =====================================================
   Insight Card (Reusable)
===================================================== */
function InsightCard({ insight, onDismiss, onAction, prominent = false }) {
  return (
    <div
      className={`ai-insight-card priority-${insight.priority} ${
        prominent ? "prominent" : ""
      }`}
    >
      <button
        className="ai-insight-close"
        onClick={() => onDismiss(insight)}
        aria-label="Dismiss insight"
      >
        ✕
      </button>

      <div className="icon">
        {ICONS[insight.type] || "💡"}
      </div>

      <div className="content">
        <h4>{insight.title}</h4>

        <p>
          {insight.metric ? (
            <>
              <strong>{insight.metric.value}</strong>{" "}
              {insight.metric.label} — {insight.description}
            </>
          ) : (
            insight.description
          )}
        </p>

        {(insight.actionLabel || insight.cta) && (
          <button
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
