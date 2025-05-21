// src/components/DashboardCards.jsx
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "../styles/dashboard.css";

const DashboardCards = ({ businessId }) => {
  const [stats, setStats] = useState({
    views_count: 0,
    requests_count: 0,
    orders_count: 0,
    reviews_count: 0,
    messages_count: 0,
    appointments_count: 0,   // ← שינינו לשם תואם
  });

  useEffect(() => {
    if (!businessId) return;

    const socket = io("https://api.esclick.co.il", {
      query: { businessId },
    });

    // על כל עדכון מהשרת, נעדכן את הסטייט
    socket.on("dashboardUpdate", (newStats) => {
      setStats(newStats);
    });

    // בקשה ראשונית לנתונים (אופציונלי)
    socket.emit("getDashboardStats", null, (response) => {
      if (response.ok) {
        setStats(response.stats);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [businessId]);

  const cards = [
    {
      label: "צפיות בפרופיל",
      value: stats.views_count,
      icon: "👁️",
      bgColor: "#f0ebff",
    },
    {
      label: "בקשות שירות",
      value: stats.requests_count,
      icon: "📩",
      bgColor: "#ffeef0",
    },
    {
      label: "הזמנות שבוצעו",
      value: stats.orders_count,
      icon: "🛒",
      bgColor: "#e0f8ec",
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
    {
      label: "פגישות עתידיות",
      value: stats.appointments_count,  // ← תואם עכשיו
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
