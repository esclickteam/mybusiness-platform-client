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
  const [businessName, setBusinessName] = useState("");
  const [businessId, setBusinessId] = useState(businessIdFromParams || null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ─── Helper: don't overwrite valid values with null ───────────── */
  const safeSetBusinessId = (newId) =>
    setBusinessId((prev) => newId ?? prev);

  /* ─── Socket ref ───────────────────────────────────────────────── */
  const socketRef = useRef(null);

  /* ─── 1. Create socket once ─────────────────────────────────────── */
  useEffect(() => {
    if (!initialized || !userId) return;
    if (socketRef.current) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

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
    socketRef.current.on("connect_error", (err) =>
      setError("שגיאה בחיבור לסוקט: " + err.message)
    );

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [initialized, userId]);

  /* ─── 2. Fetch user’s conversations once ────────────────────────── */
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
          let conv = null;
          if (businessIdFromParams) {
            conv = data.conversations.find(
              (c) => String(c.otherParty?.id) === String(businessIdFromParams)
            );
          }
          if (!conv) conv = data.conversations[0];

          setConversationId(conv.conversationId);
          setBusinessName(conv.otherParty?.name || "");
          safeSetBusinessId(conv.otherParty?.id);
        } else {
          setConversationId(null);
          setBusinessName("");
          safeSetBusinessId(businessIdFromParams);
        }
      })
      .catch((err) => {
        console.error("Error fetching user conversations:", err);
        setError("שגיאה בטעינת שיחות המשתמש");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId, businessIdFromParams]);

  /* ─── 3. Load history via REST when conversationId changes ──────── */
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    setError("");

    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");
    const page = 0;
    const limit = 50;
    const url = `${baseUrl}/api/conversations/${conversationId}/history?page=${page}&limit=${limit}`;

    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Unknown error");
        return body;
      })
      .then(({ messages: msgs }) => {
        setMessages(msgs);
      })
      .catch((err) => {
        console.error("Error fetching history:", err);
        setMessages([]);
        setError("שגיאה בטעינת ההיסטוריה: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [conversationId]);

  /* ─── 4. Subscribe to real-time updates ────────────────────────── */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) return;

    const handleNew = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    const handleApproved = (msg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, status: "approved" } : m))
      );
    };

    socket.on("newMessage", handleNew);
    socket.on("messageApproved", handleApproved);

    socket.emit("joinConversation", conversationId);
    if (businessId) socket.emit("joinRoom", businessId);

    return () => {
      socket.off("newMessage", handleNew);
      socket.off("messageApproved", handleApproved);
      socket.emit("leaveConversation", conversationId);
      if (businessId) socket.emit("leaveRoom", businessId);
    };
  }, [conversationId, businessId]);

  /* ─── 5. UI ───────────────────────────────────────────────────── */
  if (loading) return <div className={styles.loading}>טוען…</div>;

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          <h3 className={styles.sidebarTitle}>שיחה עם העסק</h3>
          <div className={styles.convItemActive}>
            {businessName || businessId || "עסק לא ידוע"}
          </div>
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
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
