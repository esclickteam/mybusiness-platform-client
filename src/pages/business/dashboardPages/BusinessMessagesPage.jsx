import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api";
import BusinessChat from "./BusinessChatComponent";
import "./BusinessMessagesPage.css";

// Placeholder shown when there are no real conversations
const EmptyState = () => (
  <div className="empty-chat">
    <h3>עדיין אין לך שיחות</h3>
    <p>כשתקבל הודעה חדשה היא תופיע כאן.</p>
  </div>
);

const BusinessMessagesPage = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newMessageCount, setNewMessageCount] = useState(0); // מספר הודעות חדשות

  // פונקציה להגדלת מספר ההודעות החדשות
  const incrementNewMessageCount = () => {
    setNewMessageCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?.userId;

        if (!userId) {
          console.warn("⚠️ אין userId ב-localStorage");
          return;
        }

        const { data } = await API.get(`/chat/conversations/${userId}`);
        if (data.length > 0) {
          setConversations(data);
          setSelected(data[0]);
        } else {
          setConversations([]);
        }
      } catch (error) {
        console.error("❌ שגיאה בטעינת השיחות:", error);
      }
    };

    fetchMessages();

    // WebSocket or SSE for real-time updates
    const eventSource = new EventSource("/api/business/notifications");

    eventSource.addEventListener("new_message", (event) => {
      const newMessage = JSON.parse(event.data);

      // Update the conversations state with the new message
      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conversation) => {
          if (conversation._id === newMessage.businessId) {
            conversation.messages.push(newMessage);
          }
          return conversation;
        });
        return updatedConversations;
      });

      // אם השיחה הנבחרת היא השיחה עם ההודעה החדשה, עדכן אותה
      if (selected && selected._id === newMessage.businessId) {
        setSelected((prevSelected) => ({
          ...prevSelected,
          messages: [...prevSelected.messages, newMessage]
        }));
      } else {
        // אם השיחה החדשה לא נבחרה, נווט אל הצ'אט החדש
        incrementNewMessageCount();  // עדכון מספר הודעות חדשות
        navigate(`/business/${businessId}/chat`);
      }
    });

    return () => {
      eventSource.close();
    };
  }, [selected, businessId, navigate]);

  // If no conversations loaded yet
  if (conversations.length === 0) {
    return <EmptyState />;
  }

  const getLastMessagePreview = (conversation) => {
    const last = conversation.messages?.[conversation.messages.length - 1];
    return last?.text?.slice(0, 40) || "הודעה חדשה";
  };

  return (
    <div className="messages-page">
      {/* Sidebar */}
      <aside className="chat-sidebar">
        <h4>שיחות</h4>
        {conversations.map((c, i) => (
          <div
            key={i}
            className={`chat-list-item ${selected?._id === c._id ? "active" : ""}`}
            onClick={() => setSelected(c)}
          >
            <strong>{c.name || "לקוח ללא שם"}</strong>
            <p>{getLastMessagePreview(c)}</p>
            {newMessageCount > 0 && !selected && (
              <span className="new-message-count">{newMessageCount}</span> // הצגת מספר ההודעות החדשות
            )}
          </div>
        ))}
      </aside>

      {/* Main Chat */}
      <main className="chat-main">
        {selected ? (
          <BusinessChat
            currentUser={{ _id: JSON.parse(localStorage.getItem("user"))?.userId }}
            partnerId={selected.clientId}
            partnerName={selected.name}
            demoMessages={selected.messages}
          />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};

export default BusinessMessagesPage;
