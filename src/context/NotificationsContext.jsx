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

  // 2️⃣ Real-time: notificationBundle, newNotification & counts
  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      if (user?.businessId) {
        socket.emit("joinBusinessRoom", user.businessId);
      }
    };
    const onBundle = ({ count, lastNotification }) => {
      console.log("[WS] notificationBundle:", count, lastNotification);
      if (lastNotification) addNotification(lastNotification);
      setUnreadCount(count);
    };
    const onNew = (notif) => {
      console.log("[WS] newNotification:", notif);
      addNotification(notif);
      setUnreadCount((c) => c + 1);
    };
    const onCount = (count) => {
      console.log("[WS] unreadMessagesCount:", count);
      setUnreadCount(count);
    };
    const onDashboard = (stats) => {
      console.log("[WS] dashboardUpdate:", stats);
      setDashboardStats(stats);
    };

    socket.on("connect", onConnect);
    if (socket.connected) onConnect();

    socket.on("notificationBundle", onBundle);
    socket.on("newNotification", onNew);
    socket.on("unreadMessagesCount", onCount);
    socket.on("dashboardUpdate", onDashboard);

    return () => {
      socket.off("connect", onConnect);
      socket.off("notificationBundle", onBundle);
      socket.off("newNotification", onNew);
      socket.off("unreadMessagesCount", onCount);
      socket.off("dashboardUpdate", onDashboard);
    };
  }, [socket, user?.businessId, addNotification]);

  // 3️⃣ Real-time: newMessage listener
  useEffect(() => {
    if (!socket) return;
    const onNewMessage = (msg) => {
      console.log("[WS] newMessage:", msg);
      // כאן אפשר להזריק ל־state של השיחות
    };
    socket.on("newMessage", onNewMessage);
    return () => {
      socket.off("newMessage", onNewMessage);
    };
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

  const ctx = {
    notifications,
    unreadCount,
    dashboardStats,
    markAsRead,
    clearAll,
    clearRead,
  };

  return (
    <NotificationsContext.Provider value={ctx}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
