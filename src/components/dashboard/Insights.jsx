import React from "react";
import "./Insights.css";

/* =========================
   Small SVG Icons
========================= */

const ArrowUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5l6 6H6l6-6z"
      fill="currentColor"
    />
  </svg>
);

const ArrowDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 19l-6-6h12l-6 6z"
      fill="currentColor"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/* =========================
   Component
========================= */

const Insights = ({ stats }) => {
  if (!stats) return null;

  const viewsThisWeek = stats.views_count || 0;
  const viewsLastWeek = stats.views_last_week || 0;
  const upcoming = stats.upcoming_appointments || 0;

  const diff = viewsThisWeek - viewsLastWeek;
  const percent =
    viewsLastWeek > 0
      ? Math.round((diff / viewsLastWeek) * 100)
      : viewsThisWeek > 0
      ? 100
      : 0;

  const trend =
    diff === 0 ? "neutral" : diff > 0 ? "positive" : "negative";

  return (
    <section className="insights-section" aria-label="Business insights">
      {/* ===== Profile Views Insight ===== */}
      <div className={`insight-card ${trend}`}>
        <div className="insight-header">
          <span className="insight-title">Profile Views</span>

          {trend === "positive" && (
            <span className="insight-trend positive">
              <ArrowUp /> +{percent}%
            </span>
          )}

          {trend === "negative" && (
            <span className="insight-trend negative">
              <ArrowDown /> {percent}%
            </span>
          )}

          {trend === "neutral" && (
            <span className="insight-trend neutral">No change</span>
          )}
        </div>

        <p className="insight-text">
          {trend === "positive" &&
            `Great! Your profile was viewed more this week (${viewsThisWeek}) compared to last week (${viewsLastWeek}).`}
          {trend === "negative" &&
            `Your profile views dropped compared to last week. Consider refreshing your profile or promoting availability.`}
          {trend === "neutral" &&
            `Your profile views stayed the same this week (${viewsThisWeek}).`}
        </p>
      </div>

      {/* ===== Appointments Insight ===== */}
      <div
        className={`insight-card ${
          upcoming > 0 ? "positive" : "negative"
        }`}
      >
        <div className="insight-header">
          <span className="insight-title">
            <CalendarIcon /> Appointments
          </span>
        </div>

        <p className="insight-text">
          {upcoming > 0
            ? `You have ${upcoming} scheduled appointment${
                upcoming > 1 ? "s" : ""
              } this week.`
            : "No appointments scheduled this week. You may want to offer open slots or a limited promotion."}
        </p>
      </div>
    </section>
  );
};

export default Insights;
