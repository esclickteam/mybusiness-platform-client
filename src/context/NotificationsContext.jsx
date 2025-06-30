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
  const [socket, setSocket] = useState(null);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => {
      if (prev.some(n => n.id === notification.id || n._id === notification._id)) {
        return prev;
      }
      return [notification, ...prev];
    });
  }, []);

  // מסמן את כולן כנקראות ומרוקן את הרשימה
  const clearAllNotifications = useCallback(async () => {
    try {
      // אם רוצים: קריאה ל-API לסימון כולן כנקראות
      // await fetch("/api/business/my/notifications/readAll", { method: "PUT", headers: … });
    } catch (err) {
      console.error("Failed to clear all notifications on server:", err);
    }
    setNotifications([]);
    setUnreadMessagesCount(0);
  }, []);

  // מוחק רק את אלה שכבר נקראו
  const clearReadNotifications = useCallback(async () => {
    try {
      // אם רוצים: קריאה ל-API למחיקת התראות נקראו
      // await fetch("/api/business/my/notifications/clearRead", { method: "DELETE", headers: … });
    } catch (err) {
      console.error("Failed to clear read notifications on server:", err);
    }
    setNotifications((prev) => prev.filter(n => !n.read));
  }, []);

  // סימון התראה כנקראה ועדכון סטייט
  const markAsRead = useCallback(async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(`/api/business/my/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  }, []);

  useEffect(() => {
    if (!user?.businessId || !user?.token) return;

    const socketConnection = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token: user.token, businessId: user.businessId },
      path: "/socket.io",
      transports: ["websocket"],
    });
    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      socketConnection.emit("joinBusinessRoom", user.businessId);
    });
    socketConnection.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    // טעינת התראות ראשונית
    fetch("/api/business/my/notifications", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) setNotifications(data.notifications);
      })
      .catch(err => console.error("Failed to fetch notifications:", err));

    // אירועים בזמן אמת
    const events = [
      "newNotification",
      "reviewCreated",
      "appointmentCreated",
      "newProposalCreated",
      "newMessage",
      "unreadMessagesCount",
      "profileViewsUpdated",
      "dashboardUpdate",
    ];

    events.forEach(event => {
      socketConnection.on(event, (data) => {
        switch (event) {
          case "unreadMessagesCount":
            setUnreadMessagesCount(data);
            break;
          case "profileViewsUpdated":
            setProfileViews(data.views_count ?? data);
            break;
          case "newNotification":
          case "reviewCreated":
          case "appointmentCreated":
          case "newProposalCreated":
          case "newMessage":
            addNotification(data);
            break;
          default:
            break;
        }
      });
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [user, addNotification]);

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadMessagesCount,
      profileViews,
      socket,
      clearAllNotifications,
      clearReadNotifications,
      addNotification,
      markAsRead,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
