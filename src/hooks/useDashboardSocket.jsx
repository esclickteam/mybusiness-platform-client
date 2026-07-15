import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.bizuply.com";

export default function useDashboardSocket({ token, businessId, refreshAccessToken, logout }) {
  const [stats, setStats] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || !businessId) return;

    console.log("🔗 Creating socket connection...");

    socketRef.current = io(SOCKET_URL, {
      path: "/socket.io",
      auth: {
        token,
        role: "business-dashboard",
        businessId,
      },
      transports: ["websocket"],
    });

    socketRef.current.on("dashboardUpdate", (newStats) => {
      console.log("📡 dashboardUpdate received:", newStats);
      setStats(prevStats =>
        prevStats ? { ...prevStats, ...newStats } : newStats
      );
    });

    socketRef.current.on("connect", () => {
      console.log("🔌 Connected to dashboard socket:", socketRef.current.id);
    });

    socketRef.current.on("tokenExpired", async () => {
      console.log("🚨 Token expired. Refreshing...");
      if (!refreshAccessToken) {
        console.error("No refreshAccessToken function provided");
        return;
      }
      const newToken = await refreshAccessToken({ force: true });
      if (!newToken) {
        if (logout) logout();
        return;
      }
      socketRef.current.auth.token = newToken;
      // במקום disconnect/connect, משתמשים ב-emit authenticate
      socketRef.current.emit("authenticate", { token: newToken }, (ack) => {
        if (!ack?.ok) {
          console.warn("❌ Authentication failed after token refresh");
          if (logout) logout();
        } else {
          console.log("✅ Authentication succeeded after token refresh");
        }
      });
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
  }, [token, businessId, refreshAccessToken, logout]);

  return stats;
}
