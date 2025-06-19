// NotificationsContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const NotificationsContext = createContext();

export function NotificationsProvider({ user, children }) {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user || !user.businessId) return;

    // יצירת חיבור Socket.io
    const socketConnection = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token: user.token,
        businessId: user.businessId,
      },
      path: "/socket.io",
      transports: ["websocket"],
    });

    setSocket(socketConnection);

    // טעינת התראות היסטוריות מהשרת
    fetch("/api/business/my/notifications", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setNotifications(data.notifications);
      })
      .catch((err) => console.error("Failed to fetch notifications:", err));

    // קבלת התראות בזמן אמת
    socketConnection.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    // ניתוק החיבור בעת פירוק הקומפוננטה
    return () => {
      socketConnection.disconnect();
    };
  }, [user]);

  return (
    <NotificationsContext.Provider value={{ notifications, setNotifications, socket }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
