import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export default function useDashboardSocket({ token, businessId }) {
  const [stats, setStats] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || !businessId) return;

    // התחברות לשרת Socket.IO
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || "/", {
      path: "/socket.io",
      auth: {
        token,
        role: "business-dashboard",
        businessId,
      },
      transports: ["websocket"],
    });

    // מאזין לעדכוני דשבורד
    socketRef.current.on("dashboardUpdate", (newStats) => {
      setStats(newStats);
      console.log("📡 dashboardUpdate received:", newStats);
    });

    // טיפול בחיבור
    socketRef.current.on("connect", () => {
      console.log("🔌 Connected to dashboard socket:", socketRef.current.id);
    });

    // טיפול בשגיאות חיבור
    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Dashboard socket connection error:", err.message);
    });

    // ניתוק בזמן ניקוי הקומפוננטה
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🔌 Disconnected dashboard socket");
      }
    };
  }, [token, businessId]);

  return stats;
}
