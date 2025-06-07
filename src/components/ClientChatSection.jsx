import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import createSocket from "../socket";

export default function ClientChatSection() {
  const { businessId } = useParams();
  const { user, initialized, refreshAccessToken } = useAuth();
  const userId = user?.userId || user?.id || null;

  const [conversationId, setConversationId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!initialized || !userId || !businessId) return;

    async function setupSocket() {
      try {
        const token = await refreshAccessToken();
        if (!token) {
          setError("אין טוקן תקין, אנא התחבר מחדש");
          return;
        }

        // מעבירים את businessId כפרמטר ל-createSocket
        const sock = await createSocket(refreshAccessToken, () => {
          window.location.href = "/login";
        }, businessId);
        
        if (!sock) {
          setError("חיבור לסוקט נכשל");
          return;
        }

        socketRef.current = sock;

        sock.on("connect_error", (err) => {
          console.error("Socket connect_error:", err.message);
          setError("שגיאה בחיבור לסוקט: " + err.message);
        });

        sock.on("disconnect", (reason) => {
          console.warn("Socket disconnected:", reason);
          // אפשר להוסיף פה לוגיקה לניסיון חיבור מחדש
        });
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
  }, [initialized, userId, businessId, refreshAccessToken]);

  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !businessId) return;

    const tryEmit = () => {
      setLoading(true);
      setError("");

      sock.emit("startConversation", { otherUserId: businessId }, (res) => {
        console.log("startConversation response:", res);
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
    };

    if (sock.connected) {
      tryEmit();
    } else {
      sock.once("connect", tryEmit);
    }

    return () => {
      sock.off("connect", tryEmit);
    };
  }, [businessId]);

  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !conversationId || !userId) return;

    sock.emit("getConversations", { userId }, (res) => {
      console.log("getConversations response:", res);
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
          <div className={styles.convItemActive}>{businessName || businessId}</div>
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
