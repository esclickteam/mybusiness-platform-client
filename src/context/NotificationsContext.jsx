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

/* ==========================
   NORMALIZE NOTIFICATION
========================== */
function normalizeNotification(notif) {
  let text = notif.text;

  if (notif.type === "taskReminder" && !text?.startsWith("⏰")) {
    text = `⏰ ${text}`;
  }

  return {
    id: notif.id || notif._id?.toString(),
    threadId: notif.threadId || null,
    text,
    read: notif.read ?? false,
    timestamp: notif.timestamp || notif.createdAt || new Date().toISOString(),
    unreadCount: notif.unreadCount ?? (notif.read ? 0 : 1),
    type: notif.type,
    actorName: notif.actorName || null,
    targetUrl: notif.targetUrl || null,
  };
}

/* ==========================
   REDUCER
========================== */
function reducer(state, action) {
  switch (action.type) {
    case "SET_NOTIFICATIONS": {
      const list = action.payload.map(normalizeNotification);

      // AI grouping logic
      const filtered = [];
      const aiThreads = new Set(
        list.filter((n) => n.type === "recommendation").map((n) => n.threadId)
      );

      for (const n of list) {
        if (aiThreads.has(n.threadId)) {
          if (n.type === "recommendation") filtered.push(n);
        } else {
          filtered.push(n);
        }
      }

      const unreadCount = filtered.reduce((sum, n) => sum + n.unreadCount, 0);
      return { notifications: filtered, unreadCount };
    }

    case "UPDATE_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };

    case "ADD_NOTIFICATION": {
      const newNotif = normalizeNotification(action.payload);

      const exists = state.notifications.some(
        (n) =>
          n.id === newNotif.id ||
          (n.threadId === newNotif.threadId && n.type === newNotif.type)
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

/* ==========================
   PROVIDER
========================== */
export function NotificationsProvider({ children }) {
  const { user, socket } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  /* --- Load stored notifications --- */
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/business/my/notifications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.ok && data.notifications) {
        dispatch({ type: "SET_NOTIFICATIONS", payload: data.notifications });
      }
    } catch (err) {
      console.error("[fetchNotifications] failed:", err);
    }
  }, []);

  useEffect(() => {
    if (user?.businessId) fetchNotifications();
  }, [user?.businessId, fetchNotifications]);

  /* ==========================
        SOCKET LISTENERS
  ========================== */
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    const setupListeners = () => {
      socket.emit("joinBusinessRoom", user.businessId);

      socket.on("businessUpdates", (event) => {
        console.log("🔥 businessUpdates:", event);

        const { type, data } = event;

        /** ────────────────
         *  STANDARD NOTIFICATION
         */
        if (type === "newNotification") {
          dispatch({ type: "ADD_NOTIFICATION", payload: data });
        }

        /** ────────────────
         *   NEW MESSAGE
         */
        if (type === "newMessage") {
          const notif = {
            threadId: data.conversationId,
            text: "✉️ New message from a customer",
            timestamp: data.timestamp || new Date().toISOString(),
            read: false,
            unreadCount: 1,
            type: "message",
            actorName: "Customer",
            targetUrl: `/conversations/${data.conversationId}`,
          };
          dispatch({ type: "ADD_NOTIFICATION", payload: notif });
        }

        /** ────────────────
         *   AI RECOMMENDATION
         */
        if (type === "newRecommendationNotification") {
          dispatch({ type: "ADD_NOTIFICATION", payload: data });
        }

        /** ────────────────
         *   UNREAD COUNT UPDATE
         */
        if (type === "unreadMessagesCount") {
          dispatch({ type: "UPDATE_UNREAD_COUNT", payload: data });
        }

        /** ────────────────
         *  NEW REVIEW (legacy)
         */
        if (type === "newReview") {
          const notif = {
            type: "review",
            text: `⭐ New review: "${data.comment}"`,
            timestamp: data.createdAt || new Date().toISOString(),
            read: false,
            unreadCount: 1,
            targetUrl: `/business/${user.businessId}/dashboard/reviews`,
            actorName: "Customer",
          };
          dispatch({ type: "ADD_NOTIFICATION", payload: notif });
        }
      });
    };

    if (socket.connected) setupListeners();
    socket.on("connect", setupListeners);

    return () => {
      socket.off("businessUpdates");
      socket.off("connect", setupListeners);
    };
  }, [socket, user?.businessId]);

  /* ==========================
        MARK AS READ
  ========================== */
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
        console.error("[markAsRead] failed:", err);
      }
    },
    [state.unreadCount]
  );

  /* ==========================
        CLEAR ALL READ
  ========================== */
  const clearRead = useCallback(async () => {
    try {
      const res = await fetch("/api/business/my/notifications/clearRead", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.ok) dispatch({ type: "CLEAR_ALL" });
    } catch (err) {
      console.error("[clearRead] failed:", err);
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

/* ==========================
   HOOK
========================== */
export function useNotifications() {
  return useContext(NotificationsContext);
}
