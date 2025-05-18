export default function ConversationsList({
  conversations,
  businessId,
  selectedConversationId,
  onSelect,
  isBusiness // ← חדש!
}) {
  if (!conversations || conversations.length === 0) {
    return <div className={styles.noSelection}>עדיין אין שיחות</div>;
  }

  return (
    <div className={styles.conversationsList}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>
          {isBusiness ? "שיחות עם לקוחות" : "שיחה עם עסק"}
        </div>
        {conversations.map((conv, idx) => {
          const participants = Array.isArray(conv.participants) ? conv.participants : [];
          const partnerId = participants.find(p => p !== businessId) || "";
          const convoId = conv._id || conv.id || `conv-${idx}`;
          const isActive = convoId === selectedConversationId;

          // אם בצד עסק – מציגים שם לקוח
          // אם בצד לקוח – מציגים שם עסק
          let displayName;
          if (isBusiness) {
            displayName = conv.customerName || partnerId;
          } else {
            displayName = conv.businessName || partnerId;
          }

          return (
            <div
              key={convoId}
              className={`${styles.convItem} ${isActive ? styles.active : ""}`}
              onClick={() =>
                onSelect({
                  conversationId: convoId,
                  partnerId
                })
              }
            >
              <div>
                <p className={styles.partnerName}>{displayName}</p>
                {conv.lastMessage && <p className={styles.lastMessage}>{conv.lastMessage.text}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
