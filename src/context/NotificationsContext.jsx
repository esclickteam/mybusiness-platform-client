import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext.jsx";
import API from "../api";

const NotificationsContext = createContext();

const initialState = {
  notifications: [],
  unreadCount: 0,
};

/* ==========================
   NORMALIZE
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
      const list = action.payload
        .filter((n) => n.type !== "message") // ❌ הסרה מוחלטת של התראות הודעות
        .map(normalizeNotification);

      const unreadCount = list.reduce((sum, n) => sum + n.unreadCount, 0);

      return { notifications: list, unreadCount };
    }

    case "UPDATE_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };

    case "ADD_NOTIFICATION": {
      const newNotif = normalizeNotification(action.payload);

      if (newNotif.type === "message") {
        return state; // ❌ לא מוסיפים התראות הודעות
      }

      const exists = state.notifications.some(
        (n) => n.id === newNotif.id || n.threadId === newNotif.threadId
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

  /* === FETCH FROM SERVER === */
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await API.get("/business/my/notifications");
      const data = res.data;

      if (data.ok && data.notifications) {
        const filtered = data.notifications.filter(
          (n) => n.type !== "message" // ❌ הסרת התראות הודעות
        );
        dispatch({ type: "SET_NOTIFICATIONS", payload: filtered });
      }
    } catch (err) {
      console.error("fetchNotifications error:", err);
    }
  }, []);

  useEffect(() => {
    if (user?.businessId) fetchNotifications();
  }, [user?.businessId, fetchNotifications]);

  /* === SOCKET LISTENERS === */
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    const setupListeners = () => {
      socket.emit("joinBusinessRoom", user.businessId);

      // 🔔 התראות רגילות
      socket.on("newNotification", (notif) => {
        if (notif.type !== "message") {
          dispatch({ type: "ADD_NOTIFICATION", payload: notif });
        }
      });

      // ⭐ ביקורות
      socket.on("newReview", (review) => {
        const clientName =
          review?.client?.name || review?.clientName || review?.name || "לקוח";
        const commentPreview = String(review?.comment || "").trim();
        const reviewId = review?._id || review?.id || "";

        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "review",
            text: commentPreview
              ? `⭐ ביקורת חדשה מ-${clientName}: "${commentPreview.slice(0, 80)}"`
              : `⭐ ביקורת חדשה מ-${clientName}`,
            timestamp: review.createdAt || new Date().toISOString(),
            actorName: clientName,
            reviewId,
            unreadCount: 1,
          },
        });
      });

      // 🤖 המלצות AI
      socket.on("newRecommendationNotification", (notif) => {
        dispatch({ type: "ADD_NOTIFICATION", payload: notif });
      });

      // 🔢 COUNTER UPDATE
      socket.on("notificationBundle", (data) => {
        if (typeof data?.count === "number") {
          dispatch({ type: "UPDATE_UNREAD_COUNT", payload: data.count });
        }
      });
    };

    if (socket.connected) setupListeners();
    socket.on("connect", setupListeners);

    return () => {
      socket.off("connect", setupListeners);
      socket.off("newNotification");
      socket.off("newReview");
      socket.off("newRecommendationNotification");
      socket.off("notificationBundle");
    };
  }, [socket, user?.businessId]);

  /* === MARK AS READ === */
  const markAsRead = useCallback(
    async (id) => {
      try {
        await API.put(`/business/my/notifications/${id}/read`);
        dispatch({
          type: "UPDATE_UNREAD_COUNT",
          payload: Math.max(state.unreadCount - 1, 0),
        });
      } catch (err) {
        console.error("markAsRead failed:", err);
      }
    },
    [state.unreadCount]
  );

  /* === CLEAR READ === */
  const clearRead = useCallback(async () => {
    try {
      const res = await API.delete("/business/my/notifications/clearRead");
      const data = res.data;
      if (data.ok) dispatch({ type: "CLEAR_ALL" });
    } catch (err) {
      console.error("clearRead failed:", err);
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
