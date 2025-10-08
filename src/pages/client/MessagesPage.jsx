```javascript
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

        // Assuming the server returns: { conversations: [...] }
        setConversations(res.data.conversations || []);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        setError("Error loading conversations, please try again later");
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  if (loading) return <div>Loading conversations...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (conversations.length === 0) return <div>You have no messages.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 My Messages</h2>
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
            title={`Click to open the chat with ${conv.businessName || "the business"}`}
          >
            {conv.businessLogo && (
              <img
                src={conv.businessLogo}
                alt={`${conv.businessName} logo`}
                style={{ width: 40, height: 40, borderRadius: 6 }}
              />
            )}
            <div>
              <strong>{conv.businessName || "Business"}</strong>
              <p style={{ margin: "4px 0" }}>
                {conv.lastMessage?.text || "No messages"}
              </p>
              <small>{new Date(conv.lastMessageDate || conv.updatedAt).toLocaleString()}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```