import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import createSocket from "../socket";

export default function ClientChatSection() {
  const { businessId } = useParams();
  const { user, initialized, refreshAccessToken } = useAuth(); // שים לב כאן להחליף ל-refreshAccessToken
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
        const token = await refreshAccessToken(); // כאן קורא ל-refreshAccessToken במקום getValidAccessToken
        if (!token) {
          setError("אין טוקן תקין, אנא התחבר מחדש");
          return;
        }

        const sock = await createSocket(token, refreshAccessToken, () => {
          window.location.href = "/login";
        });
        socketRef.current = sock;

        sock.on("connect_error", (err) => {
          console.error("Socket connect_error:", err.message);
          setError("שגיאה בחיבור לסוקט: " + err.message);
        });

        // אין צורך לקרוא connect() אם createSocket כבר מחבר את הסוקט
        // sock.connect();
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
  }, [initialized, userId, businessId, refreshAccessToken]); // ופה גם להוסיף ל-deps

  useEffect(() => {
    if (!socketRef.current || !socketRef.current.connected || !businessId) return;

    setLoading(true);
    setError("");

    socketRef.current.emit("startConversation", { otherUserId: businessId }, (res) => {
      if (!res || typeof res !== "object") {
        setError("תגובה לא תקינה משרת השיחה");
        setLoading(false);
        return;
      }
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
      if (!res || typeof res !== "object") {
        setError("תגובה לא תקינה משרת השיחות");
        return;
      }
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
