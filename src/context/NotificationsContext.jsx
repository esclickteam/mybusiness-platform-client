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

  const fetchNotifications = useCallback(async () => {
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
      console.error("[NotificationsContext] Failed to fetch notifications:", err);
    }
  }, []);

  const addNotification = useCallback((notif) => {
    dispatch({ type: "ADD_NOTIFICATION", payload: notif });
  }, []);

  useEffect(() => {
    if (user?.businessId) {
      fetchNotifications();
    }
  }, [user?.businessId, fetchNotifications]);

  useEffect(() => {
    if (!socket || !user?.businessId) return;

    const join = () => {
      console.log("[NotificationsContext] Joining business room:", user.businessId);
      socket.emit("joinBusinessRoom", user.businessId);
    };

    const onBundle = (payload) => {
      console.log("[NotificationsContext] notificationBundle received:", payload);
      if (typeof payload.count === "number") {
        dispatch({ type: "UPDATE_UNREAD_COUNT", payload: payload.count });
      }
    };

    const onNew = (notif) => {
      console.log("[NotificationsContext] newNotification received:", notif);
      dispatch({ type: "ADD_NOTIFICATION", payload: notif });
    };

    socket.on("connect", join);
    if (socket.connected) join();

    socket.on("notificationBundle", onBundle);
    socket.on("newNotification", onNew);

    // ✅ DEBUG: לוג על כל אירוע שמתקבל מה־socket
    const logAll = (event, ...args) => {
      console.log("📡 socket event:", event, ...args);
    };
    socket.onAny(logAll);

    return () => {
      socket.off("connect", join);
      socket.off("notificationBundle", onBundle);
      socket.off("newNotification", onNew);
      socket.offAny(logAll);
    };
  }, [socket, user?.businessId]);

  const markAsRead = useCallback(
    async (id) => {
      try {
        await fetch(`/api/business/my/notifications/${id}/read`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        dispatch({ type: "UPDATE_UNREAD_COUNT", payload: Math.max(state.unreadCount - 1, 0) });
      } catch (err) {
        console.error("[NotificationsContext] markAsRead error:", err);
      }
    },
    [state.unreadCount]
  );

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
        console.error("[NotificationsContext] clearRead failed:", data.error);
      }
    } catch (err) {
      console.error("[NotificationsContext] clearRead error:", err);
    }
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        markAsRead,
        clearRead,
        addNotification,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
