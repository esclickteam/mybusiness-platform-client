import React, { useEffect } from "react";
import "../styles/dashboard.css";

const DashboardCards = ({ stats = {} }) => {
  useEffect(() => {
    console.log("DashboardCards received stats:", stats);
  }, [stats]);

  const cards = [
    {
      label: "צפיות בפרופיל",
      value: stats.views_count ?? 0,
      icon: "👁️",
      bgColor: "#f0ebff",
    },
    {
      label: "ביקורות",
      value: stats.reviews_count ?? 0,
      icon: "⭐",
      bgColor: "#fff7d6",
    },
    {
      label: "פגישות",
      value: stats.appointments_count ?? 0,
      icon: "📅",
      bgColor: "#f9f0f7",
    },
  ];

  return (
    <div className="dashboard-cards-container">
      {cards.map((card, index) => (
        <div
          key={index}
          className="dashboard-card"
          style={{ backgroundColor: card.bgColor, border: "1px solid red" }}
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
