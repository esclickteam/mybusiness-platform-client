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
      .then(res => setConversations(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);
  }, [initialized]);

  if (!initialized) return null;

  // מזהה של השותף לשיחה
  const partnerId = selectedConvo
    ? selectedConvo.participants.find(id => id !== user.userId)
    : null;

  return (
    <div className="chat-section">
      {/* סיידבר עם רשימת שיחות */}
      <aside className="chat-sidebar">
        <h3>שיחות נכנסות</h3>
        {conversations.length > 0 ? (
          conversations.map(convo => {
            const label = convo.businessName ||
              convo.participants.find(id => id !== user.userId);
            return (
              <div
                key={convo._id}
                className={`chat-sidebar__item ${selectedConvo?._id === convo._id ? 'active' : ''}`}
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

      {/* חלון הצ'אט */}
      <main className="chat-main">
        {partnerId
          ? <ChatComponent partnerId={partnerId} isBusiness />
          : <div className="chat-placeholder">בחרי שיחה מהרשימה כדי להתחיל</div>
        }
      </main>

      {/* תצוגת פריוויו עליון */}
      <div className="preview-column">
        {renderTopBar?.()}
      </div>
    </div>
  );
}
