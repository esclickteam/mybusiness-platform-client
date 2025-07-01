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

  // מוסיף התראה לרשימה אם לא קיים
  const addNotification = useCallback((notif) => {
    setNotifications((prev) =>
      prev.some((n) => n.id === notif.id) ? prev : [notif, ...prev]
    );
  }, []);

  // 1️⃣ טען התראות ראשוניות
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

  // 2️⃣ מאזין לאירועי WebSocket של התראות
  useEffect(() => {
    if (!socket) return;

    // מצטרף לחדר העסק לאחר התחברות
    const onConnect = () => {
      if (user?.businessId) {
        socket.emit("joinBusinessRoom", user.businessId);
        console.log("[WS] joinBusinessRoom emitted:", user.businessId);
      }
    };
    if (socket.connected) onConnect();
    socket.on("connect", onConnect);

    // אירוע התראה בודדת
    const onNewNotification = (notif) => {
      console.log("[WS] newNotification:", notif);
      addNotification(notif);
      setUnreadCount((c) => c + 1);
    };
    socket.on("newNotification", onNewNotification);

    // אירוע חבילה עם מונה ו� lastNotification
    const onBundle = ({ count, lastNotification }) => {
      console.log("[WS] notificationBundle:", count, lastNotification);
      if (lastNotification) addNotification(lastNotification);
      setUnreadCount(count);
    };
    socket.on("notificationBundle", onBundle);

    // אירוע עדכון סטטיסטיקות לוח בקרה
    const onDashboard = (stats) => {
      console.log("[WS] dashboardUpdate:", stats);
      setDashboardStats(stats);
    };
    socket.on("dashboardUpdate", onDashboard);

    return () => {
      socket.off("connect", onConnect);
      socket.off("newNotification", onNewNotification);
      socket.off("notificationBundle", onBundle);
      socket.off("dashboardUpdate", onDashboard);
    };
  }, [socket, user?.businessId, addNotification]);

  // 3️⃣ מאזין להודעות חדשות (לשימוש בחלקי צ׳אט אחרים)
  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (msg) => {
      console.log("[WS] newMessage:", msg);
      // במידת הצורך: הוסף callback לעדכון צ׳אט
    };
    socket.on("newMessage", onNewMessage);
    return () => {
      socket.off("newMessage", onNewMessage);
    };
  }, [socket]);

  // סימון התראה כנקראה
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

  // נקה את כל ההתראות
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // נקה רק את הקריאות
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
