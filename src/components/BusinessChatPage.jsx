import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import { io } from "socket.io-client";

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const businessId = user?.businessId || user?.business?._id;

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  // Initialize socket and listeners once
  useEffect(() => {
    if (!initialized || !businessId) return;

    setLoading(true);
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const socket = io(socketUrl, {
      path: "/socket.io",
      withCredentials: true,
      auth: { role: "chat", businessId },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit(
        "getConversations",
        { userId: businessId },
        ({ ok, conversations = [], error: errMsg }) => {
          setLoading(false);
          if (ok) {
            setConvos(conversations);
            if (!selected && conversations.length > 0) {
              const first = conversations[0];
              const convoId = first._id || first.conversationId;
              const partnerId = Array.isArray(first.participants)
                ? first.participants.find((p) => p !== businessId)
                : first.partnerId;
              setSelected({ conversationId: String(convoId), partnerId });
            }
          } else {
            console.error("Error loading conversations:", errMsg);
            setError('לא ניתן לטעון שיחות: ' + errMsg);
          }
        }
      );
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setLoading(false);
      setError('שגיאת חיבור: ' + err.message);
    });

    const handleNewMessage = (msg) => {
      console.log("newMessage received:", msg);
      setConvos((prev) => {
        const idx = prev.findIndex((c) => String(c._id) === msg.conversationId);
        if (idx === -1) return prev;
        const updated = { ...prev[idx], updatedAt: msg.timestamp || new Date().toISOString() };
        const copy = [...prev];
        copy.splice(idx, 1);
        return [updated, ...copy];
      });
      setMessages((prev) =>
        msg.conversationId === selected?.conversationId && !prev.some((m) => m._id === msg._id)
          ? [...prev, msg]
          : prev
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.disconnect();
      socketRef.current = null;
      console.log("Socket cleaned up");
    };
  }, [initialized, businessId]);

  // Auto-join room when selected changes
  useEffect(() => {
    if (socketRef.current && selected?.conversationId) {
      console.log("Joining convo:", selected.conversationId);
      socketRef.current.emit(
        "joinConversation",
        selected.conversationId,
        (ack) => {
          if (!ack.ok) console.error("Failed to join:", ack.error);
        }
      );
    }
  }, [selected]);

  // Fetch history for selected
  useEffect(() => {
    if (!initialized) return;
    if (!selected?.conversationId) {
      setMessages([]);
      return;
    }

    const loadHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/conversations/history?conversationId=${selected.conversationId}`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        setMessages(data);
      } catch (e) {
        console.error(e);
        setMessages([]);
        setError('שגיאה בטעינת היסטוריה');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [initialized, selected]);

  const handleSelect = (conversationId, partnerId) => {
    setSelected({ conversationId: String(conversationId), partnerId });
  };

  if (!initialized) return <p className={styles.loading}>טוען מידע…</p>;

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          {loading && <p className={styles.loading}>טוען…</p>}
          {!loading && (
            <ConversationsList
              conversations={convos}
              businessId={businessId}
              selectedConversationId={selected?.conversationId}
              onSelect={handleSelect}
              isBusiness={true}
            />
          )}
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
    </div>
  );
}
