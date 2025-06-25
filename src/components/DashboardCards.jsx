import React, { useEffect, useState, useRef } from "react";
import "../styles/dashboard.css";
import { createSocket } from "../../../socket"; // עדכן לפי הנתיב אצלך

const DashboardCards = ({ businessId, refreshAccessToken }) => {
  const [stats, setStats] = useState({
    views_count: 0,
    reviews_count: 0,
    appointments_count: 0,
  });
  const socketRef = useRef(null);

  useEffect(() => {
    async function setupSocket() {
      const token = await refreshAccessToken();
      if (!token) return;

      const sock = await createSocket(refreshAccessToken, null, businessId);
      socketRef.current = sock;

      sock.on("connect", () => console.log("Socket connected:", sock.id));

      sock.on("reviewCreated", (reviewNotification) => {
        setStats((prev) => ({
          ...prev,
          reviews_count: (prev.reviews_count ?? 0) + 1,
        }));
      });

      sock.on("allReviewsUpdated", (allReviews) => {
        setStats((prev) => ({
          ...prev,
          reviews_count: allReviews.length,
        }));
      });

      sock.on("dashboardUpdate", (newStats) => {
        setStats((prev) => ({
          ...prev,
          views_count: newStats.views_count ?? prev.views_count,
          reviews_count: newStats.reviews_count ?? prev.reviews_count,
          appointments_count: newStats.appointments_count ?? prev.appointments_count,
        }));
      });

      // בקשה התחלתית לסטטיסטיקות
      sock.emit("getDashboardStats", null, (res) => {
        if (res?.ok && res.stats) {
          setStats({
            views_count: res.stats.views_count ?? 0,
            reviews_count: res.stats.reviews_count ?? 0,
            appointments_count: res.stats.appointments_count ?? 0,
          });
        }
      });

      return () => {
        sock.disconnect();
      };
    }

    if (businessId && refreshAccessToken) {
      setupSocket();
    }
  }, [businessId, refreshAccessToken]);

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
