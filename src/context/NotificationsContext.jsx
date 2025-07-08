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
};

function normalizeNotification(notif) {
  return {
    id: notif.threadId || notif.id || notif._id?.toString(),
    threadId: notif.threadId || null,
    text: notif.text,
    read: notif.read ?? false,
    timestamp: notif.timestamp || notif.createdAt,
    unreadCount: notif.unreadCount ?? (notif.read ? 0 : 1),
    type: notif.type,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_NOTIFICATIONS": {
      const list = action.payload.map(normalizeNotification);
      const unreadCount = list.reduce((sum, n) => sum + n.unreadCount, 0);
      return { notifications: list, unreadCount };
    }
    case "UPDATE_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };
    case "ADD_NOTIFICATION": {
      const newNotif = normalizeNotification(action.payload);
      const exists = state.notifications.some(
        (n) => n.id === newNotif.id || (n.threadId && n.threadId === newNotif.threadId)
      );
      const list = exists
        ? state.notifications
        : [newNotif, ...state.notifications];
      const unreadCount = list.reduce((sum, n) => sum + n.unreadCount, 0);
      return { notifications: list, unreadCount };
    }
    case "CLEAR_ALL":
      return { notifications: [], unreadCount: 0 };
    default:
      return state;
  }
}

export function NotificationsProvider({ children }) {
  const { user, socket } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  // 1) Fetch unread/pending notifications when business connects or user changes
  useEffect(() => {
    if (!user?.businessId) return;

    async function fetchNotifications() {
      try {
        const res = await fetch("/api/business/my/notifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        if (data.ok && data.notifications) {
          dispatch({ type: "SET_NOTIFICATIONS", payload: data.notifications });
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    }

    fetchNotifications();
  }, [user?.businessId]);

  // 2) Listen for unread-count bundles
  useEffect(() => {
    if (!socket || !user?.businessId) return;
    const join = () => socket.emit("joinBusinessRoom", user.businessId);
    const onBundle = (payload) => {
      if (typeof payload.count === "number") {
        dispatch({ type: "UPDATE_UNREAD_COUNT", payload: payload.count });
      }
    };
    socket.on("connect", join);
    if (socket.connected) join();
    socket.on("notificationBundle", onBundle);
    return () => {
      socket.off("connect", join);
      socket.off("notificationBundle", onBundle);
    };
  }, [socket, user?.businessId]);

  // 3) Listen for new notifications in real time
  useEffect(() => {
    if (!socket || !user?.businessId) return;
    const onNew = (notif) => {
      dispatch({ type: "ADD_NOTIFICATION", payload: notif });
    };
    socket.on("newNotification", onNew);
    return () => {
      socket.off("newNotification", onNew);
    };
  }, [socket, user?.businessId]);

  // 4) Mark single as read
  const markAsRead = useCallback(
    async (id) => {
      try {
        await fetch(`/api/business/my/notifications/${id}/read`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        dispatch({ type: "UPDATE_UNREAD_COUNT", payload: state.unreadCount - 1 });
      } catch (err) {
        console.error("markAsRead error:", err);
      }
    },
    [state.unreadCount]
  );

  // 5) Clear all notifications
  const clearRead = useCallback(async () => {
    try {
      const res = await fetch("/api/business/my/notifications/clearRead", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.ok) {
        dispatch({ type: "CLEAR_ALL" });
      } else {
        console.error("clearRead failed:", data.error);
      }
    } catch (err) {
      console.error("clearRead error:", err);
    }
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        markAsRead,
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
