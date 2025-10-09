// src/components/UnreadBadge.jsx
import React, { useEffect, useState } from "react";
import { useSocket } from "../context/socketContext";  // Import the socket from Context

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
      "markMessagesRead",
      conversationId,
      ({ ok, unreadCount }) => {
        if (ok && unreadCount != null) {
          setCount(unreadCount);
        }
      }
    );

    // 2. Listen for real-time updates of the counter
    const handler = (newCount) => setCount(newCount);
    socket.on("unreadMessagesCount", handler);

    return () => {
      socket.off("unreadMessagesCount", handler);
    };
  }, [socket, conversationId]);

  if (count <= 0) return null;
  return <span className="badge">{count}</span>;
}
