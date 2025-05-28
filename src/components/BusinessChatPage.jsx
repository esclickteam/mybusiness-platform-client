// src/components/BusinessChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import socket from "../socket";
import API from "../api";

export default function BusinessChatPage() {
  const { user, initialized, refreshToken } = useAuth();
  const businessId = user?.businessId || user?.business?._id;

  const [convos, setConvos]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const hasJoinedRef            = useRef(false);

  // 1. ואתחול הסוקט עם טוקן תקף
  useEffect(() => {
    if (!initialized || !businessId) return;

    (async () => {
      setLoading(true);
      let token = user.accessToken;

      // רענון טוקן אם פג
      try {
        token = await refreshToken();
      } catch {
        setError("❌ טוקן לא תקף ולא ניתן לרענן");
        setLoading(false);
        return;
      }

      // אתחול הסוקט
      socket.auth = { token, role: "business", businessId };
      socket.connect();

      setLoading(false);
    })();
  }, [initialized, businessId]);

  // 2. קבלת רשימת שיחות דרך Socket.IO
  useEffect(() => {
    if (!socket.connected || !businessId) return;

    socket.emit("getConversations", { businessId }, ({ ok, conversations, error: errMsg }) => {
      if (ok) {
        setConvos(conversations);
        // אם אין שיחה נבחרת, בחרי באחת ראשונה
        if (!selected && conversations.length > 0) {
          const first = conversations[0];
          const convoId = first._id || first.conversationId;
          const partnerId = first.partnerId || first.participants.find(p => p !== businessId);
          setSelected({ conversationId: convoId, partnerId });
        }
      } else {
        setError("לא ניתן לטעון שיחות: " + errMsg);
        console.error("getConversations error:", errMsg);
      }
    });
  }, [socket.connected, businessId]);

  // 3. האזנה להודעות חדשות
  useEffect(() => {
    const handler = (msg) => {
      // עדכון רשימת השיחות לפי עדכוןAt
      setConvos(prev => {
        const idx = prev.findIndex(c => String(c._id) === msg.conversationId);
        if (idx === -1) return prev;
        const updated = { ...prev[idx], updatedAt: msg.timestamp || new Date().toISOString() };
        return [updated, ...prev.filter((_, i) => i !== idx)];
      });
      // עדכון היסטוריית הודעות אם זו השיחה הנבחרת
      if (msg.conversationId === selected?.conversationId) {
        setMessages(prev => prev.some(m => m._id === msg._id) ? prev : [...prev, msg]);
      }
    };
    socket.on("newMessage", handler);
    return () => {
      socket.off("newMessage", handler);
    };
  }, [selected]);

  // 4. הצטרפות לחדר השיחה
  useEffect(() => {
    if (!socket.connected || !selected?.conversationId) return;

    // אם הצטרפת לפני כן — עזוב קודם
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
  }, [selected, socket.connected]);

  // 5. טעינת היסטוריה דרך HTTP (fallback)
  useEffect(() => {
    if (!initialized || !selected?.conversationId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    API.get("/conversations/history", {
      params: { conversationId: selected.conversationId }
    })
      .then(res => {
        setMessages(res.data);
      })
      .catch(e => {
        console.error("Load history error:", e);
        setError("שגיאה בטעינת היסטוריה");
        setMessages([]);
      })
      .finally(() => setLoading(false));
  }, [initialized, selected]);

  // בחירת שיחה מהצד
  function handleSelect(conversationId, partnerId) {
    setSelected({ conversationId, partnerId });
  }

  if (!initialized) {
    return <p className={styles.loading}>טוען מידע…</p>;
  }

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
            socket={socket}
            messages={messages}
            setMessages={setMessages}
          />
        ) : (
          <div className={styles.emptyMessage}>
            בחר שיחה כדי לראות הודעות
          </div>
        )}
      </section>
    </div>
  );
}
