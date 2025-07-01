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

// ————————————————————————————
// Notifications Context
// ————————————————————————————
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

  // ————————————————————————————
  // Helpers
  // ————————————————————————————
  const addNotification = useCallback((n) => {
    const id = n.id || n._id;
    console.log("[NotificationsProvider] Adding notification:", n);

    if (!id) {
      console.warn("[NotificationsProvider] Notification missing id or _id:", n);
      // במקרה הצורך – אפשר להוסיף מזהה זמני למניעת כפילויות
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

  // ————————————————————————————
  // Effect: initial fetch + socket
  // ————————————————————————————
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

    // 2. Disconnect any previous socket before creating a new one (במיוחד כאשר מתחלף משתמש)
    if (socketRef.current) {
      console.log("[NotificationsProvider] Disposing previous socket instance");
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // 3. Create socket
    const s = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      transports: ["websocket"]
    });
    socketRef.current = s;

    // ——— SOCKET EVENT HANDLERS ———
    const joinRooms = () => {
      const rooms = [
        `business-${user.businessId}`,
        `dashboard-${user.businessId}`
      ];
      console.log("[NotificationsProvider] Socket connected, joining rooms:", rooms);
      rooms.forEach((room) => s.emit("joinRoom", room));
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

    // Primary connect + reconnect
    s.on("connect", joinRooms);
    s.on("reconnect", joinRooms);

    // Notifications
    s.on("notificationBundle", onBundle);
    s.on("newNotification", onNewNotification);
    s.on("unreadMessagesCount", (count) => {
      console.log("[NotificationsProvider] Received unreadMessagesCount:", count);
      setUnreadCount(count);
    });

    // Dashboard stats
    s.on("dashboardUpdate", onDashboard);

    // ——— CLEANUP ———
    return () => {
      console.log("[NotificationsProvider] Cleaning up socket listeners and disconnecting");
      s.off("connect", joinRooms);
      s.off("reconnect", joinRooms);
      s.off("notificationBundle", onBundle);
      s.off("newNotification", onNewNotification);
      s.off("unreadMessagesCount");
      s.off("dashboardUpdate", onDashboard);
      s.disconnect();
      socketRef.current = null;
    };
  }, [user?.businessId, token, addNotification]);

  // ————————————————————————————
  // Provider Value
  // ————————————————————————————
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
