// src/components/ConversationsList.jsx
import React from "react";
import styles from "./ConversationsList.module.css";

export default function ConversationsList({
  conversations = [],
  businessId,
  selectedConversationId,
  onSelect,
  isBusiness
}) {
  if (conversations.length === 0) {
    return <div className={styles.noSelection}>עדיין אין שיחות</div>;
  }

  // טען את השיחה שנבחרה (לשם הכותרת)
  const selected = conversations.find(
    c => c.conversationId === selectedConversationId
  );

  // קבע כותרת סיידבר
  const sidebarTitle = selected
    ? `שיחה עם ${isBusiness ? selected.customerName : selected.businessName}`
    : isBusiness
      ? "שיחות עם לקוחות"
      : "שיחה עם עסק";

  return (
    <div className={styles.conversationsList}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>{sidebarTitle}</div>

        {conversations.map(conv => {
          const isActive = conv.conversationId === selectedConversationId;
          const displayName = isBusiness
            ? conv.customerName
            : conv.businessName;

          // לצורך onSelect, אם אתה צריך גם partnerId, 
          // בצד לקוח זה פשוט businessId מה props, 
          // ובצד העסק היית מוסיף customerId בשדה conv (ב־backend).
          const partnerId = isBusiness
            ? conv.customerId   // <-- ודא שה־backend מחזיר גם customerId
            : businessId;

          return (
            <div
              key={conv.conversationId}
              className={`${styles.convItem} ${isActive ? styles.active : ""}`}
              onClick={() =>
                onSelect({
                  conversationId: conv.conversationId,
                  partnerId
                })
              }
            >
              <p className={styles.partnerName}>{displayName}</p>
              {/* אם יש הודעה אחרונה אתה יכול להציג אותה כאן */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
