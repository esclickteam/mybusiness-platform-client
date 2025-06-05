import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api"; // הנח שיש לך API מוגדר

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchConversations() {
      try {
        // שים לב שהנתיב הוא '/api/conversations' בשרת - לכן כאן צריך להיות '/conversations'
        const res = await API.get("/conversations", { withCredentials: true });
        setConversations(res.data);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  if (loading) return <div>טוען שיחות...</div>;
  if (conversations.length === 0) return <div>אין לך הודעות.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 ההודעות שלי</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {conversations.map((conv) => (
          <li
            key={conv.conversationId}
            onClick={() =>
              navigate(`/business/${conv.participants.find(p => p !== conv.businessId)}/messages/${conv.conversationId}`)
            }
            style={{
              cursor: "pointer",
              padding: "10px",
              borderBottom: "1px solid #ccc",
              marginBottom: "8px",
              borderRadius: "6px",
              backgroundColor: "#f9f9f9",
            }}
            title={`לחץ כדי לפתוח את הצ'אט עם ${conv.businessName || "העסק"}`}
          >
            <strong>{conv.businessName || "עסק"}</strong>
            <p style={{ margin: "4px 0" }}>{conv.lastMessage?.text || "אין הודעות"}</p>
            <small>{new Date(conv.updatedAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
