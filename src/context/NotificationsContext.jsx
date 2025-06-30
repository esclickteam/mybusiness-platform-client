import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";

const NotificationsContext = createContext();

export function NotificationsProvider({ user, children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [profileViews, setProfileViews] = useState(0);
  const [socket, setSocket] = useState(null);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => {
      if (prev.some(n => n.id === notification.id || n._id === notification._id)) return prev;
      return [notification, ...prev];
    });
  }, []);

  useEffect(() => {
    if (!user || !user.businessId || !user.token) return;

    const socketConnection = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token: user.token, businessId: user.businessId },
      path: "/socket.io",
      transports: ["websocket"],
    });

    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      console.log("Socket connected:", socketConnection.id);
      socketConnection.emit("joinBusinessRoom", user.businessId);
    });

    socketConnection.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    // 초기 טעינת התראות
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
        console.log(`Received event ${event}:`, data);
        switch (event) {
          case "unreadMessagesCount":
            setUnreadMessagesCount(data);
            break;
          case "profileViewsUpdated":
            setProfileViews(data.views_count || data);
            break;
          case "newNotification":
          case "reviewCreated":
          case "appointmentCreated":
          case "newProposalCreated":
          case "newMessage":
            addNotification(data);
            break;
          // dashboardUpdate here if needed
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
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
        unreadMessagesCount,
        profileViews,
        socket,
      }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
