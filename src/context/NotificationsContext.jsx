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
    threadId: notif.threadId || null,
    text: rawText,
    lastMessage: rawLast,
    read: notif.read ?? false,
    timestamp: notif.timestamp || notif.createdAt || new Date().toISOString(),
    unreadCount:
      notif.unreadCount != null
        ? notif.unreadCount
        : notif.read
        ? 0
        : 1,
    clientId: notif.clientId || notif.partnerId || null,
  };
}

function calculateUnreadCount(notifs) {
  return notifs.reduce((sum, n) => sum + (n.unreadCount || 0), 0);
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_NOTIFICATIONS": {
      const incoming = action.payload.map(normalizeNotification);
      const map = new Map();
      for (const n of incoming) {
        const key = n.threadId || n.id;
        const ex = map.get(key);
        if (ex) {
          map.set(key, {
            ...ex,
            ...n,
            unreadCount: Math.max(ex.unreadCount, n.unreadCount),
            timestamp:
              new Date(n.timestamp) > new Date(ex.timestamp)
                ? n.timestamp
                : ex.timestamp,
          });
        } else {
          map.set(key, n);
        }
      }
      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      return {
        ...state,
        notifications: merged,
        unreadCount: calculateUnreadCount(merged),
      };
    }

    case "UPDATE_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };

    case "CLEAR_ALL":
      // מוחק את כל ההתראות
      return { ...state, notifications: [], unreadCount: 0 };

    default:
      return state;
  }
}

export function NotificationsProvider({ children }) {
  const { user, socket } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  // טעינת התראות ראשונית
  useEffect(() => {
    if (!user?.businessId) return;
    fetch("/api/business/my/notifications", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) dispatch({ type: "SET_NOTIFICATIONS", payload: data.notifications });
      })
      .catch(console.error);
  }, [user?.businessId]);

  // עדכוני מונה מה-socket
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    const join = () => socket.emit("joinBusinessRoom", user.businessId);
    const onBundle = (p) => {
      if (p?.count != null) dispatch({ type: "UPDATE_UNREAD_COUNT", payload: p.count });
    };

    socket.on("connect", join);
    if (socket.connected) join();
    socket.on("notificationBundle", onBundle);

    return () => {
      socket.off("connect", join);
      socket.off("notificationBundle", onBundle);
    };
  }, [socket, user?.businessId]);

  // סימון יחיד כנקרא
  const markAsRead = useCallback(
    async (id) => {
      await fetch(`/api/business/my/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch({ type: "UPDATE_UNREAD_COUNT", payload: state.unreadCount - 1 });
    },
    [state.unreadCount]
  );

  // סימון כל ההתראות כנקראו (ומוחק את כולן)
  const markAllAsRead = useCallback(async () => {
    await fetch("/api/business/my/notifications/readAll", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    dispatch({ type: "CLEAR_ALL" });
  }, []);

  // ניקוי כל ההתראות
  const clearRead = useCallback(async () => {
    const res = await fetch("/api/business/my/notifications/clearRead", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (data.ok) dispatch({ type: "CLEAR_ALL" });
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        markAsRead,
        markAllAsRead,
        clearRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
