// src/components/DashboardLive.jsx
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
    appointments_count: 0,   // <— תואם לשדה מהשרת
    open_leads_count: 0      // <— אם אתם משתמשים גם בלידים
  });

  useEffect(() => {
    if (!businessId) return;

    const socket = io(process.env.REACT_APP_SOCKET_URL || "https://api.esclick.co.il", {
      query: { businessId }
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("getDashboardStats", null, ({ ok, stats }) => {
        if (ok) {
          setStats(stats);
        } else {
          console.error("Failed to get stats:", stats);
        }
      });
    });

    socket.on("dashboardUpdate", newStats => {
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
