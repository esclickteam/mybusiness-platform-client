// src/pages/business/dashboardPages/buildTabs/buildSections/ChatSection.jsx
import React, { useState, useEffect } from "react";
import API from "@api";
import ChatTab from "../ChatTab.jsx";
import "./ChatSection.css";

export default function ChatSection({ businessDetails, setBusinessDetails, renderTopBar }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);

  // 1) טוענים את כל השיחות של העסק
  useEffect(() => {
    API.get("/messages/conversations", { withCredentials: true })
      .then(res => setConversations(res.data))
      .catch(console.error);
  }, []);

  // 2) צד שמאל – רשימת השיחות
  return (
    <>
      <div className="form-column">
        <aside className="chat-sidebar">
          <h3>שיחות נכנסות</h3>

          {conversations.length > 0 ? (
            conversations.map(convo => {
              // מניח שב־convo יש participantNames ו־participants
              // מוציא את ה־ID של הלקוח שמשוחח עם העסק
              const partnerId = convo.participants.find(p => p !== businessDetails.ownerId);
              // תווית פשוטה: שם הלקוח (אפשר לשנות לפי מה שעובר ב־convo)
              const label = convo.clientName || partnerId;
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

        {/* 3) ברגע שבוחרים שיחה – טוענים ChatTab */}
        {selectedConvo && (
          <ChatTab
            businessDetails={businessDetails}
            setBusinessDetails={setBusinessDetails}
            isPreview={false}
            partnerId={selectedConvo.participants.find(p => p !== businessDetails.ownerId)}
            isBusiness={true}
          />
        )}
      </div>

      {/* 4) תצוגת פריוויו בצד ימין */}
      <div className="preview-column">
        {renderTopBar()}
        {selectedConvo && (
          <ChatTab
            businessDetails={businessDetails}
            setBusinessDetails={setBusinessDetails}
            isPreview={true}
            partnerId={selectedConvo.participants.find(p => p !== businessDetails.ownerId)}
            isBusiness={true}
          />
        )}
      </div>
    </>
  );
}
