// src/pages/business/dashboardPages/buildTabs/buildSections/ChatSection.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import API from "@api";
import ChatComponent from "@components/ChatComponent";
import "./ChatSection.css";

export default function ChatSection({ renderTopBar }) {
  const { user, initialized } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);

  useEffect(() => {
    if (!initialized) return;
    API.get("/messages/conversations", { withCredentials: true })
      .then(res => {
        setConversations(Array.isArray(res.data) ? res.data : []);
      })
      .catch(console.error);
  }, [initialized]);

  if (!initialized) return null;

  const partnerId = selectedConvo
    ? selectedConvo.participants.find(id => id !== user.userId)
    : null;

  const conversationId = selectedConvo?._id || null;

  return (
    <div className="chat-section">
      <aside className="chat-sidebar">
        <h3>שיחות נכנסות</h3>
        {conversations.length > 0 ? (
          conversations.map(convo => {
            const otherId = convo.participants.find(id => id !== user.userId);
            const label = convo.businessName || otherId;
            return (
              <div
                key={convo._id}
                className={`chat-sidebar__item ${
                  selectedConvo?._id === convo._id ? "active" : ""
                }`}
                onClick={() => setSelectedConvo(convo)}
              >
                {label}
              </div>
            );
          })
        ) : (
          <p className="chat-sidebar__empty">אין שיחות להצגה</p>
        )}
      </aside>

      <main className="chat-main">
        {conversationId ? (
          <ChatComponent
            partnerId={partnerId}
            conversationId={conversationId}
            isBusiness={true}
          />
        ) : (
          <div className="chat-placeholder">
            בחרי שיחה מהרשימה כדי להתחיל
          </div>
        )}
      </main>

      <div className="preview-column">{renderTopBar?.()}</div>
    </div>
  );
}
