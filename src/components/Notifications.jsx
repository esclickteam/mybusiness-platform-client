import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";

export default function Notifications({ onClose }) {
  const { user } = useAuth();
  const businessId = user?.businessId;

  const {
    notifications,
    clearAll,
    clearRead,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  // איחוד התראות צ'אט מסוג "message" לפי threadId וסכימת unreadCount
  const dedupedNotifications = React.useMemo(() => {
    const map = new Map();

    for (const notif of notifications) {
      if (notif.type === "message" && notif.threadId) {
        const threadIdStr =
          notif.threadId.toString ? notif.threadId.toString() : notif.threadId;
        if (map.has(threadIdStr)) {
          const existing = map.get(threadIdStr);
          map.set(threadIdStr, {
            ...existing,
            unreadCount: (existing.unreadCount || 0) + (notif.unreadCount || 0),
            timestamp:
              new Date(notif.timestamp) > new Date(existing.timestamp)
                ? notif.timestamp
                : existing.timestamp,
            text:
              new Date(notif.timestamp) > new Date(existing.timestamp)
                ? notif.text
                : existing.text,
            read: existing.read && notif.read, // רק אם שתיהן נקראו
          });
        } else {
          map.set(threadIdStr, { ...notif });
        }
      } else {
        // התראות אחרות נשארות כפי שהן
        map.set(notif.id || notif._id || Math.random().toString(), { ...notif });
      }
    }

    // הסרת התראות עם id לא תקין במקרה שהיו
    return Array.from(map.values()).filter(n => n.id || n._id);
  }, [notifications]);

  // חישוב סך כל ההודעות שלא נקראו
  const totalUnreadCount = React.useMemo(() => {
    return dedupedNotifications.reduce((sum, notif) => {
      // אם יש unreadCount משתמשים בו, אחרת אם לא נקראים מוסיפים 1
      return sum + (notif.unreadCount || (notif.read ? 0 : 1));
    }, 0);
  }, [dedupedNotifications]);

  const handleClick = async (notif) => {
    const id = notif.id || notif._id;
    const idStr = id && (id.toString ? id.toString() : id);

    if (!notif.read && idStr) {
      await markAsRead(idStr);
    }

    if (onClose) onClose();
  };

  const formatDate = (ts) =>
    new Date(ts).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        right: 10,
        width: 320,
        maxHeight: 400,
        overflowY: "auto",
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        borderRadius: 8,
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
          fontWeight: 700,
        }}
      >
        התראות
        {totalUnreadCount > 0 && (
          <div
            style={{
              backgroundColor: "#d00",
              color: "white",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              marginLeft: 10,
              userSelect: "none",
            }}
            title={`${totalUnreadCount} הודעות שלא נקראו`}
          >
            {totalUnreadCount}
          </div>
        )}
        {dedupedNotifications.length > 0 && (
          <>
            <button
              onClick={clearRead}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                fontSize: "0.9rem",
                marginLeft: 10,
              }}
            >
              נקה נקראו
            </button>
            <button
              onClick={markAllAsRead}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              סמן כנקראות
            </button>
          </>
        )}
      </div>

      {dedupedNotifications.length === 0 ? (
        <div style={{ padding: 15, textAlign: "center" }}>אין התראות חדשות</div>
      ) : (
        dedupedNotifications.map((notif) => {
          const key =
            notif.id || notif._id || (notif.threadId ? notif.threadId.toString() : null);
          return (
            <div
              key={key}
              onClick={() => handleClick(notif)}
              style={{
                padding: "10px 15px",
                borderBottom: "1px solid #eee",
                fontWeight: notif.read ? "normal" : "700",
                backgroundColor: notif.read ? "white" : "#e8f4ff",
                cursor: "pointer",
                userSelect: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              title={notif.text}
            >
              <div>{notif.text}</div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#666",
                  opacity: 0.7,
                }}
              >
                {formatDate(notif.timestamp)}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
