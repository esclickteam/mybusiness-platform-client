import React from "react";
import { useNotifications } from "../context/NotificationsContext";

export default function Notifications({ onClose }) {
  const { notifications, markAsRead, clearRead } = useNotifications();

  React.useEffect(() => {
    console.log("🔔 raw notifications:", notifications);
  }, [notifications]);

  // dedupe לפי threadId/ id
  const dedupedNotifications = React.useMemo(() => {
    const map = new Map();
    for (const notif of notifications) {
      const key = notif.threadId || notif.id;
      if (!key) continue;
      if (map.has(key)) {
        const prev = map.get(key);
        const isNewer = new Date(notif.timestamp) > new Date(prev.timestamp);
        map.set(key, {
          ...prev,
          ...notif,
          timestamp: isNewer ? notif.timestamp : prev.timestamp,
          unreadCount: Math.max(prev.unreadCount || 0, notif.unreadCount || 0),
        });
      } else {
        map.set(key, { ...notif });
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [notifications]);

  const handleClick = async (notif) => {
    const id = notif.threadId || notif.id;
    if (!notif.read && id) {
      await markAsRead(id);
    }
    onClose?.();
  };

  const handleClear = async () => {
    try {
      await clearRead();
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const formatDate = (ts) =>
    new Date(ts).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });

  const buttonStyle = {
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    fontSize: "0.9rem",
  };

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
      {/* Header */}
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
          <button onClick={handleClear} style={buttonStyle}>
            ניקוי כל ההתראות
          </button>
        )}
      </div>

      {/* Body */}
      {dedupedNotifications.length === 0 ? (
        <div style={{ padding: 15, textAlign: "center" }}>אין התראות</div>
      ) : (
        dedupedNotifications.map((notif) => {
          const key = notif.threadId || notif.id;
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
              {/* מציג בדיוק את ה-text שמגיע מהמונגו */}
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
