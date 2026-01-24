import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "./MessagesPage.css";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true);
        const res = await API.get("/messages/user-conversations", {
          withCredentials: true,
        });
        setConversations(res.data.conversations || []);
      } catch (err) {
        console.error(err);
        setError("Error loading conversations");
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  if (loading) return <div className="messages-loading">Loading conversations…</div>;
  if (error) return <div className="messages-error">{error}</div>;
  if (conversations.length === 0)
    return (
      <div className="messages-empty">
        <h3>No messages yet</h3>
        <p>Your conversations will appear here.</p>
      </div>
    );

  return (
    <div className="messages-page">
      <h2 className="messages-title">💬 My Messages</h2>

      <ul className="messages-list">
        {conversations.map((conv) => (
          <li
            key={conv.conversationId}
            className="message-card"
            onClick={() =>
              navigate(`/business/${conv.businessId}/messages`, {
                state: { conversationId: conv.conversationId },
              })
            }
          >
            {conv.businessLogo && (
              <img
                src={conv.businessLogo}
                alt={`${conv.businessName} logo`}
                className="message-card__logo"
              />
            )}

            <div className="message-card__content">
              <strong className="message-card__name">
                {conv.businessName || "Business"}
              </strong>

              <p className="message-card__preview">
                {conv.lastMessage?.text || "No messages yet"}
              </p>

              <span className="message-card__date">
                {new Date(
                  conv.lastMessageDate || conv.updatedAt
                ).toLocaleString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
