import React from "react";
import styles from "./ConversationsList.module.css";

export default function ConversationsList({
  conversations = [],
  businessId,
  selectedConversationId,
  onSelect,
  isBusiness,
  unreadCountsByConversation = {}, // הוספנו פרופ חדש למפה של ספירות
}) {
  if (conversations.length === 0) {
    return <div className={styles.noSelection}>עדיין אין שיחות</div>;
  }

  // מסננים כפילויות לפי partnerId
  const uniqueConvs = conversations.filter((conv, idx, arr) => {
    const parts = Array.isArray(conv.participants) ? conv.participants : [];
    const partnerId = parts.find((p) => p !== businessId) || conv.partnerId || "";
    return (
      arr.findIndex((c) => {
        const cParts = Array.isArray(c.participants) ? c.participants : [];
        const pid = cParts.find((p) => p !== businessId) || c.partnerId || "";
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
          const partnerId = parts.find((p) => p !== businessId) || conv.partnerId || "";
          const convoId =
            conv.conversationId ||
            (conv._id ? conv._id.toString() : "") ||
            conv.id ||
            `conv-${idx}`;

          const displayName = isBusiness
            ? conv.customerName || conv.partnerName || partnerId
            : conv.businessName || conv.partnerName || partnerId;

          const isActive = convoId === selectedConversationId;

          // ספירת הודעות לא נקראות של השיחה הנוכחית
          const unreadCount = unreadCountsByConversation[convoId] || 0;

          return (
            <div
              key={convoId}
              className={`${styles.convItem} ${isActive ? styles.active : ""}`}
              onClick={() => onSelect(convoId, partnerId)}
              style={{ position: "relative" }}
            >
              {displayName}
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 10,
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "12px",
                    padding: "2px 6px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    userSelect: "none",
                    minWidth: 18,
                    textAlign: "center",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
