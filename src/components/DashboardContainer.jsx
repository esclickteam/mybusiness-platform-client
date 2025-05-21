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
    if (!businessId) return;

    // קבלת ה־URL מ־.env (Vite)
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
    console.log("🛰️ FRONTEND SOCKET_URL =", SOCKET_URL);
    console.log("🔑 Token in localStorage:", localStorage.getItem("token"));

    // להתחבר ל־Socket.IO
    const socket = io(SOCKET_URL, {
      path: "/socket.io",
      auth: { token: localStorage.getItem("token") },
      query: { businessId, role: "business-dashboard" },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("getDashboardStats", null, ({ ok, stats: initial }) => {
        console.log("🔄 Initial stats response:", { ok, initial });
        if (ok && initial) setStats(initial);
      });
    });

    socket.on("dashboardUpdate", updatedStats => {
      console.log("📊 Dashboard update:", updatedStats);
      setStats(updatedStats);
    });

    socket.on("disconnect", reason => {
      console.log("⚠️ Socket disconnected:", reason);
    });

    socket.on("connect_error", err => {
      console.error("🚨 connect_error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [businessId]);

  return <DashboardCards stats={stats} />;
}
