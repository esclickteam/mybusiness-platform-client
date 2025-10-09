import React from "react";
import "./Insights.css"; // Recommended to keep styles separate (or use dashboard.css)

const Insights = ({ stats }) => {
  if (!stats) return null;

  const viewsThisWeek = stats?.views_count || 0;
  const viewsLastWeek = stats?.views_last_week || 0;
  const viewsDiff = viewsThisWeek - viewsLastWeek;
  const viewsPercent =
    viewsLastWeek > 0
      ? Math.round((viewsDiff / viewsLastWeek) * 100)
      : viewsThisWeek > 0
      ? 100
      : 0;

  const upcoming = stats?.upcoming_appointments || 0;

  const changeColor = (diff) => {
    if (diff === 0) return "gray";
    return diff > 0 ? "green" : "red";
  };

  const changeIcon = (diff) => {
    if (diff === 0) return "➖";
    return diff > 0 ? "⬆️" : "⬇️";
  };

  return (
    <div className="insights-section">
      {/* Profile Views Section */}
      <div
        className="views-change"
        style={{ color: changeColor(viewsDiff) }}
        title="Change in profile views compared to last week"
      >
        {changeIcon(viewsDiff)} Change in profile views:{" "}
        {viewsDiff === 0
          ? "No change"
          : viewsDiff > 0
          ? `Up by ${viewsPercent}%`
          : `Down by ${Math.abs(viewsPercent)}%`}{" "}
        ({viewsThisWeek} this week, {viewsLastWeek} last week)
      </div>

      {/* Upcoming Appointments Section */}
      <div
        className={`appointments-info ${
          upcoming > 0 ? "success" : "danger"
        }`}
      >
        📆{" "}
        {upcoming > 0
          ? `You have ${upcoming} scheduled appointment${
              upcoming > 1 ? "s" : ""
            } this week`
          : "No appointments scheduled this week"}
      </div>
    </div>
  );
};

export default Insights;
