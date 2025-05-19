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

  // מסננים כפילויות לפי partnerId (מכל מבנה אפשרי)
  const uniqueConvs = conversations.filter((conv, idx, arr) => {
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
          // partnerId: קודם מ־participants, ואם לא – מ־customer._id
          const partnerId =
            participants.find(p => p !== businessId) ||
            (conv.customer ? conv.customer._id : "") ||
            "";
          const convoId =
            conv._id || conv.conversationId || conv.id || `conv-${idx}`;

          // מציגים את שם הלקוח או שם העסק לפי הצד
          const displayName = isBusiness
            ? (conv.customer?.name || conv.customerName || partnerId)
            : (conv.businessName || partnerId);

          const isActive = convoId === selectedConversationId;

          // DEBUG
          // console.log("Sidebar Conversation:", {
          //   convoId, partnerId, displayName, participants, businessId, conv,
          // });

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
