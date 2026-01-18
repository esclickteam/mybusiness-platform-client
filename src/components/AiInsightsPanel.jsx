import React from "react";
import "./AiInsights.css";

const ICONS = {
  followup: "📩",
  revenue: "💰",
  schedule: "📅",
  operations: "⚙️",
  retention: "🔁",
};

export default function AiInsightsPanel({ insights, loading }) {
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

  return (
    <div className="ai-insights-panel">
      <h3>AI Insights</h3>

      <div className="ai-insights-list">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`ai-insight-card priority-${insight.priority}`}
          >
            <div className="icon">{ICONS[insight.type] || "💡"}</div>

            <div className="content">
              <h4>{insight.title}</h4>
              <p>{insight.description}</p>

              {insight.actionLabel && (
                <button className="action-btn">
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
