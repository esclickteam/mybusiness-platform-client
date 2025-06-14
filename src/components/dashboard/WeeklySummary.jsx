import React from "react";

const WeeklySummary = ({ stats }) => {
  if (!stats) return null;

  // נתונים נוכחיים
  const currentReviews = stats.reviews_count || 0;
  const currentViews = stats.views_count || 0;
  const currentAppointments = stats.appointments_count || 0; // פגישות נוכחיות

  // נתוני שבוע שעבר (אם קיימים)
  const lastReviews = stats.reviews_last_week || 0;
  const lastViews = stats.views_last_week || 0;
  const lastAppointments = stats.appointments_last_week || 0; // פגישות שבוע שעבר

  // חישוב שינוי באחוזים
  const getChange = (current, last) => {
    if (!last) return current > 0 ? { text: "+100%", color: "green", arrow: "▲" } : { text: "0%", color: "gray", arrow: "" };
    const diff = current - last;
    const percent = Math.round((diff / last) * 100);
    if (percent > 0) return { text: `+${percent}%`, color: "green", arrow: "▲" };
    if (percent < 0) return { text: `${percent}%`, color: "red", arrow: "▼" };
    return { text: "0%", color: "gray", arrow: "" };
  };

  const reviewsChange = getChange(currentReviews, lastReviews);
  const viewsChange = getChange(currentViews, lastViews);
  const appointmentsChange = getChange(currentAppointments, lastAppointments);

  return (
    <div>
      <h4 style={{ textAlign: "center", marginBottom: 16 }}>סיכום שבועי חכם 📅</h4>
      <div style={{ display: "flex", justifyContent: "space-around", gap: 16, textAlign: "center" }}>
        <div style={{ backgroundColor: "#FFF7CC", padding: 20, borderRadius: 12, flex: 1 }}>
          <div style={{ fontSize: 14, marginBottom: 8 }}>⭐ ביקורות חיוביות</div>
          <div style={{ fontSize: 24, fontWeight: "bold" }}>{currentReviews}</div>
          <div style={{ fontSize: 12, color: reviewsChange.color }}>
            {reviewsChange.arrow} {reviewsChange.text}
          </div>
        </div>

        <div style={{ backgroundColor: "#E6E0FF", padding: 20, borderRadius: 12, flex: 1 }}>
          <div style={{ fontSize: 14, marginBottom: 8 }}>👀 צפיות בפרופיל</div>
          <div style={{ fontSize: 24, fontWeight: "bold" }}>{currentViews}</div>
          <div style={{ fontSize: 12, color: viewsChange.color }}>
            {viewsChange.arrow} {viewsChange.text}
          </div>
        </div>

        <div style={{ backgroundColor: "#F9F0F7", padding: 20, borderRadius: 12, flex: 1 }}>
          <div style={{ fontSize: 14, marginBottom: 8 }}>📅 פגישות</div>
          <div style={{ fontSize: 24, fontWeight: "bold" }}>{currentAppointments}</div>
          <div style={{ fontSize: 12, color: appointmentsChange.color }}>
            {appointmentsChange.arrow} {appointmentsChange.text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;
