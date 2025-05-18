// src/components/ConversationsList.jsx
import React from 'react';
import './ConversationsList.css';

export default function ConversationsList({
  conversations = [],
  isBusiness,
  selectedConversationId,
  onSelect,
  children
}) {
  return (
    <div className="conversations-list">
      {/* Sidebar */}
      <div className="sidebar">
        {conversations.map(conv => {
          const { conversationId } = conv;
          const partner = isBusiness ? conv.customer : conv.business;
          if (!partner) return null;

          const partnerId = partner._id;
          const name = isBusiness
            ? partner.name
            : partner.businessName || partner.name || '—';

          const isActive = selectedConversationId === conversationId;

          return (
            <div
              key={conversationId}
              className={`conv-item ${isActive ? 'active' : ''}`}
              onClick={() =>
                onSelect({ conversationId, partnerId })
              }
            >
              {name}
            </div>
          );
        })}
      </div>

      {/* Chat area */}
      <div className="chat-area">
        {children || (
          <div className="no-selection">
            בחר שיחה מהרשימה כדי להתחיל
          </div>
        )}
      </div>
    </div>
  );
}
