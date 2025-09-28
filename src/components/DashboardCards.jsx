import React, { useEffect } from "react";
import "../styles/dashboard.css";

const DashboardCards = React.memo(({ stats = {} }) => {
  // console.log ניתן להסיר או להוסיף לבדיקה בסביבת פיתוח בלבד
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("DashboardCards received stats:", stats);
    }
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
    <div className="dashboard-cards-container" role="list">
      {cards.map((card, index) => (
        <div
          key={index}
          className="dashboard-card"
          style={{ backgroundColor: card.bgColor}}
          role="listitem"
          aria-label={`${card.label}: ${card.value}`}
        >
          <div className="card-icon" aria-hidden="true">{card.icon}</div>
          <div className="card-title">{card.label}</div>
          <div className="card-value">{card.value}</div>
        </div>
      ))}
    </div>
  );
});

export default DashboardCards;
