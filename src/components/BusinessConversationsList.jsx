// src/components/BusinessConversationsList.jsx
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import createSocket from "../socket";

export default function BusinessConversationsList({ onSelectConversation }) {
  const { user, initialized, refreshToken } = useAuth();
  const businessId = user?.businessId || user?.business?._id;

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!initialized || !businessId) return;

    (async () => {
      // ensure token refreshed before connecting
      try {
        await refreshToken();
      } catch {
        console.error("Failed to refresh token");
      }

      const sock = createSocket();
      socketRef.current = sock;
      sock.connect();

      sock.emit(
        "getConversations",
        { userId: businessId },
        (res) => {
          if (res.ok) {
            setConversations(res.conversations);
          } else {
            console.error("Error loading conversations:", res.error);
          }
          setLoading(false);
        }
      );

      return () => {
        sock.disconnect();
      };
    })();
  }, [initialized, businessId, refreshToken]);

  if (loading) return <p>טוען שיחות...</p>;
  if (conversations.length === 0) return <p>אין שיחות פעילות</p>;

  return (
    <ul>
      {conversations.map((conv) => (
        <li
          key={conv._id}
          onClick={() => onSelectConversation(conv._id)}
          style={{ cursor: "pointer", padding: "8px 0" }}
        >
          שיחה עם:{" "}
          {conv.participants
            .filter((p) => p !== businessId)
            .join(", ")}
        </li>
      ))}
    </ul>
  );
}
