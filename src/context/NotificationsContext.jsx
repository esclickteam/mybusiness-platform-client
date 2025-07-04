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

// פונקציה שמבצעת נירמול ומבטיחה אחידות keys
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
      // דה-דופ לפי threadId (אם יש), אחרת לפי id
      incoming.forEach((n) => {
        const key = n.threadId || n.id;
        const existing = map.get(key);
        if (existing) {
          // בחר ערכים עדכניים/מצטברים
          map.set(key, {
            ...existing,
            ...n,
            unreadCount: Math.max(existing.unreadCount || 0, n.unreadCount || 0),
            timestamp: new Date(n.timestamp) > new Date(existing.timestamp) ? n.timestamp : existing.timestamp,
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
    case "ADD_NOTIFICATION": {
      const n = normalizeNotification(action.payload);

      // דה-דופ לפי threadId (אם יש), אחרת id
      const key = n.threadId || n.id;
      const existsIndex = state.notifications.findIndex(
        x => (x.threadId || x.id) === key
      );

      let list;
      if (existsIndex !== -1) {
        list = [...state.notifications];
        const existing = list[existsIndex];
        list[existsIndex] = {
          ...existing,
          ...n,
          read: false,
          unreadCount: (existing.unreadCount || 0) + (n.unreadCount || 1),
          timestamp: new Date(n.timestamp) > new Date(existing.timestamp) ? n.timestamp : existing.timestamp,
        };
      } else {
        list = [n, ...state.notifications];
      }

      list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const unreadCount = calculateUnreadCount(list);
      return { ...state, notifications: list, unreadCount };
    }
    case "MARK_AS_READ": {
      const id = action.payload;
      const updatedNotifications = state.notifications.map((n) =>
        (n.id === id || n.threadId === id) ? { ...n, read: true, unreadCount: 0 } : n
      );
      const unreadCount = calculateUnreadCount(updatedNotifications);
      return { ...state, notifications: updatedNotifications, unreadCount };
    }
    case "CLEAR_ALL":
      return { ...state, notifications: [], unreadCount: 0 };
    case "CLEAR_READ": {
      const filtered = state.notifications.filter((n) => !n.read);
      const unreadCount = calculateUnreadCount(filtered);
      return { ...state, notifications: filtered, unreadCount };
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

  useEffect(() => {
    if (!socket || !user?.businessId) return;

    const handleConnect = () => {
      socket.emit("joinBusinessRoom", user.businessId);
    };

    const handleNewNotification = (payload) => {
      const data = payload?.data ?? payload;
      if (!data || typeof data.text !== "string") return;
      dispatch({ type: "ADD_NOTIFICATION", payload: data });
    };

    const handleNewMessage = (msg) => {
      const data = msg.data || msg;
      if (!data || typeof data.text !== "string") return;
      const notification = {
        ...data,
        text: typeof data.text === "string" ? data.text : "",
        lastMessage:
          data.lastMessage || (typeof data.text === "string" ? data.text : ""),
        id: data.threadId || data.chatId || data.id || data._id?.toString(),
        threadId: data.threadId || null,
        read: data.read ?? false,
        timestamp: data.timestamp || data.createdAt || new Date().toISOString(),
      };
      dispatch({ type: "ADD_NOTIFICATION", payload: notification });
    };

    socket.on("connect", handleConnect);
    if (socket.connected) handleConnect();
    socket.on("newNotification", handleNewNotification);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("newNotification", handleNewNotification);
      socket.off("newMessage", handleNewMessage);
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
      dispatch({ type: "MARK_AS_READ", payload: id });
    } catch (err) {
      console.error("markAsRead error:", err);
    }
  }, []);

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
