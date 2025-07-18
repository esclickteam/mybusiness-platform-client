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
  console.log('[normalizeNotification] קלט:', notif);
  return {
    id: notif.id || notif._id?.toString(),
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
      let list = action.payload.map(normalizeNotification);
      // עבור כל thread, שמור רק AI אם קיים, אחרת רגילה
      const filtered = [];
      const aiThreads = new Set(
        list.filter(n => n.type === "recommendation").map(n => n.threadId)
      );
      for (const n of list) {
        if (aiThreads.has(n.threadId)) {
          if (n.type === "recommendation") filtered.push(n);
        } else {
          filtered.push(n);
        }
      }
      const unreadCount = filtered.reduce((sum, n) => sum + n.unreadCount, 0);
      console.log('[SET_NOTIFICATIONS] filtered:', filtered);
      return { notifications: filtered, unreadCount };
    }
    case "UPDATE_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };
    case "ADD_NOTIFICATION": {
      const newNotif = normalizeNotification(action.payload);
      console.log('[ADD_NOTIFICATION] newNotif:', newNotif);

      // יש כבר AI לאותו thread? (אל תכניס רגילה)
      if (
        newNotif.type === "message" &&
        state.notifications.some(
          n =>
            n.threadId === newNotif.threadId &&
            n.type === "recommendation"
        )
      ) {
        console.log('[ADD_NOTIFICATION] קיימת המלצת AI, מדלג על רגילה');
        return state;
      }

      // אם זו המלצת AI – מחק רגילה לאותו thread, והכנס רק אותה
      if (newNotif.type === "recommendation") {
        const list = [
          newNotif,
          ...state.notifications.filter(
            n => n.threadId !== newNotif.threadId
          ),
        ];
        const unreadCount = list.reduce((sum, n) => sum + n.unreadCount, 0);
        console.log('[ADD_NOTIFICATION] AI Recommendation נכנסה:', list);
        return { notifications: list, unreadCount };
      }

      // רגילה – אם כבר קיימת בדיוק התראה זהה לא להוסיף (מניעת כפילות כללית)
      const exists = state.notifications.some(
        n =>
          n.id === newNotif.id ||
          (n.threadId && n.threadId === newNotif.threadId && n.type === newNotif.type)
      );
      const list = exists
        ? state.notifications
        : [newNotif, ...state.notifications];
      const unreadCount = list.reduce((sum, n) => sum + n.unreadCount, 0);
      if (!exists) {
        console.log('[ADD_NOTIFICATION] הוספה רגילה:', newNotif);
      } else {
        console.log('[ADD_NOTIFICATION] רגילה קיימת, לא נוסף');
      }
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
        console.log('[fetchNotifications] מהשרת:', data.notifications);
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

      // הודעות חדשות
      socket.on("newMessage", msg => {
        const senderRole = msg.role || "client";
        const notif = {
          threadId: msg.conversationId,
          text: `✉️ הודעה חדשה מ${senderRole === "client" ? "לקוח" : "עסק"}`,
          timestamp: msg.timestamp || msg.createdAt,
          read: false,
          unreadCount: 1,
          type: "message",
          actorName: senderRole === "client" ? "לקוח" : "עסק",
        };
        console.log('[socket newMessage]', notif);
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: notif,
        });
      });

      // התראות רגילות
      socket.on("newNotification", notif => {
        console.log('[socket newNotification]', notif);
        dispatch({ type: "ADD_NOTIFICATION", payload: notif });
      });

      // התראות AI ייעודיות
      socket.on("newRecommendationNotification", notif => {
        console.log('[socket newRecommendationNotification]', notif);
        dispatch({ type: "ADD_NOTIFICATION", payload: notif });
      });

      // עדכון ספירת שלא נקראו
      socket.on("unreadMessagesCount", count => {
        console.log('[socket unreadMessagesCount]', count);
        dispatch({ type: "UPDATE_UNREAD_COUNT", payload: count });
      });
    };

    socket.on("connect", onConnect);
    if (socket.connected) onConnect();

    // נקיון מאזינים
    return () => {
      socket.off("connect", onConnect);
      socket.off("newMessage");
      socket.off("newNotification");
      socket.off("newRecommendationNotification");
      socket.off("unreadMessagesCount");
    };
  }, [socket, user?.businessId]);

  const markAsRead = useCallback(
    async id => {
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
