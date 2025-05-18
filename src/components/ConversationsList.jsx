// src/components/ConversationsList.jsx
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
    const partnerId = Array.isArray(conv.participants)
      ? conv.participants.find(p => p !== businessId)
      : "";
    // מוצאים את המקרה הראשון במערך עם אותו partnerId
    return (
      arr.findIndex(c => {
        const pid = Array.isArray(c.participants)
          ? c.participants.find(p => p !== businessId)
          : "";
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
          const partnerId = participants.find(p => p !== businessId) || "";
          const convoId = conv._id || conv.id || `conv-${idx}`;
          const displayName = isBusiness
            ? conv.customerName || partnerId
            : conv.businessName || partnerId;
          const isActive = convoId === selectedConversationId;

          return (
            <div
              key={convoId}
              className={`${styles.conversationItem} ${
                isActive ? styles.active : ""
              }`}
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
