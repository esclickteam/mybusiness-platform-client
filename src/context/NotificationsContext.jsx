// src/context/NotificationsContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";
import { useAuth } from "./AuthContext.jsx";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const { user, socket } = useAuth();   // לוקחים את ה־socket מה־AuthContext
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    appointments_count: 0,
    reviews_count: 0,
    views_count: 0
  });

  // עוזר להוסיף רק פעם אחת כל notification
  const addNotification = useCallback((n) => {
    const id = n.id || n._id;
    setNotifications(prev =>
      prev.some(x => (x.id||x._id)===id) ? prev : [n, ...prev]
    );
  }, []);

  const handleBundle = useCallback(({ count, lastNotification }) => {
    if (lastNotification) addNotification(lastNotification);
    setUnreadCount(count);
  }, [addNotification]);

  const handleNew = useCallback(n => {
    addNotification(n);
    setUnreadCount(c => c + 1);
  }, [addNotification]);

  const handleDashboard = useCallback(stats => {
    setDashboardStats(stats);
  }, []);

  // מאזינים לאירועי ה־socket שמגיע מה־AuthContext
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    // מצטרפים לחדרים ברגע שהחיבור עולה
    const joinRooms = () => {
      socket.emit("joinRoom", `business-${user.businessId}`);
      socket.emit("joinRoom", `dashboard-${user.businessId}`);
    };

    socket.on("connect",    joinRooms);
    socket.on("reconnect",  joinRooms);

    socket.on("notificationBundle", handleBundle);
    socket.on("newNotification",     handleNew);
    socket.on("unreadMessagesCount", setUnreadCount);
    socket.on("dashboardUpdate",     handleDashboard);

    return () => {
      socket.off("connect",    joinRooms);
      socket.off("reconnect",  joinRooms);

      socket.off("notificationBundle", handleBundle);
      socket.off("newNotification",     handleNew);
      socket.off("unreadMessagesCount", setUnreadCount);
      socket.off("dashboardUpdate",     handleDashboard);
    };
  }, [socket, user?.businessId, handleBundle, handleNew, handleDashboard]);

  // טעינת התראות ראשונית מה־API ברגע שה־socket קיים
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    fetch("/api/business/my/notifications", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          setNotifications(d.notifications);
          setUnreadCount(d.notifications.filter(n => !n.read).length);
        }
      })
      .catch(console.error);
  }, [socket, user?.businessId]);

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadMessagesCount: unreadCount,
      dashboardStats
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
