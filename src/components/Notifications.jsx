import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";

export default function Notifications({ onClose }) {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead, clearRead, clearAll } = useNotifications();

  // 1. פילוח הודעות צ'אט מלקוח/שותף עסקי ושאר ההתראות
  const messageNotifications = notifications.filter(n =>
    n.type === "message" &&
    (n.senderType === "client" || n.senderType === "businessPartner")
  );
  const otherNotifications = notifications.filter(n =>
    !(n.type === "message" &&
      (n.senderType === "client" || n.senderType === "businessPartner"))
  );

  // 2. חישוב סך ההודעות הלא־נקראו והתאריך העדכני ביותר רק עבור ה־messageNotifications
  const { totalUnread, latestTimestamp } = React.useMemo(() => {
    return messageNotifications.reduce(
      (acc, n) => {
        const cnt = n.unreadCount || 0;
        const ts = new Date(n.timestamp);
        return {
          totalUnread: acc.totalUnread + cnt,
          latestTimestamp: ts > acc.latestDate ? ts : acc.latestDate,
        };
      },
      { totalUnread: 0, latestDate: new Date(0) }
    );
  }, [messageNotifications]);

  // 3. בניית התראה מסכמת בודדת רק אם יש הודעות מלקוח/שותף עסקי לא־נקראו
  const summaryNotification =
    totalUnread > 0
      ? [
          {
            id: "summary-messages",
            text: `יש לך ${totalUnread} הודעות צ’אט מלקוח/שותף עסקי שלא נקראו`,
            unreadCount: totalUnread,
            timestamp: latestTimestamp.toISOString(),
            read: false,
            isSummary: true,
          },
        ]
      : [];

  const handleSummaryClick = async () => {
    // מסמן את כל הודעות ה־messageNotifications כנקראו
    for (const n of messageNotifications) {
      if (!n.read) {
        const id = n.id || n._id;
        await markAsRead(id.toString());
      }
    }
    if (onClose) onClose();
  };

  const formatDate = ts =>
    new Date(ts).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        התראות
        <div>
          {summaryNotification.length > 0 && (
            <button onClick={handleSummaryClick} style={styles.actionBtn}>
              סמן הודעות צ’אט כנקראו
            </button>
          )}
          {otherNotifications.length > 0 && (
            <>
              <button onClick={clearRead} style={styles.actionBtn}>
                נקה נקראו
              </button>
              <button onClick={clearAll} style={styles.actionBtn}>
                נקה הכל
              </button>
            </>
          )}
        </div>
      </div>

      {/* אם אין כל סוג של התראות */}
      {summaryNotification.length === 0 && otherNotifications.length === 0 && (
        <div style={styles.empty}>אין התראות חדשות</div>
      )}

      {/* קודם מציגים את הסיכום (אם קיים) */}
      {summaryNotification.map(notif => (
        <div
          key={notif.id}
          onClick={handleSummaryClick}
          style={styles.item}
          title={notif.text}
        >
          <div>{notif.text}</div>
          <div style={styles.meta}>
            <div style={styles.time}>{formatDate(notif.timestamp)}</div>
            <div style={styles.bubble}>{notif.unreadCount}</div>
          </div>
        </div>
      ))}

      {/* אחר כך מייצרים את שאר ההתראות כפי שהיו */}
      {otherNotifications.map(n => {
        const id = n.id || n._id;
        return (
          <div
            key={id}
            onClick={async () => {
              if (!n.read) {
                await markAsRead(id.toString());
              }
              if (onClose) onClose();
            }}
            style={{
              ...styles.item,
              fontWeight: n.read ? "normal" : 700,
              backgroundColor: n.read ? "white" : "#e8f4ff",
            }}
            title={n.text}
          >
            <div>{n.text}</div>
            <div style={styles.meta}>
              <div style={styles.time}>{formatDate(n.timestamp)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    position: "absolute",
    top: 40,
    right: 10,
    width: 360,
    maxHeight: 480,
    overflowY: "auto",
    backgroundColor: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    borderRadius: 8,
    zIndex: 1000,
  },
  header: {
    padding: "8px 12px",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 700,
  },
  actionBtn: {
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    fontSize: "0.85rem",
    marginLeft: 8,
  },
  empty: {
    padding: 15,
    textAlign: "center",
    color: "#666",
  },
  item: {
    padding: "10px 15px",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
    userSelect: "none",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    display: "flex",
    alignItems: "center",
  },
  time: {
    fontSize: "0.75rem",
    color: "#666",
    opacity: 0.7,
    marginRight: 10,
  },
  bubble: {
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
  },
};
