// src/components/DashboardLive.jsx
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import DashboardCards from "./DashboardCards";

export default function DashboardLive({ businessId }) {
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
    if (!businessId) {
      console.warn("⚠️ Missing businessId for DashboardLive");
      return;
    }

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { role: "business-dashboard", businessId },  // לא שולחים token ידנית
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true, // חובה! כדי לשלוח cookie אוטומטית
    });

    socket.on("connect", () => {
      console.log("🟢 Socket.IO connected:", socket.id);
    });

    socket.on("dashboardUpdate", (data) => {
      console.log("📨 dashboardUpdate received:", data);
      setStats(data);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket.IO disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("⚠️ Socket.IO connection error:", err.message);
    });

    return () => {
      console.log("🔌 Disconnecting Socket.IO");
      socket.disconnect();
    };
  }, [businessId]);

  return <DashboardCards stats={stats} />;
}
