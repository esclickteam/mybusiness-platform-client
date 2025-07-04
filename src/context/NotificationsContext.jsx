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

function normalizeNotification(notif) {
  const rawText = typeof notif.text === "string" ? notif.text : notif.data?.text || "";
  const rawLast = notif.lastMessage || rawText;

  return {
    id: notif.threadId || notif.chatId || notif.id || notif._id?.toString(),
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
      state.notifications.forEach((n) => map.set(n.id, n));
      incoming.forEach((n) => {
        const existing = map.get(n.id);
        if (existing) {
          const unreadCount = Math.max(
            existing.unreadCount || 0,
            n.unreadCount || 0
          );
          map.set(n.id, { ...existing, ...n, unreadCount });
        } else {
          map.set(n.id, n);
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
      const exists = state.notifications.find((x) => x.id === n.id);
      let list;
      if (exists) {
        list = state.notifications.map((x) =>
          x.id === n.id
            ? {
                ...x,
                ...n,
                read: false,
                unreadCount: (x.unreadCount || 0) + 1,
              }
            : x
        );
      } else {
        list = [{ ...n, unreadCount: 1 }, ...state.notifications];
      }
      list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const unreadCount = calculateUnreadCount(list);
      return { ...state, notifications: list, unreadCount };
    }
    case "MARK_AS_READ": {
      const id = action.payload;
      const updatedNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true, unreadCount: 0 } : n
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
