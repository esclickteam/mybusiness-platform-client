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

  // fetch initial list
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/business/my/notifications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.ok && data.notifications) {
        dispatch({ type: "SET_NOTIFICATIONS", payload: data.notifications });
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (user?.businessId) fetchNotifications();
  }, [user?.businessId, fetchNotifications]);

  useEffect(() => {
    if (!socket || !user?.businessId) return;

    // handlers
    const onBundle = (payload) =>
      dispatch({ type: "UPDATE_UNREAD_COUNT", payload: payload.count });
    const onNew = (notif) =>
      dispatch({ type: "ADD_NOTIFICATION", payload: notif });
    const onCount = (count) =>
      dispatch({ type: "UPDATE_UNREAD_COUNT", payload: count });
    const logAll = (event, ...args) =>
      console.log("📡 socket event:", event, ...args);

    // on connect/reconnect
    const onConnect = () => {
      console.log("[Notifications] connected, joining:", user.businessId);
      socket.emit("joinBusinessRoom", user.businessId);

      socket.on("notificationBundle", onBundle);
      socket.on("newNotification", onNew);
      socket.on("unreadMessagesCount", onCount);
      socket.onAny(logAll);
    };

    socket.on("connect", onConnect);
    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("notificationBundle", onBundle);
      socket.off("newNotification", onNew);
      socket.off("unreadMessagesCount", onCount);
      socket.offAny(logAll);
    };
  }, [socket, user?.businessId]);

  const markAsRead = useCallback(
    async (id) => {
      try {
        await fetch(`/api/business/my/notifications/${id}/read`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        dispatch({
          type: "UPDATE_UNREAD_COUNT",
          payload: Math.max(state.unreadCount - 1, 0),
        });
      } catch (err) {
        console.error(err);
      }
    },
    [state.unreadCount]
  );

  const clearRead = useCallback(async () => {
    try {
      const res = await fetch("/api/business/my/notifications/clearRead", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.ok) dispatch({ type: "CLEAR_ALL" });
    } catch (err) {
      console.error(err);
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
