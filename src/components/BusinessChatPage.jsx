import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import API from "../api";
import { useSocket } from "../context/socketContext";
import { useNotifications } from "../context/NotificationsContext"; // ✅ חדש

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const rawBusinessId = user?.businessId || user?.business?._id;
  const businessId = (rawBusinessId?._id ?? rawBusinessId)?.toString();

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const socket = useSocket();
  const location = useLocation();

  const { unreadCount, markAsRead } = useNotifications(); // ✅ שימוש במערכת ההתראות החדשה

  /* 🧩 עוזר לנרמל שיחות */
  const normaliseConversation = (c) => ({
    ...c,
    conversationId: (c.conversationId ?? c._id ?? c.id)?.toString() ?? "",
    clientId:
      c.clientId?.toString() ||
      c.customer?._id?.toString() ||
      "".toString(),
    clientName: c.clientName || c.customer?.name || "Client",
    conversationType: c.conversationType || "user-business",
  });

  /* 🔍 בודק query param לפתיחת שיחה */
  useEffect(() => {
    if (!initialized || !businessId || convos.length === 0) return;

    const params = new URLSearchParams(location.search);
    const threadId = params.get("threadId");
    if (threadId) {
      const convo = convos.find((c) => c.conversationId === threadId);
      if (convo) {
        setSelected({
          conversationId: convo.conversationId,
          partnerId: convo.clientId,
          partnerName: convo.clientName,
          conversationType: convo.conversationType,
        });
        setUnreadCounts((prev) => {
          const next = { ...prev };
          delete next[threadId];
          return next;
        });
        markAsRead?.(threadId); // ✅ מסמן כהודעה שנקראה
      }
    }
  }, [location.search, convos, initialized, businessId, markAsRead]);

  /* 📦 טוען שיחות */
  useEffect(() => {
    if (!initialized || !businessId) return;

    API.get("/messages/client-conversations")
      .then(({ data }) => {
        const listRaw = (data.conversations ?? data ?? []).filter(
          (c) => (c.conversationType || "user-business") === "user-business"
        );

        const list = listRaw.map(normaliseConversation);

        const deduped = list.reduce((acc, conv) => {
          if (!acc.find((c) => c.clientId === conv.clientId)) acc.push(conv);
          return acc;
        }, []);

        setConvos(deduped);

        const counts = {};
        deduped.forEach((c) => {
          if (c.unreadCount) counts[c.conversationId] = c.unreadCount;
        });
        setUnreadCounts(counts);

        // בחירת שיחה ראשונה כברירת מחדל
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
            conversationType,
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching client conversations:", err);
      });
  }, [initialized, businessId, selected]);

  /* 💬 עדכון מיידי בזמן אמת */
  useEffect(() => {
    if (!socket || !businessId) return;

    socket.emit("joinBusinessRoom", businessId);

    const handleNewMessage = (msg) => {
      if (msg?.toId === businessId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [msg.conversationId]: (prev[msg.conversationId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.emit("leaveRoom", `business-${businessId}`);
    };
  }, [socket, businessId]);

  /* 🧭 בחירת שיחה */
  const handleSelect = (conversationId, partnerId, partnerName) => {
    const convo = convos.find((c) => c.conversationId === conversationId);
    const type = convo?.conversationType || "user-business";

    setSelected({ conversationId, partnerId, partnerName, conversationType: type });
    setUnreadCounts((prev) => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
    markAsRead?.(conversationId); // ✅ סימון כהודעה שנקראה
  };

  if (!initialized) {
    return <p className={styles.loading}>Loading data…</p>;
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
          <div className={styles.emptyMessage}>
            Select a conversation to view messages
          </div>
        )}
      </section>
    </div>
  );
}
