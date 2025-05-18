export default function ConversationsList({
  conversations,
  businessId,
  selectedConversationId,
  onSelect,
  isBusiness
}) {
  if (!conversations || conversations.length === 0) {
    return <div className={styles.noSelection}>עדיין אין שיחות</div>;
  }

  // מוצא את השיחה הנבחרת
  const selectedConversation = conversations.find(
    (c) =>
      (c._id || c.id || c.conversationId) === selectedConversationId
  );

  // קובע מה להציג בכותרת
  let sidebarTitle = "שיחה";
  if (selectedConversation) {
    if (isBusiness) {
      sidebarTitle = `שיחה עם ${selectedConversation.customerName || "לקוח"}`;
    } else {
      sidebarTitle = `שיחה עם ${selectedConversation.businessName || "עסק"}`;
    }
  } else {
    sidebarTitle = isBusiness ? "שיחות עם לקוחות" : "שיחה עם עסק";
  }

  return (
    <div className={styles.conversationsList}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>
          {sidebarTitle}
        </div>
        {conversations.map((conv, idx) => {
          const participants = Array.isArray(conv.participants) ? conv.participants : [];
          const partnerId = participants.find(p => p !== businessId) || "";
          const convoId = conv._id || conv.id || conv.conversationId || `conv-${idx}`;
          const isActive = convoId === selectedConversationId;

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
