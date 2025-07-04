import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext.jsx";

const NotificationsContext = createContext();

const initialState = {
  notifications: [],
  unreadCount: 0,
  dashboardStats: {
    appointments_count: 0,
    reviews_count: 0,
    views_count: 0,
  },
};

// נירמול הודעה (שומר על קונסיסטנטיות במקרה שצריך לתצוגה מלאה)
function normalizeNotification(notif) {
  const rawText = typeof notif.text === "string" ? notif.text : notif.data?.text || "";
  const rawLast = notif.lastMessage || rawText;

  return {
    id: notif.threadId || notif.chatId || notif.id || notif._id?.toString(),
    threadId: notif.threadId || null,
    text: rawText,
    lastMessage: rawLast,
    read: notif.read ?? false,
    timestamp: notif.timestamp || notif.createdAt || new Date().toISOString(),
    unreadCount:
      notif.unreadCount !== undefined && notif.unreadCount !== null
        ? notif.unreadCount
        : notif.read
        ? 0
        : 1,
    clientId: notif.clientId || notif.partnerId || null,
  };
}

function calculateUnreadCount(notifications) {
  return notifications.reduce((count, n) => count + (n.unreadCount || 0), 0);
}

function notificationsReducer(state, action) {
  switch (action.type) {
    case "SET_NOTIFICATIONS": {
      const incoming = action.payload.map(normalizeNotification);
      const map = new Map();
      incoming.forEach((n) => {
        const key = n.threadId || n.id;
        const existing = map.get(key);
        if (existing) {
          map.set(key, {
            ...existing,
            ...n,
            unreadCount: Math.max(existing.unreadCount || 0, n.unreadCount || 0),
            timestamp:
              new Date(n.timestamp) > new Date(existing.timestamp)
                ? n.timestamp
                : existing.timestamp,
          });
        } else {
          map.set(key, n);
        }
      });
      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      const unreadCount = calculateUnreadCount(merged);
      return { ...state, notifications: merged, unreadCount };
    }

    case "UPDATE_UNREAD_COUNT": {
      // רק עדכון המונה
      return { ...state, unreadCount: action.payload };
    }

    case "SET_DASHBOARD_STATS":
      return { ...state, dashboardStats: action.payload };

    default:
      return state;
  }
}

export function NotificationsProvider({ children }) {
  const { user, socket } = useAuth();
  const [state, dispatch] = useReducer(notificationsReducer, initialState);

  // טען את הרשימה הראשונית של ההודעות (אם צריך)
  useEffect(() => {
    if (!user?.businessId) return;
    fetch("/api/business/my/notifications", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          dispatch({ type: "SET_NOTIFICATIONS", payload: data.notifications });
        }
      })
      .catch((err) => console.error("Notifications fetch failed:", err));
  }, [user?.businessId]);

  // מאזינים רק ל-notificationBundle
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    const handleConnect = () => {
      socket.emit("joinBusinessRoom", user.businessId);
    };

    const handleBundle = (payload) => {
      // payload = { count: X }
      if (payload && typeof payload.count === "number") {
        dispatch({ type: "UPDATE_UNREAD_COUNT", payload: payload.count });
      }
    };

    socket.on("connect", handleConnect);
    if (socket.connected) handleConnect();

    socket.on("notificationBundle", handleBundle);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("notificationBundle", handleBundle);
    };
  }, [socket, user?.businessId]);

  const markAsRead = useCallback(async (id) => {
    try {
      await fetch(`/api/business/my/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // אם תרצו לאפס ברגע סימון כנקרא:
      dispatch({ type: "UPDATE_UNREAD_COUNT", payload: state.unreadCount - 1 });
    } catch (err) {
      console.error("markAsRead error:", err);
    }
  }, [state.unreadCount]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        markAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
