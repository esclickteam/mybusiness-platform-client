// src/pages/BusinessChatPage.jsx
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
  const businessId = user?.businessId || user?.business?._id;

  const { updateMessagesCount } = useOutletContext();

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const socket = useSocket();
  const prevSelectedRef = useRef(null);

  const [unreadCountsByConversation, setUnreadCountsByConversation] = useState({});

  const totalUnreadCount = Object.values(unreadCountsByConversation).reduce((a, b) => a + b, 0);

  useEffect(() => {
    updateMessagesCount?.(totalUnreadCount);
  }, [totalUnreadCount, updateMessagesCount]);

  useEffect(() => {
    if (!initialized || !businessId) return;
    setLoading(true);
    API.get("/conversations", { params: { businessId } })
      .then(({ data }) => {
        setConvos(data);
        const initialUnread = {};
        data.forEach((c) => {
          const id = c.conversationId || c._id;
          const unread = c.unreadCount || 0;
          if (unread > 0) initialUnread[id] = unread;
        });
        setUnreadCountsByConversation(initialUnread);

        if (data.length > 0) {
          const first = data[0];
          const convoId = first.conversationId || first._id;
          const partnerId = first.partnerId || first.participants.find((p) => p !== businessId);
          setSelected({ conversationId: convoId, partnerId });
        }
      })
      .catch(() => setError("שגיאה בטעינת שיחות"))
      .finally(() => setLoading(false));
  }, [initialized, businessId]);

  // Remove useOnScreen - always load messages when selected changes
  const messagesAreaRef = useRef(null);

  useEffect(() => {
    if (!socket || !socket.connected || !selected?.conversationId) {
      setMessages([]);
      return;
    }

    socket.emit("markMessagesRead", selected.conversationId, (resp) => {
      if (!resp.ok) console.error("Failed to mark read", resp.error);
      else {
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

    socket.emit("getHistory", { conversationId: selected.conversationId }, (res) => {
      if (res.ok) setMessages(res.messages || []);
      else {
        setMessages([]);
        setError("שגיאה בטעינת ההודעות");
      }
    });

    prevSelectedRef.current = selected.conversationId;
  }, [socket, selected]);

  useEffect(() => {
    if (!socket) return;
    const handleNew = (msg) => {
      const convoId = msg.conversationId || msg.conversation_id;
      if (convoId && convoId !== selected?.conversationId) {
        setUnreadCountsByConversation((prev) => ({ ...prev, [convoId]: (prev[convoId] || 0) + 1 }));
      }
    };
    socket.on("newClientMessageNotification", handleNew);
    return () => socket.off("newClientMessageNotification", handleNew);
  }, [socket, selected?.conversationId]);

  const handleSelect = (conversationId, partnerId) => {
    setSelected({ conversationId, partnerId });
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
            isBusiness
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
            businessName={user?.businessName || user?.name}
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
