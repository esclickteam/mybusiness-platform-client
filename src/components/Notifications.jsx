import React from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationsContext";

export default function Notifications({ onClose }) {
  const {
    notifications,
    clearAllNotifications,
    clearReadNotifications,
    markAsRead,
  } = useNotifications();

  const navigate = useNavigate();

  console.log("[Notifications] Rendered with notifications:", notifications);

  const handleClick = (notif) => {
    console.log("[Notifications] Clicked notification:", notif);

    if (!notif.read) {
      console.log(`[Notifications] Marking notification ${notif.id} as read`);
      markAsRead(notif.id);
    }

    const url =
      notif.targetUrl ||
      {
        message: "/messages",
        collaboration: "/collaborations",
        meeting: "/meetings",
        review: "/reviews",
      }[notif.type] ||
      "/";
    console.log(`[Notifications] Navigating to ${url}`);
    navigate(url);
    onClose();
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
        {notifications.length > 0 && (
          <>
            <button
              onClick={() => {
                console.log("[Notifications] Clearing read notifications");
                clearReadNotifications();
              }}
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
              onClick={() => {
                console.log("[Notifications] Clearing all notifications");
                clearAllNotifications();
              }}
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

      {notifications.length === 0 ? (
        <div style={{ padding: 15, textAlign: "center" }}>אין התראות חדשות</div>
      ) : (
        notifications.map((notif) => (
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
        ))
      )}
    </div>
  );
}
