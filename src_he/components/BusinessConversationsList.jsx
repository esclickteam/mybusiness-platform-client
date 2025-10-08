```javascript
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import createSocket from "../socket";

export default function BusinessConversationsList({ onSelectConversation }) {
  const { user, initialized, getValidAccessToken, logout } = useAuth();
  const businessId = user?.businessId || user?.business?._id;

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!initialized || !businessId) return;

    async function setupSocket() {
      setLoading(true);
      setError("");

      // Do not send token, send the function that returns a valid token
      const sock = await createSocket(getValidAccessToken, logout, businessId);

      if (!sock) return; // Probably the login redirect has already occurred

      sock.connect();
      socketRef.current = sock;

      sock.emit("getConversations", { userId: businessId }, (res) => {
        if (res.ok) {
          setConversations(res.conversations || []);
        } else {
          setError("Error loading conversations: " + (res.error || ""));
          console.error("Error loading conversations:", res.error);
        }
        setLoading(false);
      });

      sock.on("connect_error", (err) => {
        setError("Socket connection error: " + err.message);
        setLoading(false);
        console.error("Socket connect error:", err.message);
      });
    }

    setupSocket();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [initialized, businessId, getValidAccessToken, logout]);

  if (loading) return <p>Loading conversations...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (conversations.length === 0) return <p>No active conversations</p>;

  return (
    <ul>
      {conversations.map((conv) => (
        <li
          key={conv._id}
          onClick={() => onSelectConversation(conv._id)}
          style={{ cursor: "pointer", padding: "8px 0" }}
        >
          Conversation with:{" "}
          {(Array.isArray(conv.participants)
            ? conv.participants.filter((p) => p !== businessId)
            : []
          ).join(", ")}
        </li>
      ))}
    </ul>
  );
}
```