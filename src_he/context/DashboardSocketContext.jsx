import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext"; // Update according to your path

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.BizUply.co.il";
const DashboardSocketContext = createContext(null);

export function DashboardSocketProvider({ businessId, children }) {
  const { refreshAccessToken, logout } = useAuth();

  const [stats, setStats] = useState({
    views_count: 0,
    requests_count: 0,
    orders_count: 0,
    reviews_count: 0,
    messages_count: 0,
    appointments_count: 0,
    appointments: [],
  });

  const socketRef = useRef(null);
  const hasInitRef = useRef(false);

  useEffect(() => {
    if (!businessId) return;
    if (hasInitRef.current) return;
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

      socketRef.current.on("dashboardUpdate", (newStats) => {
        if (!isMounted) return;
        const cleanedStats = {};
        for (const key in newStats) {
          if (newStats[key] !== undefined) {
            cleanedStats[key] = newStats[key];
          }
        }
        setStats((prev) => ({ ...prev, ...cleanedStats }));
      });

      socketRef.current.on("unreadMessagesCount", (count) => {
        if (!isMounted) return;
        setStats((prev) =>
          prev.messages_count === count ? prev : { ...prev, messages_count: count }
        );
      });

      socketRef.current.on("appointmentCreated", (newAppointment) => {
        if (!isMounted) return;
        setStats((prev) => {
          const updatedAppointments = prev.appointments ? [...prev.appointments] : [];
          updatedAppointments.push(newAppointment);
          return {
            ...prev,
            appointments: updatedAppointments,
            appointments_count: updatedAppointments.length,
          };
        });
      });

      socketRef.current.on("appointmentUpdated", (newAppointment) => {
        if (!isMounted) return;
        setStats((prev) => {
          const updatedAppointments = prev.appointments ? [...prev.appointments] : [];
          const index = updatedAppointments.findIndex((a) => a._id === newAppointment._id);
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

      socketRef.current.on("appointmentDeleted", ({ id }) => {
        if (!isMounted) return;
        setStats((prev) => {
          const updatedAppointments = prev.appointments
            ? prev.appointments.filter((a) => a._id !== id)
            : [];
          return {
            ...prev,
            appointments: updatedAppointments,
            appointments_count: updatedAppointments.length,
          };
        });
      });

      socketRef.current.on("allAppointmentsUpdated", (allAppointments) => {
        if (!isMounted) return;
        setStats((prev) => ({
          ...prev,
          appointments: allAppointments,
          appointments_count: allAppointments.length,
        }));
      });

      socketRef.current.on("reviewCreated", (reviewNotification) => {
        if (!isMounted) return;
        setStats((prev) => ({
          ...prev,
          reviews_count: (prev.reviews_count ?? 0) + 1,
        }));
      });

      socketRef.current.on("allReviewsUpdated", (allReviews) => {
        if (!isMounted) return;
        setStats((prev) => ({
          ...prev,
          reviews_count: allReviews.length,
        }));
      });

      socketRef.current.on("connect", () => {
        console.log("🔌 [SocketProvider] Connected with ID:", socketRef.current.id);
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("❌ [SocketProvider] Connection error:", err.message);
      });

      socketRef.current.on("tokenExpired", async () => {
        console.log("🚨 [SocketProvider] Token expired, refreshing...");
        const newToken = await refreshAccessToken();
        if (!newToken) {
          logout();
          return;
        }
        socketRef.current.auth.token = newToken;
        socketRef.current.emit("authenticate", { token: newToken }, (ack) => {
          if (!ack?.ok) {
            console.warn("❌ Re-authentication failed, performing Logout");
            logout();
          } else {
            console.log("✅ Re-authentication succeeded");
          }
        });
      });

      // Initial request for statistics
      socketRef.current.emit("getDashboardStats", null, (res) => {
        if (res?.ok && res.stats) {
          setStats({
            views_count: res.stats.views_count ?? 0,
            reviews_count: res.stats.reviews_count ?? 0,
            appointments_count: res.stats.appointments_count ?? 0,
            messages_count: res.stats.messages_count ?? 0,
            appointments: res.stats.appointments ?? [],
          });
        }
      });
    }

    initSocket();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.off("dashboardUpdate");
        socketRef.current.off("unreadMessagesCount");
        socketRef.current.off("appointmentCreated");
        socketRef.current.off("appointmentUpdated");
        socketRef.current.off("appointmentDeleted");
        socketRef.current.off("allAppointmentsUpdated");
        socketRef.current.off("reviewCreated");
        socketRef.current.off("allReviewsUpdated");
        socketRef.current.off("connect");
        socketRef.current.off("connect_error");
        socketRef.current.off("tokenExpired");
        socketRef.current.disconnect();
        console.log("🔌 [SocketProvider] Socket disconnected");
        socketRef.current = null;
      }
    };
  }, [businessId, refreshAccessToken, logout]);

  return (
    <DashboardSocketContext.Provider value={{ stats, socket: socketRef.current }}>
      {children}
    </DashboardSocketContext.Provider>
  );
}

export function useDashboardStats() {
  const context = useContext(DashboardSocketContext);
  if (context === undefined) {
    throw new Error("useDashboardStats must be used within a DashboardSocketProvider");
  }
  return context;
}
