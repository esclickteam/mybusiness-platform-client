// src/components/ClientChatSection.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

export default function ClientChatSection() {
  const { businessId } = useParams();
  const { user, initialized } = useAuth();
  const userId = user?.userId || null;

  const [conversationId, setConversationId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  // 1️⃣ Initialize socket once when dependencies are ready
  useEffect(() => {
    if (!initialized || !userId || !businessId) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

    console.log("Creating socket with:", { token, businessId });

    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      transports: ["polling", "websocket"],
      auth: { token, role: "chat", businessId },
      withCredentials: true,
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connect_error:", err.message);
      setError("שגיאה בחיבור לסוקט: " + err.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initialized, userId, businessId]);

  // 2️⃣ Start or get conversation once
  useEffect(() => {
    if (!socketRef.current || !businessId) return;

    setLoading(true);
    socketRef.current.emit(
      "startConversation",
      { otherUserId: businessId },
      (res) => {
        if (res.ok) setConversationId(res.conversationId);
        else setError("שגיאה ביצירת השיחה: " + (res.error || "לא ידוע"));
        setLoading(false);
      }
    );
  }, [businessId]);

  // 3️⃣ After conversationId is ready, load business name
  useEffect(() => {
    if (!socketRef.current || !conversationId) return;

    socketRef.current.emit(
      "getConversations",
      { userId },
      (res) => {
        if (res.ok) {
          const conv = res.conversations.find((c) =>
            [c.conversationId, c._id, c.id]
              .map(String)
              .includes(String(conversationId))
          );
          setBusinessName(conv?.businessName || "");
        } else {
          setError("שגיאה בטעינת שם העסק");
        }
      }
    );
  }, [conversationId, userId]);

  if (loading) return <div className={styles.loading}>טוען…</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          <h3 className={styles.sidebarTitle}>שיחה עם העסק</h3>
          <div className={styles.convItemActive}>
            {businessName || businessId}
          </div>
        </aside>
        <section className={styles.chatArea}>
          {conversationId ? (
            <ClientChatTab
              socket={socketRef.current}
              conversationId={conversationId}
              businessId={businessId}
              userId={userId}
            />
          ) : (
            <div className={styles.emptyMessage}>לא הצלחנו לפתוח שיחה…</div>
          )}
        </section>
      </div>
    </div>
  );
}
