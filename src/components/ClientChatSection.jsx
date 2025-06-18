// src/components/ClientChatSection.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/socketContext"; // משתמש ב־SocketContext

export default function ClientChatSection() {
  const { businessId } = useParams();
  const { user, initialized } = useAuth();
  const userId = user?.userId || null;
  const socket = useSocket();

  const [conversationId, setConversationId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // פתיחת שיחה או קבלת שיחה קיימת
  useEffect(() => {
    if (!initialized || !userId || !businessId || !socket) return;

    setLoading(true);
    setError("");

    socket.emit(
      "startConversation",
      { otherUserId: businessId },
      (res) => {
        if (res.ok) setConversationId(res.conversationId);
        else setError("שגיאה ביצירת השיחה: " + (res.error || "לא ידוע"));
        setLoading(false);
      }
    );
  }, [initialized, userId, businessId, socket]);

  // טעינת שם העסק לאחר קבלת conversationId
  useEffect(() => {
    if (!socket || !conversationId || !userId) return;

    socket.emit(
      "getConversations",
      { userId },
      (res) => {
        if (res.ok) {
          const conv = res.conversations.find((c) =>
            [c.conversationId, c._id, c.id].map(String).includes(String(conversationId))
          );
          setBusinessName(conv?.businessName || "");
        } else {
          setError("שגיאה בטעינת שם העסק");
        }
      }
    );
  }, [socket, conversationId, userId]);

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
              socket={socket}
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
