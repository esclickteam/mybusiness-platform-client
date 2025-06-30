import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";
import { io } from "socket.io-client";

const NotificationsContext = createContext();

export function NotificationsProvider({ user, children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [profileViews, setProfileViews] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    appointments_count: 0,
    reviews_count: 0,
    views_count: 0
  });
  const [socket, setSocket] = useState(null);

  // מוסיף התראה ייחודית
  const addNotification = useCallback(notification => {
    setNotifications(prev =>
      prev.some(n => n.id === notification.id) ? prev : [notification, ...prev]
    );
  }, []);

  // מסמן התראה בודדת כנקראה
  const markAsRead = useCallback(async id => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await fetch(`/api/business/my/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  }, []);

  // מוחק התראות שכבר נקראו
  const clearReadNotifications = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.read));
  }, []);

  // מאפס את כל ההתראות והמונה
  const clearAllNotifications = useCallback(() => {
    // אופציונלי: קריאה ל־API לסימון כולן כנקראות
    setNotifications([]);
    setUnreadMessagesCount(0);
  }, []);

  useEffect(() => {
    if (!user?.businessId || !user?.token) return;

    const sock = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token: user.token, businessId: user.businessId },
      transports: ["websocket"]
    });
    setSocket(sock);

    // הצטרפות לחדר
    sock.on("connect", () => {
      sock.emit("joinBusinessRoom", user.businessId);
    });

    // התראות ורענון מונה הודעות
    sock.on("newNotification", addNotification);
    sock.on("newMessage", data => {
      addNotification({
        id: data.id || Date.now(),
        type: "message",
        actorName: data.fromName || "משתמש",
        text: data.content || "התקבלה הודעה חדשה",
        read: false,
        timestamp: data.timestamp || Date.now(),
        targetUrl: "/messages"
      });
      setUnreadMessagesCount(c => c + 1);
    });
    sock.on("unreadMessagesCount", setUnreadMessagesCount);

    // עדכון צפיות בפרופיל
    sock.on("profileViewsUpdated", data => {
      const views = data.views_count ?? data;
      setProfileViews(views);
      setDashboardStats(prev => ({ ...prev, views_count: views }));
    });

    // עדכוני דשבורד לפגישות וביקורות
    sock.on("appointmentCreated", () => {
      setDashboardStats(prev => ({
        ...prev,
        appointments_count: prev.appointments_count + 1
      }));
    });
    sock.on("reviewCreated", () => {
      setDashboardStats(prev => ({
        ...prev,
        reviews_count: prev.reviews_count + 1
      }));
    });
    sock.on("dashboardUpdate", stats => {
      setDashboardStats({
        appointments_count: stats.appointments_count,
        reviews_count: stats.reviews_count,
        views_count: stats.views_count
      });
    });

    // טעינת התראות ראשונית מה־API
    fetch("/api/business/my/notifications", {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) setNotifications(data.notifications);
      })
      .catch(console.error);

    return () => {
      sock.disconnect();
    };
  }, [user, addNotification]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadMessagesCount,
        profileViews,
        dashboardStats,
        socket,
        addNotification,
        markAsRead,
        clearReadNotifications,
        clearAllNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
