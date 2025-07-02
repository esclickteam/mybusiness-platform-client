import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const NotificationsContext = createContext();

const initialState = {
  notifications: [],
  dashboardStats: {
    appointments_count: 0,
    reviews_count: 0,
    views_count: 0,
  },
};

function normalizeNotification(notif) {
  return {
    ...notif,
    id: notif.threadId || notif.chatId || notif.id || notif._id?.toString(),
    lastMessage: notif.lastMessage,
    read: notif.read ?? false,
    timestamp: notif.timestamp || notif.createdAt || new Date().toISOString(),
    unreadCount: notif.unreadCount || (notif.read ? 0 : 1),
    clientId: notif.clientId || notif.partnerId || null,
    targetUrl: notif.targetUrl || null,
    businessId: notif.businessId || null,
    threadId: notif.threadId || notif.id || notif._id?.toString(),
  };
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
          const unreadCount = Math.max(existing.unreadCount || 0, n.unreadCount || 0);
          map.set(n.id, { ...existing, ...n, unreadCount });
        } else {
          map.set(n.id, n);
        }
      });
      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      return { ...state, notifications: merged };
    }
    case "ADD_NOTIFICATION": {
      const normalized = normalizeNotification(action.payload);
      const exists = state.notifications.find((n) => n.id === normalized.id);
      let newNotifications;
      if (exists) {
        newNotifications = state.notifications.map((n) =>
          n.id === normalized.id
            ? { ...n, ...normalized, read: false, unreadCount: (n.unreadCount || 0) + 1 }
            : n
        );
      } else {
        newNotifications = [{ ...normalized, unreadCount: 1 }, ...state.notifications];
      }
      newNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return { ...state, notifications: newNotifications };
    }
    case "MARK_AS_READ": {
      const id = action.payload;
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true, unreadCount: 0 } : n
      );
      return { ...state, notifications: updated };
    }
    case "CLEAR_ALL":
      return { ...state, notifications: [] };
    case "CLEAR_READ": {
      const filtered = state.notifications.filter((n) => !n.read);
      return { ...state, notifications: filtered };
    }
    case "SET_DASHBOARD_STATS":
      return { ...state, dashboardStats: action.payload };
    default:
      return state;
  }
}

export function NotificationsProvider({ children }) {
  const { user, socket } = useAuth();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(notificationsReducer, initialState);

  const unreadCount = state.notifications.reduce(
    (acc, n) => acc + (n.unreadCount > 0 ? 1 : 0),
    0
  );

  // Fetch initial notifications
  useEffect(() => {
    if (!user?.businessId) return;
    fetch("/api/business/my/notifications", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) dispatch({ type: "SET_NOTIFICATIONS", payload: data.notifications });
      })
      .catch((err) => console.error("Notifications fetch failed:", err));
  }, [user?.businessId]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !user?.businessId) return;
    const handleConnect = () => socket.emit("joinBusinessRoom", user.businessId);
    socket.on("connect", handleConnect);
    if (socket.connected) handleConnect();
    socket.on("notificationBundle", ({ lastNotification }) => {
      if (lastNotification) dispatch({ type: "ADD_NOTIFICATION", payload: lastNotification });
    });
    socket.on("newNotification", (notif) => dispatch({ type: "ADD_NOTIFICATION", payload: notif }));
    socket.on("dashboardUpdate", (stats) => dispatch({ type: "SET_DASHBOARD_STATS", payload: stats }));
    return () => {
      socket.off("connect", handleConnect);
      socket.off("notificationBundle");
      socket.off("newNotification");
      socket.off("dashboardUpdate");
    };
  }, [socket, user?.businessId]);

  const markAsRead = useCallback(async (threadId) => {
    const idStr = String(threadId);
    try {
      await fetch(`/api/business/my/notifications/${idStr}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch({ type: "MARK_AS_READ", payload: idStr });
    } catch (err) {
      console.error("markAsRead error:", err);
    }
  }, []);

  const clearAll = useCallback(() => dispatch({ type: "CLEAR_ALL" }), []);
  const clearRead = useCallback(async () => {
    try {
      const res = await fetch("/api/business/my/notifications/clearRead", { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (data.ok) dispatch({ type: "CLEAR_READ" });
    } catch (err) {
      console.error("clearRead error:", err);
    }
  }, []);

  const handleNotificationClick = useCallback(
    (notif) => {
      markAsRead(notif.id);
      if (notif.targetUrl) {
        navigate(notif.targetUrl);
      } else {
        const businessId = notif.businessId;
        if (!businessId) {
          console.error("Notification missing businessId", notif);
          return;
        }
        const base = `/business/${businessId}/chat`;
        const url = notif.clientId
          ? `${base}/${notif.clientId}?threadId=${notif.id}`
          : `${base}?threadId=${notif.id}`;
        navigate(url);
      }
    },
    [navigate, markAsRead]
  );

  return (
    <NotificationsContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount,
        dashboardStats: state.dashboardStats,
        markAsRead,
        clearAll,
        clearRead,
        handleNotificationClick,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
