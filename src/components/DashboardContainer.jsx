// src/components/DashboardLive.jsx
import React, { useEffect, useState, useRef } from "react";
import DashboardCards from "./DashboardCards";
import { useAuth } from "../context/AuthContext";
import { createSocket } from "../socket";
import { ensureValidToken, getBusinessId } from "../utils/authHelpers";


export default function DashboardLive() {
  const { initialized, refreshToken } = useAuth();
  const businessId = getBusinessId();
  const socketRef = useRef(null);

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
    if (!initialized || !businessId) return;
    let sock;

    (async () => {
      try {
        const token = await ensureValidToken(refreshToken);

        sock = createSocket();
        sock.auth = { token, role: "business-dashboard", businessId };
        sock.connect();
        socketRef.current = sock;

        // initial fetch
        sock.emit("getDashboardStats", { businessId }, (res) => {
          if (res.ok) setStats(res.stats);
        });

        const handler = (newStats) => {
          setStats((prev) => ({ ...prev, ...newStats }));
        };
        sock.on("dashboardUpdate", handler);
        sock.on("dashboardStatsUpdate", handler);
      } catch (e) {
        console.error("Dashboard socket init failed:", e);
      }
    })();

    return () => {
      if (socketRef.current) {
        socketRef.current.off("dashboardUpdate");
        socketRef.current.off("dashboardStatsUpdate");
        socketRef.current.disconnect();
      }
    };
  }, [initialized, businessId, refreshToken]);

  return <DashboardCards stats={stats} />;
}
