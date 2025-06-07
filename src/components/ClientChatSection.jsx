import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import createSocket from "../socket";

export default function ClientChatSection() {
  const { businessId } = useParams();
  const { user, initialized, refreshAccessToken, logout } = useAuth();
  const userId = user?.userId || user?.id || null;

  const [conversationId, setConversationId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [messages, setMessages] = useState([]);   // <-- הוסף סטייט להודעות
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const socketRef = useRef(null);
  const prevConversationIdRef = useRef(null);

  // חיבור לסוקט עם טיפול ברענון טוקן
  useEffect(() => {
    if (!initialized || !userId || !businessId) return;

    (async () => {
      const token = await refreshAccessToken();
      if (!token) {
        setError("אין טוקן תקין, אנא התחבר מחדש");
        logout();
        return;
      }

      const sock = await createSocket(refreshAccessToken, logout, businessId);
      if (!sock) {
        setError("חיבור לסוקט נכשל");
        return;
      }

      socketRef.current = sock;

      sock.on("connect_error", (err) => {
        setError("שגיאה בחיבור לסוקט: " + err.message);
      });

      sock.on("tokenExpired", async () => {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          logout();
          return;
        }
        sock.auth.token = newToken;
        sock.disconnect();
        sock.connect();
      });

      sock.on("disconnect", (reason) => {
        console.warn("Socket disconnected:", reason);
      });
    })();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      prevConversationIdRef.current = null;
    };
  }, [initialized, userId, businessId, refreshAccessToken, logout]);

  // פתיחת שיחה חדשה או קבלת שיחה קיימת
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !businessId) return;

    const tryEmit = () => {
      setLoading(true);
      setError("");

      sock.emit("startConversation", { otherUserId: businessId }, (res) => {
        if (res?.ok) {
          setConversationId(res.conversationId);
          setError("");
        } else {
          setError("שגיאה ביצירת השיחה: " + (res.error || "לא ידוע"));
          setConversationId(null);
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

  // טעינת שם העסק לפי השיחה
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !conversationId || !userId) return;

    setLoading(true);

    sock.emit("getConversations", { userId }, (res) => {
      setLoading(false);
      if (res?.ok && Array.isArray(res.conversations)) {
        const conv = res.conversations.find((c) =>
          [c.conversationId, c._id, c.id].map(String).includes(String(conversationId))
        );
        if (conv) {
          setBusinessName(conv.businessName || "");
          setError("");
        } else {
          setBusinessName("");
          setError("לא נמצאה שיחה מתאימה");
        }
      } else {
        setBusinessName("");
        setError("שגיאה בטעינת שם העסק");
      }
    });
  }, [conversationId, userId]);

  // הצטרפות ל-room של השיחה, טעינת היסטוריה ומאזין להודעות חדשות
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !conversationId) return;

    if (prevConversationIdRef.current && prevConversationIdRef.current !== conversationId) {
      sock.emit("leaveConversation", prevConversationIdRef.current);
    }

    sock.emit("joinConversation", conversationId, (ack) => {
      if (!ack.ok) {
        setError("לא ניתן להצטרף לשיחה");
        return;
      }
      setError("");
    });

    // בקש היסטוריית הודעות ועדכן סטייט
    sock.emit("getHistory", { conversationId }, (res) => {
      if (res.ok) {
        setMessages(res.messages || []);
      } else {
        setError("שגיאה בטעינת ההודעות");
        setMessages([]);
      }
    });

    prevConversationIdRef.current = conversationId;

    // מאזין להודעות חדשות ומוסיף אותן לסטייט
    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        const exists = prev.some(
          (m) => (m._id && msg._id && m._id === msg._id) ||
                 (m.tempId && msg.tempId && m.tempId === msg.tempId)
        );
        if (exists) return prev;
        return [...prev, msg];
      });
    };
    sock.on("newMessage", handleNewMessage);

    return () => {
      sock.emit("leaveConversation", conversationId);
      sock.off("newMessage", handleNewMessage);
    };
  }, [conversationId]);

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
              messages={messages}         // <-- העבר הודעות
              setMessages={setMessages}   // <-- העבר setter
            />
          ) : (
            <div className={styles.emptyMessage}>לא הצלחנו לפתוח שיחה…</div>
          )}
        </section>
      </div>
    </div>
  );
}
