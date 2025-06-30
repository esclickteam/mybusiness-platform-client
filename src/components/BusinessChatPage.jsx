import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import API from "../api";
import { useSocket } from "../context/socketContext";

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const rawBusinessId = user?.businessId || user?.business?._id;
  const businessId =
    rawBusinessId?._id?.toString() || rawBusinessId?.toString();

  const { updateMessagesCount } = useOutletContext();

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const socket = useSocket();

  // עדכון סך כל ההודעות הלא נקראות בתפריט העליון
  useEffect(() => {
    const total = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
    updateMessagesCount?.(total);
  }, [unreadCounts, updateMessagesCount]);

  // הצטרפות לחדר העסק ל־Socket.IO
  useEffect(() => {
    if (socket && businessId) {
      socket.emit("joinBusinessRoom", businessId);
    }
  }, [socket, businessId]);

  // טעינת שיחות העסק
  useEffect(() => {
    if (!initialized || !businessId) return;

    API.get("/messages/client-conversations")
      .then(({ data }) => {
        // ה־API מחזיר { conversations: [...] }
        const list = data.conversations ?? [];
        setConvos(list);

        // בניית מיפוי של unread counts
        const counts = {};
        list.forEach((c) => {
          if (c.unreadCount) {
            counts[c.conversationId] = c.unreadCount;
          }
        });
        setUnreadCounts(counts);

        // בחר כברירת מחדל את השיחה הראשונה
        if (list.length) {
          const { conversationId, clientId, clientName, conversationType } =
            list[0];
          setSelected({
            conversationId,
            partnerId: clientId,
            partnerName: clientName,
            conversationType,
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching client conversations:", err);
      });
  }, [initialized, businessId]);

  const handleSelect = (conversationId, partnerId, partnerName) => {
    const convo = convos.find((c) => c.conversationId === conversationId);
    const type = convo?.conversationType || "user-business";

    setSelected({
      conversationId,
      partnerId,
      partnerName,
      conversationType: type,
    });

    // אפס את הספירה של השיחה שנבחרה
    setUnreadCounts((prev) => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
  };

  if (!initialized) {
    return <p className={styles.loading}>טוען מידע…</p>;
  }

  return (
    <div className={styles.chatContainer}>
      <aside className={styles.sidebarInner}>
        <ConversationsList
          conversations={convos}
          businessId={businessId}
          selectedConversationId={selected?.conversationId}
          onSelect={handleSelect}
          unreadCountsByConversation={unreadCounts}
          isBusiness={true}
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
          <div className={styles.emptyMessage}>
            בחר שיחה כדי לראות הודעות
          </div>
        )}
      </section>
    </div>
  );
}
