```javascript
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
  console.log("[normalizeNotification] Input:", notif);

  let text = notif.text;
  // ✅ Handling task reminders
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

function reducer(state, action) {
  switch (action.type) {
    case "SET_NOTIFICATIONS": {
      let list = action.payload.map(normalizeNotification);

      // Keeping special rules for AI
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
      console.log("[SET_NOTIFICATIONS] filtered:", filtered);
      return { notifications: filtered, unreadCount };
    }

    case "UPDATE_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };

    case "ADD_NOTIFICATION": {
      const newNotif = normalizeNotification(action.payload);
      console.log("[ADD_NOTIFICATION] newNotif:", newNotif);

      // Do not add a regular client message if there is already an AI recommendation
      if (
        newNotif.type === "message" &&
        state.notifications.some(
          (n) => n.threadId === newNotif.threadId && n.type === "recommendation"
        )
      ) {
        console.log("[ADD_NOTIFICATION] AI recommendation exists, skipping regular");
        return state;
      }

      // If this is an AI recommendation – replace regular
      if (newNotif.type === "recommendation") {
        const list = [
          newNotif,
          ...state.notifications.filter((n) => n.threadId !== newNotif.threadId),
        ];
        const unreadCount = list.reduce((sum, n) => sum + n.unreadCount, 0);
        return { notifications: list, unreadCount };
      }

      // Regular – do not insert duplicates
      const exists = state.notifications.some(
        (n) =>
          n.id === newNotif.id ||
          (n.threadId &&
            n.threadId === newNotif.threadId &&
            n.type === newNotif.type)
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

    const onConnect = () => {
      socket.emit("joinBusinessRoom", user.businessId);

      // 📩 New messages
      socket.on("newMessage", (msg) => {
        const senderRole = msg.role || "client";
        const notif = {
          threadId: msg.conversationId,
          text: `✉️ New message from ${
            senderRole === "client" ? "client" : "business"
          }`,
          timestamp: msg.timestamp || msg.createdAt,
          read: false,
          unreadCount: 1,
          type: "message",
          actorName: senderRole === "client" ? "client" : "business",
        };
        dispatch({ type: "ADD_NOTIFICATION", payload: notif });
      });

      // 🔔 Regular notifications (including taskReminder)
      socket.on("newNotification", (notif) => {
        dispatch({ type: "ADD_NOTIFICATION", payload: notif });
      });

      // 🤖 AI notifications
      socket.on("newRecommendationNotification", (notif) => {
        dispatch({ type: "ADD_NOTIFICATION", payload: notif });
      });

      // 📊 Update unread messages count
      socket.on("unreadMessagesCount", (count) => {
        dispatch({ type: "UPDATE_UNREAD_COUNT", payload: count });
      });
    };

    socket.on("connect", onConnect);
    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("newMessage");
      socket.off("newNotification");
      socket.off("newRecommendationNotification");
      socket.off("unreadMessagesCount");
    };
  }, [socket, user?.businessId]);

  const markAsRead = useCallback(
    async (id) => {
      await fetch(`/api/business/my/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch({
        type: "UPDATE_UNREAD_COUNT",
        payload: Math.max(state.unreadCount - 1, 0),
      });
    },
    [state.unreadCount]
  );

  const clearRead = useCallback(async () => {
    const res = await fetch("/api/business/my/notifications/clearRead", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
```