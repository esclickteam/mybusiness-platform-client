// src/components/ConversationsList.jsx
import React from 'react';
import './ConversationsList.css';

export default function ConversationsList({
  conversations,
  isBusiness,
  onSelect,
  selectedConversationId,
  userId,
  clientProfilePic,
  businessProfilePic
}) {
  return (
    <div className="conversations-list">
      {conversations.map(conv => {
        const partnerId = isBusiness ? conv.customer._id : conv.business._id;
        const partnerName = isBusiness ? conv.customer.name : conv.business.businessName;
        const isSelected = selectedConversationId === partnerId;
        return (
          <div
            key={partnerId}
            className={`conv-item ${isSelected ? 'active' : ''}`}
            onClick={() => onSelect({ conversationId: conv.conversationId, partnerId })}
          >
            <img
              className="conv-avatar"
              src={isBusiness ? clientProfilePic : businessProfilePic}
              alt="avatar"
            />
            <span className="conv-name">{partnerName}</span>
          </div>
        );
      })}
    </div>
  );
}