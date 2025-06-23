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
  const businessId = rawBusinessId?._id?.toString() || rawBusinessId?.toString();

  const { updateMessagesCount } = useOutletContext();

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const socket = useSocket();

  // סיכום כל ה‐unread
  useEffect(() => {
    const total = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
    updateMessagesCount?.(total);
  }, [unreadCounts, updateMessagesCount]);

  // טעינת רשימת השיחות
  useEffect(() => {
    if (!initialized || !businessId) return;
    API.get("/messages/client-conversations")
      .then(({ data }) => {
        const list = data.conversations || [];
        setConvos(list);
        // unread initial
        const u = {};
        list.forEach(c => { if (c.unreadCount) u[c.conversationId] = c.unreadCount; });
        setUnreadCounts(u);
        // בחר אוטומטית את הראשונה
        if (list.length) {
          const { conversationId, clientId, clientName } = list[0];
          setSelected({ conversationId, partnerId: clientId, partnerName: clientName });
        }
      })
      .catch(() => {/* error handling */});
  }, [initialized, businessId]);

  const handleSelect = (conversationId, partnerId, partnerName) => {
    setSelected({ conversationId, partnerId, partnerName });
    // מאפסים את הספירה של השיחה הנבחרת
    setUnreadCounts(prev => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
  };

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
          />
        ) : (
          <div className={styles.emptyMessage}>בחר שיחה כדי לראות הודעות</div>
        )}
      </section>
    </div>
  );
}
