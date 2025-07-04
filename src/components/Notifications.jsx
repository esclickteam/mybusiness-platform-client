import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";

export default function Notifications({ onClose }) {
  const { user } = useAuth();

  const {
    notifications,
    clearRead,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  // איחוד לפי threadId: כרטיס אחד בלבד לשיחה, טקסט קבוע, מספר הודעות לא נקראו
  const dedupedNotifications = React.useMemo(() => {
    const map = new Map();

    for (const notif of notifications) {
      // רק הודעות מהסוג הרלוונטי (לדוג' הודעות צ'אט)
      if (notif.type === "message" && notif.threadId) {
        const key = notif.threadId.toString();
        if (map.has(key)) {
          const prev = map.get(key);
          map.set(key, {
            ...prev,
            unreadCount: (prev.unreadCount || 0) + (notif.unreadCount || 0),
            timestamp: new Date(notif.timestamp) > new Date(prev.timestamp) ? notif.timestamp : prev.timestamp,
            read: prev.read && notif.read,
          });
        } else {
          map.set(key, {
            ...notif,
            text: "✉️ הודעה חדשה מלקוח", // טקסט אחיד לכל שיחה!
          });
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [notifications]);

  const handleClick = async (notif) => {
    const id = notif.threadId;
    if (!notif.read && id) {
      await markAsRead(id);
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
          const key = notif.threadId;
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#666",
                    opacity: 0.7,
                    marginRight: 10,
                  }}
                >
                  {formatDate(notif.timestamp)}
                </div>
                {!notif.read && notif.unreadCount > 0 && (
                  <div
                    style={{
                      backgroundColor: "#d00",
                      color: "white",
                      borderRadius: "50%",
                      width: 22,
                      height: 22,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                    aria-label={`${notif.unreadCount} הודעות לא נקראו`}
                  >
                    {notif.unreadCount}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
