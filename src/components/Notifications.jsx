import React from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationsContext";

export default function Notifications({ onClose }) {
  const {
    notifications,
    clearAll,
    clearRead,
    markAsRead,
  } = useNotifications();

  const navigate = useNavigate();

  // איחוד התראות צ'אט לפי threadId (כמו בפייסבוק)
  const dedupedNotifications = React.useMemo(() => {
    const seenThreads = new Set();
    const filtered = [];

    for (const notif of notifications) {
      if (notif.type === "message" && notif.threadId) {
        if (!seenThreads.has(notif.threadId)) {
          filtered.push(notif);
          seenThreads.add(notif.threadId);
        }
      } else {
        filtered.push(notif);
      }
    }
    return filtered;
  }, [notifications]);

  const handleClick = (notif) => {
    console.log("Notification clicked:", notif);

    const id = notif.id || notif._id;
    if (!id) {
      console.warn("Notification missing id:", notif);
    }

    // סמן כהתראה נקראה
    if (!notif.read) {
      console.log("Marking as read:", id);
      markAsRead(id);
    }

    // ניווט לפי סוג ההתראה
    if (notif.type === "message" && notif.threadId) {
      const clientId = notif.clientId || notif.partnerId;
      const url = clientId
        ? `/dashboard/messages?threadId=${notif.threadId}&clientId=${clientId}`
        : `/dashboard/messages?threadId=${notif.threadId}`;

      console.log("Navigating to chat URL:", url);
      navigate(url);
    } else {
      const url =
        notif.targetUrl ||
        {
          collaboration: "/collaborations",
          meeting: "/meetings",
          review: "/reviews",
        }[notif.type] ||
        "/";

      console.log("Navigating to URL:", url);
      navigate(url);
    }

    if (onClose) {
      console.log("Calling onClose to close notifications panel");
      onClose();
    }
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
              aria-label="נקה את כל ההתראות שכבר נקראו"
            >
              נקה נקראו
            </button>
            <button
              onClick={clearAll}
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

      {dedupedNotifications.length === 0 ? (
        <div style={{ padding: 15, textAlign: "center" }}>אין התראות חדשות</div>
      ) : (
        dedupedNotifications.map((notif) => {
          const key = notif.id || notif._id || notif.threadId;
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
                {!notif.read && notif.unreadCount > 1 && (
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
