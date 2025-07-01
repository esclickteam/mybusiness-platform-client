// src/context/NotificationsContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext.jsx";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const { user, socket } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    appointments_count: 0,
    reviews_count: 0,
    views_count: 0,
  });

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                           */
  /* ------------------------------------------------------------------ */
  const addNotification = useCallback((n) => {
    const id = n.id || n._id;
    setNotifications((prev) =>
      prev.some((x) => (x.id || x._id) === id) ? prev : [n, ...prev]
    );
  }, []);

  const handleBundle = useCallback(
    ({ count, lastNotification }) => {
      if (lastNotification) addNotification(lastNotification);
      setUnreadCount(count);
    },
    [addNotification]
  );

  const handleNew = useCallback(
    (n) => {
      addNotification(n);
      setUnreadCount((c) => c + 1);
    },
    [addNotification]
  );

  const handleDashboard = useCallback((stats) => {
    setDashboardStats(stats);
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Socket listeners & room join                                      */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    const joinRooms = () => {
      socket.emit("joinBusinessRoom", user.businessId, (ok) =>
        console.log("business join ack →", ok)
      );
    };

    // הצטרפות מיידית אם כבר מחובר
    if (socket.connected) joinRooms();

    // התחברות‑מחדש
    socket.on("connect", joinRooms);
    socket.io.on("reconnect", joinRooms);

    // Business events
    socket.on("notificationBundle", handleBundle);
    socket.on("newNotification", handleNew);
    socket.on("unreadMessagesCount", setUnreadCount);
    socket.on("dashboardUpdate", handleDashboard);

    // cleanup
    return () => {
      socket.off("connect", joinRooms);
      socket.io.off("reconnect", joinRooms);

      socket.off("notificationBundle", handleBundle);
      socket.off("newNotification", handleNew);
      socket.off("unreadMessagesCount", setUnreadCount);
      socket.off("dashboardUpdate", handleDashboard);
    };
  }, [socket, user?.businessId, handleBundle, handleNew, handleDashboard]);

  /* ------------------------------------------------------------------ */
  /*  Initial fetch                                                     */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    (async () => {
      try {
        const res  = await fetch("/api/business/my/notifications", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.ok) {
          setNotifications(data.notifications);
          setUnreadCount(data.notifications.filter((n) => !n.read).length);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    })();
  }, [socket, user?.businessId]);

  /* ------------------------------------------------------------------ */
  /*  Context value                                                     */
  /* ------------------------------------------------------------------ */
  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadMessagesCount: unreadCount, dashboardStats }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
