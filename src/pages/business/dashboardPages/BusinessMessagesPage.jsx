import React, { useEffect, useState } from "react";
import API from "../../../api";
import BusinessChat from "./BusinessChatComponent";
import "./BusinessMessagesPage.css";

// Placeholder shown when there are no real conversations
const EmptyState = () => (
  <div className="empty-chat">
    {/* Illustration can be added here */}
    <h3>עדיין אין לך שיחות</h3>
    <p>כשתקבל הודעה חדשה היא תופיע כאן.</p>
  </div>
);

const BusinessMessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?.userId;

        if (!userId) {
          console.warn("⚠️ אין userId ב-localStorage");
          return;
        }

        console.log("📡 מבצע קריאה ל-conversations של:", userId);
        const { data } = await API.get(`/chat/conversations/${userId}`);
        console.log("📥 שיחות שהתקבלו מהשרת:", data);

        if (data.length > 0) {
          setConversations(data);
          setSelected(data[0]);
        } else {
          // No real conversations in production
          setConversations([]);
        }
      } catch (error) {
        console.error("❌ שגיאה בטעינת השיחות:", error);
      }
    };

    fetchMessages();
  }, []);

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
            className={`chat-list-item ${selected?.clientId === c.clientId ? "active" : ""}`}
            onClick={() => setSelected(c)}
          >
            <strong>{c.name || "לקוח ללא שם"}</strong>
            <p>{getLastMessagePreview(c)}</p>
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
