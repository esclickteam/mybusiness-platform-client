import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import ChatComponent from "../../../components/ChatComponent";
import API from "../../../api";
import "./BusinessMessagesPage.css";

export default function BusinessMessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const businessUserId = user?.userId;

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 1) טען רשימת שיחות
  useEffect(() => {
    if (!businessUserId) return;
    setIsLoading(true);
    setError("");

    API.get("/messages/conversations", { withCredentials: true })
      .then(res => {
        const list = res.data
          .map(conv => {
            const participants = conv.participants.map(p => p.toString());
            const otherId = participants.find(id => id !== businessUserId);
            if (!otherId) return null;
            return {
              conversationId: conv.conversationId.toString(),
              partnerId: otherId,
              name: conv.businessName || "שיחה",
              lastMessage: conv.lastMessage?.text || "",
            };
          })
          .filter(Boolean);

        setConversations(list);
        if (list.length > 0) {
          setActiveConversationId(list[0].conversationId);
        }
      })
      .catch(err => {
        console.error("❌ Error loading conversations:", err);
        setError("שגיאה בטעינת שיחות, נסה שוב מאוחר יותר");
      })
      .finally(() => setIsLoading(false));
  }, [businessUserId]);

  if (authLoading) return <div className="loading-screen">🔄 טוען הרשאה…</div>;
  if (isLoading) return <div className="loading-screen">🔄 טוען שיחות…</div>;
  if (error) return <div className="error-screen">{error}</div>;

  return (
    <div className="messages-page">
      <aside className="chat-sidebar">
        <h4>שיחות מלקוחות</h4>
        <ul className="chat-list">
          {conversations.map(({ conversationId, partnerId, name, lastMessage }) => (
            <li key={conversationId} className="chat-list-item">
              <button
                className={conversationId === activeConversationId ? "active" : ""}
                onClick={() => setActiveConversationId(conversationId)}
              >
                <div className="chat-info">
                  <strong>{name}</strong>
                  {lastMessage && <p className="last-message">{lastMessage}</p>}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat-main">
        {activeConversationId ? (
          <ChatComponent
            conversationId={activeConversationId}
            partnerId={
              conversations.find(c => c.conversationId === activeConversationId)
                .partnerId
            }
            isBusiness={true}
          />
        ) : (
          <div className="empty-chat">אין שיחות להצגה</div>
        )}
      </main>
    </div>
  );
}
