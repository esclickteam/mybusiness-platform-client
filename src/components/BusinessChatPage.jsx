import React, { useEffect, useState, useRef } from "react";
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
    rawBusinessId && typeof rawBusinessId === "object" && rawBusinessId._id
      ? rawBusinessId._id.toString()
      : rawBusinessId?.toString();

  const { updateMessagesCount } = useOutletContext();

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const socket = useSocket();
  const prevSelectedRef = useRef(null);

  const [unreadCountsByConversation, setUnreadCountsByConversation] = useState({});
  const totalUnreadCount = Object.values(unreadCountsByConversation).reduce(
    (a, b) => a + b,
    0
  );

  useEffect(() => {
    updateMessagesCount?.(totalUnreadCount);
  }, [totalUnreadCount, updateMessagesCount]);

  // Fetch conversations list
  useEffect(() => {
    if (!initialized || !businessId) return;

    setLoading(true);
    API.get("/messages/client-conversations")
      .then(({ data }) => {
        console.log("🔥 client-conversations response:", data.conversations);
        const convosData = data.conversations || [];
        setConvos(convosData);

        // Initialize unread counts
        const initialUnread = {};
        convosData.forEach((c) => {
          if (c.unreadCount > 0) initialUnread[c.conversationId] = c.unreadCount;
        });
        setUnreadCountsByConversation(initialUnread);

        // Initial selection of first conversation
        if (convosData.length > 0) {
          const { conversationId, clientId, clientName } = convosData[0];
          console.log("Initial selected convo:", { conversationId, clientId, clientName });
          setSelected({
            conversationId,
            partnerId:   clientId,
            partnerName: clientName,
          });
        } else {
          setSelected(null);
        }
      })
      .catch(() => setError("שגיאה בטעינת שיחות עם לקוחות"))
      .finally(() => setLoading(false));
  }, [initialized, businessId]);

  const messagesAreaRef = useRef(null);

  // Handle socket events and history
  useEffect(() => {
    if (!socket || !socket.connected || !selected?.conversationId) {
      setMessages([]);
      return;
    }

    socket.emit("markMessagesRead", selected.conversationId, (resp) => {
      if (resp.ok) {
        setUnreadCountsByConversation((prev) => {
          const next = { ...prev };
          delete next[selected.conversationId];
          return next;
        });
      }
    });

    if (prevSelectedRef.current && prevSelectedRef.current !== selected.conversationId) {
      socket.emit("leaveConversation", prevSelectedRef.current);
    }

    socket.emit("joinConversation", selected.conversationId, (ack) => {
      if (!ack.ok) setError("לא ניתן להצטרף לשיחה");
    });

    socket.emit(
      "getHistory",
      { conversationId: selected.conversationId },
      (res) => {
        if (res.ok) {
          setMessages(res.messages || []);
        } else {
          setMessages([]);
          setError("שגיאה בטעינת ההודעות");
        }
      }
    );

    prevSelectedRef.current = selected.conversationId;
  }, [socket, selected]);

  // Listen for new message notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      const convoId = msg.conversationId || msg.conversation_id;
      if (convoId && convoId !== selected?.conversationId) {
        setUnreadCountsByConversation((prev) => ({
          ...prev,
          [convoId]: (prev[convoId] || 0) + 1,
        }));
      }
    };

    socket.on("newClientMessageNotification", handleNewMessage);
    return () => socket.off("newClientMessageNotification", handleNewMessage);
  }, [socket, selected?.conversationId]);

  // Selection handler
  const handleSelect = (conversationId, partnerId, partnerName) => {
    console.log("handleSelect got:", { conversationId, partnerId, partnerName });
    setSelected({ conversationId, partnerId, partnerName });
  };

  if (!initialized) return <p className={styles.loading}>טוען מידע…</p>;

  return (
    <div className={styles.chatContainer}>
      <aside className={styles.sidebarInner}>
        {loading ? (
          <p className={styles.loading}>טוען שיחות…</p>
        ) : (
          <ConversationsList
            conversations={convos}
            businessId={businessId}
            selectedConversationId={selected?.conversationId}
            onSelect={handleSelect}
            unreadCountsByConversation={unreadCountsByConversation}
            isBusiness={false}
          />
        )}
        {error && <p className={styles.error}>{error}</p>}
      </aside>

      <section ref={messagesAreaRef} className={styles.chatArea}>
        {selected ? (
          <BusinessChatTab
            conversationId={selected.conversationId}
            businessId={businessId}
            customerId={selected.partnerId}
            customerName={selected.partnerName}
            socket={socket}
            initialMessages={messages}
            onMessagesChange={setMessages}
          />
        ) : (
          <div className={styles.emptyMessage}>בחר שיחה כדי לראות הודעות</div>
        )}
      </section>
    </div>
  );
}
