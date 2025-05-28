import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// דומיין ברירת מחדל במידה ואין משתנה סביבה
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";  // הדומיין שלך כאן

export default function useDashboardSocket({ token, businessId }) {
  const [stats, setStats] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // אם אין לנו token או businessId, לא נבצע את החיבור
    if (!token || !businessId) return;

    console.log("🔗 Creating socket connection...");

    // יצירת החיבור לסוקט
    socketRef.current = io(SOCKET_URL, {
      path: "/socket.io",
      auth: {
        token,  // שלח את ה-token
        role: "business-dashboard",  // תפקיד המשתמש
        businessId,  // שלח את ה-businessId
      },
      transports: ["websocket"],  // השתמש ב-websocket עבור החיבור
    });

    // מאזין לעדכונים מהדשבורד
    socketRef.current.on("dashboardUpdate", (newStats) => {
      console.log("📡 dashboardUpdate received:", newStats);
      setStats(prevStats => 
        prevStats ? { ...prevStats, ...newStats } : newStats
      );
    });

    // טיפול בהתחברות מוצלחת
    socketRef.current.on("connect", () => {
      console.log("🔌 Connected to dashboard socket:", socketRef.current.id);
    });

    // טיפול בשגיאות התחברות
    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Dashboard socket connection error:", err.message);
    });

    // ניתוק הסוקט כאשר הקומפוננטה מפסיקה לפעול (cleanup)
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🔌 Disconnected dashboard socket");
      }
    };
  }, [token, businessId]);  // רק אם ה-token או ה-businessId משתנים

  return stats;  // מחזיר את הסטטיסטיקות מהדשבורד
}
