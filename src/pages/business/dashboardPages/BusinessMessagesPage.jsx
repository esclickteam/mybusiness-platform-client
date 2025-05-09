import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import ChatComponent from "../../../components/ChatComponent";
import API from "../../../api";
import "./BusinessMessagesPage.css";

export default function BusinessMessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const businessUserId = user?.userId;
  const businessProfilePic = user?.profilePicUrl || "/default-business.png";
  const defaultClientPic = "/default-client.png";

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to load conversations
  useEffect(() => {
    console.log("businessUserId:", businessUserId);

    if (!businessUserId) return;

    setIsLoading(true);
    API.get("/messages/conversations", { withCredentials: true })
      .then(({ data }) => {
        console.log("📬 raw conversations payload:", data);

        if (!data || data.length === 0) {
          console.warn("⚠️ No conversations found!");
        }

        // Map conversations
        const list = data.map(conv => {
          const other = conv.participants.find(p => {
            const id =
              typeof p === "string"
                ? p
                : p.userId
                ? p.userId.toString()
                : p._id
                ? p._id.toString()
                : "";
            return id !== businessUserId.toString();
          });

          if (!other) {
            console.error("❌ No valid participant found in conversation:", conv);
            return null;
          }

          const clientId =
            typeof other === "string"
              ? other
              : other.userId
              ? other.userId.toString()
              : other._id
              ? other._id.toString()
              : "";

          return {
            conversationId: conv._id.toString(),
            clientId,
          };
        }).filter(Boolean);

        console.log("✅ mapped conversation list:", list);
        setConversations(list);

        if (list.length > 0) {
          setActiveConversationId(list[0].conversationId);
        }
      })
      .catch(err => {
        console.error("❌ Error loading conversations:", err);
        setError("❌ Could not load conversations, please try again later");
      })
      .finally(() => setIsLoading(false));
  }, [businessUserId]);

  // Effect to log the active conversation ID
  useEffect(() => {
    console.log("📬 activeConversationId:", activeConversationId);
  }, [activeConversationId]);

  if (authLoading) return <div className="loading-screen">🔄 Loading auth...</div>;
  if (isLoading) return <div className="loading-screen">🔄 Loading conversations...</div>;
  if (error) return <div className="error-screen">{error}</div>;

  if (!conversations.length) {
    return (
      <div className="empty-chat">
        <h3>No conversations yet</h3>
        <p>When you receive a new message, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <aside className="chat-sidebar">
        <h4>Conversations with clients</h4>
        <ul>
          {conversations.map(({ conversationId, clientId }) => (
            <li key={conversationId}>
              <button
                className={conversationId === activeConversationId ? "active" : ""}
                onClick={() => {
                  console.log(`📬 Switching to conversation ${conversationId}`);
                  setActiveConversationId(conversationId);
                }}
              >
                {/* Replace clientId with client name or email */}
                Client: {clientId}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat-main">
        {activeConversationId && (
          <ChatComponent
            conversationId={activeConversationId}
            partnerId={conversations.find(c => c.conversationId === activeConversationId).clientId}
            isBusiness={true}
            clientProfilePic={defaultClientPic}
            businessProfilePic={businessProfilePic}
          />
        )}
      </main>
    </div>
  );
}
