import React, { useState } from "react";
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

  const [dismissedInsights, setDismissedInsights] = useState([]);

  console.log("🧠 AiInsightsPanel render");
  console.log("📍 current location:", location.pathname, location.state);

  if (loading) {
    return <div className="ai-insights-loading">Loading insights…</div>;
  }

  const visibleInsights = insights.filter(
    (insight) => !dismissedInsights.includes(insight.id)
  );

  if (!visibleInsights.length) {
    console.log("ℹ️ No visible insights");
    return (
      <div className="ai-insights-empty">
        ✅ Everything looks good. No actions needed right now.
      </div>
    );
  }

  const handleDismiss = (id) => {
    console.log("❌ Dismiss insight:", id);
    setDismissedInsights((prev) => [...prev, id]);
  };

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

    navigate(`/business/${businessId}/dashboard/messages`, {
      state: {
        threadId: conversationId,
      },
    });

    console.log("✅ navigate() called");
  };

  return (
    <div className="ai-insights-panel">
      <h3>AI Insights</h3>

      <div className="ai-insights-list">
        {visibleInsights.map((insight) => (
          <div
            key={insight.id}
            className={`ai-insight-card priority-${insight.priority}`}
          >
            {/* ❌ Close button */}
            <button
              className="ai-insight-close"
              onClick={() => handleDismiss(insight.id)}
              aria-label="Dismiss insight"
            >
              ✕
            </button>

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
