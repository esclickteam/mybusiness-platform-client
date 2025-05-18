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

  // מוצא את השיחה הנבחרת
  const selectedConversation = conversations.find(
    (c) => c.conversationId === selectedConversationId
  );

  // קובע מה להציג בכותרת
  let sidebarTitle;
  if (selectedConversation) {
    if (isBusiness) {
      sidebarTitle = `שיחה עם ${selectedConversation.customer.name}`;
    } else {
      sidebarTitle = `שיחה עם ${selectedConversation.business.businessName}`;
    }
  } else {
    sidebarTitle = isBusiness ? "שיחות עם לקוחות" : "שיחה עם עסק";
  }

  return (
    <div className={styles.conversationsList}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>{sidebarTitle}</div>

        {conversations.map((conv) => {
          const convoId = conv.conversationId;
          const isActive = convoId === selectedConversationId;

          // מזהה הצד השני
          const partner = isBusiness
            ? conv.customer
            : conv.business;
          const partnerId = partner._id;
          const displayName = isBusiness
            ? conv.customer.name
            : conv.business.businessName;

          // מוצא את ההודעה האחרונה
          const lastMsgObj =
            Array.isArray(conv.messages) && conv.messages.length > 0
              ? conv.messages[conv.messages.length - 1]
              : null;
          const lastText = lastMsgObj ? lastMsgObj.text : "";

          return (
            <div
              key={convoId}
              className={`${styles.convItem} ${
                isActive ? styles.active : ""
              }`}
              onClick={() =>
                onSelect({
                  conversationId: convoId,
                  partnerId
                })
              }
            >
              <div>
                <p className={styles.partnerName}>{displayName}</p>
                {lastText && (
                  <p className={styles.lastMessage}>{lastText}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
