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
    return (
      <div className="ai-insights-empty">
        ✅ Everything looks good. No actions needed right now.
      </div>
    );
  }

  /* =========================
     ❌ Dismiss Insight (UI + DB)
  ========================= */
  const handleDismiss = async (insight) => {
    console.log("❌ Dismiss insight:", insight.id);

    // 1️⃣ הסתרה מיידית ב-UI
    setDismissedInsights((prev) => [...prev, insight.id]);

    // 2️⃣ עדכון לשרת
    try {
      await fetch("/api/ai/insights/dismiss", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId,
          insightId: insight.id,
          stateHash: insight.meta?.stateHash || null,
        }),
      });

      console.log("✅ Insight dismissed in DB");
    } catch (err) {
      console.error("❌ Failed to dismiss insight:", err);
    }
  };

  /* =========================
     CTA Action (unchanged)
  ========================= */
  const handleActionClick = (insight) => {
    console.log("👉 CLICKED INSIGHT:", insight);

    if (insight.id !== "followup_needed") return;
    if (!insight.meta?.conversations?.length) return;

    const conversationId = insight.meta.conversations[0];

    navigate(`/business/${businessId}/dashboard/messages`, {
      state: { threadId: conversationId },
    });
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
            {/* ❌ Close */}
            <button
              className="ai-insight-close"
              onClick={() => handleDismiss(insight)}
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
