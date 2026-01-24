import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import API from "../api";
import { useSocket } from "../context/socketContext";

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const rawBusinessId = user?.businessId || user?.business?._id;
  const businessId = (rawBusinessId?._id ?? rawBusinessId)?.toString();

  const socket = useSocket();
  const location = useLocation();

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  /* =========================
     📱 Detect mobile
  ========================= */
  const isMobile = useMemo(() => window.innerWidth <= 768, []);

  /* =========================
     🧩 Normalize conversation
  ========================= */
  const normaliseConversation = (c) => ({
    ...c,
    conversationId: (c.conversationId ?? c._id ?? c.id)?.toString() ?? "",
    clientId:
      c.clientId?.toString() ||
      c.customer?._id?.toString() ||
      "",
    clientName: c.clientName || c.customer?.name || "Client",
    conversationType: c.conversationType || "user-business",
  });

  /* =========================
     📦 Fetch conversations
  ========================= */
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

        // בדסקטופ – פותחים אוטומטית שיחה ראשונה
        if (!isMobile && !selected && deduped.length) {
          const first = deduped[0];
          setSelected({
            conversationId: first.conversationId,
            partnerId: first.clientId,
            partnerName: first.clientName,
            conversationType: first.conversationType,
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching client conversations:", err);
      });
  }, [initialized, businessId]);

  /* =========================
     🔍 Deep link (AI / navigation)
  ========================= */
  useEffect(() => {
    if (!initialized || !businessId || convos.length === 0) return;

    const threadId =
      location.state?.threadId ||
      new URLSearchParams(location.search).get("threadId");

    if (!threadId) return;

    const convo = convos.find((c) => c.conversationId === threadId);
    if (!convo) return;

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
  }, [location, convos, initialized, businessId]);

  /* =========================
     💬 Realtime updates
  ========================= */
  useEffect(() => {
    if (!socket || !businessId) return;

    socket.emit("joinBusinessRoom", businessId);

    const handleNewMessage = (msg) => {
      if (msg?.toId !== businessId) return;
      if (msg.conversationId === selected?.conversationId) return;

      setUnreadCounts((prev) => ({
        ...prev,
        [msg.conversationId]: (prev[msg.conversationId] || 0) + 1,
      }));
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.emit("leaveRoom", `business-${businessId}`);
    };
  }, [socket, businessId, selected]);

  /* =========================
     ✅ Mark as read
  ========================= */
  useEffect(() => {
    if (!socket || !selected?.conversationId || !businessId) return;

    socket.emit("markConversationRead", {
      conversationId: selected.conversationId,
      role: "business",
      readerId: businessId,
    });
  }, [socket, selected?.conversationId, businessId]);

  /* =========================
     🧭 Select conversation
  ========================= */
  const handleSelect = (conversationId, partnerId, partnerName) => {
    const convo = convos.find((c) => c.conversationId === conversationId);

    setSelected({
      conversationId,
      partnerId,
      partnerName,
      conversationType: convo?.conversationType || "user-business",
    });

    setUnreadCounts((prev) => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
  };

  if (!initialized) {
    return <p className={styles.loading}>Loading data…</p>;
  }

  return (
    <div className={styles.chatContainer}>
      {/* 📱 מובייל: רשימת שיחות בלבד */}
      {(!isMobile || !selected) && (
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
      )}

      {/* 📱 מובייל: שיחה בלבד + חזרה */}
      {(!isMobile || selected) && (
        <section className={styles.chatArea}>
          {isMobile && selected && (
            <button
              className={styles.backButton}
              onClick={() => setSelected(null)}
            >
              ← חזרה לשיחות
            </button>
          )}

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
      )}
    </div>
  );
}
