```javascript
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useOutletContext, useLocation } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import API from "../api";
import { useSocket } from "../context/socketContext";

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const rawBusinessId = user?.businessId || user?.business?._id;
  const businessId = (rawBusinessId?._id ?? rawBusinessId)?.toString();

  const { updateMessagesCount } = useOutletContext();
  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const socket = useSocket();
  const location = useLocation();

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

  // Checks the query parameter threadId and sets an open conversation if there is a match
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
      }
    }
  }, [location.search, convos, initialized, businessId]);

  // Loads conversations from the server and updates the conversation list + counters
  useEffect(() => {
    if (!initialized || !businessId) return;

    API.get("/messages/client-conversations")
      .then(({ data }) => {
        // Filters only conversations with clients (user-business)
        const listRaw = (data.conversations ?? data ?? []).filter(
          (c) => (c.conversationType || "user-business") === "user-business"
        );

        const list = listRaw.map(normaliseConversation);

        // Removes duplicates by clientId
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

        // Selects an initial conversation if none has been selected yet
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
  }, [initialized, businessId]);

  // Updates the unread message count on the dashboard or elsewhere
  useEffect(() => {
    const total = Object.values(unreadCounts).reduce((acc, v) => acc + v, 0);
    updateMessagesCount?.(total);
  }, [unreadCounts, updateMessagesCount]);

  // Handles conversation selection
  const handleSelect = (conversationId, partnerId, partnerName) => {
    const convo = convos.find((c) => c.conversationId === conversationId);
    const type = convo?.conversationType || "user-business";

    setSelected({ conversationId, partnerId, partnerName, conversationType: type });
    setUnreadCounts((prev) => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
  };

  if (!initialized) {
    return <p className={styles.loading}>Loading information…</p>;
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
            Select a conversation to see messages
          </div>
        )}
      </section>
    </div>
  );
}
```