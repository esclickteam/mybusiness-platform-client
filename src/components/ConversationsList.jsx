import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "../context/socketContext";
import UnreadBadge from "./UnreadBadge";
import styles from "./ConversationsList.module.css";

export default function ConversationsList({
  conversations = [],
  businessId,
  selectedConversationId,
  onSelect,
  isBusiness,
  unreadCountsByConversation = {},
}) {
  const socket = useSocket();

  const endpoint = isBusiness
    ? "/api/messages/client-conversations"
    : "/api/messages/user-conversations";

  const { data: fetchedConversations = [], isLoading, error } = useQuery({
    queryKey: ["conversations", endpoint, businessId],
    queryFn: async () => {
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("שגיאה בטעינת השיחות");
      const json = await res.json();
      return json.conversations ?? json;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Use passed-in prop if provided, otherwise fetched data
  const list = conversations.length ? conversations : fetchedConversations;

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
  if (list.length === 0)
    return <div className={styles.noSelection}>עדיין אין שיחות</div>;

  const uniqueConvs = list.filter((conv, idx, arr) => {
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
              className={`${styles.convItem} ${
                isActive ? styles.active : ""
              }`}
              onClick={() => onSelect(convoId, partnerId, displayName)}
              style={{ position: "relative" }}
            >
              <span>{displayName}</span>
              <div className={styles.badgeWrapper}>
                <UnreadBadge conversationId={convoId} count={unreadCount} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
