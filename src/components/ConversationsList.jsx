import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "../context/socketContext";
import { useOutletContext } from "react-router-dom";
import UnreadBadge from "./UnreadBadge";
import styles from "./ConversationsList.module.css";

/**
 * Sidebar displaying the list of conversations.
 * Works for both the **client app** and the **business dashboard**.
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

  /* =========================
     ⬅️ STATE מגיע מה־Layout
  ========================= */
  const {
    chatSidebarOpen: sidebarOpen,
    setChatSidebarOpen: setSidebarOpen,
    isMobile,
  } = useOutletContext();

  const [selectedId, setSelectedId] = useState(selectedConversationId);

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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Error loading conversations");
      const json = await res.json();
      return json.conversations ?? json;
    },
    staleTime: 5 * 60 * 1000,
  });

  const list = conversations.length ? conversations : fetchedConversations;

  // -------- SOCKET ----------
  useEffect(() => {
    if (isBusiness && socket && businessId) {
      socket.emit("joinBusinessRoom", businessId);
    }
  }, [socket, businessId, isBusiness]);

  // -------- SYNC SELECTED ----------
  useEffect(() => {
    setSelectedId(selectedConversationId ?? null);
  }, [selectedConversationId]);

  // -------- UI STATES ----------
  if (isLoading)
    return (
      <div className={styles.noSelection}>Loading conversations…</div>
    );

  if (error)
    return (
      <div className={styles.noSelection}>
        Error loading conversations: {error.message}
      </div>
    );

  if (!list.length)
    return (
      <div className={styles.noSelection}>No conversations yet</div>
    );

  // -------- HELPERS ----------
  const getConversationId = (conv) =>
    (conv.conversationId ?? conv._id ?? conv.id)?.toString() ?? "";

  const uniqueConvs = list.reduce((acc, conv) => {
    const partnerId = isBusiness ? conv.clientId : conv.businessId;
    const exists = acc.some((c) =>
      isBusiness ? c.clientId === partnerId : c.businessId === partnerId
    );
    if (!exists) acc.push(conv);
    return acc;
  }, []);

  // -------- HANDLE SELECT ----------
  const handleSelect = (convoId, partnerId, displayName) => {
    onSelect(convoId, partnerId, displayName);
    setSelectedId(convoId);

    if (isMobile) {
      setSidebarOpen(false); // ⬅️ סוגר צ’אט במובייל
    }
  };

  // -------- RENDER ----------
  return (
    <div className={styles.conversationsList}>
  {/* Sidebar */}
  <div
    className={`${styles.sidebar} ${
      sidebarOpen ? styles.open : ""
    }`}
  >
    <div className={styles.sidebarTitle}>
      {isBusiness ? "Chats with Clients" : "Chat with Business"}
    </div>

    {uniqueConvs.map((conv) => {
      const convoId = getConversationId(conv);
      const partnerId = isBusiness ? conv.clientId : conv.businessId;
      const displayName = isBusiness
        ? conv.clientName
        : conv.businessName || partnerId;

      const unreadCount =
        unreadCountsByConversation[convoId] || 0;

      const isActive = convoId === selectedId;

      return (
        <div
          key={convoId}
          className={`${styles.convItem} ${
            isActive ? styles.active : ""
          }`}
          onClick={() =>
            handleSelect(convoId, partnerId, displayName)
          }
        >
          <span>{displayName}</span>

          {unreadCount > 0 && (
            <UnreadBadge
              conversationId={convoId}
              count={unreadCount}
            />
          )}
        </div>
      );
    })}
  </div>

  {/* 🔥 OVERLAY – חובה */}
  <div
  className={`${styles.overlay} ${
    sidebarOpen ? styles.show : ""
  }`}
  onClick={() => setSidebarOpen(false)}
/>
</div>


  );
}
