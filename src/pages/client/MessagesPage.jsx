import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api"; 

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true);
        const res = await API.get("/messages/user-conversations", { withCredentials: true });

        // מניח שהשרת מחזיר: { conversations: [...] }
        setConversations(res.data.conversations || []);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        setError("שגיאה בטעינת השיחות, נסה שוב מאוחר יותר");
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  if (loading) return <div>טוען שיחות...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (conversations.length === 0) return <div>אין לך הודעות.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 ההודעות שלי</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {conversations.map((conv) => (
          <li
            key={conv.conversationId}
            onClick={() =>
              navigate(`/business/${conv.businessId}/messages`, { state: { conversationId: conv.conversationId } })
            }
            style={{
              cursor: "pointer",
              padding: "10px",
              borderBottom: "1px solid #ccc",
              marginBottom: "8px",
              borderRadius: "6px",
              backgroundColor: "#f9f9f9",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
            title={`לחץ כדי לפתוח את הצ'אט עם ${conv.businessName || "העסק"}`}
          >
            {conv.businessLogo && (
              <img
                src={conv.businessLogo}
                alt={`${conv.businessName} לוגו`}
                style={{ width: 40, height: 40, borderRadius: 6 }}
              />
            )}
            <div>
              <strong>{conv.businessName || "עסק"}</strong>
              <p style={{ margin: "4px 0" }}>
                {conv.lastMessage?.text || "אין הודעות"}
              </p>
              <small>{new Date(conv.lastMessageDate || conv.updatedAt).toLocaleString()}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
