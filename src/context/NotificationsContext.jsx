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
   🧩 Helper: Normalize Notification
   ========================== */
function normalizeNotification(notif) {
  console.log("[normalizeNotification] input:", notif);

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
   ⚙️ Reducer
   ========================== */
function reducer(state, action) {
  switch (action.type) {
    case "SET_NOTIFICATIONS": {
      const list = action.payload.map(normalizeNotification);

      // הסרת כפילויות של המלצות AI לעומת הודעות רגילות
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

      // אל תוסיף הודעת לקוח אם כבר יש המלצה של AI באותו thread
      if (
        newNotif.type === "message" &&
        state.notifications.some(
          (n) => n.threadId === newNotif.threadId && n.type === "recommendation"
        )
      ) {
        console.log("[ADD_NOTIFICATION] AI recommendation exists, skipping regular");
        return state;
      }

      // אם זו המלצת AI — החלף את ההתראה הרגילה
      if (newNotif.type === "recommendation") {
        const list = [
          newNotif,
          ...state.notifications.filter((n) => n.threadId !== newNotif.threadId),
        ];
        const unreadCount = list.reduce((sum, n) => sum + n.unreadCount, 0);
        return { notifications: list, unreadCount };
      }

      // התראה רגילה – אל תוסיף כפילויות
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

/* ==========================
   🧠 Provider
   ========================== */
export function NotificationsProvider({ children }) {
  const { user, socket } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  /* === Fetch existing notifications === */
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
      console.error("[fetchNotifications] failed:", err);
    }
  }, []);

  useEffect(() => {
    if (user?.businessId) fetchNotifications();
  }, [user?.businessId, fetchNotifications]);

  /* === Socket real-time listeners === */
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    const setupListeners = () => {
      console.log("[Socket] joining business room", user.businessId);
      socket.emit("joinBusinessRoom", user.businessId);

      // 🔔 התראות כלליות
      socket.on("newNotification", (notif) => {
        console.log("[Socket] newNotification:", notif);
        dispatch({ type: "ADD_NOTIFICATION", payload: notif });
      });

      // ✉️ הודעות חדשות
      socket.on("newMessage", (msg) => {
        console.log("[Socket] newMessage:", msg);
        const senderRole = msg.role || "client";
        const notif = {
          threadId: msg.conversationId,
          text: `✉️ New message from ${
            senderRole === "client" ? "a customer" : "a business"
          }`,
          timestamp: msg.timestamp || msg.createdAt,
          read: false,
          unreadCount: 1,
          type: "message",
          actorName: senderRole === "client" ? "Customer" : "Business",
        };
        dispatch({ type: "ADD_NOTIFICATION", payload: notif });
      });

      // 🤖 התראות AI
      socket.on("newRecommendationNotification", (notif) => {
        console.log("[Socket] newRecommendationNotification:", notif);
        dispatch({ type: "ADD_NOTIFICATION", payload: notif });
      });

      // 🔢 עדכון מונה כולל (notificationBundle)
      socket.on("notificationBundle", (data) => {
        console.log("[Socket] notificationBundle:", data);
        if (typeof data?.count === "number") {
          dispatch({ type: "UPDATE_UNREAD_COUNT", payload: data.count });
        }
      });
    };

    // מאזינים גם אם כבר מחובר
    if (socket.connected) setupListeners();
    socket.on("connect", setupListeners);

    return () => {
      socket.off("connect", setupListeners);
      socket.off("newMessage");
      socket.off("newNotification");
      socket.off("newRecommendationNotification");
      socket.off("notificationBundle");
    };
  }, [socket, user?.businessId]);

  /* === Mark as read === */
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

  /* === Clear all read notifications === */
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
   📡 Hook
   ========================== */
export function useNotifications() {
  return useContext(NotificationsContext);
}
