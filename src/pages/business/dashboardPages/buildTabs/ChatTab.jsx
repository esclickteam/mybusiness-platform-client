// src/pages/business/dashboardPages/build/buildTabs/ChatTab.jsx
import React from 'react';
// סגנונות כלליים של עמוד הבניה
import '../build/Build.css';// סגנונות ספציפיים לטאב הצ'אט
import './ChatTab.css';

import { useNavigate } from 'react-router-dom';
import CustomerChatPreview from './CustomerChatPreview';
import { v4 as uuidv4 } from 'uuid';

const ChatTab = ({ isPreview, businessDetails, setBusinessDetails }) => {
  const navigate = useNavigate();

  if (!businessDetails) return <p>טוען נתוני צ'אט...</p>;

  const messages = businessDetails?.messages ?? [];

  console.log("📬 messages from businessDetails:", messages);

  const setMessages = (updater) => {
    setBusinessDetails((prev) => {
      const prevMessages = prev.messages ?? [];

      const updatedMessages =
        typeof updater === 'function'
          ? updater(prevMessages)
          : Array.isArray(updater)
          ? updater
          : [];

      const sanitizedMessages = updatedMessages.map((msg) => ({
        ...msg,
        id: msg.id ?? uuidv4(),
        from: msg.from,
        to: msg.to ?? null,
        text: msg.text ?? '',
        file: msg.file ?? null,
        timestamp: msg.timestamp ?? Date.now(),
        clientId: msg.clientId ?? null,
        name: msg.name ?? '',
      }));

      console.log("✅ setMessages - הודעות חדשות (מעובדות):", sanitizedMessages);

      return {
        ...prev,
        messages: sanitizedMessages,
      };
    });
  };

  return (
    <div className="chat-tab-container">
      {isPreview ? (
        <CustomerChatPreview
          businessDetails={businessDetails}
          messages={messages}
          setMessages={setMessages}
        />
      ) : (
        <div
          className="chat-settings-info"
          style={{
            background: "#f5f5f5",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #ccc",
            textAlign: "center",
            color: "#444",
            maxWidth: "500px",
            margin: "2rem auto",
          }}
        >
          <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>
            ✉️ ניהול ההודעות שלך
          </h3>
          <p>
            כל ההודעות שהתקבלו מלקוחות בעמוד העסק שלך מרוכזות עבורך בעמוד{" "}
            <strong>"הודעות מלקוחות"</strong>.
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            משם תוכל/י לקרוא, להשיב ולנהל את השיחות בצורה מסודרת ונוחה.
          </p>
          <button
            style={{
              marginTop: "1rem",
              backgroundColor: "#6c63ff",
              color: "white",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/dashboard/messages")}
          >
            עבור לעמוד ההודעות
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatTab;
