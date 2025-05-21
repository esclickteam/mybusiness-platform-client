import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import DashboardCards from "./DashboardCards";

export default function DashboardLive({ businessId }) {
  const [stats, setStats] = useState({
    views_count: 0,
    requests_count: 0,
    orders_count: 0,
    reviews_count: 0,
    messages_count: 0,
    upcoming_appointments: 0,
  });

  useEffect(() => {
    if (!businessId) return;

    const socket = io("https://api.esclick.co.il", {
      query: { businessId }
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      // אפשר לבקש סטטיסטיקות אם תרצה:
      socket.emit("getDashboardStats", null, (response) => {
        if (response.ok) setStats(response.stats);
        else console.error("Failed to get stats:", response.error);
      });
    });

    socket.on("dashboardUpdate", (newStats) => {
      console.log("📊 Dashboard update:", newStats);
      setStats(newStats);
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [businessId]);

  return <DashboardCards stats={stats} />;
}
