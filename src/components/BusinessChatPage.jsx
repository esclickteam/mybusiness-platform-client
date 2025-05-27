import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import * as jwtDecode from "jwt-decode";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import { io } from "socket.io-client";
import API from "../api";

export default function BusinessChatPage() {
  const { user, initialized, refreshToken } = useAuth();
  const businessId = user?.businessId || user?.business?._id;

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  function isTokenValid(token) {
    if (!token) return false;
    try {
      const { exp } = jwtDecode.default(token);
      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  }

  async function initSocket(token) {
    socketRef.current?.disconnect();
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const socket = io(socketUrl, {
      path: "/socket.io",
      withCredentials: true,
      auth: { token, role: "business", businessId },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("getConversations", { businessId }, ({ ok, conversations = [], error: errMsg }) => {
        if (ok) {
          setConvos(conversations);
          if (!selected && conversations.length > 0) {
            const first = conversations[0];
            const convoId = first._id || first.conversationId;
            const partnerId = Array.isArray(first.participants)
              ? first.participants.find(p => String(p) !== String(businessId))
              : first.partnerId;
            setSelected({ conversationId: String(convoId), partnerId });
          }
        } else {
          setError("לא ניתן לטעון שיחות: " + errMsg);
        }
      });
    });

    socket.on("connect_error", err => {
      setError("שגיאת socket: " + err.message);
      setLoading(false);
    });

    socket.on("newMessage", msg => {
      setConvos(prev => {
        const idx = prev.findIndex(c => String(c._id) === msg.conversationId);
        if (idx === -1) return prev;
        const updated = { ...prev[idx], updatedAt: msg.timestamp || new Date().toISOString() };
        const copy = [...prev];
        copy.splice(idx, 1);
        return [updated, ...copy];
      });
      if (msg.conversationId === selected?.conversationId) {
        setMessages(prev => (prev.some(m => m._id === msg._id) ? prev : [...prev, msg]));
      }
    });
  }

  // ראשוני: חיבור socket
  useEffect(() => {
    if (!initialized || !businessId) return;
    let isMounted = true;
    (async () => {
      setLoading(true);
      let token = user?.accessToken;
      if (!isTokenValid(token)) {
        try { token = await refreshToken(); } catch {
          if (isMounted) {
            setError("טוקן לא תקף ולא ניתן לרענן");
            setLoading(false);
          }
          return;
        }
      }
      await initSocket(token);
      if (isMounted) setLoading(false);
    })();
    return () => { isMounted = false; socketRef.current?.disconnect(); };
  }, [initialized, businessId, user?.accessToken]);

  // REST fallback אם אין שיחות
  useEffect(() => {
    if (!initialized || loading || convos.length > 0) return;
    (async () => {
      try {
        setLoading(true);
        const res = await API.get(`/api/conversations/business/${businessId}`);
        setConvos(res.data);
      } catch (e) {
        console.error("REST fallback failed:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [initialized, loading, convos.length, businessId]);

  // הצטרפות לשיחה נבחרת
  useEffect(() => {
    if (socketRef.current && selected?.conversationId) {
      socketRef.current.emit("joinConversation", selected.conversationId, ack => {
        if (!ack.ok) console.error("join failed:", ack.error);
      });
    }
  }, [selected]);

  // טעינת היסטוריית הודעות
  useEffect(() => {
    if (!initialized || !selected?.conversationId) return setMessages([]);
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/conversations/history?conversationId=${selected.conversationId}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setMessages(data);
      } catch {
        setError("שגיאה בטעינת היסטוריה");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [initialized, selected]);

  function handleSelect(conversationId, partnerId) {
    setSelected({ conversationId: String(conversationId), partnerId });
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
