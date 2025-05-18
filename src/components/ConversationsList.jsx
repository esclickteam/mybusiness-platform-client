import React from "react";
import styles from "./ConversationsList.module.css";

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

  // מסננים כפילויות לפי ה-partnerId
  const uniqueConvs = conversations.filter((conv, idx, arr) => {
    // עדיפות למזהה מתוך participants, ואם לא – מ-customer?._id
    const partnerId =
      (Array.isArray(conv.participants)
        ? conv.participants.find(p => p !== businessId)
        : null) ||
      (conv.customer ? conv.customer._id : "") ||
      "";
    return (
      arr.findIndex(c => {
        const pid =
          (Array.isArray(c.participants)
            ? c.participants.find(p => p !== businessId)
            : null) ||
          (c.customer ? c.customer._id : "") ||
          "";
        return pid === partnerId;
      }) === idx
    );
  });

  return (
    <div className={styles.conversationsList}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>
          {isBusiness ? "שיחות עם לקוחות" : "שיחה עם עסק"}
        </div>
        {uniqueConvs.map((conv, idx) => {
          const participants = Array.isArray(conv.participants)
            ? conv.participants
            : [];
          // חפש תמיד קודם ב-participants ואם לא – מ-customer._id
          const partnerId =
            participants.find(p => p !== businessId) ||
            (conv.customer ? conv.customer._id : "") ||
            "";
          const convoId =
            conv._id || conv.conversationId || conv.id || `conv-${idx}`;
          const displayName = isBusiness
            ? conv.customerName || partnerId
            : conv.businessName || partnerId;
          const isActive = convoId === selectedConversationId;

          return (
            <div
              key={convoId}
              className={`${styles.conversationItem} ${isActive ? styles.active : ""}`}
              onClick={() => onSelect(convoId, partnerId)}
            >
              {displayName}
            </div>
          );
        })}
      </div>
    </div>
  );
}
