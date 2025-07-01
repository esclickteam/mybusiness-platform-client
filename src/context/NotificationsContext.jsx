import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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

  const addNotification = useCallback((n) => {
    const id = n.id || n._id;
    setNotifications((prev) =>
      prev.some((x) => (x.id || x._id) === id) ? prev : [n, ...prev]
    );
  }, []);

  const handleNew = useCallback(
    (n) => {
      console.log('[Socket] newNotification received:', n);
      addNotification(n);
      setUnreadCount((c) => c + 1);
    },
    [addNotification]
  );

  const handleUnreadCount = useCallback((count) => {
    console.log('[Socket] unreadMessagesCount received:', count);
    setUnreadCount(count);
  }, []);

  const handleDashboard = useCallback((stats) => {
    console.log('[Socket] dashboardUpdate received:', stats);
    setDashboardStats(stats);
  }, []);

  // Initial fetch of notifications
  useEffect(() => {
    if (!user?.businessId) return;
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
  }, [user?.businessId]);

  // Real-time listeners
  useEffect(() => {
    if (!socket || !socket.connected) return;

    socket.on("newNotification", handleNew);
    socket.on("unreadMessagesCount", handleUnreadCount);
    socket.on("dashboardUpdate", handleDashboard);

    return () => {
      socket.off("newNotification", handleNew);
      socket.off("unreadMessagesCount", handleUnreadCount);
      socket.off("dashboardUpdate", handleDashboard);
    };
  }, [socket, handleNew, handleUnreadCount, handleDashboard]);

  const markAsRead = useCallback(async (id) => {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ notificationId: id }),
      });

      setNotifications((prev) =>
        prev.map((n) =>
          (n.id || n._id) === id ? { ...n, read: true } : n
        )
      );
      setUnreadCount((c) => Math.max(c - 1, 0));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const clearReadNotifications = useCallback(() => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  }, []);

  const ctx = {
    notifications,
    unreadMessagesCount: unreadCount,
    dashboardStats,
    markAsRead,
    clearAllNotifications,
    clearReadNotifications,
  };

  useEffect(() => {
    console.log('[Notifications] notifications changed:', notifications);
    console.log('[Notifications] unreadCount:', unreadCount);
  }, [notifications, unreadCount]);

  return <NotificationsContext.Provider value={ctx}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
