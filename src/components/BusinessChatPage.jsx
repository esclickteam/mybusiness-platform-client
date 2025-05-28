// src/components/BusinessChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import createSocket from "../socket";
import API from "../api";

export default function BusinessChatPage() {
  const { user, initialized, refreshToken } = useAuth();
  const businessId = user?.businessId || user?.business?._id;

  const [convos, setConvos]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const socketRef               = useRef(null);
  const hasJoinedRef            = useRef(false);

  // 1. אתחול והתחברות לסוקט (פעם אחת בלבד)
  useEffect(() => {
    if (!initialized || !businessId) return;
    if (socketRef.current) return; // אם כבר אתחולנו—אל נפעיל שוב

    (async () => {
      try {
        await refreshToken();
      } catch {
        setError("❌ טוקן לא תקף ולא ניתן לרענן");
        setLoading(false);
        return;
      }

      const sock = createSocket();
      socketRef.current = sock;
      sock.connect();

      sock.on("connect_error", err => {
        setError("שגיאת socket: " + err.message);
        setLoading(false);
      });

      sock.once("connect", () => {
        sock.emit("getConversations", { businessId }, ({ ok, conversations, error: errMsg }) => {
          if (ok) {
            setConvos(conversations);
            if (conversations.length > 0) {
              const first = conversations[0];
              const convoId   = first._id || first.conversationId;
              const partnerId = first.partnerId || first.participants.find(p => p !== businessId);
              setSelected({ conversationId: convoId, partnerId });
            }
          } else {
            setError("לא ניתן לטעון שיחות: " + errMsg);
          }
          setLoading(false);
        });
      });
    })();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [initialized, businessId]); // הסרנו את refreshToken מתלות

  // 2. האזנה להודעות חדשות
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock) return;

    const handler = msg => {
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

    sock.on("newMessage", handler);
    return () => {
      sock.off("newMessage", handler);
    };
  }, [selected]);

  // 3. הצטרפות ועזיבת חדר השיחה
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

  // 4. טעינת היסטוריה (fallback)
  useEffect(() => {
    if (!selected?.conversationId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    API.get("/conversations/history", {
      params: { conversationId: selected.conversationId }
    })
      .then(res => setMessages(res.data))
      .catch(e => {
        console.error("Load history error:", e);
        setError("שגיאה בטעינת היסטוריה");
        setMessages([]);
      })
      .finally(() => setLoading(false));
  }, [selected]);

  const handleSelect = (conversationId, partnerId) => {
    setSelected({ conversationId, partnerId });
  };

  if (!initialized) return <p className={styles.loading}>טוען מידע…</p>;

  return (
    <div className={styles.chatContainer}>
      <aside className={styles.sidebarInner}>
        {loading
          ? <p className={styles.loading}>טוען…</p>
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
