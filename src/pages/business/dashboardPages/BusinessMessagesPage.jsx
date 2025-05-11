import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import ChatComponent from "../../../components/ChatComponent";
import API from "../../../api";
import "./BusinessMessagesPage.css";

export default function BusinessMessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const businessUserId = user?.userId;                     // מחרוזת
  const businessProfilePic = user?.profilePicUrl || "/default-business.png";
  const defaultClientPic = "/default-client.png";

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1) טען רשימת שיחות
  useEffect(() => {
    if (!businessUserId) return;
    setIsLoading(true);

    API.get("/messages/conversations", { withCredentials: true })
      .then(({ data }) => {
        const list = data
          .map(conv => {
            // המר את כל ה־ObjectId לשורות
            const parts = conv.participants.map(p => p.toString());
            // מצא את הקצה השני שאינו העסק
            const other = parts.find(id => id !== businessUserId);
            return other
              ? { 
                  conversationId: conv._id.toString(), 
                  clientId: other 
                }
              : null;
          })
          .filter(Boolean);

        setConversations(list);
        if (list.length > 0) {
          setActiveConversationId(list[0].conversationId);
        }
      })
      .catch(err => {
        console.error("Error loading conversations:", err);
        setError("❌ Couldn't load conversations, please try later");
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
        <ul>
          {conversations.map(({ conversationId, clientId }) => (
            <li key={conversationId} className="chat-list-item">
              <button
                className={conversationId === activeConversationId ? "active" : ""}
                onClick={() => setActiveConversationId(conversationId)}
              >
                לקוח: {clientId}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat-main">
        {activeConversationId ? (
          <ChatComponent
            partnerId={
              conversations.find(c => c.conversationId === activeConversationId)
                ?.clientId
            }
            isBusiness={true}
            businessProfilePic={businessProfilePic}
            clientProfilePic={defaultClientPic}
          />
        ) : (
          <div className="empty-chat">אין שיחות להצגה</div>
        )}
      </main>
    </div>
  );
}
