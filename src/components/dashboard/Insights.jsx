import React from "react";

const Insights = ({ stats }) => {
  if (!stats) return null;

  const viewsThisWeek = stats?.views_count || 0;
  const viewsLastWeek = stats?.views_last_week || 0;
  const viewsDiff = viewsThisWeek - viewsLastWeek;
  const viewsPercent =
    viewsLastWeek > 0 ? Math.round((viewsDiff / viewsLastWeek) * 100) : viewsThisWeek > 0 ? 100 : 0;

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
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", fontSize: "1.1rem" }}>
      <div
        title="שינוי בצפיות לעומת שבוע שעבר"
        style={{
          color: changeColor(viewsDiff),
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {changeIcon(viewsDiff)} שינוי בצפיות:{" "}
        {viewsDiff === 0
          ? "אין שינוי"
          : viewsDiff > 0
          ? `עלייה של ${viewsPercent}%`
          : `ירידה של ${Math.abs(viewsPercent)}%`}{" "}
        ({viewsThisWeek} צפיות השבוע, {viewsLastWeek} צפיות בשבוע שעבר)
      </div>

      <div
        style={{
          backgroundColor: upcoming > 0 ? "#d4edda" : "#f8d7da",
          padding: "10px",
          borderRadius: "5px",
          color: upcoming > 0 ? "green" : "red",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        📆 {upcoming > 0 ? `יש ${upcoming} פגישות מתוכננות השבוע` : "אין פגישות מתוכננות השבוע"}
      </div>

      {!upcoming && (
        <div
          style={{
            marginTop: "5px",
            fontWeight: "normal",
            fontSize: "0.9rem",
            color: "#555",
            paddingLeft: "5px",
          }}
        >
          מומלץ לתזמן פגישות לשיפור הפעילות
        </div>
      )}
    </div>
  );
};

export default Insights;
