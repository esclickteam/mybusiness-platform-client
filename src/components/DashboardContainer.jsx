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

    const evtSource = new EventSource(
      `${process.env.REACT_APP_API_URL}/sse/dashboard-stats/${businessId}`
    );

    evtSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📨 SSE dashboardUpdate received:", data);
      setStats(data);
    };

    evtSource.onerror = (err) => {
      console.error("⚠️ SSE error:", err);
      evtSource.close();
    };

    return () => {
      console.log("🔌 Closing SSE connection");
      evtSource.close();
    };
  }, [businessId]);

  return <DashboardCards stats={stats} />;
}
