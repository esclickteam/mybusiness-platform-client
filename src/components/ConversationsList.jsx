import React from 'react';
import './ConversationsList.css';

export default function ConversationsList({
  conversations = [],        // ודא שהמערך אף פעם לא undefined
  isBusiness,
  onSelect,
  selectedConversationId
}) {
  return (
    <div className="conversations-list">
      {conversations.map(conv => {
        const conversationId = conv.conversationId;
        const partner = isBusiness ? conv.customer : conv.business;

        // אם אין פרטנר, מדלגים עליו
        if (!partner) return null;

        const partnerId = partner._id;
        const partnerName = isBusiness
          ? partner.name
          : partner.businessName || partner.name || '—';

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
