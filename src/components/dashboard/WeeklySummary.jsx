// src/components/dashboard/WeeklySummary.js
import React from "react";

const WeeklySummary = ({ stats }) => {
  if (!stats) return null;

  // נתונים נוכחיים
  const currentOrders = stats.orders_count || 0;
  const currentViews = stats.views_count || 0;
  const currentRequests = stats.requests_count || 0;
  const currentReviews = stats.reviews_count || 0;

  // נתוני שבוע שעבר (אם קיימים)
  const lastOrders = stats.orders_last_week || 0;
  const lastViews = stats.views_last_week || 0;
  const lastRequests = stats.requests_last_week || 0;
  const lastReviews = stats.reviews_last_week || 0;

  // חישוב שינוי באחוזים
  const getChange = (current, last) => {
    if (!last) return current > 0 ? "+100%" : "0%";
    const diff = current - last;
    const percent = Math.round((diff / last) * 100);
    return (percent >= 0 ? "+" : "") + percent + "%";
  };

  return (
    <div className="graph-box">
      <h4>סיכום שבועי חכם 📅</h4>
      <ul style={{ listStyle: "none", padding: 0, textAlign: "right" }}>
        <li>✅ הזמנות: {currentOrders} ({getChange(currentOrders, lastOrders)})</li>
        <li>📩 פניות: {currentRequests} ({getChange(currentRequests, lastRequests)})</li>
        <li>👀 צפיות בפרופיל: {currentViews} ({getChange(currentViews, lastViews)})</li>
        <li>⭐ ביקורות חדשות: {currentReviews} ({getChange(currentReviews, lastReviews)})</li>
      </ul>
    </div>
  );
};

export default WeeklySummary;
