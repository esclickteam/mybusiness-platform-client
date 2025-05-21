// src/components/DashboardLive.jsx
import React, { useEffect, useState, useRef } from "react";
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

  const socketRef = useRef(null);

  useEffect(() => {
    if (!businessId) {
      console.warn("⚠️ No businessId provided to DashboardLive");
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

    console.log("🛰️ FRONTEND SOCKET_URL =", SOCKET_URL);
    console.log("🔑 Token =", token);

    const socket = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token },
      query: { businessId, role: "business-dashboard" },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);

      socket.emit("getDashboardStats", null, ({ ok, stats: initial }) => {
        console.log("🔄 Initial stats response:", { ok, initial });
        if (ok && initial) {
          setStats(initial);
        }
      });
    });

    socket.on("dashboardUpdate", (updatedStats) => {
      console.log("📊 Dashboard update:", updatedStats);
      setStats(updatedStats);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("🚨 Socket connect error:", err.message);
    });

    return () => {
      console.log("🔌 Cleaning up socket connection");
      socket.disconnect();
    };
  }, [businessId]);

  return <DashboardCards stats={stats} />;
}
