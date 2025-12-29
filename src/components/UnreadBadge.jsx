import React, { useEffect, useState } from "react";
import { useSocket } from "../context/socketContext";  // Import the socket from Context
import styles from "./UnreadBadge.module.css";  // Import the CSS module

/**
 * Displays a badge with the count of unread messages in real-time.
 * @param {string} conversationId
 */
export default function UnreadBadge({ conversationId }) {
  const socket = useSocket();  // Get the socket instance from the provider
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!socket || !conversationId) return;

    // 1. Initial call to mark messages as read and get the counter
    socket.emit(
      "markMessagesRead",  // שולח את הבקשה למערכת
      conversationId,
      ({ ok, unreadCount }) => {
        if (ok && unreadCount != null) {
          setCount(unreadCount);  // עדכון כמות ההודעות הלא נקראות
        }
      }
    );

    // 2. Listen for real-time updates of the counter
    const handler = (newCount) => setCount(newCount);  // עדכון בזמן אמת
    socket.on("unreadMessagesCount", handler);  // מאזין לעדכון

    // ניקוי ההאזנה כשהרכיב לא בשימוש יותר
    return () => {
      socket.off("unreadMessagesCount", handler);  // מנקה את ההאזנה
    };
  }, [socket, conversationId]);

  if (count <= 0) return null;  // אם אין הודעות לא נקראות, לא מציגים את ה־badge
  return <span className={styles.badge}>{count}</span>;  // הצגת ה־badge עם כמות ההודעות
}
