// src/context/NotificationsContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext.jsx";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const { user, socket } = useAuth(); // מקבלים את ה‑socket המאוחד מה‑AuthContext
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    appointments_count: 0,
    reviews_count: 0,
    views_count: 0,
  });

  // מוודא שלא תתווסף אותה התראה פעמיים
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

  /* -------------------------------------------------------------------- */
  /* הצטרפות לחדרים ורישום מאזינים בזמן אמת                               */
  /* -------------------------------------------------------------------- */
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    const businessRoom = `business-${user.businessId}`;
    const dashboardRoom = `dashboard-${user.businessId}`;

    const joinRooms = () => {
      socket.emit("joinRoom", businessRoom);
      socket.emit("joinRoom", dashboardRoom);
    };

    /* 1) אם החיבור כבר קיים (refresh חם או fast‑refresh) — מצטרפים מייד */
    if (socket.connected) {
      joinRooms();
    }

    /* 2) הצטרפות בכל התחברות / התחברות‑מחדש */
    socket.on("connect", joinRooms);
    socket.io.on("reconnect", joinRooms); // manager‑level event

    /* 3) אירועי עסק */
    socket.on("notificationBundle", handleBundle);
    socket.on("newNotification", handleNew);
    socket.on("unreadMessagesCount", setUnreadCount);
    socket.on("dashboardUpdate", handleDashboard);

    /* ניקוי */
    return () => {
      socket.off("connect", joinRooms);
      socket.io.off("reconnect", joinRooms);

      socket.off("notificationBundle", handleBundle);
      socket.off("newNotification", handleNew);
      socket.off("unreadMessagesCount", setUnreadCount);
      socket.off("dashboardUpdate", handleDashboard);
    };
  }, [socket, user?.businessId, handleBundle, handleNew, handleDashboard]);

  /* -------------------------------------------------------------------- */
  /* טעינה ראשונית של התראות מה‑REST API                                   */
  /* -------------------------------------------------------------------- */
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    (async () => {
      try {
        const res = await fetch("/api/business/my/notifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadMessagesCount: unreadCount,
        dashboardStats,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
