import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const { user, token } = useAuth();
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
    console.log("[Notifications] Adding notification:", notification);
    setNotifications(prev =>
      prev.some(n => n.id === notification.id) ? prev : [notification, ...prev]
    );
  }, []);

  const markAsRead = useCallback(async id => {
    console.log(`[Notifications] Marking notification ${id} as read`);
    if (!token) {
      console.warn("[Notifications] No token, cannot mark as read");
      return;
    }
    try {
      await fetch(`/api/business/my/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("[Notifications] Error marking as read:", err);
    }
  }, [token]);

  const clearReadNotifications = useCallback(() => {
    console.log("[Notifications] Clearing read notifications");
    setNotifications(prev => prev.filter(n => !n.read));
  }, []);

  const clearAllNotifications = useCallback(() => {
    console.log("[Notifications] Clearing all notifications");
    setNotifications([]);
    setUnreadMessagesCount(0);
  }, []);

  useEffect(() => {
    if (!user?.businessId || !token) {
      console.log("[Notifications] Missing user or token, skipping socket setup");
      return;
    }

    console.log("[Notifications] Setting up socket connection");
    const sock = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token, businessId: user.businessId },
      transports: ["websocket"]
    });

    setSocket(sock);

    sock.on("connect", () => {
      console.log("[Socket] Connected with id:", sock.id);
      sock.emit("joinBusinessRoom", user.businessId);
      console.log(`[Socket] Joined rooms: business-${user.businessId}, dashboard-${user.businessId}`);
    });

    sock.on("disconnect", reason => {
      console.log("[Socket] Disconnected:", reason);
    });

    sock.on("newNotification", data => {
      console.log("[Socket] Received newNotification:", data);
      addNotification(data);
    });

    sock.on("newMessage", data => {
      console.log("[Socket] Received newMessage:", data);
      addNotification({
        id: data.id || Date.now(),
        type: "message",
        actorName: data.fromName || "משתמש",
        text: data.content || "התקבלה הודעה חדשה",
        read: false,
        timestamp: data.timestamp || Date.now(),
        targetUrl: "/messages"
      });
      setUnreadMessagesCount(c => {
        const newCount = c + 1;
        console.log("[Notifications] Updated unreadMessagesCount to", newCount);
        return newCount;
      });
    });

    sock.on("unreadMessagesCount", count => {
      console.log("[Socket] Received unreadMessagesCount:", count);
      setUnreadMessagesCount(count);
    });

    sock.on("profileViewsUpdated", data => {
      const views = data.views_count ?? data;
      console.log("[Socket] Received profileViewsUpdated:", views);
      setProfileViews(views);
      setDashboardStats(prev => ({ ...prev, views_count: views }));
    });

    sock.on("appointmentCreated", () => {
      console.log("[Socket] Received appointmentCreated");
      setDashboardStats(prev => ({
        ...prev,
        appointments_count: prev.appointments_count + 1
      }));
    });

    sock.on("reviewCreated", () => {
      console.log("[Socket] Received reviewCreated");
      setDashboardStats(prev => ({
        ...prev,
        reviews_count: prev.reviews_count + 1
      }));
    });

    sock.on("dashboardUpdate", stats => {
      console.log("[Socket] Received dashboardUpdate:", stats);
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
      .then(data => {
        if (data.ok) {
          console.log("[Notifications] Fetched notifications from API:", data.notifications);
          setNotifications(data.notifications);
        } else {
          console.warn("[Notifications] Failed to fetch notifications:", data);
        }
      })
      .catch(err => console.error("[Notifications] Error fetching notifications:", err));

    return () => {
      console.log("[Notifications] Disconnecting socket");
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
