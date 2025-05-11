// src/pages/business/dashboardPages/buildTabs/buildSections/ChatSection.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import API from "@api";
import ChatComponent from "@components/ChatComponent";
import "./ChatSection.css";

export default function ChatSection() {
  const { user, initialized } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);

  // טוען את רשימת השיחות של העסק
  useEffect(() => {
    if (!initialized) return;
    API.get("/messages/conversations", { withCredentials: true })
      .then(res => setConversations(res.data))
      .catch(console.error);
  }, [initialized]);

  if (!initialized) return null;

  // מוציא את השותף לשיחה (כל ID חוץ ממני)
  const partnerId = selectedConvo
    ? selectedConvo.participants.find(id => id !== user.userId)
    : null;

  return (
    <div className="chat-section">
      <aside className="chat-sidebar">
        <h3>שיחות נכנסות</h3>
        {conversations.length > 0 ? (
          conversations.map(convo => {
            const label =
              convo.businessName ||
              convo.participants.find(id => id !== user.userId);
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
        {partnerId ? (
          <ChatComponent partnerId={partnerId} isBusiness={true} />
        ) : (
          <div className="chat-placeholder">
            בחרי שיחה מהרשימה כדי להתחיל
          </div>
        )}
      </main>
    </div>
  );
}
