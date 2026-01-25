import React, { useEffect, useState } from "react";
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

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  const socket = useSocket();
  const location = useLocation();

  // 🟣 זיהוי מובייל – לוגיקה בלבד
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
     🔍 Open conversation from navigation (deep link)
     ❗ לא בוחר אוטומטית במובייל
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

        // 🟣 בחירה אוטומטית – רק בדסקטופ
        const navigatedThreadId =
          location.state?.threadId ||
          new URLSearchParams(location.search).get("threadId");

        if (!isMobile && !selected && !navigatedThreadId && deduped.length) {
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
  }, [initialized, businessId, selected, location, isMobile]);

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
     🧭 Manual selection
  ========================= */
  const handleSelect = (conversationId, partnerId, partnerName) => {
    const convo = convos.find((c) => c.conversationId === conversationId);
    const type = convo?.conversationType || "user-business";

    setSelected({
      conversationId,
      partnerId,
      partnerName,
      conversationType: type,
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
      {/* 🟣 במובייל – רשימה רק אם אין שיחה */}
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

      {/* 🟣 שיחה – רק אם נבחרה */}
      {selected && (
        <section className={styles.chatArea}>
          <BusinessChatTab
            conversationId={selected.conversationId}
            businessId={businessId}
            customerId={selected.partnerId}
            customerName={selected.partnerName}
            socket={socket}
            conversationType={selected.conversationType}
            onBack={isMobile ? () => setSelected(null) : undefined}
          />
        </section>
      )}
    </div>
  );
}
