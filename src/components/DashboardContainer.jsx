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
      console.warn("⚠️ Missing businessId for DashboardLive");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ Missing auth token");
      return;
    }

    const url = `${process.env.REACT_APP_API_URL}/sse/dashboard-stats/${businessId}?token=${encodeURIComponent(token)}`;
    const evtSource = new EventSource(url);

    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📨 SSE dashboardUpdate received:", data);
        setStats(data);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    evtSource.onerror = (err) => {
      console.error("⚠️ SSE error:", err);
      // לא סוגר כאן מיד, אפשר לנסות reconnect אוטומטי
    };

    return () => {
      console.log("🔌 Closing SSE connection");
      evtSource.close();
    };
  }, [businessId]);

  return <DashboardCards stats={stats} />;
}
