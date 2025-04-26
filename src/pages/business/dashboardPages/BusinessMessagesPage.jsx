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

// Placeholder for loading a demo conversation in development
const DemoPlaceholder = ({ onLoadDemo }) => (
  <div className="empty-chat demo-placeholder">
    <h3>אין שיחות עדיין</h3>
    <p>אתה יכול לטעון שיחת דמו כדי לראות איך זה נראה:</p>
    <button className="load-demo-btn" onClick={onLoadDemo}>
      הצג שיחת דמו
    </button>
  </div>
);

const BusinessMessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);

  // Loads a single demo conversation
  const loadDemoConversation = () => {
    const demo = {
      clientId: "demo123",
      name: "דנה כהן",
      messages: [
        { text: "שלום, רציתי לבדוק אם יש משלוחים גם לראשון לציון?", sender: "client" },
        { text: "היי דנה, כן! אנחנו שולחים לראשון לציון בימים ראשון–חמישי.", sender: "business" },
        { text: "תוך כמה זמן מגיע בערך?", sender: "client" },
        { text: "עד 2 ימי עסקים, ואם תזמיני היום לפני 14:00 – זה יישלח היום!", sender: "business" },
      ],
    };
    setConversations([demo]);
    setSelected(demo);
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

        console.log("📡 מבצע קריאה ל-conversations של:", userId);
        const { data } = await API.get(`/chat/conversations/${userId}`);
        console.log("📥 שיחות שהתקבלו מהשרת:", data);

        if (data.length > 0) {
          setConversations(data);
          setSelected(data[0]);
        } else {
          // No real conversations
          if (process.env.NODE_ENV === "development") {
            // In dev, offer demo automatically
            loadDemoConversation();
          } else {
            // In production, show empty state
            setConversations([]);
          }
        }
      } catch (error) {
        console.error("❌ שגיאה בטעינת השיחות:", error);
      }
    };

    fetchMessages();
  }, []);

  // If no conversations loaded yet
  if (conversations.length === 0) {
    if (process.env.NODE_ENV === "development") {
      return <DemoPlaceholder onLoadDemo={loadDemoConversation} />;
    }
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
