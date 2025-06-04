import React from "react";

const WeeklySummary = ({ stats }) => {
  if (!stats) return null;

  // נתונים נוכחיים
  const currentMessages = stats.messages_count || 0;
  const currentViews = stats.views_count || 0;
  const currentReviews = stats.reviews_count || 0;

  // נתוני שבוע שעבר (אם קיימים)
  const lastMessages = stats.messages_last_week || 0;
  const lastViews = stats.views_last_week || 0;
  const lastReviews = stats.reviews_last_week || 0;

  // חישוב שינוי באחוזים
  const getChange = (current, last) => {
    if (!last) return current > 0 ? "+100%" : "0%";
    const diff = current - last;
    const percent = Math.round((diff / last) * 100);
    return (percent >= 0 ? "+" : "") + percent + "%";
  };

  return (
    <div>
      <h4 style={{ textAlign: "center", marginBottom: 16 }}>סיכום שבועי חכם 📅</h4>
      <div style={{ display: "flex", justifyContent: "space-around", gap: 16, textAlign: "center" }}>
        <div style={{ backgroundColor: "#D6E8FF", padding: 20, borderRadius: 12, flex: 1 }}>
          <div style={{ fontSize: 14, marginBottom: 8 }}>💬 הודעות מלקוחות</div>
          <div style={{ fontSize: 24, fontWeight: "bold" }}>{currentMessages}</div>
          <div style={{ fontSize: 12, color: "#555" }}>{getChange(currentMessages, lastMessages)}</div>
        </div>

        <div style={{ backgroundColor: "#FFF7CC", padding: 20, borderRadius: 12, flex: 1 }}>
          <div style={{ fontSize: 14, marginBottom: 8 }}>⭐ ביקורות חיוביות</div>
          <div style={{ fontSize: 24, fontWeight: "bold" }}>{currentReviews}</div>
          <div style={{ fontSize: 12, color: "#555" }}>{getChange(currentReviews, lastReviews)}</div>
        </div>

        <div style={{ backgroundColor: "#E6E0FF", padding: 20, borderRadius: 12, flex: 1 }}>
          <div style={{ fontSize: 14, marginBottom: 8 }}>👀 צפיות בפרופיל</div>
          <div style={{ fontSize: 24, fontWeight: "bold" }}>{currentViews}</div>
          <div style={{ fontSize: 12, color: "#555" }}>{getChange(currentViews, lastViews)}</div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;
