import React from "react";
import styles from "./ConversationsList.module.css";

export default function ConversationsList({
  conversations = [],
  businessId,
  selectedConversationId,
  onSelect,
  isBusiness,
  unreadCountsByConversation = {},
}) {
  if (conversations.length === 0) {
    return <div className={styles.noSelection}>עדיין אין שיחות</div>;
  }

  // מסננים כפילויות לפי partnerId
  const uniqueConvs = conversations.filter((conv, idx, arr) => {
    // partnerId נקבע לפי סוג המשתמש
    const partnerId = isBusiness ? conv.clientId : conv.businessId;
    return (
      arr.findIndex((c) => {
        const pid = isBusiness ? c.clientId : c.businessId;
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
        {uniqueConvs.map((conv) => {
          const convoId = conv.conversationId || (conv._id?.toString() ?? "");
          const partnerId = isBusiness ? conv.clientId : conv.businessId;
          const displayName = isBusiness
            ? conv.clientName
            : conv.businessName || partnerId;
          const isActive = convoId === selectedConversationId;
          const unreadCount = unreadCountsByConversation[convoId] || 0;

          return (
            <div
              key={convoId}
              className={`${styles.convItem} ${isActive ? styles.active : ""}`}
              onClick={() => onSelect(convoId, partnerId, displayName)}
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
