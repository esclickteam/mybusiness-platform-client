// src/pages/business/dashboardPages/buildTabs/buildSections/ChatSection.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import API from "@api";
import ChatTab from "../ChatTab.jsx";
import "./ChatSection.css";

export default function ChatSection({ businessDetails, setBusinessDetails, renderTopBar }) {
  const { user, initialized } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);

  useEffect(() => {
    if (!initialized) return;
    // קורא ל־endpoint שמחזיר את רשימת השיחות
    API.get("/messages", { withCredentials: true })
      .then(res => {
        // אם השרת עוטף ב־{ conversations: [...] } תחליפי ל־res.data.conversations
        setConversations(res.data);
      })
      .catch(console.error);
  }, [initialized]);

  if (!initialized) return null;

  // מוציא את ה־partnerId: כל משתתף חוץ ממני
  const partnerId = selectedConvo
    ? selectedConvo.participants.find(id => id !== user.userId)
    : null;

  return (
    <>
      <div className="form-column">
        <aside className="chat-sidebar">
          <h3>שיחות נכנסות</h3>

          {conversations.length > 0 ? (
            conversations.map(convo => {
              const pid = convo.participants.find(id => id !== user.userId);
              // תווית להצגה: אפשר כאן לקחת convo.clientName או convo.businessName
              const label = convo.clientName || convo.businessName || pid;
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

        {partnerId && (
          <ChatTab
            businessDetails={businessDetails}
            setBusinessDetails={setBusinessDetails}
            isPreview={false}
            partnerId={partnerId}
            isBusiness={true}
          />
        )}
      </div>

      <div className="preview-column">
        {renderTopBar()}
        {partnerId && (
          <ChatTab
            businessDetails={businessDetails}
            setBusinessDetails={setBusinessDetails}
            isPreview={true}
            partnerId={partnerId}
            isBusiness={true}
          />
        )}
      </div>
    </>
  );
}
