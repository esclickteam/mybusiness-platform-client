import React from "react";
import styles from "./ConversationsList.module.css";

export default function ConversationsList({
  conversations = [],
  businessId,
  selectedConversationId,
  onSelect,
  isBusiness,
}) {
  if (conversations.length === 0) {
    return <div className={styles.noSelection}>עדיין אין שיחות</div>;
  }

  // מסננים כפילויות לפי partnerId
  const uniqueConvs = conversations.filter((conv, idx, arr) => {
    const parts = Array.isArray(conv.participants) ? conv.participants : [];
    const partnerId = parts.find(p => p !== businessId) || conv.partnerId || "";
    return (
      arr.findIndex(c => {
        const cParts = Array.isArray(c.participants) ? c.participants : [];
        const pid = cParts.find(p => p !== businessId) || c.partnerId || "";
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
          const parts = Array.isArray(conv.participants) ? conv.participants : [];
          const partnerId = parts.find(p => p !== businessId) || conv.partnerId || "";
          const convoId = conv.conversationId || conv._id || conv.id || `conv-${idx}`;

          const displayName = isBusiness
            ? conv.customerName || conv.partnerName || partnerId
            : conv.businessName || conv.partnerName || partnerId;

          const isActive = convoId === selectedConversationId;

          return (
            <div
              key={convoId}
              className={`${styles.convItem} ${isActive ? styles.active : ""}`}
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
