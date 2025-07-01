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

  const addNotification = useCallback((notif) => {
    const normalized = normalizeNotification(notif);
    console.log("Adding notification:", normalized); // לוג לבדיקת קבלת ההתראה
    setNotifications(prev => {
      const exists = prev.find(n => n.id === normalized.id);
      if (exists) {
        // מעדכן התראה קיימת במקום להוסיף כפילות
        return prev.map(n => n.id === normalized.id ? normalized : n);
      }
      return [normalized, ...prev];
    });
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
          console.log("Fetched notifications:", data.notifications); // לוג לבדיקה
          const normalizedNotifs = data.notifications.map(normalizeNotification);
          setNotifications(normalizedNotifs);
        } else {
          console.warn("Fetch notifications returned not ok:", data);
        }
      })
      .catch(err => console.error("Notifications fetch failed:", err));
  }, [user?.businessId]);

  // 2️⃣ Setup all WS listeners
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    const handleConnect = () => {
      console.log("[WS] Socket connected, joining room:", user.businessId); // לוג
      socket.emit("joinBusinessRoom", user.businessId);
    };

    const handleBundle = ({ count, lastNotification }) => {
      console.log("[WS] notificationBundle:", count, lastNotification);
      if (lastNotification) addNotification(lastNotification);
    };

    const handleNew = notif => {
      console.log("[WS] newNotification received:", notif);
      addNotification(notif);
    };

    const handleDashboard = stats => {
      console.log("[WS] dashboardUpdate:", stats);
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
