// src/components/ConversationsList.jsx
import React from "react";
import PropTypes from "prop-types";
import styles from "./ConversationsList.module.css";

export default function ConversationsList({
  conversations,
  businessId,
  selectedConversationId,
  onSelect
}) {
  if (!conversations || conversations.length === 0) {
    return <div className={styles.noSelection}>עדיין אין שיחות</div>;
  }

  return (
    <div className={styles.conversationsList}>
      <div className={styles.sidebar}>
        {conversations.map((conv, idx) => {
          const participants = Array.isArray(conv.participants) ? conv.participants : [];
          const partnerId = participants.find(p => p !== businessId) || "";
          const convoId = conv._id || conv.id || `conv-${idx}`;
          const isActive = convoId === selectedConversationId;

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
                <p>{conv.businessName || partnerId}</p>
                {conv.lastMessage && <p>{conv.lastMessage.text}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

ConversationsList.propTypes = {
  conversations: PropTypes.array.isRequired,
  businessId: PropTypes.string.isRequired,
  selectedConversationId: PropTypes.string,
  onSelect: PropTypes.func.isRequired
};
