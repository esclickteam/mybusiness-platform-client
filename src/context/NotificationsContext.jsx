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

  const addNotification = useCallback((notif) => {
    setNotifications(prev =>
      prev.some(n => n.id === notif.id) ? prev : [notif, ...prev]
    );
  }, []);

  // Fetch initial notifications once when businessId becomes available
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
          setUnreadCount(data.notifications.filter(n => !n.read).length);
        }
      } catch (err) {
        console.error("Notifications fetch failed:", err);
      }
    })();
  }, [user?.businessId]);

  // Real-time WebSocket listeners for notifications & counts
  useEffect(() => {
    if (!socket || !socket.connected) return;

    const onNewNotification = notif => {
      console.log("[WS] newNotification:", notif);
      addNotification(notif);
      setUnreadCount(c => c + 1);
    };
    const onCount = count => {
      console.log("[WS] unreadMessagesCount:", count);
      setUnreadCount(count);
    };
    const onDashboard = stats => {
      console.log("[WS] dashboardUpdate:", stats);
      setDashboardStats(stats);
    };

    socket.emit("joinBusinessRoom", user.businessId);
    socket.on("newNotification", onNewNotification);
    socket.on("unreadMessagesCount", onCount);
    socket.on("dashboardUpdate", onDashboard);

    return () => {
      socket.off("newNotification", onNewNotification);
      socket.off("unreadMessagesCount", onCount);
      socket.off("dashboardUpdate", onDashboard);
    };
  }, [socket, user?.businessId, addNotification]);

  // Real-time WebSocket listener for new messages
  useEffect(() => {
    if (!socket || !socket.connected) return;

    const onNewMessage = msg => {
      console.log('[WS] newMessage:', msg);
      // כאן תוכל להוסיף לוגיקה להוספת ההודעה לשיחה, למשל:
      // addToConversation(msg.conversationId, msg);
    };

    socket.on('newMessage', onNewMessage);
    return () => {
      socket.off('newMessage', onNewMessage);
    };
  }, [socket]);

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
      setUnreadCount(c => Math.max(c - 1, 0));
    } catch (err) {
      console.error("markAsRead error:", err);
    }
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const clearRead = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.read));
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
