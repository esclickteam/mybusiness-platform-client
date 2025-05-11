// src/pages/business/dashboardPages/buildTabs/buildSections/ChatSection.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import API from "@api";
import ChatComponent from "@components/ChatComponent"; // הקומפוננטה שמציגה את הצ'אט
import "./ChatSection.css";

export default function ChatSection({ renderTopBar }) {
  const { user, initialized } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);

  useEffect(() => {
    if (!initialized) return;

    API.get("/messages/conversations", { withCredentials: true })
      .then(res => {
        console.log("📨 fetched conversations:", res.data);
        setConversations(res.data);
      })
      .catch(err => console.error("❌ load convos error:", err));
  }, [initialized]);

  if (!initialized) return null;

  // מזהה של השותף לשיחה
  const partnerId = selectedConvo
    ? selectedConvo.participants.find(p => p !== user.userId)
    : null;

  return (
    <div className="chat-section">
      <aside className="chat-sidebar">
        <h3>שיחות נכנסות</h3>
        {conversations.length > 0 ? (
          conversations.map(convo => {
            // שדה לתצוגה: או שם העסק (businessName), או ID, או תוכלו להוסיף clientName
            const label = convo.businessName || convo.participants.find(p => p !== user.userId);
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

      <section className="chat-main">
        {partnerId ? (
          <ChatComponent
            partnerId={partnerId}
            isBusiness={true}
          />
        ) : (
          <div className="chat-placeholder">
            בחרי שיחה מהרשימה כדי להתחיל
          </div>
        )}
      </section>

      <div className="preview-column">
        {renderTopBar()}
      </div>
    </div>
  );
}
