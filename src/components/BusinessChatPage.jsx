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

  /* =========================
     📱 Mobile handling
  ========================= */
  const [isMobile, setIsMobile] = useState(false);

  const [mobileView, setMobileView] = useState("list"); // list | chat

  useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  checkMobile(); // 👈 קובע מצב מיד אחרי mount

  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);

  const socket = useSocket();
  const location = useLocation();

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
     🔍 Open conversation from navigation
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

    if (isMobile) setMobileView("chat");

    setUnreadCounts((prev) => {
      const next = { ...prev };
      delete next[threadId];
      return next;
    });
  }, [location, convos, initialized, businessId, isMobile]);

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

        if (!selected && deduped.length && !isMobile) {
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
  }, [initialized, businessId, selected, isMobile]);

  /* =========================
     💬 Realtime unread updates
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
     ✅ Mark conversation read
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

    if (isMobile) setMobileView("chat");
  };

  if (!initialized) {
    return <p className={styles.loading}>Loading data…</p>;
  }

  /* =========================
     🖼 Render
  ========================= */
  return (
    <div className={styles.chatContainer}>
      {isMobile ? (
        mobileView === "list" ? (
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
        ) : (
          <section className={styles.chatArea}>
  {selected ? (
    <BusinessChatTab
      conversationId={selected.conversationId}
      businessId={businessId}
      customerId={selected.partnerId}
      customerName={selected.partnerName}
      conversationType={selected.conversationType}
      onBack={() => setMobileView("list")}
    />
  ) : (
    <div className={styles.loading}>Loading chat…</div>
  )}
</section>
        )
      ) : (
        <>
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
                conversationType={selected.conversationType}
              />
            ) : (
              <div className={styles.emptyMessage}>
                Select a conversation
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
