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
  return {
    id: notif.id || notif._id?.toString(),
    threadId: notif.threadId || null,
    text: notif.text,
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
      const unreadCount = list.reduce((sum, n) => sum + n.unreadCount, 0);
      return { notifications: list, unreadCount };
    }

    case "ADD_NOTIFICATION": {
  const newNotif = normalizeNotification(action.payload);

  const list = [...state.notifications];

  let idx;

  if (newNotif.threadId) {
    // 🟣 מאחד לפי שיחה
    idx = list.findIndex(n => n.threadId === newNotif.threadId);
  } else {
    // 🟢 מאחד לפי ID להתראות כלליות
    idx = list.findIndex(n => n.id === newNotif.id);
  }

  if (idx !== -1) {
    list[idx] = { ...list[idx], ...newNotif };
  } else {
    list.unshift(newNotif);
  }

  const unreadCount = list.reduce((sum, n) => sum + n.unreadCount, 0);

  return { notifications: list, unreadCount };
}



     case "UPDATE_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };

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

  /* Load saved notifications */
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

        /** 1️⃣ Notifications stored in Mongo */
        if (type === "newNotification") {
          dispatch({ type: "ADD_NOTIFICATION", payload: data });
        }

        /** 2️⃣ AI Recommendation Notification */
        if (type === "newRecommendationNotification") {
          dispatch({ type: "ADD_NOTIFICATION", payload: data });
        }

        /** 3️⃣ Unread messages count */
        if (type === "unreadMessagesCount") {
          dispatch({ type: "UPDATE_UNREAD_COUNT", payload: data });
        }

        /** 4️⃣ New Review */
        if (type === "newReview") {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              text: `⭐ New review: "${data.comment}"`,
              timestamp: data.createdAt || new Date().toISOString(),
              read: false,
              unreadCount: 1,
              type: "review",
              targetUrl: `/business/${user.businessId}/dashboard/reviews`,
              actorName: "Customer",
            },
          });
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
     CLEAR ALL
  ========================== */
  const clearRead = useCallback(async () => {
    try {
      const res = await fetch("/api/business/my/notifications/clearRead", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await res.json();
      if (data.ok) {
        dispatch({ type: "CLEAR_ALL" });
      }
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

export function useNotifications() {
  return useContext(NotificationsContext);
}
