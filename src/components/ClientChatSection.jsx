import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import API, { setAccessToken } from "../api";

export default function ClientChatSection() {
  const { businessId } = useParams();
  const { user, initialized } = useAuth();
  const userId = user?.id || user?.userId;

  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  // Configure Axios auth header
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setAccessToken(token);
  }, []);

  // Setup Socket.IO and fetch conversations
  useEffect(() => {
    if (!initialized || !userId) return;
    setLoading(true);
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      path: "/socket.io",
      withCredentials: true,
      auth: { token: localStorage.getItem("accessToken"), role: "client" },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("getConversations", { userId }, ({ ok, conversations }) => {
        if (ok) {
          setConversations(conversations);
          setError("");
        } else {
          setError("שגיאה בטעינת שיחות");
        }
        setLoading(false);
      });
    });

    socket.on("newMessage", (msg) => {
      setMessages((prev) => (msg.conversationId === selectedConvId ? [...prev, msg] : prev));
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.conversationId === msg.conversationId);
        if (idx === -1) return prev;
        const updated = { ...prev[idx], updatedAt: msg.timestamp || new Date().toISOString() };
        return [updated, ...prev.filter((_, i) => i !== idx)];
      });
    });

    socket.on("connect_error", (err) => {
      setError("שגיאת socket: " + err.message);
      setLoading(false);
    });

    return () => socket.disconnect();
  }, [initialized, userId, selectedConvId]);

  // Auto-select first conversation
  useEffect(() => {
    if (!selectedConvId && conversations.length > 0) {
      setSelectedConvId(conversations[0].conversationId);
    }
  }, [conversations, selectedConvId]);

  // Load message history
  useEffect(() => {
    if (!selectedConvId) return;
    setLoading(true);
    API.get("/conversations/history", { params: { conversationId: selectedConvId } })
      .then((res) => {
        setMessages(res.data);
        setError("");
      })
      .catch(() => setError("שגיאה בטעינת היסטוריה"))
      .finally(() => setLoading(false));
  }, [selectedConvId]);

  if (loading) return <div className={styles.loading}>טוען…</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          <h3 className={styles.sidebarTitle}>השיחות שלי</h3>
          <ConversationsList
            conversations={conversations}
            businessId={userId}
            selectedConversationId={selectedConvId}
            onSelect={setSelectedConvId}
            isBusiness={false}
          />
        </aside>
        <section className={styles.chatArea}>
          {selectedConvId ? (
            <ClientChatTab
              socket={socketRef.current}
              conversationId={selectedConvId}
              businessId={businessId}
              userId={userId}
              messages={messages}
              setMessages={setMessages}
            />
          ) : (
            <div className={styles.emptyMessage}>בחר שיחה</div>
          )}
        </section>
      </div>
    </div>
  );
}
