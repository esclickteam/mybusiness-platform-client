// src/components/BusinessChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import createSocket from "../socket";

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const businessId = user?.businessId || user?.business?._id;

  const [convos, setConvos]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const socketRef               = useRef(null);
  const hasJoinedRef            = useRef(false);

  // 1. Initialize and connect socket
  useEffect(() => {
    if (!initialized || !businessId) return;

    (async () => {
      const sock = await createSocket();
      if (!sock) return;
      socketRef.current = sock;
      sock.connect();

      sock.on("connect_error", err => {
        setError("Socket error: " + err.message);
        setLoading(false);
      });
    })();

    return () => {
      socketRef.current?.disconnect();
      hasJoinedRef.current = false;
    };
  }, [initialized, businessId]);

  // 2. Load conversations on socket connect
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock) return;

    const onConnect = () => {
      sock.emit(
        "getConversations",
        { businessId },
        ({ ok, conversations, error: errMsg }) => {
          if (ok) {
            setConvos(conversations);
            if (conversations.length > 0) {
              const first = conversations[0];
              const convoId = first._id || first.conversationId;
              const partnerId = first.partnerId || first.participants.find(p => p !== businessId);
              setSelected({ conversationId: convoId, partnerId });
            }
          } else {
            setError("לא ניתן לטעון שיחות: " + errMsg);
          }
          setLoading(false);
        }
      );
    };

    sock.once("connect", onConnect);
    return () => sock.off("connect", onConnect);
  }, [businessId]);

  // 3. Listen for incoming Socket messages
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock) return;

    const handler = msg => {
      // update sidebar order
      setConvos(prev => {
        const idx = prev.findIndex(c => String(c._id || c.conversationId) === msg.conversationId);
        if (idx === -1) return prev;
        const updated = {
          ...prev[idx],
          updatedAt: msg.timestamp || new Date().toISOString()
        };
        return [updated, ...prev.filter((_, i) => i !== idx)];
      });
      // append to history if open
      if (msg.conversationId === selected?.conversationId) {
        setMessages(prev =>
          prev.some(m => m._id === msg._id) ? prev : [...prev, msg]
        );
      }
    };

    sock.on("newMessage", handler);
    return () => sock.off("newMessage", handler);
  }, [selected]);

  // 4. Join or leave rooms on selection change
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock?.connected || !selected?.conversationId) return;

    if (hasJoinedRef.current) {
      sock.emit("leaveConversation", selected.conversationId);
    }
    sock.emit("joinConversation", selected.conversationId, ack => {
      if (!ack.ok) setError("לא ניתן להצטרף לשיחה");
    });
    hasJoinedRef.current = true;
  }, [selected]);

  const handleSelect = (conversationId, partnerId) => {
    setSelected({ conversationId, partnerId });
    setMessages([]);
    setLoading(true);
  };

  if (!initialized) return <p className={styles.loading}>טוען מידע…</p>;

  return (
    <div className={styles.chatContainer}>
      <aside className={styles.sidebarInner}>
        {loading
          ? <p className={styles.loading}>טוען שיחות…</p>
          : <ConversationsList
              conversations={convos}
              businessId={businessId}
              selectedConversationId={selected?.conversationId}
              onSelect={handleSelect}
              isBusiness
            />
        }
        {error && <p className={styles.error}>{error}</p>}
      </aside>

      <section className={styles.chatArea}>
        {selected
          ? <BusinessChatTab
              conversationId={selected.conversationId}
              businessId={businessId}
              customerId={selected.partnerId}
              businessName={user?.businessName || user?.name}
              socket={socketRef.current}
              messages={messages}
              setMessages={setMessages}
            />
          : <div className={styles.emptyMessage}>
              בחר שיחה כדי לראות הודעות
            </div>
        }
      </section>
    </div>
  );
}
