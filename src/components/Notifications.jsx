import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationsContext";

export default function Notifications({ onClose }) {
  const { notifications, clearAllNotifications, clearReadNotifications } = useNotifications();
  const [localNotifications, setLocalNotifications] = useState([]);
  const navigate = useNavigate();

  // סנכרון התראות מקונטקסט ל-local state
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const handler = useCallback(
    (data, event) => {
      let newNotif = {};
      switch (event) {
        case "newNotification":
          newNotif = {
            id: data._id || data.id || Date.now(),
            type: data.type || "notification",
            actorName: data.actorName || data.fromName || "משתמש",
            text: data.text || data.message || "התראה חדשה",
            read: false,
            timestamp: data.timestamp || data.createdAt || Date.now(),
            targetUrl: data.targetUrl || "/",
          };
          break;

        case "reviewCreated":
          newNotif = {
            id: data._id || data.id || Date.now(),
            type: "review",
            actorName: data.userName || data.actorName || "משתמש",
            text: `⭐ ${data.userName || data.actorName || "משתמש"} השאיר ביקורת: "${data.comment || "ביקורת חדשה"}" - ציון ממוצע: ${data.averageScore || "?"}`,
            read: false,
            timestamp: data.createdAt || Date.now(),
            targetUrl: "/reviews",
          };
          break;

        case "appointmentCreated":
          newNotif = {
            id: data._id || data.id || Date.now(),
            type: "meeting",
            actorName: data.userName || data.actorName || "משתמש",
            text: `📅 פגישה חדשה מתוזמנת על ידי ${data.userName || data.actorName || "משתמש"}`,
            read: false,
            timestamp: data.createdAt || Date.now(),
            targetUrl: "/meetings",
          };
          break;

        case "newMessage":
          newNotif = {
            id: data._id || data.id || Date.now(),
            type: "message",
            actorName: data.fromName || data.actorName || "משתמש",
            text: data.content || "התקבלה הודעה חדשה",
            read: false,
            timestamp: data.timestamp || Date.now(),
            targetUrl: "/messages",
          };
          break;

        case "profileViewsUpdated":
          newNotif = {
            id: `pv-${Date.now()}`,
            type: "info",
            actorName: "מערכת",
            text: `👁️ צפיות בפרופיל עודכנו: ${data.views_count}`,
            read: false,
            timestamp: Date.now(),
            targetUrl: "/dashboard",
          };
          break;

        case "dashboardUpdate":
          console.log("Dashboard stats updated", data);
          return;

        default:
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
      // כאן במקום dispatch מוסיפים התראה חדשה ישירות בקונטקסט - צריך להתאים לפי מימוש הקונטקסט שלך
      // לדוגמה: addNotification(newNotif);
      setLocalNotifications(prev => [newNotif, ...prev]);
    },
    []
  );

  // סימון קריאה – תוכל לשלב קריאה לשרת ולעדכן קונטקסט במידת הצורך
  const markAsRead = async id => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await fetch(`/api/business/my/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      setLocalNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleClick = notif => {
    if (!notif.read) markAsRead(notif.id);
    const url = notif.targetUrl || {
      message: "/messages",
      collaboration: "/collaborations",
      meeting: "/meetings",
      review: "/reviews",
    }[notif.type] || "/";
    navigate(url);
    onClose();
  };

  const formatDate = ts => new Date(ts).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });

  return (
    <div style={{
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
    }}>
      <div style={{
        padding: "8px 12px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: "700",
      }}>
        התראות
        {localNotifications.length > 0 && (
          <>
            <button onClick={clearReadNotifications} style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", fontSize: "0.9rem", marginLeft: 10 }} aria-label="נקה את כל ההתראות שכבר נקראו">
              נקה נקראו
            </button>
            <button onClick={clearAllNotifications} style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", fontSize: "0.9rem" }} aria-label="סמן את כל ההתראות כנקראות">
              סמן כנקראות
            </button>
          </>
        )}
      </div>
      {localNotifications.length === 0 ? (
        <div style={{ padding: "15px", textAlign: "center" }}>אין התראות חדשות</div>
      ) : (
        localNotifications.map(notif => (
          <div key={notif.id} onClick={() => handleClick(notif)} style={{
            padding: "10px 15px",
            borderBottom: "1px solid #eee",
            fontWeight: notif.read ? "normal" : "700",
            backgroundColor: notif.read ? "white" : "#e8f4ff",
            cursor: "pointer",
            userSelect: "none",
          }} title={notif.text}>
            <div>{notif.text}</div>
            <div style={{ fontSize: "0.75rem", color: "#666", opacity: 0.7, marginTop: 4 }}>{formatDate(notif.timestamp)}</div>
          </div>
        ))
      )}
    </div>
  );
}
