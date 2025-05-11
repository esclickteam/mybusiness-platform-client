import React, { useState, useEffect } from "react";
import API from "@api";
import ChatTab from "../ChatTab.jsx";
import "./ChatSection.css";

export default function ChatSection({ businessDetails, setBusinessDetails, renderTopBar }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);

  useEffect(() => {
    API.get("/messages/conversations", { withCredentials: true })
      .then(res => setConversations(res.data))
      .catch(console.error);
  }, []);

  const handleSelect = convo => {
    setSelectedConvo(convo);
  };

  const partnerId = selectedConvo
    ? selectedConvo.participants.find(p => p !== businessDetails.ownerId)
    : null;

  return (
    <>
      <div className="form-column">
        <aside className="chat-sidebar">
          <h3>שיחות נכנסות</h3>
          {conversations.length ? (
            conversations.map(convo => {
              const label =
                convo.clientName ||
                convo.participantNames?.find(n => n !== businessDetails.businessName) ||
                "לקוח";
              return (
                <div
                  key={convo._id}
                  className={`chat-sidebar__item ${
                    selectedConvo?._id === convo._id ? "active" : ""
                  }`}
                  onClick={() => handleSelect(convo)}
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
