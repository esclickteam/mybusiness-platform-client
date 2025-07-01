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
  const [dashboardStats, setDashboardStats] = useState({
    appointments_count: 0,
    reviews_count: 0,
    views_count: 0,
  });

  // במקום לנהל unreadCount בנפרד, מחשבים אותו מתוך המערך
  const unreadCount = notifications.filter(n => !n.read).length;

  // ממיר כל התראה להוסיף שדה id (מתוך _id אם חסר)
  const normalizeNotification = (notif) => ({
    ...notif,
    id: notif.id || notif._id?.toString(),
  });

  // פונקציה למיזוג מערכי התראות בלי כפילויות
  const mergeNotifications = (existing, incoming) => {
    const map = new Map();
    existing.forEach(n => map.set(n.id, n));
    incoming.forEach(n => map.set(n.id, n)); // מעדכן או מוסיף
    // מיון לפי תאריך, התראה חדשה למעלה
    return Array.from(map.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const addNotification = useCallback((notif) => {
    const normalized = normalizeNotification(notif);
    setNotifications(prev => {
      const exists = prev.find(n => n.id === normalized.id);
      if (exists) {
        // עדכון התראה קיימת במקום להוסיף כפילות
        return prev.map(n => n.id === normalized.id ? normalized : n);
      }
      return [normalized, ...prev];
    });
  }, []);

  // עדכון של מערך ההתראות - מיזוג בין קיים לחדש
  const mergeNewNotifications = useCallback((newNotifs) => {
    const normalizedNotifs = newNotifs.map(normalizeNotification);
    setNotifications(prev => mergeNotifications(prev, normalizedNotifs));
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
          mergeNewNotifications(data.notifications);
        } else {
          console.warn("Fetch notifications returned not ok:", data);
        }
      })
      .catch(err => console.error("Notifications fetch failed:", err));
  }, [user?.businessId, mergeNewNotifications]);

  // 2️⃣ Setup all WS listeners
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    const handleConnect = () => {
      socket.emit("joinBusinessRoom", user.businessId);
    };

    const handleBundle = ({ count, lastNotification }) => {
      if (lastNotification) addNotification(lastNotification);
    };

    const handleNew = notif => {
      addNotification(notif);
    };

    const handleDashboard = stats => {
      setDashboardStats(stats);
    };

    socket.on("connect", handleConnect);
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
    } catch (err) {
      console.error("markAsRead error:", err);
    }
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
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
