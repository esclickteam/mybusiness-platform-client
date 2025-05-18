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
  return (
    <div className={styles.listContainer}>
      {conversations.map(conv => {
        // וודא שיש מערך משתתפים
        const participants = Array.isArray(conv.participants) ? conv.participants : [];
        const partnerId = participants.find(p => p !== businessId) || "";
        const isActive = conv._id === selectedConversationId;

        return (
          <div
            key={conv._id || conv.id}
            className={`${styles.convoItem} ${isActive ? styles.active : ""}`}
            onClick={() => onSelect({ conversationId: conv._id || conv.id, partnerId })}
          >
            <div className={styles.convoInfo}>
              <p className={styles.partnerName}>{conv.businessName || partnerId}</p>
              {conv.lastMessage && <p className={styles.lastMsg}>{conv.lastMessage.text}</p>}
            </div>
            {conv.updatedAt && (
              <div className={styles.timeStamp}>
                {new Date(conv.updatedAt).toLocaleDateString("he-IL", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

ConversationsList.propTypes = {
  conversations: PropTypes.array.isRequired,
  businessId: PropTypes.string.isRequired,
  selectedConversationId: PropTypes.string,
  onSelect: PropTypes.func.isRequired
};
