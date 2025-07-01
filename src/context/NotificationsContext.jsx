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
    console.log("[NotificationsProvider] Adding notification:", n);

    if (!id) {
      console.warn("[NotificationsProvider] Notification missing id or _id:", n);
      // אפשר להוסיף מזהה זמני פה אם רוצים למנוע כפילויות
    }

    setNotifications((prev) =>
      prev.some((x) => (x.id || x._id) === id) ? prev : [n, ...prev]
    );
  }, []);

  const markAsRead = useCallback(
    async (id) => {
      if (!token) {
        console.warn("[NotificationsProvider] markAsRead called without token");
        return;
      }
      console.log(`[NotificationsProvider] Marking notification ${id} as read`);

      try {
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
      } catch (err) {
        console.error("[NotificationsProvider] Error marking as read:", err);
      }
    },
    [token]
  );

  const clearReadNotifications = useCallback(() => {
    console.log("[NotificationsProvider] Clearing read notifications");
    setNotifications((prev) => prev.filter((n) => !n.read));
  }, []);

  const clearAllNotifications = useCallback(() => {
    console.log("[NotificationsProvider] Clearing all notifications");
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // ——— EFFECT: FETCH + SOCKET ———
  useEffect(() => {
    if (!user?.businessId || !token) {
      console.log("[NotificationsProvider] Missing user.businessId or token, skipping setup");
      return;
    }

    // 1. Fetch initial list (סינכרון ראשוני)
    fetch("/api/business/my/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          console.log("[NotificationsProvider] Initial notifications fetched:", d.notifications);
          setNotifications(d.notifications);
          setUnreadCount(d.notifications.filter((n) => !n.read).length);
        } else {
          console.error("[NotificationsProvider] Failed fetching initial notifications:", d);
        }
      })
      .catch((e) => {
        console.error("[NotificationsProvider] Fetch error:", e);
      });

    // 2. Create socket if not connected already
    if (socketRef.current?.connected) {
      console.log("[NotificationsProvider] Socket already connected, skipping");
      return;
    }

    const s = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      transports: ["websocket"]
    });
    socketRef.current = s;

    // ——— SOCKET EVENT HANDLERS ———
    const joinRooms = () => {
      console.log("[NotificationsProvider] Socket connected, joining business room:", user.businessId);
      s.emit("joinBusinessRoom", user.businessId);
    };

    const onBundle = ({ count, lastNotification }) => {
      console.log("[NotificationsProvider] Received notificationBundle:", { count, lastNotification });
      if (lastNotification) addNotification(lastNotification);
      setUnreadCount(count);
    };

    const onNewNotification = (notification) => {
      console.log("[NotificationsProvider] Received newNotification:", notification);
      if (notification) addNotification(notification);
      setUnreadCount((count) => count + 1);
    };

    const onDashboard = (stats) => {
      console.log("[NotificationsProvider] Received dashboardUpdate:", stats);
      setDashboardStats(stats);
    };

    s.on("connect", joinRooms);
    s.on("notificationBundle", onBundle);
    s.on("newNotification", onNewNotification);
    s.on("unreadMessagesCount", (count) => {
      console.log("[NotificationsProvider] Received unreadMessagesCount:", count);
      setUnreadCount(count);
    });
    s.on("dashboardUpdate", onDashboard);

    // ——— CLEANUP ———
    return () => {
      console.log("[NotificationsProvider] Cleaning up socket listeners and disconnecting");
      s.off("connect", joinRooms);
      s.off("notificationBundle", onBundle);
      s.off("newNotification", onNewNotification);
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
