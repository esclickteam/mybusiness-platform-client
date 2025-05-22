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

    let evtSource;
    let reconnectTimeout;

    function connect() {
      const url = `${process.env.REACT_APP_API_URL}/sse/dashboard-stats/${businessId}?token=${encodeURIComponent(token)}`;
      evtSource = new EventSource(url);

      evtSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setStats(data);
        } catch (error) {
          console.error("Error parsing SSE data:", error);
        }
      };

      evtSource.onerror = (err) => {
        console.error("⚠️ SSE error, reconnecting in 3 seconds", err);
        evtSource.close();
        reconnectTimeout = setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      if (evtSource) evtSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      console.log("🔌 SSE connection closed");
    };
  }, [businessId]);

  return <DashboardCards stats={stats} />;
}
