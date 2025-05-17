import React from 'react';
import './ConversationsList.css';

export default function ConversationsList({
  conversations,
  isBusiness,
  onSelect,
  selectedConversationId
}) {
  return (
    <div className="conversations-list">
      {conversations.map(conv => {
        // מזהה השיחה והפרטנר המתאים
        const conversationId = conv.conversationId;
        const partner = isBusiness ? conv.customer : conv.business;
        const partnerId = partner._id;
        const partnerName = isBusiness ? conv.customer.name : conv.business.businessName;
        
        // בדיקה האם השיחה נבחרה
        const isSelected = selectedConversationId === conversationId;

        return (
          <div
            key={conversationId}
            className={`conv-item ${isSelected ? 'active' : ''}`}
            onClick={() => onSelect({ conversationId, partnerId })}
          >
            <span className="conv-name">{partnerName}</span>
          </div>
        );
      })}
    </div>
  );
}
