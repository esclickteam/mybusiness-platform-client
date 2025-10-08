import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import LineChart from "./LineChart";  // שנה לנתיב שלך
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

const DashboardRealTime = ({ businessId }) => {
  const { refreshAccessToken, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!businessId) {
      console.warn("Missing businessId, socket not connected");
      return;
    }

    let isMounted = true;

    async function setupSocket() {
      const token = await refreshAccessToken();
      if (!token) {
        console.warn("No valid token, logging out");
        logout();
        return;
      }

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      const socket = io(SOCKET_URL, {
        path: "/socket.io",
        auth: { token, role: "business-dashboard", businessId },
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
          if (isMounted) {
            console.log("Received dashboardUpdate:", newStats);
            setStats(newStats);
          }
        } else {
          console.warn("Ignoring invalid dashboard update:", newStats);
        }
      });

      socket.on("disconnect", () => {
        console.log("WebSocket disconnected");
      });

      socket.on("tokenExpired", async () => {
        console.log("Token expired, refreshing token...");
        const newToken = await refreshAccessToken();
        if (!newToken) {
          logout();
          return;
        }
        socket.auth.token = newToken;
        socket.emit("authenticate", { token: newToken }, (ack) => {
          if (!ack?.ok) {
            console.warn("Authentication failed after token refresh");
            logout();
          } else {
            console.log("Authentication succeeded after token refresh");
          }
        });
      });

      socket.on("connect_error", (err) => {
        console.error("Connection error:", err.message);
      });
    }

    setupSocket();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [businessId, refreshAccessToken, logout]);

  return <LineChart stats={stats} />;
};

export default DashboardRealTime;
