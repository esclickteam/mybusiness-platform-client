import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function Notifications({ socket, user, onClose, clearNotifications }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // טען התראות מהשרת בתחילת טעינת קומפוננטה
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    async function loadNotifications() {
      try {
        const res = await fetch("/api/business/my/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.ok) setNotifications(data.notifications);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    }
    loadNotifications();
  }, [user]);

  // הצטרפות לחדר Socket.IO לפי businessId
  useEffect(() => {
    if (!socket || !user?.businessId) return;
    socket.emit("joinBusinessRoom", user.businessId);
    console.log(`Requested joinBusinessRoom for business-${user.businessId}`);
  }, [socket, user]);

  // יצירת התראה חדשה על פי אירוע
  const handler = useCallback(
    (data, event) => {
      let newNotif = {};

      if (event === "newNotification") {
        newNotif = {
          id: data._id || data.id || Date.now(),
          type: data.type || "notification",
          actorName: data.actorName || data.fromName || "משתמש",
          text: data.text || data.message || "התראה חדשה",
          read: false,
          timestamp: data.timestamp || data.createdAt || Date.now(),
          targetUrl: data.targetUrl || "/",
        };
      } else if (event === "reviewCreated") {
        newNotif = {
          id: data._id || data.id || Date.now(),
          type: "review",
          actorName: data.userName || data.actorName || "משתמש",
          text: `⭐ ${data.userName || data.actorName || "משתמש"} השאיר ביקורת: "${data.comment || "ביקורת חדשה"}" - ציון ממוצע: ${data.averageScore || "?"}`,
          read: false,
          timestamp: data.createdAt || Date.now(),
          targetUrl: "/reviews",
        };
      } else if (event === "appointmentCreated") {
        newNotif = {
          id: data._id || data.id || Date.now(),
          type: "meeting",
          actorName: data.userName || data.actorName || "משתמש",
          text: `📅 פגישה חדשה מתוזמנת על ידי ${data.userName || data.actorName || "משתמש"}`,
          read: false,
          timestamp: data.createdAt || Date.now(),
          targetUrl: "/meetings",
        };
      } else if (event === "newMessage") {
        newNotif = {
          id: data._id || data.id || Date.now(),
          type: "message",
          actorName: data.fromName || data.actorName || "משתמש",
          text: data.content || "התקבלה הודעה חדשה",
          read: false,
          timestamp: data.timestamp || Date.now(),
          targetUrl: "/messages",
        };
      } else if (event === "profileViewsUpdated") {
        newNotif = {
          id: `pv-${Date.now()}`,
          type: "info",
          actorName: "מערכת",
          text: `👁️ צפיות בפרופיל עודכנו: ${data.views_count}`,
          read: false,
          timestamp: Date.now(),
          targetUrl: "/dashboard",
        };
      } else if (event === "dashboardUpdate") {
        // לא מציג התראה, רק console
        console.log("Dashboard stats updated", data);
        return;
      } else {
        // אירועים נוספים
        newNotif = {
          id: data._id || data.id || Date.now(),
          type: data.type || "notification",
          actorName: data.actorName || "משתמש",
          text: data.text || "התראה חדשה",
          read: false,
          timestamp: data.timestamp || data.createdAt || Date.now(),
          targetUrl: data.targetUrl || "/",
        };
      }

      setNotifications((prev) => {
        if (prev.some((n) => n.id === newNotif.id)) return prev;
        return [newNotif, ...prev];
      });
    },
    [setNotifications]
  );

  // האזנה לאירועים ב־Socket.IO
  useEffect(() => {
    if (!socket) return;

    const events = [
      "newNotification",
      "reviewCreated",
      "appointmentCreated",
      "newMessage",
      "profileViewsUpdated",
      "dashboardUpdate",
    ];

    const eventHandlers = events.map((event) => {
      const fn = (data) => handler(data, event);
      socket.on(event, fn);
      return { event, fn };
    });

    return () => eventHandlers.forEach(({ event, fn }) => socket.off(event, fn));
  }, [socket, handler]);

  // שאר הפונקציות והתצוגה נותרו ללא שינוי

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await fetch(`/api/business/my/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleClick = (notif) => {
    if (!notif.read) markAsRead(notif.id);
    if (notif.targetUrl) navigate(notif.targetUrl);
    else {
      switch (notif.type) {
        case "message": navigate("/messages"); break;
        case "collaboration": navigate("/collaborations"); break;
        case "meeting": navigate("/meetings"); break;
        case "review": navigate("/reviews"); break;
        default: break;
      }
    }
    onClose();
  };

  // ניקוי כל ההתראות (סימון כולן נקראות)
  const handleClearAll = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/business/my/notifications/readAll", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.ok) {
        setNotifications([]);
        if (clearNotifications) clearNotifications();
      } else {
        console.error("Failed to clear notifications on server:", data.error);
      }
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  // ניקוי רק התראות שנקראו
  const handleClearReadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/business/my/notifications/clearRead", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.ok) {
        setNotifications((prev) => prev.filter((notif) => !notif.read));
        if (clearNotifications) clearNotifications();
      } else {
        console.error("Failed to clear read notifications on server:", data.error);
      }
    } catch (err) {
      console.error("Failed to clear read notifications:", err);
    }
  };

  // פונקציית עזר לעיצוב תאריך
  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "40px",
        right: "10px",
        width: "320px",
        maxHeight: "400px",
        overflowY: "auto",
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        borderRadius: "8px",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "700",
        }}
      >
        התראות
        {notifications.length > 0 && (
          <>
            <button
              onClick={handleClearReadNotifications}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                fontSize: "0.9rem",
                marginLeft: 10,
              }}
              aria-label="נקה את כל ההתראות שכבר נקראו"
            >
              נקה נקראות
            </button>
            <button
              onClick={handleClearAll}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
              aria-label="סמן את כל ההתראות כנקראות"
            >
              סמן כנקראות
            </button>
          </>
        )}
      </div>

      {notifications.length === 0 && (
        <div style={{ padding: "15px", textAlign: "center" }}>אין התראות חדשות</div>
      )}

      {notifications.map((notif) => (
        <div
          key={notif.id}
          onClick={() => handleClick(notif)}
          style={{
            padding: "10px 15px",
            borderBottom: "1px solid #eee",
            fontWeight: notif.read ? "normal" : "700",
            backgroundColor: notif.read ? "white" : "#e8f4ff",
            cursor: "pointer",
            userSelect: "none",
          }}
          title={notif.text}
        >
          <div>{notif.text}</div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#666",
              opacity: 0.7,
              marginTop: 4,
            }}
          >
            {formatDate(notif.timestamp)}
          </div>
        </div>
      ))}
    </div>
  );
}
