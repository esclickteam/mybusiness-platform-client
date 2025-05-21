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
    appointments_count: 0,
    open_leads_count: 0,
  });

  useEffect(() => {
    if (!businessId) return;

    // צור חיבור עם token לאימות
    const socket = io(process.env.REACT_APP_SOCKET_URL || "https://api.esclick.co.il", {
      path: "/socket.io",
      auth: {
        token: localStorage.getItem("token")  // וודא שהטוקן נשמר ב-localStorage
      },
      query: { businessId },
    });

    // דיאגנוסטיקה
    console.log("🛰️ Connecting socket for businessId:", businessId);

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);

      // בקשה ראשונית לסטטיסטיקות
      socket.emit("getDashboardStats", null, ({ ok, stats: initial }) => {
        console.log("🔄 Initial getDashboardStats response:", { ok, initial });
        if (ok && initial) {
          setStats(initial);
        }
      });
    });

    socket.on("dashboardUpdate", newStats => {
      console.log("📊 Dashboard update:", newStats);
      setStats(newStats);
    });

    socket.on("disconnect", reason => {
      console.log("⚠️ Socket disconnected:", reason);
    });

    socket.on("connect_error", err => {
      console.error("🚨 Socket connect_error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [businessId]);

  return <DashboardCards stats={stats} />;
}
