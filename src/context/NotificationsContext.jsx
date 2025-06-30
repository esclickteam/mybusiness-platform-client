import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";  // <-- ייבוא useAuth

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const { user, token } = useAuth();   // <-- שימוש ב־AuthContext
  const [notifications, setNotifications] = useState([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [profileViews, setProfileViews] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    appointments_count: 0,
    reviews_count: 0,
    views_count: 0
  });
  const [socket, setSocket] = useState(null);

  const addNotification = useCallback(notification => {
    setNotifications(prev =>
      prev.some(n => n.id === notification.id) ? prev : [notification, ...prev]
    );
  }, []);

  const markAsRead = useCallback(async id => {
    if (!token) return;
    await fetch(`/api/business/my/notifications/${id}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    });
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, [token]);

  const clearReadNotifications = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.read));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadMessagesCount(0);
  }, []);

  useEffect(() => {
    if (!user?.businessId || !token) return;

    const sock = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token, businessId: user.businessId },
      transports: ["websocket"]
    });
    setSocket(sock);

    sock.on("connect", () => {
      sock.emit("joinBusinessRoom", user.businessId);
    });

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

    sock.on("profileViewsUpdated", data => {
      const views = data.views_count ?? data;
      setProfileViews(views);
      setDashboardStats(prev => ({ ...prev, views_count: views }));
    });

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

    fetch("/api/business/my/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => data.ok && setNotifications(data.notifications))
      .catch(console.error);

    return () => {
      sock.disconnect();
    };
  }, [user, token, addNotification]);

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
