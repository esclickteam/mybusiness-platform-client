import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

const LineChartComponent = ({ stats }) => {
  if (
    !stats ||
    !Array.isArray(stats.weekly_labels) ||
    !Array.isArray(stats.weekly_views) ||
    !Array.isArray(stats.weekly_requests) ||
    !Array.isArray(stats.weekly_orders) ||
    stats.weekly_labels.length === 0
  ) {
    return (
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <h3>📈 פעילות בשבוע האחרון</h3>
        <p>אין נתונים להצגה</p>
      </div>
    );
  }

  const data = stats.weekly_labels.map((label, index) => ({
    name: label,
    views: stats.weekly_views[index] || 0,
    requests: stats.weekly_requests[index] || 0,
    orders: stats.weekly_orders[index] || 0,
  }));

  return (
    <div className="chart-container" style={{ marginTop: 30 }}>
      <h3 style={{ textAlign: "center" }}>📈 פעילות בשבוע האחרון</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#6a5acd"
            strokeWidth={2}
            name="צפיות"
          />
          <Line
            type="monotone"
            dataKey="requests"
            stroke="#ffa07a"
            strokeWidth={2}
            name="פניות"
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#90ee90"
            strokeWidth={2}
            name="הזמנות"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const DashboardRealTime = ({ businessId, token, refreshToken }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      path: "/socket.io",
      auth: { token, refreshToken, role: "business-dashboard", businessId },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("dashboardUpdate", (newStats) => {
      console.log("Received dashboardUpdate:", newStats);
      setStats(newStats);
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [businessId, token, refreshToken]);

  return <LineChartComponent stats={stats} />;
};

export default DashboardRealTime;
