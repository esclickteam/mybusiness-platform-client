import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // לקבל את businessId
import socket from "../socket";

export default function BusinessConversationsList({ onSelectConversation }) {
  const { user } = useAuth();
  const businessId = user?.businessId || user?.business?._id;
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;

    socket.emit("getConversations", { userId: businessId }, (res) => {
      if (res.ok) {
        setConversations(res.conversations);
      } else {
        alert("Error loading conversations: " + res.error);
      }
      setLoading(false);
    });
  }, [businessId]);

  if (loading) return <p>טוען שיחות...</p>;
  if (conversations.length === 0) return <p>אין שיחות פעילות</p>;

  return (
    <ul>
      {conversations.map((conv) => (
        <li key={conv._id} onClick={() => onSelectConversation(conv._id)}>
          שיחה עם:{" "}
          {conv.participants
            .filter((p) => p !== businessId)
            .join(", ")}{" "}
          {/* מציג את הצד השני בלבד */}
        </li>
      ))}
    </ul>
  );
}
