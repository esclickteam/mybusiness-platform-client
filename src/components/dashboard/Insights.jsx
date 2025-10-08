import React from "react";

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
    <div
      style={{
        direction: "ltr",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        fontSize: "1.05rem",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Profile Views Section */}
      <div
        title="Change in profile views compared to last week"
        style={{
          color: changeColor(viewsDiff),
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          flexWrap: "wrap",
        }}
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
        style={{
          backgroundColor: upcoming > 0 ? "#d4edda" : "#f8d7da",
          padding: "10px 12px",
          borderRadius: "8px",
          color: upcoming > 0 ? "#155724" : "#721c24",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        📆{" "}
        {upcoming > 0
          ? `You have ${upcoming} scheduled appointment${
              upcoming > 1 ? "s" : ""
            } this week`
          : "No appointments scheduled this week"}
      </div>

      {/* Suggestion Message */}
      {!upcoming && (
        <div
          style={{
            marginTop: "5px",
            fontWeight: "400",
            fontSize: "0.9rem",
            color: "#555",
            paddingLeft: "6px",
          }}
        >
          
        </div>
      )}
    </div>
  );
};

export default Insights;
