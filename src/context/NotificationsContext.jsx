// src/context/NotificationsContext.jsx — final updated version
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext.jsx";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { user, socket } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    appointments_count: 0,
    reviews_count: 0,
    views_count: 0,
  });

  /* ------------------------- Helpers ------------------------- */
  const addNotification = useCallback((notification) => {
    const id = notification.id || notification._id;
    setNotifications((prev) =>
      prev.some((item) => (item.id || item._id) === id) ? prev : [notification, ...prev]
    );
  }, []);

  const handleBundle = useCallback(
    ({ count, lastNotification }) => {
      if (lastNotification) addNotification(lastNotification);
      setUnreadCount(count);
    },
    [addNotification]
  );

  const handleNewNotification = useCallback(
    (notification) => {
      addNotification(notification);
      setUnreadCount((c) => c + 1);
    },
    [addNotification]
  );

  const handleDashboard = useCallback((stats) => {
    setDashboardStats(stats);
  }, []);

  /* ---------------------- Socket listeners ------------------- */
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    // Join rooms for both Redis adapter and notificationsHandler
    const joinRooms = () => {
      socket.emit("joinBusinessRoom", user.businessId);
    };

    if (socket.connected) joinRooms(); // hot-reload
    socket.on("connect", joinRooms);

    socket.on("notificationBundle", handleBundle);
    socket.on("newNotification", handleNewNotification);
    socket.on("unreadMessagesCount", setUnreadCount);
    socket.on("dashboardUpdate", handleDashboard);

    return () => {
      socket.off("connect", joinRooms);
      socket.off("notificationBundle", handleBundle);
      socket.off("newNotification", handleNewNotification);
      socket.off("unreadMessagesCount", setUnreadCount);
      socket.off("dashboardUpdate", handleDashboard);
    };
  }, [socket, user?.businessId, handleBundle, handleNewNotification, handleDashboard]);

  /* -------------------- Initial fetch ------------------------ */
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    (async () => {
      try {
        const res = await fetch("/api/business/my/notifications", {
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

  /* -------------------- Context value ------------------------ */
  const value = {
    notifications,
    unreadMessagesCount: unreadCount,
    dashboardStats,
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
