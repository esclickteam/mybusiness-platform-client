import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import ChatComponent from "../../../components/ChatComponent";
import API from "../../../api";
import { io } from "socket.io-client";
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
  const socketRef = useRef(null);

  // 1) טען את רשימת השיחות
  useEffect(() => {
    if (!businessUserId) return;

    setIsLoading(true);
    API.get("/messages/conversations", { withCredentials: true })
      .then(({ data }) => {
        const list = data.map(conv => {
          const other = conv.participants.find(p => p !== businessUserId);
          return {
            conversationId: conv._id.toString(),
            clientId: other,
          };
        }).filter(Boolean);
        
        setConversations(list);
        if (list.length > 0) {
          setActiveConversationId(list[0].conversationId);
        }
      })
      .catch(err => {
        setError("❌ Could not load conversations, please try again later");
      })
      .finally(() => setIsLoading(false));
  }, [businessUserId]);

  // 2) טען הודעות של שיחה נבחרת
  useEffect(() => {
    if (!activeConversationId) return;

    API.get(`/messages/${activeConversationId}/messages`, { withCredentials: true })
      .then(res => {
        // Process and set messages for active conversation
      })
      .catch(err => console.error(err));
  }, [activeConversationId]);

  // 3) חיבור ל-Socket.IO ולהאזנה להודעות בזמן אמת
  useEffect(() => {
    if (!activeConversationId) return;

    const socket = io(API.BASE_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinRoom", activeConversationId);
    });

    socket.on("newMessage", msg => {
      // Update only if the message belongs to the active conversation
      if (msg.conversationId === activeConversationId) {
        // Update messages state for active conversation
        setMessages(prevMessages => [...prevMessages, msg]);
      } else {
        // Optionally, add new conversation to list
        setConversations(prevConvos => [
          ...prevConvos,
          { conversationId: msg.conversationId, clientId: msg.from },
        ]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [activeConversationId]);

  // Handle loading, errors, and active conversation display
  if (authLoading) return <div className="loading-screen">🔄 טוען הרשאה…</div>;
  if (isLoading) return <div className="loading-screen">🔄 טוען שיחות…</div>;
  if (error) return <div className="error-screen">{error}</div>;

  return (
    <div className="messages-page">
      <aside className="chat-sidebar">
        <h4>שיחות מלקוחות</h4>
        <ul>
          {conversations.map(({ conversationId, clientId }) => (
            <li key={conversationId}>
              <button
                className={conversationId === activeConversationId ? "active" : ""}
                onClick={() => {
                  setActiveConversationId(conversationId);
                }}
              >
                לקוח: {clientId}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat-main">
        {activeConversationId && (
          <ChatComponent
            conversationId={activeConversationId}
            partnerId={conversations.find(c => c.conversationId === activeConversationId)?.clientId}
            isBusiness={true}
            clientProfilePic={defaultClientPic}
            businessProfilePic={businessProfilePic}
          />
        )}
      </main>
    </div>
  );
}
