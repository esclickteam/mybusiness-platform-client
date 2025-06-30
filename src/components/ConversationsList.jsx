import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import UnreadBadge from "./UnreadBadge";
import styles from "./ConversationsList.module.css";
import socket from "../socket"; // נניח שיש לכם instance של socket.io מחובר

/**
 * קומפוננטה להצגת רשימת השיחות.
 * אם isBusiness=true → יקרא ל־client-conversations, אחרת ל־user-conversations.
 */
export default function ConversationsList({
  businessId,
  selectedConversationId,
  onSelect,
  isBusiness,
}) {
  // בחר endpoint בהתאם לתפקיד
  const endpoint = isBusiness
    ? "/api/messages/client-conversations"
    : "/api/messages/user-conversations";

  // fetch השיחות
  const {
    data: conversations = [],
    isLoading,
    error,
  } = useQuery(
    // queryKey כמערך! שמנו גם את העסק כדי להפריד בין queries
    ["conversations", endpoint, businessId],
    async () => {
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error("שגיאה בטעינת השיחות");
      }
      const json = await res.json();
      // ה־API מחזיר { conversations: [...] }
      return json.conversations ?? json;
    }
  );

  // הצטרפות לחדר העסק לזמן אמת
  useEffect(() => {
    if (isBusiness && socket && businessId) {
      socket.emit("joinBusinessRoom", businessId);
    }
  }, [socket, businessId, isBusiness]);

  if (isLoading) {
    return <div className={styles.noSelection}>טוען שיחות…</div>;
  }
  if (error) {
    return (
      <div className={styles.noSelection}>
        שגיאה בטעינת שיחות: {error.message}
      </div>
    );
  }
  if (conversations.length === 0) {
    return <div className={styles.noSelection}>עדיין אין שיחות</div>;
  }

  // מסננים כפילויות לפי partnerId
  const uniqueConvs = conversations.filter((conv, idx, arr) => {
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

          return (
            <div
              key={convoId}
              className={`${styles.convItem} ${
                isActive ? styles.active : ""
              }`}
              onClick={() => onSelect(convoId, partnerId, displayName)}
              style={{ position: "relative" }}
            >
              <span>{displayName}</span>
              {/* badge של הודעות לא נקראו */}
              <div className={styles.badgeWrapper}>
                <UnreadBadge conversationId={convoId} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
