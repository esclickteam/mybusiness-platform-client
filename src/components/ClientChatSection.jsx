import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import createSocket from "../socket";

export default function ClientChatSection() {
  const { businessId } = useParams();
  const { user, initialized, getValidAccessToken } = useAuth();
  const userId = user?.userId || null;

  const [conversationId, setConversationId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!initialized || !userId || !businessId) return;

    async function setupSocket() {
      try {
        const token = await getValidAccessToken();
        if (!token) {
          setError("אין טוקן תקין, אנא התחבר מחדש");
          return;
        }

        const sock = await createSocket(token, getValidAccessToken, () => {
          window.location.href = "/login";
        });
        socketRef.current = sock;

        sock.on("connect_error", (err) => {
          console.error("Socket connect_error:", err.message);
          setError("שגיאה בחיבור לסוקט: " + err.message);
        });

        sock.connect();
      } catch (e) {
        setError("שגיאה בהתחברות לסוקט");
        console.error(e);
      }
    }

    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initialized, userId, businessId, getValidAccessToken]);

  useEffect(() => {
    if (!socketRef.current || !socketRef.current.connected || !businessId) return;

    setLoading(true);
    setError("");

    socketRef.current.emit("startConversation", { otherUserId: businessId }, (res) => {
      if (res.ok) {
        setConversationId(res.conversationId);
        setError("");
      } else {
        setError("שגיאה ביצירת השיחה: " + (res.error || "לא ידוע"));
      }
      setLoading(false);
    });
  }, [businessId]);

  useEffect(() => {
    if (!socketRef.current || !conversationId) return;

    socketRef.current.emit("getConversations", { userId }, (res) => {
      if (res.ok) {
        const conv = res.conversations.find((c) =>
          [c.conversationId, c._id, c.id].map(String).includes(String(conversationId))
        );
        setBusinessName(conv?.businessName || "");
      } else {
        setError("שגיאה בטעינת שם העסק");
      }
    });
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
