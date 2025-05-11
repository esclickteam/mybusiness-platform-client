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

  useEffect(() => {
    if (!initialized) return;

    console.log("🔍 fetching conversations for", user.userId);
    API.get("/messages/conversations", { withCredentials: true })
      .then(res => {
        console.log("📨 conversations payload:", res.data);
        // res.data אמור להיות מערך של שיחות
        setConversations(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("❌ error loading conversations:", err);
      });
  }, [initialized, user.userId]);

  // לצור L og של ה־state אחרי עדכון
  useEffect(() => {
    console.log("🔥 conversations state now:", conversations);
  }, [conversations]);

  if (!initialized) return null;

  // partnerId = כל ID ב־participants חוץ ממני
  const partnerId = selectedConvo
    ? selectedConvo.participants.find(id => id !== user.userId)
    : null;

  return (
    <div className="chat-section">
      <aside className="chat-sidebar">
        <h3>שיחות נכנסות</h3>
        {conversations.length > 0 ? (
          conversations.map(convo => {
            // label = אם שמור businessName, אחרת ID
            const label = convo.businessName || convo.participants.find(id => id !== user.userId);
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
