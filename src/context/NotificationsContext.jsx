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

  const handleBundle = useCallback(
    ({ count, lastNotification }) => {
      console.log('[Socket] notificationBundle received:', { count, lastNotification });
      if (lastNotification) addNotification(lastNotification);
      setUnreadCount(count);
    },
    [addNotification]
  );

  const handleNew = useCallback(
    (n) => {
      console.log('[Socket] newNotification received:', n);
      addNotification(n);
      setUnreadCount((c) => c + 1);
    },
    [addNotification]
  );

  const handleDashboard = useCallback((stats) => {
    console.log('[Socket] dashboardUpdate received:', stats);
    setDashboardStats(stats);
  }, []);

  useEffect(() => {
    if (!socket) return;

    if (user?.businessId) {
      socket.emit("joinBusinessRoom", user.businessId);
    }

    socket.on("notificationBundle", handleBundle);
    socket.on("newNotification", handleNew);
    socket.on("unreadMessagesCount", (count) => {
      console.log('[Socket] unreadMessagesCount received:', count);
      setUnreadCount(count);
    });
    socket.on("dashboardUpdate", handleDashboard);

    return () => {
      socket.off("notificationBundle", handleBundle);
      socket.off("newNotification", handleNew);
      socket.off("unreadMessagesCount");
      socket.off("dashboardUpdate", handleDashboard);
    };
  }, [socket, user?.businessId, handleBundle, handleNew, handleDashboard]);

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

  const ctx = {
    notifications,
    unreadMessagesCount: unreadCount,
    dashboardStats,
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
