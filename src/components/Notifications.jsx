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
  } = useNotifications();

  // איחוד התראות צ'אט לפי threadId עם מיזוג הודעות מאותו תזמון והצגת טקסט כללי
  const dedupedNotifications = React.useMemo(() => {
    console.log("🚀 raw notifications:", notifications);

    const map = new Map();

    for (const notif of notifications) {
      if (notif.type === "message" && notif.threadId) {
        const threadIdStr = notif.threadId.toString ? notif.threadId.toString() : notif.threadId;
        const existing = map.get(threadIdStr);

        if (existing) {
          map.set(threadIdStr, {
            ...existing,
            text: `✉️ יש לך ${existing.unreadCount + (notif.unreadCount || 0)} הודעות חדשות`,
            timestamp: new Date(notif.timestamp) > new Date(existing.timestamp) ? notif.timestamp : existing.timestamp,
            unreadCount: (existing.unreadCount || 0) + (notif.unreadCount || 0),
            read: existing.read && notif.read,
          });
        } else {
          map.set(threadIdStr, { ...notif });
        }
      } else {
        const id = notif.id || notif._id;
        map.set(id, { ...notif });
      }
    }

    const result = Array.from(map.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    console.log("✅ deduped notifications:", result);
    return result;
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
            notif.id ||
            notif._id ||
            (notif.threadId ? notif.threadId.toString() : null);
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
                    aria-label={`${notif.unreadCount} התראות לא נקראו`}
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
