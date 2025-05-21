// src/hooks/useDashboardSocket.jsx
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export default function useDashboardSocket({ token, businessId }) {
  const [stats, setStats] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || !businessId) return;

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || "/", {
      path: "/socket.io",
      auth: { token, role: "business-dashboard", businessId },
      transports: ["websocket"],
    });

    socketRef.current.on("dashboardUpdate", (newStats) => {
      console.log("📡 dashboardUpdate received:", newStats);
      setStats(prev =>
        prev
          ? { ...prev, ...newStats }
          : newStats
      );
    });

    socketRef.current.on("connect", () => {
      console.log("🔌 Connected to dashboard socket:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Dashboard socket connection error:", err.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🔌 Disconnected dashboard socket");
      }
    };
  }, [token, businessId]);

  return stats;
}