// src/components/UnreadBadge.jsx
import React, { useEffect, useState } from "react";
import { socket } from "../socket"; // ודאו שקראתם createSocket() באפליקציה לפני

/**
 * מציג badge עם ספירת ההודעות הלא־נקראות בזמן אמת.
 * @param {string} conversationId
 */
export default function UnreadBadge({ conversationId }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!conversationId) return;

    // 1. קריאה ראשונית לסימון קריאה ולקבלת המונה
    socket.emit(
      "markMessagesRead",
      conversationId,
      ({ ok, unreadCount }) => {
        if (ok && unreadCount != null) setCount(unreadCount);
      }
    );

    // 2. האזנה לעדכוני זמן־אמת של המונה
    const handler = (newCount) => setCount(newCount);
    socket.on("unreadMessagesCount", handler);

    return () => {
      socket.off("unreadMessagesCount", handler);
    };
  }, [conversationId]);

  if (count <= 0) return null;
  return <span className="badge">{count}</span>;
}
