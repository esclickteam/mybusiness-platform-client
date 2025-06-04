import React from "react";
import "../styles/dashboard.css";

const DashboardCards = ({ stats }) => {
  const cards = [
    {
      label: "צפיות בפרופיל",
      value: stats.views_count,
      icon: "👁️",
      bgColor: "#f0ebff",
    },
    {
      label: "ביקורות חיוביות",
      value: stats.reviews_count,
      icon: "⭐",
      bgColor: "#fff7d6",
    },
    {
      label: "הודעות מלקוחות",
      value: stats.messages_count,
      icon: "💬",
      bgColor: "#e6f7ff",
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
