import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import API from "../api";
import { useSocket } from "../context/socketContext";

/**
 * Business dashboard – chat page
 * Shows list of client conversations on the left and the active chat on the right.
 *
 * Fixes / improvements:
 * 1. Normalise `conversationId` so it is **always** a string even if the API
 *    returns `_id` (Mongo) or plain `id`.
 * 2. Removes duplicated client conversations (keep the newest per client).
 * 3. Keeps unread‑counts in sync and clears them once a conversation is opened.
 */
export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const rawBusinessId = user?.businessId || user?.business?._id;
  const businessId = (rawBusinessId?._id ?? rawBusinessId)?.toString();

  const { updateMessagesCount } = useOutletContext();

  const [convos, setConvos] = useState([]); // list of conversations
  const [selected, setSelected] = useState(null); // currently open convo meta
  const [unreadCounts, setUnreadCounts] = useState({}); // { convoId: n }
  const socket = useSocket();

  // Utility – make sure every conversation has a stable string id
  const normaliseConversation = (c) => ({
    ...c,
    conversationId: (c.conversationId ?? c._id ?? c.id)?.toString() ?? "",
  });

  // ────────────────────────────────────────────────────────────────────────────
  // JOIN BUSINESS SOCKET ROOM
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (socket && businessId) {
      socket.emit("joinBusinessRoom", businessId);
    }
  }, [socket, businessId]);

  // ────────────────────────────────────────────────────────────────────────────
  // FETCH CONVERSATIONS + UNREAD COUNTS
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!initialized || !businessId) return;

    API.get("/messages/client-conversations")
      .then(({ data }) => {
        const listRaw = data.conversations ?? data ?? [];
        const list = listRaw.map(normaliseConversation);

        // Remove duplicates – keep first per client
        const deduped = list.reduce((acc, conv) => {
          if (!acc.find((c) => c.clientId === conv.clientId)) acc.push(conv);
          return acc;
        }, []);

        setConvos(deduped);

        // Build unread counters map
        const counts = {};
        deduped.forEach((c) => {
          if (c.unreadCount) counts[c.conversationId] = c.unreadCount;
        });
        setUnreadCounts(counts);

        // Auto‑select first conversation if none selected yet
        if (!selected && deduped.length) {
          const {
            conversationId,
            clientId: partnerId,
            clientName: partnerName,
            conversationType,
          } = deduped[0];
          setSelected({
            conversationId,
            partnerId,
            partnerName,
            conversationType: conversationType || "user-business",
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching client conversations:", err);
      });
  }, [initialized, businessId, selected]);

  // ────────────────────────────────────────────────────────────────────────────
  // UPDATE TOTAL UNREAD IN TOP MENU
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const total = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
    updateMessagesCount?.(total);
  }, [unreadCounts, updateMessagesCount]);

  // ────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ────────────────────────────────────────────────────────────────────────────
  const handleSelect = (conversationId, partnerId, partnerName) => {
    const convo = convos.find((c) => c.conversationId === conversationId);
    const type = convo?.conversationType || "user-business";

    setSelected({ conversationId, partnerId, partnerName, conversationType: type });

    // clear unread badge for this conversation
    setUnreadCounts((prev) => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
  };

  // ────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────────
  if (!initialized) return <p className={styles.loading}>טוען מידע…</p>;

  return (
    <div className={styles.chatContainer}>
      <aside className={styles.sidebarInner}>
        <ConversationsList
          conversations={convos}
          businessId={businessId}
          selectedConversationId={selected?.conversationId}
          onSelect={handleSelect}
          unreadCountsByConversation={unreadCounts}
          isBusiness
        />
      </aside>

      <section className={styles.chatArea}>
        {selected ? (
          <BusinessChatTab
            conversationId={selected.conversationId}
            businessId={businessId}
            customerId={selected.partnerId}
            customerName={selected.partnerName}
            socket={socket}
            conversationType={selected.conversationType}
          />
        ) : (
          <div className={styles.emptyMessage}>בחר שיחה כדי לראות הודעות</div>
        )}
      </section>
    </div>
  );
}
