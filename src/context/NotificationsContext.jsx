// src/context/NotificationsContext.jsx
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

  const addNotification = useCallback((notif) => {
    setNotifications((prev) =>
      prev.some((n) => n.id === notif.id) ? prev : [notif, ...prev]
    );
  }, []);

  // 1️⃣ Fetch initial notifications
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
          setUnreadCount(
            data.notifications.filter((n) => !n.read).length
          );
        }
      } catch (err) {
        console.error("Notifications fetch failed:", err);
      }
    })();
  }, [user?.businessId]);

  // 2️⃣ Real-time: notificationBundle & newNotification
  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      if (user?.businessId) {
        socket.emit("joinBusinessRoom", user.businessId);
      }
    };
    const onBundle = ({ count, lastNotification }) => {
      // סנכרון מלא של מספר ההתראות
      if (lastNotification) addNotification(lastNotification);
      setUnreadCount(count);
    };
    const onNew = (notif) => {
      // התראה בודדת
      addNotification(notif);
      setUnreadCount((c) => c + 1);
    };

    socket.on("connect", onConnect);
    if (socket.connected) onConnect();

    socket.on("notificationBundle", onBundle);
    socket.on("newNotification", onNew);

    return () => {
      socket.off("connect", onConnect);
      socket.off("notificationBundle", onBundle);
      socket.off("newNotification", onNew);
    };
  }, [socket, user?.businessId, addNotification]);

  // 3️⃣ (אופציונלי) listener עבור עדכוני דשבורד
  useEffect(() => {
    if (!socket) return;
    const onDashboard = (stats) => {
      setDashboardStats(stats);
    };
    socket.on("dashboardUpdate", onDashboard);
    return () => socket.off("dashboardUpdate", onDashboard);
  }, [socket]);

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
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(c - 1, 0));
    } catch (err) {
      console.error("markAsRead error:", err);
    }
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const clearRead = useCallback(() => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        dashboardStats,
        markAsRead,
        clearAll,
        clearRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
