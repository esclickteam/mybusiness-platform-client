import React from "react";
import "../styles/dashboard.css";

const DashboardCards = ({ stats }) => {
  const cards = [
    {
      label: "צפיות בפרופיל",
      value: stats?.views_count || 0,
      icon: "👁️",
      bgColor: "#f0ebff",
    },
    {
      label: "בקשות שירות",
      value: stats?.requests_count || 0,
      icon: "📩",
      bgColor: "#ffeef0",
    },
    {
      label: "הזמנות שבוצעו",
      value: stats?.orders_count || 0,
      icon: "🛒",
      bgColor: "#e0f8ec",
    },
    {
      label: "ביקורות חיוביות",
      value: stats?.reviews_count || 0,
      icon: "⭐",
      bgColor: "#fff7d6",
    },
    {
      label: "הודעות מלקוחות",
      value: stats?.messages_count || 0,
      icon: "💬",
      bgColor: "#e6f7ff",
    },
    {
      label: "פגישות עתידיות",
      value: stats?.upcoming_appointments || 0,
      icon: "📅",
      bgColor: "#fcefe3",
    },
  ];

  return (
    <div className="dashboard-cards-container">
      {cards.map((card, index) => (
        <div
          key={index}
          className="dashboard-card"
          style={{ backgroundColor: card.bgColor }}
        >
          <div className="card-icon">{card.icon}</div>
          <div className="card-title">{card.label}</div>
          <div className="card-value">{card.value}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
