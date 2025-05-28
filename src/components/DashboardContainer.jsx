// src/components/DashboardLive.jsx
import React, { useEffect, useState, useContext } from "react";
import DashboardCards from "./DashboardCards";
import { SocketContext } from "../context/socketContext";

export default function DashboardLive({ businessId }) {
  const socket = useContext(SocketContext);
  const [stats, setStats] = useState({
    views_count: 0,
    requests_count: 0,
    orders_count: 0,
    reviews_count: 0,
    messages_count: 0,
    appointments_count: 0,
    open_leads_count: 0,
  });

  useEffect(() => {
    if (!businessId || !socket) {
      console.warn("⚠️ Missing businessId or socket for DashboardLive");
      return;
    }

    // Handler לעדכונים בזמן אמת
    const statsHandler = (newStats) => {
      setStats((prev) => ({ ...prev, ...newStats }));
    };

    // הירשם לאירוע העדכון
    socket.on("dashboardStatsUpdate", statsHandler);

    // בקש את המצב ההתחלתי
    socket.emit("getDashboardStats", { businessId });

    return () => {
      socket.off("dashboardStatsUpdate", statsHandler);
    };
  }, [businessId, socket]);

  return <DashboardCards stats={stats} />;
}
