import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const { user, token } = useAuth();

  // ——— STATE ———
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    appointments_count: 0,
    reviews_count: 0,
    views_count: 0
  });

  // ——— SOCKET REF (למניעת כפל חיבורים) ———
  const socketRef = useRef(null);

  // ——— HELPERS ———
  const addNotification = useCallback((n) => {
    const id = n.id || n._id;
    setNotifications((prev) =>
      prev.some((x) => (x.id || x._id) === id) ? prev : [n, ...prev]
    );
  }, []);

  const markAsRead = useCallback(
    async (id) => {
      if (!token) return;
      await fetch(`/api/business/my/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      setNotifications((prev) =>
        prev.map((n) => ((n.id || n._id) === id ? { ...n, read: true } : n))
      );
    },
    [token]
  );

  const clearReadNotifications = useCallback(() => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // ——— EFFECT: FETCH + SOCKET ———
  useEffect(() => {
    if (!user?.businessId || !token) return;

    // 1. Fetch initial list (סינכרון ראשוני)
    fetch("/api/business/my/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setNotifications(d.notifications);
          setUnreadCount(d.notifications.filter((n) => !n.read).length);
        }
      })
      .catch(console.error);

    // 2. Create socket if not connected already
    if (socketRef.current?.connected) return;

    const s = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      transports: ["websocket"]
    });
    socketRef.current = s;

    // ——— SOCKET EVENT HANDLERS ———
    const joinRooms = () => {
      s.emit("joinBusinessRoom", user.businessId);
    };

    const onBundle = ({ count, lastNotification }) => {
      if (lastNotification) addNotification(lastNotification);
      setUnreadCount(count);
    };

    const onDashboard = (stats) => {
      setDashboardStats(stats);
    };

    s.on("connect", joinRooms);
    s.on("notificationBundle", onBundle);
    s.on("unreadMessagesCount", setUnreadCount);
    s.on("dashboardUpdate", onDashboard);

    // ——— CLEANUP ———
    return () => {
      s.off("connect", joinRooms);
      s.off("notificationBundle", onBundle);
      s.off("unreadMessagesCount", setUnreadCount);
      s.off("dashboardUpdate", onDashboard);
      s.disconnect();
      socketRef.current = null;
    };
  }, [user?.businessId, token, addNotification]);

  // ——— PROVIDER VALUE ———
  const value = {
    notifications,
    unreadMessagesCount: unreadCount,
    dashboardStats,
    socket: socketRef.current,
    addNotification,
    markAsRead,
    clearReadNotifications,
    clearAllNotifications
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
