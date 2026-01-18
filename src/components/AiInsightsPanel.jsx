import React from "react";
import { useNavigate } from "react-router-dom";
import "./AiInsights.css";

const ICONS = {
  followup: "📩",
  revenue: "💰",
  schedule: "📅",
  operations: "⚙️",
  retention: "🔁",
};

export default function AiInsightsPanel({ insights, loading, businessId }) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="ai-insights-loading">Loading insights…</div>;
  }

  if (!insights.length) {
    return (
      <div className="ai-insights-empty">
        ✅ Everything looks good. No actions needed right now.
      </div>
    );
  }

  const handleActionClick = (insight) => {
    // ▶️ FOLLOW UP → ניתוב לצ׳אט
    if (
      insight.id === "followup_needed" &&
      insight.meta?.conversations?.length
    ) {
      const conversationId = insight.meta.conversations[0];

      navigate(
  `/dashboard/messages?threadId=${conversationId}`
);
    }

    // אפשר להוסיף כאן פעולות נוספות בהמשך
  };

  return (
    <div className="ai-insights-panel">
      <h3>AI Insights</h3>

      <div className="ai-insights-list">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`ai-insight-card priority-${insight.priority}`}
          >
            <div className="icon">
              {ICONS[insight.type] || "💡"}
            </div>

            <div className="content">
              <h4>{insight.title}</h4>
              <p>{insight.description}</p>

              {insight.actionLabel && (
                <button
                  className="action-btn"
                  onClick={() => handleActionClick(insight)}
                >
                  {insight.actionLabel}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
