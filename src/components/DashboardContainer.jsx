// src/components/DashboardLive.jsx
import React, { useEffect, useState } from "react";
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
      console.warn("⚠️ No businessId provided to DashboardLive");
      return;
    }

    console.log("🔥 VITE_SSE_URL =", import.meta.env.VITE_SSE_URL);

    const eventSource = new EventSource(
      `${import.meta.env.VITE_SSE_URL}/stream/${businessId}`,
      { withCredentials: true }
    );

    eventSource.addEventListener("statsUpdate", (e) => {
      try {
        const payload = JSON.parse(e.data);
        // payload.extra מכיל את הסטטיסטיקות העדכניות
        setStats(payload.extra);
      } catch (err) {
        console.error("Error parsing statsUpdate:", err);
      }
    });

    eventSource.onerror = (err) => {
      console.error("🚨 SSE error:", err);
      eventSource.close();
    };

    return () => {
      console.log("🔌 Closing SSE connection");
      eventSource.close();
    };
  }, [businessId]);

  return <DashboardCards stats={stats} />;
}
