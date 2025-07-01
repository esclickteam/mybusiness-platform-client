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

// עדכון: הנורמליזציה חייבת להחזיר id שהוא threadId (ולא הודעה)
function normalizeNotification(notif) {
  return {
    ...notif,
    // חובה! לזהות threadId או מזהה שיחה כ-id להתראה.
    id: notif.threadId || notif.chatId || notif.id || notif._id?.toString(),
    lastMessage: notif.lastMessage, // תעדכן פה את שדה ההודעה האחרונה אם צריך
    read: notif.read ?? false,
    timestamp: notif.timestamp || notif.createdAt || new Date().toISOString(),
  };
}

// Reducer בסגנון פייסבוק – שורה אחת לכל thread עם הודעה לא נקראה
function notificationsReducer(state, action) {
  switch (action.type) {
    case "SET_NOTIFICATIONS": {
      // מיזוג התראות לפי threadId בלבד
      const incoming = action.payload.map(normalizeNotification);
      const map = new Map();
      state.notifications.forEach(n => map.set(n.id, n));
      incoming.forEach(n => map.set(n.id, n));
      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      return { ...state, notifications: merged };
    }

    case "ADD_NOTIFICATION": {
      const normalized = normalizeNotification(action.payload);
      const exists = state.notifications.find(n => n.id === normalized.id);
      let newNotifications;
      if (exists) {
        // מעדכן את שורת ההתראה – תמיד שם כלא נקרא, ומעדכן הודעה אחרונה
        newNotifications = state.notifications.map(n =>
          n.id === normalized.id
            ? { ...n, ...normalized, read: false } // תמיד מסמן לא נקרא כשהגיעה הודעה חדשה
            : n
        );
      } else {
        newNotifications = [normalized, ...state.notifications];
      }
      // ממיין מחדש לפי תאריך (כך שהשיחה עם ההודעה הכי עדכנית תהיה למעלה)
      newNotifications.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      return { ...state, notifications: newNotifications };
    }

    case "MARK_AS_READ": {
      const id = action.payload;
      const updated = state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      return { ...state, notifications: updated };
    }

    case "CLEAR_ALL": {
      return { ...state, notifications: [] };
    }

    case "CLEAR_READ": {
      const filtered = state.notifications.filter(n => !n.read);
      return { ...state, notifications: filtered };
    }

    case "SET_DASHBOARD_STATS": {
      return { ...state, dashboardStats: action.payload };
    }

    default:
      return state;
  }
}

export function NotificationsProvider({ children }) {
  const { user, socket } = useAuth();

  const [state, dispatch] = useReducer(notificationsReducer, initialState);

  // מונה שיחות לא נקראו (בסגנון פייסבוק)
  const unreadCount = state.notifications.filter(n => !n.read).length;

  // טעינת התראות ראשוניות
  useEffect(() => {
    if (!user?.businessId) return;
    fetch("/api/business/my/notifications", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          dispatch({ type: "SET_NOTIFICATIONS", payload: data.notifications });
        } else {
          console.warn("Fetch notifications returned not ok:", data);
        }
      })
      .catch(err => console.error("Notifications fetch failed:", err));
  }, [user?.businessId]);

  // האזנה ל־socket לאירועים חיים
  useEffect(() => {
    if (!socket || !user?.businessId) return;

    const handleConnect = () => {
      socket.emit("joinBusinessRoom", user.businessId);
    };

    const handleBundle = ({ count, lastNotification }) => {
      if (lastNotification) {
        dispatch({ type: "ADD_NOTIFICATION", payload: lastNotification });
      }
    };

    const handleNew = notif => {
      dispatch({ type: "ADD_NOTIFICATION", payload: notif });
    };

    const handleDashboard = stats => {
      dispatch({ type: "SET_DASHBOARD_STATS", payload: stats });
    };

    socket.on("connect", handleConnect);
    if (socket.connected) handleConnect();

    socket.on("notificationBundle", handleBundle);
    socket.on("newNotification", handleNew);
    socket.on("dashboardUpdate", handleDashboard);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("notificationBundle", handleBundle);
      socket.off("newNotification", handleNew);
      socket.off("dashboardUpdate", handleDashboard);
    };
  }, [socket, user?.businessId]);

  // סימון שיחה כנקראה
  const markAsRead = useCallback(async (threadId) => {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ threadId }), // שים לב: threadId!
      });
      dispatch({ type: "MARK_AS_READ", payload: threadId });
    } catch (err) {
      console.error("markAsRead error:", err);
    }
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: "CLEAR_ALL" });
  }, []);

  const clearRead = useCallback(() => {
    dispatch({ type: "CLEAR_READ" });
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount,
        dashboardStats: state.dashboardStats,
        markAsRead,
        clearAll,
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
