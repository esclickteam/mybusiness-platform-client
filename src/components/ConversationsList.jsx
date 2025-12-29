import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "../context/socketContext";
import UnreadBadge from "./UnreadBadge";
import styles from "./ConversationsList.module.css";

/**
 * Sidebar displaying the list of conversations.
 * Works for both the **client app** and the **business dashboard**.
 *
 * - When `isBusiness=true`, we show business-side labels and join
 *   the socket room for the given `businessId`.
 * - We ensure only the first conversation per partner is kept,
 *   to avoid duplicates when the same client reopens a chat.
 * - `onSelect` is called with (conversationId, partnerId, partnerName).
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
  const [selectedId, setSelectedId] = useState(selectedConversationId); // מניעת פתיחה אוטומטית של שיחה

  // -------- API ENDPOINT ----------
  const endpoint = isBusiness
    ? "/api/messages/client-conversations"
    : "/api/messages/user-conversations";

  // -------- REACT-QUERY ----------
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
      if (!res.ok) throw new Error("Error loading conversations");
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
  if (isLoading) return <div className={styles.noSelection}>Loading conversations…</div>;
  if (error)
    return (
      <div className={styles.noSelection}>
        Error loading conversations: {error.message}
      </div>
    );
  if (!list.length)
    return <div className={styles.noSelection}>No conversations yet</div>;

  // -------- HELPERS ----------
  /** Ensure a stable string ID in all cases */
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

  // -------- HANDLE SELECT ----------
  const handleSelect = (convoId, partnerId, displayName) => {
    console.log("SELECT CONVERSATION", {
      convoId,
      partnerId,
      displayName,
    });
    onSelect(convoId, partnerId, displayName);
    setSelectedId(convoId); // עדכון השיחה שנבחרה
  };

  // -------- RENDER ----------
  return (
    <div className={styles.conversationsList}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>
          {isBusiness ? "Chats with Clients" : "Chat with Business"}
        </div>

        {uniqueConvs.map((conv) => {
          const convoId = getConversationId(conv);
          const partnerId = isBusiness ? conv.clientId : conv.businessId;
          const displayName = isBusiness
            ? conv.clientName
            : conv.businessName || partnerId;
          const unreadCount = unreadCountsByConversation[convoId] || 0;
          const isActive = convoId === selectedId; // השתמש ב-selectedId במקום selectedConversationId

          return (
            <div
              key={convoId}
              className={`${styles.convItem} ${isActive ? styles.active : ""}`}
              onClick={() => handleSelect(convoId, partnerId, displayName)}
              style={{ position: "relative" }}
            >
              <span>{displayName}</span>
              <div className={styles.badgeWrapper}>
                {/* Badge to display unread count */}
                {unreadCount > 0 && <UnreadBadge conversationId={convoId} count={unreadCount} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
