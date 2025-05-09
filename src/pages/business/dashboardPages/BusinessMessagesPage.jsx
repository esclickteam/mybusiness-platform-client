// src/pages/business/dashboardPages/BusinessMessagesPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import ChatComponent from "../../../components/ChatComponent";
import API from "../../../api";
import "./BusinessMessagesPage.css";

export default function BusinessMessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const businessId = user?.businessId;
  const businessProfilePic = user?.profilePicUrl || "/default-business.png";
  const defaultClientPic   = "/default-client.png";

  const [conversations, setConversations]   = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isLoading, setIsLoading]           = useState(true);
  const [error, setError]                   = useState(null);

  // 1) Load list of client conversations
  useEffect(() => {
    if (!businessId) return;

    setIsLoading(true);
    API.get("/api/messages/conversations", { withCredentials: true })
      .then(({ data }) => {
        // data = [{ _id, participants: [businessId, clientId] }, ...]
        const list = data.map(conv => {
          const other = conv.participants.find(p => p !== businessId);
          return {
            conversationId: conv._id,
            clientId: other,
          };
        });

        setConversations(list);

        if (list.length > 0) {
          setActiveConversationId(list[0].conversationId);
        }
      })
      .catch(err => {
        console.error("❌ שגיאה בטעינת השיחות:", err);
        setError("❌ לא ניתן לטעון את השיחות, נסה שוב מאוחר יותר");
      })
      .finally(() => setIsLoading(false));
  }, [businessId]);

  // 2) Loading / auth / error states
  if (authLoading) {
    return <div className="loading-screen">🔄 טוען הרשאה…</div>;
  }
  if (isLoading) {
    return <div className="loading-screen">🔄 טוען שיחות…</div>;
  }
  if (error) {
    return <div className="error-screen">{error}</div>;
  }
  if (!conversations.length) {
    return (
      <div className="empty-chat">
        <h3>עדיין אין לך שיחות</h3>
        <p>כשתקבל הודעה חדשה היא תופיע כאן.</p>
      </div>
    );
  }

  return (
    <div className="messages-page">
      {/* Sidebar */}
      <aside className="chat-sidebar">
        <h4>שיחות מלקוחות</h4>
        <ul>
          {conversations.map(({ conversationId, clientId }) => (
            <li key={conversationId}>
              <button
                className={conversationId === activeConversationId ? "active" : ""}
                onClick={() => setActiveConversationId(conversationId)}
              >
                {clientId /* כאן אפשר להחליף לשם הלקוח אם ה־API מחזיר name */}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Chat Area */}
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
