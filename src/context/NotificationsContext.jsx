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
  dashboardStats: {
    appointments_count: 0,
    reviews_count: 0,
    views_count: 0,
  },
};

function normalizeNotification(notif) {
  // Extract text (from notif.text or notif.data?.text) and map to lastMessage if missing
  const rawText = notif.text ?? notif.data?.text ?? "";
  const rawLast = notif.lastMessage ?? rawText;

  return {
    id:
      notif.threadId || notif.chatId || notif.id || notif._id?.toString(),
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
      return { ...state, notifications: merged };
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
      return { ...state, notifications: list };
    }

    case "MARK_AS_READ": {
      const id = action.payload;
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true, unreadCount: 0 } : n
        ),
      };
    }

    case "CLEAR_ALL":
      return { ...state, notifications: [] };

    case "CLEAR_READ":
      return {
        ...state,
        notifications: state.notifications.filter((n) => !n.read),
      };

    case "SET_DASHBOARD_STATS":
      return { ...state, dashboardStats: action.payload };

    default:
      return state;
  }
}

export function NotificationsProvider({ children }) {
  const { user, socket } = useAuth();
  const [state, dispatch] = useReducer(
    notificationsReducer,
    initialState
  );

  // סופר הודעות לא נקראות
  const unreadCount = state.notifications.reduce(
    (acc, n) => acc + (n.unreadCount > 0 ? 1 : 0),
    0
  );

  // טעינת התראות ראשונית מה־API
  useEffect(() => {
    if (!user?.businessId) return;
    fetch("/api/business/my/notifications", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          console.log(
            "Initial notifications loaded:",
            data.notifications
          );
          dispatch({ type: "SET_NOTIFICATIONS", payload: data.notifications });
        }
      })
      .catch((err) => console.error("Notifications fetch failed:", err));
  }, [user?.businessId]);

  // חיבור לסוקט והגדרת listeners
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    console.log(
      "Setting up socket listeners in NotificationsProvider"
    );

    const handleConnect = () => {
      console.log(
        "Socket connected, joining business room:",
        user.businessId
      );
      socket.emit("joinBusinessRoom", user.businessId);
    };

    // 2. אירוע newNotification
    const handleNewNotification = ({ data }) => {
      console.log("🔔 newNotification received:", data);
      dispatch({ type: "ADD_NOTIFICATION", payload: data });
    };

    // 3. אירוע newMessage
    const handleNewMessage = (msg) => {
      console.log("💬 newMessage received:", msg);
      dispatch({ type: "ADD_NOTIFICATION", payload: msg.data });
    };

    // 4. עדכוני דשבורד
    const handleDashboard = (stats) => {
      console.log("📊 dashboardUpdate received:", stats);
      dispatch({ type: "SET_DASHBOARD_STATS", payload: stats });
    };

    socket.on("connect", handleConnect);
    if (socket.connected) handleConnect();

    socket.on("newNotification", handleNewNotification);
    socket.on("newMessage", handleNewMessage);
    socket.on("dashboardUpdate", handleDashboard);

    return () => {
      console.log(
        "Cleaning up socket listeners in NotificationsProvider"
      );
      socket.off("connect", handleConnect);
      socket.off("newNotification", handleNewNotification);
      socket.off("newMessage", handleNewMessage);
      socket.off("dashboardUpdate", handleDashboard);
    };
  }, [socket, user?.businessId]);

  const markAsRead = useCallback(async (id) => {
    try {
      await fetch(
        `/api/business/my/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch({ type: "MARK_AS_READ", payload: id });
    } catch (err) {
      console.error("markAsRead error:", err);
    }
  }, []);

  const clearAll = useCallback(
    () => dispatch({ type: "CLEAR_ALL" }),
    []
  );

  const clearRead = useCallback(async () => {
    try {
      const res = await fetch(
        "/api/business/my/notifications/clearRead",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();
      if (data.ok) dispatch({ type: "CLEAR_READ" });
    } catch (err) {
      console.error("clearRead error:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const res = await fetch(
        "/api/business/my/notifications/readAll",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();
      if (data.ok) {
        dispatch({
          type: "SET_NOTIFICATIONS",
          payload: state.notifications.map((n) => ({
            ...n,
            read: true,
            unreadCount: 0,
          })),
        });
      }
    } catch (err) {
      console.error("markAllAsRead error:", err);
    }
  }, [state.notifications]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount,
        dashboardStats: state.dashboardStats,
        markAsRead,
        clearAll,
        clearRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
