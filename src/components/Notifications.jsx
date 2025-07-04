import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";

export default function Notifications({ onClose }) {
  const { user } = useAuth();
  const businessId = user?.businessId;

  const {
    notifications,
    clearRead,
    markAsRead,
    markAllAsRead,
    unreadCount, // סך כל ההודעות שלא נקראו מהקונטקסט (bundle)
  } = useNotifications();

  // איחוד התראות מסוג "message" לפי threadId, אך לא מציגים בועות ליד כל הודעה
  const dedupedNotifications = React.useMemo(() => {
    const map = new Map();

    for (const notif of notifications) {
      if (notif.type === "message" && notif.threadId) {
        const threadIdStr = notif.threadId.toString
          ? notif.threadId.toString()
          : notif.threadId;
        if (map.has(threadIdStr)) {
          const existing = map.get(threadIdStr);
          map.set(threadIdStr, {
            ...existing,
            timestamp:
              new Date(notif.timestamp) > new Date(existing.timestamp)
                ? notif.timestamp
                : existing.timestamp,
            text:
              new Date(notif.timestamp) > new Date(existing.timestamp)
                ? notif.text
                : existing.text,
            read: existing.read && notif.read,
            // לא משנים unreadCount כאן כי לא נציג בועות ליד הודעות
          });
        } else {
          map.set(threadIdStr, { ...notif });
        }
      } else {
        map.set(notif.id || notif._id || Math.random().toString(), { ...notif });
      }
    }

    return Array.from(map.values()).filter(n => n.id || n._id);
  }, [notifications]);

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
        {unreadCount > 0 && (
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
            title={`${unreadCount} הודעות שלא נקראו`}
          >
            {unreadCount}
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
