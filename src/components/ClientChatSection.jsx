import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

export default function ClientChatSection() {
  /* ─── Route params & Auth ───────────────────────────────────────── */
  const { businessId: businessIdFromParams } = useParams();
  const { user, initialized } = useAuth();
  const userId = user?.userId || null;

  /* ─── Local state ──────────────────────────────────────────────── */
  const [conversationId, setConversationId] = useState(null);
  const [businessName, setBusinessName]     = useState("");
  const [businessId,  setBusinessId]        = useState(businessIdFromParams || null);
  const [loading,      setLoading]          = useState(true);
  const [error,        setError]            = useState("");
  const [messages,     setMessages]         = useState([]);

  const socketRef = useRef(null);

  /* ─── Create socket once ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (!initialized || !userId) return;
    if (socketRef.current)       return; // already connected

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token     = localStorage.getItem("token");

    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token, role: "chat" },
      withCredentials: true,
      autoConnect: true,
    });

    socketRef.current.on("connect", () => setError(""));

    socketRef.current.on("disconnect", (reason) => {
      if (reason !== "io client disconnect") {
        setError("Socket disconnected unexpectedly: " + reason);
      }
    });

    socketRef.current.on("connect_error", (err) => {
      setError("שגיאה בחיבור לסוקט: " + err.message);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [initialized, userId]);

  /* ─── Fetch user conversations once (REST) ─────────────────────── */
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError("");

    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

    fetch(`${baseUrl}/api/messages/user-conversations`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.conversations) && data.conversations.length) {
          // נסה לבחור שיחה לפי businessId מה‑URL, אחרת הראשונה ברשימה
          let conv = null;
          if (businessIdFromParams) {
            conv = data.conversations.find(
              (c) => String(c.otherParty?.id) === String(businessIdFromParams)
            );
          }
          if (!conv) conv = data.conversations[0];

          setConversationId(conv.conversationId);
          setBusinessName(conv.otherParty?.name || "");
          setBusinessId(conv.otherParty?.id);
        } else {
          // אין שיחות קיימות – נתחיל חדשה כשישלחו הודעה
          setConversationId(null);
          setBusinessName("");
          setBusinessId(businessIdFromParams || null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user conversations:", err);
        setError("שגיאה בטעינת שיחות המשתמש");
        setLoading(false);
      });
  }, [userId, businessIdFromParams]);

  /* ─── WS: history + realtime listeners ─────────────────────────── */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected || !conversationId) {
      setMessages([]);
      return;
    }

    setLoading(true);

    socket.emit("getHistory", { conversationId, businessId }, (res) => {
      if (res.ok) {
        setMessages(Array.isArray(res.messages) ? res.messages : []);
        setError("");
      } else {
        setMessages([]);
        setError("שגיאה בטעינת ההודעות: " + (res.error || "לא ידוע"));
      }
      setLoading(false);
    });

    const handleNew = (msg) => {
      setMessages((prev) => {
        const idx = prev.findIndex((m) =>
          m._id === msg._id || (m.tempId && msg.tempId && m.tempId === msg.tempId)
        );
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], ...msg };
          return next;
        }
        return [...prev, msg];
      });
    };
    const handleApproved = (msg) => {
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, status: "approved" } : m)));
    };

    socket.on("newMessage", handleNew);
    socket.on("messageApproved", handleApproved);

    socket.emit("joinConversation", conversationId);
    businessId && socket.emit("joinRoom", businessId);

    return () => {
      socket.off("newMessage", handleNew);
      socket.off("messageApproved", handleApproved);
      socket.emit("leaveConversation", conversationId);
    };
  }, [conversationId, businessId]);

  /* ─── UI ───────────────────────────────────────────────────────── */
  if (loading) return <div className={styles.loading}>טוען…</div>;

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          <h3 className={styles.sidebarTitle}>שיחה עם העסק</h3>
          <div className={styles.convItemActive}>{businessName || businessId || "עסק לא ידוע"}</div>
        </aside>
        <section className={styles.chatArea}>
          <ClientChatTab
            socket={socketRef.current}
            conversationId={conversationId}
            setConversationId={setConversationId}
            businessId={businessId}
            userId={userId}
            messages={messages}
            setMessages={setMessages}
          />
        </section>
      </div>
    </div>
  );
}
