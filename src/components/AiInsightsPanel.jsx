import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  console.log("🧠 AiInsightsPanel render");
  console.log("📍 current location:", location.pathname, location.state);

  if (loading) {
    return <div className="ai-insights-loading">Loading insights…</div>;
  }

  if (!insights.length) {
    console.log("ℹ️ No insights");
    return (
      <div className="ai-insights-empty">
        ✅ Everything looks good. No actions needed right now.
      </div>
    );
  }

  const handleActionClick = (insight) => {
    console.log("👉 CLICKED INSIGHT:", insight);

    if (insight.id !== "followup_needed") {
      console.log("⏭️ Not followup insight, ignoring");
      return;
    }

    if (!insight.meta?.conversations?.length) {
      console.warn("⚠️ No conversations in insight.meta", insight.meta);
      return;
    }

    const conversationId = insight.meta.conversations[0];

    console.log("📨 Follow-up conversationId:", conversationId);
    console.log("➡️ Navigating to /dashboard/messages with state");

    navigate("/dashboard/messages", {
      state: {
        threadId: conversationId,
        from: "ai-insights", // 👈 עוזר לנו להבין מאיפה באנו
      },
    });

    console.log("✅ navigate() called");
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
