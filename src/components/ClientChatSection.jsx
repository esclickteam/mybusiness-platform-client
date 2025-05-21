// src/components/ClientChatSection.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";

export default function ClientChatSection() {
  const { businessId } = useParams();
  const { user, initialized } = useAuth();
  const userId = user?.userId || null;

  const [conversationId, setConversationId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    if (!initialized || !userId || !businessId) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      auth: {
        userId,
        businessId,
        role: "customer"
      },
      transports: ["websocket"],
    });

    socketRef.current.emit(
      "startConversation",
      { otherUserId: businessId },
      (res) => {
        if (res.ok) {
          setConversationId(res.conversationId);
        } else {
          setError("שגיאה ביצירת השיחה: " + (res.error || "שגיאה לא ידועה"));
        }
        setLoading(false);
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, [initialized, userId, businessId]);

  useEffect(() => {
    if (!conversationId || !socketRef.current) return;

    socketRef.current.emit(
      "getConversations",
      { userId: businessId },
      (res) => {
        if (res.ok) {
          const convos = Array.isArray(res.conversations)
            ? res.conversations
            : [];
          const conv = convos.find((c) =>
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
  }, [conversationId, businessId]);

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
              conversationId={conversationId}
              businessId={businessId}
              userId={userId}
              socket={socketRef.current}
            />
          ) : (
            <div className={styles.emptyMessage}>
              לא הצלחנו לפתוח שיחה…
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
