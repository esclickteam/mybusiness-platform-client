import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";
const DashboardSocketContext = createContext(null);

export function DashboardSocketProvider({ businessId, children }) {
  const { refreshAccessToken, logout } = useAuth();

  const [stats, setStats] = useState({
    views_count: 0,
    requests_count: 0,
    orders_count: 0,
    reviews_count: 0,
    messages_count: 0, // ספירת הודעות לא נקראו
    appointments_count: 0,
    appointments: [], // מערך הפגישות
  });

  const socketRef = useRef(null);
  const hasInitRef = useRef(false);

  useEffect(() => {
    if (!businessId) return;
    if (hasInitRef.current) return; // מונע התחברות חוזרת
    hasInitRef.current = true;

    let isMounted = true;

    async function initSocket() {
      const token = await refreshAccessToken();
      if (!token) {
        logout();
        return;
      }

      socketRef.current = io(SOCKET_URL, {
        path: "/socket.io",
        auth: { token, role: "business-dashboard", businessId },
        transports: ["websocket"],
      });

      const handleUpdate = (newStats) => {
        if (!isMounted) return;
        console.log("🔄 [SocketProvider] עדכון סטטיסטיקות:", newStats);
        const cleanedStats = {};
        for (const key in newStats) {
          if (newStats[key] !== undefined) {
            cleanedStats[key] = newStats[key];
          }
        }
        setStats((prev) => ({ ...prev, ...cleanedStats }));
      };

      socketRef.current.on("dashboardUpdate", handleUpdate);

      socketRef.current.on("unreadMessagesCount", (count) => {
        if (!isMounted) return;
        setStats((prev) => {
          if (prev.messages_count === count) {
            console.log("[SocketProvider] דילוג על עדכון unreadMessagesCount - אותו ערך:", count);
            return prev; // לא לעדכן אם אותו ערך
          }
          console.log("🔄 [SocketProvider] עדכון ספירת הודעות לא נקראו:", count);
          return { ...prev, messages_count: count };
        });
      });

      // אירוע סנכרון פגישה יחידה
      socketRef.current.on("appointmentUpdated", (newAppointment) => {
        if (!isMounted) return;
        setStats((prev) => {
          const updatedAppointments = prev.appointments ? [...prev.appointments] : [];
          const index = updatedAppointments.findIndex(a => a._id === newAppointment._id);
          if (index !== -1) {
            updatedAppointments[index] = newAppointment;
          } else {
            updatedAppointments.push(newAppointment);
          }
          return {
            ...prev,
            appointments: updatedAppointments,
            appointments_count: updatedAppointments.length,
          };
        });
      });

      // אירוע סנכרון כל הפגישות
      socketRef.current.on("allAppointmentsUpdated", (allAppointments) => {
        if (!isMounted) return;
        setStats((prev) => ({
          ...prev,
          appointments: allAppointments,
          appointments_count: allAppointments.length,
        }));
      });

      socketRef.current.on("connect", () => {
        console.log("🔌 [SocketProvider] מחובר עם ID:", socketRef.current.id);
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("❌ [SocketProvider] שגיאת חיבור:", err.message);
      });

      socketRef.current.on("tokenExpired", async () => {
        console.log("🚨 [SocketProvider] טוקן פג תוקף, מרענן...");
        const newToken = await refreshAccessToken();
        if (!newToken) {
          logout();
          return;
        }
        socketRef.current.auth.token = newToken;
        socketRef.current.disconnect();
        socketRef.current.connect();
      });
    }

    initSocket();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.off("dashboardUpdate");
        socketRef.current.off("unreadMessagesCount");
        socketRef.current.off("appointmentUpdated");
        socketRef.current.off("allAppointmentsUpdated");
        socketRef.current.disconnect();
        console.log("🔌 [SocketProvider] ניתוק ה־socket");
        socketRef.current = null;
      }
      // לא מאפסים את hasInitRef כדי למנוע התחברות חוזרת לא רצויה
    };
  }, [businessId, refreshAccessToken, logout]);

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
