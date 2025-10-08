import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "../context/socketContext";
import UnreadBadge from "./UnreadBadge";
import styles from "./ConversationsList.module.css";

/**
 * Sidebar that shows the list of conversations.
 * Works both for the **client app** and for the **business dashboard**.
 *
 * ‑ When `isBusiness=true` we show the business‑side wording and join the
 *   socket room of the given `businessId`.
 * ‑ We make sure to keep only the first conversation per partner so you
 *   don’t get duplicates when the same client re‑opens a chat.
 * ‑ `onSelect` is called with (conversationId, partnerId, partnerName).
 */
export default function ConversationsList({
  conversations = [],
  businessId,
  selectedConversationId,
  onSelect,
  isBusiness,
  unreadCountsByConversation = {},
}) {
  const socket = useSocket();

  // -------- API ENDPOINT ----------
  const endpoint = isBusiness
    ? "/api/messages/client-conversations"
    : "/api/messages/user-conversations";

  // -------- REACT‑QUERY ----------
  const {
    data: fetchedConversations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["conversations", endpoint, businessId],
    queryFn: async () => {
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("שגיאה בטעינת השיחות");
      const json = await res.json();
      return json.conversations ?? json;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Prefer the conversations prop (useful for optimistic updates)
  const list = conversations.length ? conversations : fetchedConversations;

  // -------- SOCKET: join business room ----------
  useEffect(() => {
    if (isBusiness && socket && businessId) {
      socket.emit("joinBusinessRoom", businessId);
    }
  }, [socket, businessId, isBusiness]);

  // -------- UI STATES ----------
  if (isLoading) return <div className={styles.noSelection}>טוען שיחות…</div>;
  if (error)
    return (
      <div className={styles.noSelection}>
        שגיאה בטעינת שיחות: {error.message}
      </div>
    );
  if (!list.length)
    return <div className={styles.noSelection}>עדיין אין שיחות</div>;

  // -------- HELPERS ----------
  /** Ensure we have a stable string id in every scenario */
  const getConversationId = (conv) =>
    (conv.conversationId ?? conv._id ?? conv.id)?.toString() ?? "";

  /** Keep only one conversation per partner (first occurrence) */
  const uniqueConvs = list.reduce((acc, conv) => {
    const partnerId = isBusiness ? conv.clientId : conv.businessId;
    const alreadyExists = acc.some((c) =>
      isBusiness ? c.clientId === partnerId : c.businessId === partnerId,
    );
    if (!alreadyExists) acc.push(conv);
    return acc;
  }, []);

  // -------- RENDER ----------
  return (
    <div className={styles.conversationsList}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>
          {isBusiness ? "שיחות עם לקוחות" : "שיחה עם עסק"}
        </div>

        {uniqueConvs.map((conv) => {
          const convoId = getConversationId(conv);
          const partnerId = isBusiness ? conv.clientId : conv.businessId;
          const displayName = isBusiness
            ? conv.clientName
            : conv.businessName || partnerId;
          const unreadCount = unreadCountsByConversation[convoId] || 0;
          const isActive = convoId === selectedConversationId;

          const handleSelect = () => {
            console.log("SELECT CONVERSATION", {
              convoId,
              partnerId,
              displayName,
            });
            onSelect(convoId, partnerId, displayName);
          };

          return (
            <div
              key={convoId}
              className={`${styles.convItem} ${isActive ? styles.active : ""}`}
              onClick={handleSelect}
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
