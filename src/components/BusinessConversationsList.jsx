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

      // לא שולחים token, שולחים את הפונקציה שמחזירה טוקן תקין
      const sock = await createSocket(getValidAccessToken, logout, businessId);

      if (!sock) return; // כנראה הפניית login כבר התבצעה

      sock.connect();
      socketRef.current = sock;

      sock.emit("getConversations", { userId: businessId }, (res) => {
        if (res.ok) {
          setConversations(res.conversations || []);
        } else {
          setError("שגיאה בטעינת שיחות: " + (res.error || ""));
          console.error("Error loading conversations:", res.error);
        }
        setLoading(false);
      });

      sock.on("connect_error", (err) => {
        setError("שגיאה בחיבור לסוקט: " + err.message);
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

  if (loading) return <p>טוען שיחות...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
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
          {(Array.isArray(conv.participants)
            ? conv.participants.filter((p) => p !== businessId)
            : []
          ).join(", ")}
        </li>
      ))}
    </ul>
  );
}
