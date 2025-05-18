// src/components/ConversationsList.jsx
export default function ConversationsList({
  conversations,
  businessId,
  selectedConversationId,
  onSelect,
  children
}) {
  return (
    <div className="convo-wrapper">
      <aside className="convo-list">
        {conversations.map(conv => {
          const partnerId = conv.participants.find(p => p !== businessId);
          const isActive = conv._id === selectedConversationId;
          return (
            <div
              key={conv._id}
              className={`convo-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelect({
                conversationId: conv._id,
                partnerId
              })}
            >
              {/* תצוגת שם הלקוח, תאריך אחרון וכו' */}
              <p>{conv.businessName || partnerId}</p>
            </div>
          );
        })}
      </aside>
      <section className="chat-view">
        {children || <p>בחר שיחה כדי להתחיל צפייה בהודעות.</p>}
      </section>
    </div>
  );
}
