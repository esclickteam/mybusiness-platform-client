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
    setNotifications(prev =>
      prev.some(n => n.id === notif.id) ? prev : [notif, ...prev]
    );
  }, []);

  // 1️⃣ Fetch initial notifications
  useEffect(() => {
    if (!user?.businessId) return;
    fetch("/api/business/my/notifications", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setNotifications(data.notifications);
          setUnreadCount(data.notifications.filter(n => !n.read).length);
        }
      })
      .catch(err => console.error("Notifications fetch failed:", err));
  }, [user?.businessId]);

  // 2️⃣ Setup all WS listeners
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    // כשמתחברים לסוקט
    const handleConnect = () => {
      socket.emit("joinBusinessRoom", user.businessId);
      console.log("[WS] joined business room:", user.businessId);
    };

    // מונה ו-bundle
    const handleBundle = ({ count, lastNotification }) => {
      console.log("[WS] notificationBundle:", count, lastNotification);
      if (lastNotification) addNotification(lastNotification);
      setUnreadCount(count);
    };

    // התראה חדשה
    const handleNew = notif => {
      console.log("[WS] newNotification:", notif);
      addNotification(notif);
      setUnreadCount(c => c + 1);
    };

    // עדכון דשבורד (לא קשור ל-badge)
    const handleDashboard = stats => {
      console.log("[WS] dashboardUpdate:", stats);
      setDashboardStats(stats);
    };

    // בהרשמה
    socket.on("connect", handleConnect);
    // אם כבר מתחבר
    if (socket.connected) handleConnect();

    socket.on("notificationBundle", handleBundle);
    socket.on("newNotification", handleNew);
    socket.on("dashboardUpdate", handleDashboard);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("notificationBundle", handleBundle);
      socket.off("newNotification", handleNew);
      socket.off("dashboardUpdate", handleDashboard);
    };
  }, [socket, user?.businessId, addNotification]);

  // 3️⃣ (אופציונלי) לסמן קריאה
  const markAsRead = useCallback(async id => {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications(prev => prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(c => Math.max(c - 1, 0));
    } catch (err) {
      console.error("markAsRead error:", err);
    }
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const clearRead = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.read));
  }, []);

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      dashboardStats,
      markAsRead,
      clearAll,
      clearRead,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
