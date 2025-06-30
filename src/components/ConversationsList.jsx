import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import UnreadBadge from "./UnreadBadge";
import styles from "./ConversationsList.module.css";
import socket from "../socket"; // instance של socket.io מחובר

export default function ConversationsList({
  businessId,
  selectedConversationId,
  onSelect,
  isBusiness,
}) {
  const endpoint = isBusiness
    ? "/api/messages/client-conversations"
    : "/api/messages/user-conversations";

  const { data: conversations = [], isLoading, error } = useQuery({
    queryKey: ["conversations", endpoint, businessId],
    queryFn: async () => {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("שגיאה בטעינת השיחות");
      const json = await res.json();
      return json.conversations ?? json;
    },
    // אופציונלי: תשמר בקאש למשך 5 דקות
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isBusiness && socket && businessId) {
      socket.emit("joinBusinessRoom", businessId);
    }
  }, [socket, businessId, isBusiness]);

  if (isLoading) return <div className={styles.noSelection}>טוען שיחות…</div>;
  if (error)
    return (
      <div className={styles.noSelection}>
        שגיאה בטעינת שיחות: {error.message}
      </div>
    );
  if (conversations.length === 0)
    return <div className={styles.noSelection}>עדיין אין שיחות</div>;

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
