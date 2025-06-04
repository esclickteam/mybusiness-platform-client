// src/context/DashboardSocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";
const DashboardSocketContext = createContext(null);

export function DashboardSocketProvider({ token, businessId, children }) {
  const [stats, setStats] = useState(null);
  const socketRef = useRef(null);
  const hasInitRef = useRef(false);

  useEffect(() => {
    if (!token || !businessId) return;
    if (hasInitRef.current) return;       // אם כבר התחברנו פעם – לא נתחבר שוב
    hasInitRef.current = true;

    console.log("🔗 [SocketProvider] אתחול חיבור Socket.IO...");
    socketRef.current = io(SOCKET_URL, {
      path: "/socket.io",
      auth: { token, role: "business-dashboard", businessId },
      transports: ["websocket"],
    });

    const handleUpdate = (newStats) => {
      setStats(prev => (prev ? { ...prev, ...newStats } : newStats));
    };
    socketRef.current.on("dashboardUpdate", handleUpdate);
    socketRef.current.on("connect", () => {
      console.log("🔌 [SocketProvider] מחובר עם ID:", socketRef.current.id);
    });
    socketRef.current.on("connect_error", err => {
      console.error("❌ [SocketProvider] שגיאת חיבור:", err.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("dashboardUpdate", handleUpdate);
        socketRef.current.disconnect();
        console.log("🔌 [SocketProvider] ניתוק ה־socket");
        socketRef.current = null;
      }
      // לא מאפסים את hasInitRef כדי שאפילו ב־mount חוזר לא יתחבר שוב
    };
  }, [token, businessId]);

  return (
    <DashboardSocketContext.Provider value={stats}>
      {children}
    </DashboardSocketContext.Provider>
  );
}

export function useDashboardStats() {
  const stats = useContext(DashboardSocketContext);
  if (stats === undefined) {
    throw new Error("useDashboardStats חייב להיות בתוך DashboardSocketProvider");
  }
  return stats;
}
