import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AiInsights.css";

const ICONS = {
  followup: "📩",
  revenue: "💰",
  schedule: "📅",
  operations: "⚙️",
  retention: "🔁",
};

// Toggle this to silence logs quickly
const DEBUG_AI_INSIGHTS = true;

export default function AiInsightsPanel({ insights = [], loading, businessId }) {
  const navigate = useNavigate();
  const [dismissedInsights, setDismissedInsights] = useState([]);

  /* =========================
     Debug snapshots
  ========================= */
  const safeInsights = Array.isArray(insights) ? insights : [];
  const visibleInsights = useMemo(() => {
    return safeInsights.filter((insight) => !dismissedInsights.includes(insight?.id));
  }, [safeInsights, dismissedInsights]);

  const highPriority = useMemo(
    () => visibleInsights.filter((i) => i?.priority === "high"),
    [visibleInsights]
  );
  const mediumPriority = useMemo(
    () => visibleInsights.filter((i) => i?.priority === "medium"),
    [visibleInsights]
  );

  useEffect(() => {
    if (!DEBUG_AI_INSIGHTS) return;

    // This will print on every change in inputs / results
    console.groupCollapsed("🧠 [AiInsightsPanel] render debug");
    console.log("businessId:", businessId, "type:", typeof businessId);
    console.log("loading:", loading);
    console.log("insights (raw):", safeInsights);
    console.log("dismissedInsights:", dismissedInsights);
    console.log("visibleInsights:", visibleInsights);
    console.log("highPriority:", highPriority);
    console.log("mediumPriority:", mediumPriority);

    // Common reasons why "nothing shows"
    if (loading) console.warn("Reason: loading=true → showing loading state");
    if (!businessId) console.warn("Reason: businessId is missing/empty");
    if (!safeInsights.length) console.warn("Reason: insights array is empty");
    if (safeInsights.length && !visibleInsights.length) {
      console.warn(
        "Reason: all insights are filtered out by dismissedInsights (or missing id fields)"
      );
    }

    // Validate insight object shape
    safeInsights.forEach((ins, idx) => {
      if (!ins?.id) console.warn(`Insight[${idx}] missing id:`, ins);
      if (!ins?.priority) console.warn(`Insight[${idx}] missing priority:`, ins);
      if (!ins?.type) console.warn(`Insight[${idx}] missing type:`, ins);
    });

    console.groupEnd();
  }, [
    businessId,
    loading,
    dismissedInsights,
    safeInsights,
    visibleInsights,
    highPriority,
    mediumPriority,
  ]);

  if (loading) {
    return <div className="ai-insights-loading">Loading insights…</div>;
  }

  // If no visible insights, log why and return null
  if (!visibleInsights.length) {
    if (DEBUG_AI_INSIGHTS) {
      console.groupCollapsed("🧠 [AiInsightsPanel] NOT RENDERING (no visible insights)");
      console.log("businessId:", businessId);
      console.log("insights.length:", safeInsights.length);
      console.log("dismissedInsights:", dismissedInsights);
      console.log("visibleInsights:", visibleInsights);

      if (!safeInsights.length) {
        console.warn("Backend returned [] OR parent didn't pass insights.");
      } else {
        console.warn("All insights were dismissed locally OR missing id fields.");
      }
      console.groupEnd();
    }
    return null;
  }

  /* =========================
     Dismiss Insight (UI + DB)
  ========================= */
  const handleDismiss = async (insight) => {
    const id = insight?.id;

    if (DEBUG_AI_INSIGHTS) {
      console.groupCollapsed("🧠 [AiInsightsPanel] dismiss");
      console.log("insight:", insight);
      console.log("businessId:", businessId);
      console.log("dismiss id:", id);
      console.groupEnd();
    }

    if (!id) return;

    setDismissedInsights((prev) => (prev.includes(id) ? prev : [...prev, id]));

    try {
      const payload = {
        businessId,
        insightId: id,
        stateHash: insight?.meta?.stateHash || null,
      };

      if (DEBUG_AI_INSIGHTS) {
        console.log("🛰️ POST /api/ai/insights/dismiss payload:", payload);
      }

      const res = await fetch("/api/ai/insights/dismiss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (DEBUG_AI_INSIGHTS) {
        console.log("dismiss response status:", res.status);
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Dismiss failed:", res.status, txt);
      }
    } catch (err) {
      console.error("Failed to dismiss insight", err);
    }
  };

  /* =========================
     CTA Handler
  ========================= */
  const handleAction = (insight) => {
    if (DEBUG_AI_INSIGHTS) {
      console.groupCollapsed("🧠 [AiInsightsPanel] action click");
      console.log("insight:", insight);
      console.log("businessId:", businessId);
      console.groupEnd();
    }

    // Every CTA = dismiss (same as ✕)
    handleDismiss(insight);

    // Generic CTA
    if (insight?.cta?.action === "navigate") {
      if (DEBUG_AI_INSIGHTS) console.log("navigate (generic):", insight.cta.target);
      navigate(insight.cta.target);
      return;
    }

    // 🔴 Follow-up: business sent last, client didn’t reply
    if (insight?.id === "followup_needed" && insight?.meta?.conversations?.length) {
      const threadId = insight.meta.conversations[0];
      if (DEBUG_AI_INSIGHTS) console.log("navigate followup_needed threadId:", threadId);

      navigate(`/business/${businessId}/dashboard/messages`, {
        state: { threadId },
      });
      return;
    }

    // 🔴 Client waiting for reply: client sent last, business didn’t reply
    if (
      insight?.id === "unanswered_client_messages" &&
      insight?.meta?.conversations?.length
    ) {
      const threadId = insight.meta.conversations[0];
      if (DEBUG_AI_INSIGHTS)
        console.log("navigate unanswered_client_messages threadId:", threadId);

      navigate(`/business/${businessId}/dashboard/messages`, {
        state: { threadId },
      });
      return;
    }

    // 🟠 Clients without appointments
    if (insight?.id === "clients_without_appointments") {
      if (DEBUG_AI_INSIGHTS)
        console.log("navigate clients_without_appointments → crm/appointments");

      navigate(`/business/${businessId}/dashboard/crm/appointments`);
      return;
    }

    // 🟣 Empty calendar → Work Hours
if (insight?.id === "missing_work_hours") {
  if (DEBUG_AI_INSIGHTS) {
    console.log(
      "navigate missing_work_hours → crm/work-hours",
      businessId
    );
  }

  navigate(`/business/${businessId}/dashboard/crm/work-hours`);
  return;
}


    if (DEBUG_AI_INSIGHTS) {
      console.warn("No action handler matched for insight:", insight?.id);
    }
  };

  return (
    <section className="ai-insights-panel">
      {/* Header */}
      <div className="ai-insights-header">
        <h3>AI Insights ✨</h3>
        <p>Personalized suggestions to improve your business</p>

        {/* Debug strip (visible only in console, but also can show on UI if needed) */}
        {DEBUG_AI_INSIGHTS && (
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
            Debug: {safeInsights.length} total • {visibleInsights.length} visible •{" "}
            {dismissedInsights.length} dismissed
          </div>
        )}
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
   Insight Card
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
          <button className="action-btn" onClick={() => onAction(insight)}>
            {insight.actionLabel || insight.cta?.label}
          </button>
        )}
      </div>
    </div>
  );
}
