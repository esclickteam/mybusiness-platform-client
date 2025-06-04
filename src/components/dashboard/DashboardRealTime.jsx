import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import LineChartComponent from "./LineChartComponent";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

const DashboardRealTime = ({ businessId, token, refreshToken }) => {
  const [stats, setStats] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!businessId || !token) {
      console.warn("Missing businessId or token, socket not connected");
      return;
    }

    if (socketRef.current) {
      // אם כבר קיים חיבור, ננתק קודם
      socketRef.current.disconnect();
    }

    const socket = io(SOCKET_URL, {
      path: "/socket.io",
      auth: { token, refreshToken, role: "business-dashboard", businessId },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("dashboardUpdate", (newStats) => {
      if (
        newStats &&
        Array.isArray(newStats.weekly_labels) &&
        newStats.weekly_labels.length > 0
      ) {
        console.log("Received dashboardUpdate:", newStats);
        setStats(newStats);
      } else {
        console.warn("Ignoring invalid dashboard update:", newStats);
      }
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [businessId, token, refreshToken]);

  return <LineChartComponent stats={stats} />;
};

export default DashboardRealTime;
