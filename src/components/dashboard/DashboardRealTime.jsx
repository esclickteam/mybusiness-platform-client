import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import LineChart from "./LineChart";  // שנה לנתיב שלך

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

const DashboardRealTime = ({ businessId, token }) => { // הסר את refreshToken מפרופס
  const [stats, setStats] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!businessId || !token) {
      console.warn("Missing businessId or token, socket not connected");
      return;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io(SOCKET_URL, {
      path: "/socket.io",
      auth: { token, role: "business-dashboard", businessId }, // ללא refreshToken
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
  }, [businessId, token]); // הסר refreshToken מהתלות

  return <LineChart stats={stats} />;
};

export default DashboardRealTime;
