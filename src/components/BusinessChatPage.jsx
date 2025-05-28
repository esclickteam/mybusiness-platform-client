// src/components/BusinessChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import { createSocket } from "../socket";
import API from "../api";
import { ensureValidToken, getBusinessId } from "../utils/authHelpers";


export default function BusinessChatPage() {
  const { user, initialized, refreshToken } = useAuth();
  const businessId = getBusinessId();
  const socketRef = useRef(null);

  const [convos, setConvos]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const hasJoinedRef            = useRef(false);

  // 1. Initialize socket once with valid token
  useEffect(() => {
    if (!initialized || !businessId) return;

    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const token = await ensureValidToken(refreshToken);

        const socket = createSocket();
        socket.auth = { token, role: "business", businessId };
        socket.connect();
        socketRef.current = socket;
      } catch (e) {
        console.error("Cannot initialize socket:", e);
        if (isMounted) setError("❌ טוקן לא תקף ולא ניתן להתחבר");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
    };
  }, [initialized, businessId, refreshToken]);

  // 2. Fetch conversations via socket
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !businessId) return;

    socket.emit("getConversations", { businessId }, ({ ok, conversations, error: errMsg }) => {
      if (ok) {
        setConvos(conversations);
        if (!selected && conversations.length > 0) {
          const first = conversations[0];
          const convoId = first._id || first.conversationId;
          const partnerId = first.partnerId || first.participants.find(p => p !== businessId);
          setSelected({ conversationId: convoId, partnerId });
        }
      } else {
        console.error("getConversations error:", errMsg);
        setError("לא ניתן לטעון שיחות: " + errMsg);
      }
    });
  }, [socketRef.current?.connected, businessId, selected]);

  // 3. Listen for new messages
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handler = (msg) => {
      setConvos(prev => {
        const idx = prev.findIndex(c => String(c._id) === msg.conversationId);
        if (idx === -1) return prev;
        const updated = { ...prev[idx], updatedAt: msg.timestamp || new Date().toISOString() };
        return [updated, ...prev.filter((_, i) => i !== idx)];
      });
      if (msg.conversationId === selected?.conversationId) {
        setMessages(prev => prev.some(m => m._id === msg._id) ? prev : [...prev, msg]);
      }
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [selected]);

  // 4. Join conversation room
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !selected?.conversationId) return;

    if (hasJoinedRef.current) {
      socket.emit("leaveConversation", selected.conversationId);
    }
    socket.emit("joinConversation", selected.conversationId, (ack) => {
      if (!ack.ok) {
        console.error("joinConversation failed:", ack.error);
        setError("לא ניתן להצטרף לשיחה");
      }
    });
    hasJoinedRef.current = true;
  }, [socketRef.current?.connected, selected]);

  // 5. Load history via REST fallback
  useEffect(() => {
    if (!initialized || !selected?.conversationId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    API.get("/conversations/history", { params: { conversationId: selected.conversationId } })
      .then(res => setMessages(res.data))
      .catch(e => {
        console.error("Load history error:", e);
        setError("שגיאה בטעינת היסטוריה");
        setMessages([]);
      })
      .finally(() => setLoading(false));
  }, [initialized, selected]);

  function handleSelect(conversationId, partnerId) {
    setSelected({ conversationId, partnerId });
  }

  if (!initialized) return <p className={styles.loading}>טוען מידע…</p>;

  return (
    <div className={styles.chatContainer}>
      <aside className={styles.sidebarInner}>
        {loading && <p className={styles.loading}>טוען…</p>}
        {!loading && (
          <ConversationsList
            conversations={convos}
            businessId={businessId}
            selectedConversationId={selected?.conversationId}
            onSelect={handleSelect}
            isBusiness
          />
        )}
        {error && <p className={styles.error}>{error}</p>}
      </aside>
      <section className={styles.chatArea}>
        {selected?.conversationId && selected.partnerId ? (
          <BusinessChatTab
            conversationId={selected.conversationId}
            businessId={businessId}
            customerId={selected.partnerId}
            businessName={user?.businessName || user?.name}
            socket={socketRef.current}
            messages={messages}
            setMessages={setMessages}
          />
        ) : (
          <div className={styles.emptyMessage}>בחר שיחה כדי לראות הודעות</div>
        )}
      </section>
    </div>
  );
}
