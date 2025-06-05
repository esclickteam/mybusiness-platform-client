import React, { useEffect } from "react";
import "../styles/dashboard.css";

const DashboardCards = ({ stats = {} }) => {
  useEffect(() => {
    console.log("DashboardCards received stats:", stats);
    console.log("Stats keys:", Object.keys(stats));
  }, [stats]);

  const cards = [
    {
      label: "צפיות בפרופיל",
      value: stats.views_count ?? 0,
      icon: "👁️",
      bgColor: "#f0ebff",
    },
    {
      label: "ביקורות חיוביות",
      value: stats.reviews_count ?? 0,
      icon: "⭐",
      bgColor: "#fff7d6",
    },
    {
      label: "הודעות מלקוחות",
      value: stats.messages_count ?? 0,
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
          style={{ backgroundColor: card.bgColor, border: "1px solid red" }} // להדגשה וויזואלית
        >
          <div className="card-icon">{card.icon}</div>
          <div className="card-title">{card.label}</div>
          <div className="card-value">{JSON.stringify(card.value)}</div> {/* להציג גם אם 0 */}
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
