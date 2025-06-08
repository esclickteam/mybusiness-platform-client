import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import createSocket from "../socket";
import API from "../api";

export default function BusinessChatPage() {
  const { user, initialized, refreshAccessToken, logout } = useAuth();
  const businessId = user?.businessId || user?.business?._id;

  // כאן מקבלים את שתי הפונקציות מה-context
  const { resetMessagesCount, updateMessagesCount } = useOutletContext() || {};

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const socketRef = useRef(null);
  const prevSelectedRef = useRef(null);
  const selectedRef = useRef(selected);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // אפס ספירת הודעות בתחילת טעינת הקומפוננטה (אם הפונקציה קיימת)
  useEffect(() => {
    if (resetMessagesCount) {
      resetMessagesCount();
    }
  }, [resetMessagesCount]);

  useEffect(() => {
    if (!initialized || !businessId) return;

    (async () => {
      const token = await refreshAccessToken();
      if (!token) {
        setError("Session expired, please login again");
        logout();
        return;
      }

      const sock = await createSocket(refreshAccessToken, logout, businessId);
      if (!sock) {
        setError("Socket connection failed");
        return;
      }
      socketRef.current = sock;

      sock.on("connect_error", (err) => {
        setError("Socket error: " + err.message);
        console.log("Socket connection failed:", err);
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

      // מאזינים לעדכון ספירת הודעות שלא נקראו
      sock.on("unreadMessagesCount", (count) => {
        console.log("Received unreadMessagesCount:", count);
        if (updateMessagesCount) {
          updateMessagesCount(count);
        }
      });
    })();

    return () => {
      socketRef.current?.disconnect();
      prevSelectedRef.current = null;
    };
  }, [initialized, businessId, refreshAccessToken, logout, resetMessagesCount, updateMessagesCount]);

  useEffect(() => {
    if (!initialized || !businessId) return;
    setLoading(true);
    API.get("/conversations", { params: { businessId } })
      .then(({ data }) => {
        setConvos(data);
        if (data.length > 0) {
          const first = data[0];
          const convoId = first.conversationId || first._id;
          const partnerId =
            first.partnerId || first.participants.find((p) => p !== businessId);
          setSelected({ conversationId: convoId, partnerId });
        }
      })
      .catch(() => setError("שגיאה בטעינת שיחות"))
      .finally(() => setLoading(false));
  }, [initialized, businessId]);

  useEffect(() => {
    const sock = socketRef.current;
    if (!sock) return;

    const handler = (msg) => {
      setConvos((prev) => {
        const idx = prev.findIndex(
          (c) => String(c._id || c.conversationId) === msg.conversationId
        );
        if (idx === -1) return prev;
        const updated = {
          ...prev[idx],
          updatedAt: msg.timestamp || new Date().toISOString(),
        };
        return [updated, ...prev.filter((_, i) => i !== idx)];
      });

      const sel = selectedRef.current;
      if (msg.conversationId === sel?.conversationId) {
        setMessages((prev) =>
          prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
        );
      }
    };

    sock.on("newMessage", handler);
    return () => sock.off("newMessage", handler);
  }, []);

  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !sock.connected || !selected?.conversationId) {
      setMessages([]);
      return;
    }

    // אפס ספירת הודעות חדשות כאשר המשתמש בוחר שיחה
    if (resetMessagesCount) {
      resetMessagesCount();
    }

    // שלח סיגנל לסמן הודעות כנקראות דרך socket.io
    sock.emit("markMessagesRead", selected.conversationId, (response) => {
      if (!response.ok) {
        console.error("Failed to mark messages as read:", response.error);
      }
    });

    if (prevSelectedRef.current && prevSelectedRef.current !== selected.conversationId) {
      sock.emit("leaveConversation", prevSelectedRef.current);
    }

    sock.emit("joinConversation", selected.conversationId, (ack) => {
      if (!ack.ok) setError("לא ניתן להצטרף לשיחה");
    });

    sock.emit("getHistory", { conversationId: selected.conversationId }, (res) => {
      if (res.ok) {
        setMessages(res.messages || []);
      } else {
        setMessages([]);
        setError("שגיאה בטעינת ההודעות");
      }
    });

    prevSelectedRef.current = selected.conversationId;
  }, [selected, resetMessagesCount]);

  const handleSelect = (conversationId, partnerId) => {
    setSelected({ conversationId, partnerId });
  };

  if (!initialized) {
    return <p className={styles.loading}>טוען מידע…</p>;
  }

  return (
    <div className={styles.chatContainer}>
      <aside className={styles.sidebarInner}>
        {loading ? (
          <p className={styles.loading}>טוען שיחות…</p>
        ) : (
          <ConversationsList
            conversations={convos}
            businessId={businessId}
            selectedConversationId={selected?.conversationId}
            onSelect={handleSelect}
            isBusiness
          />
        )}
        {error && <p className={styles.error}>{error}</p>}
      </aside>

      <section className={styles.chatArea}>
        {selected ? (
          <BusinessChatTab
            conversationId={selected.conversationId}
            businessId={businessId}
            customerId={selected.partnerId}
            businessName={user?.businessName || user?.name}
            socket={socketRef.current}
            messages={messages}
            setMessages={setMessages}
          />
        ) : (
          <div className={styles.emptyMessage}>בחר שיחה כדי לראות הודעות</div>
        )}
      </section>
    </div>
  );
}
