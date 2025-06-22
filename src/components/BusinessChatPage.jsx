// src/pages/BusinessChatPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import API from "../api";
import { useSocket } from "../context/socketContext";
import { useOnScreen } from "../hooks/useOnScreen";

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const businessId = user?.businessId || user?.business?._id;

  const { updateMessagesCount } = useOutletContext();

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]); // ‼ ה‑state היחיד להודעות
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const socket = useSocket();
  const prevSelectedRef = useRef(null);

  // ספירת "לא נקרא" לכל שיחה
  const [unreadCountsByConversation, setUnreadCountsByConversation] = useState({});

  // סכום כולל של הודעות לא‑נקראו (ל‑Sidebar)
  const totalUnreadCount = Object.values(unreadCountsByConversation).reduce((a, b) => a + b, 0);

  // עדכון הבאג׳ בעמוד הראשי
  useEffect(() => {
    updateMessagesCount?.(totalUnreadCount);
  }, [totalUnreadCount, updateMessagesCount]);

  /* ---------------------------------------------------------------------------
   *   טעינת רשימת השיחות (once per business)
   * -------------------------------------------------------------------------*/
  useEffect(() => {
    if (!initialized || !businessId) return;

    setLoading(true);
    API.get("/conversations", { params: { businessId } })
      .then(({ data }) => {
        setConvos(data);

        // אתחול מפת Unread
        const initialUnread = {};
        data.forEach((c) => {
          const id = c.conversationId || c._id;
          const unread = c.unreadCount || 0;
          if (unread > 0) initialUnread[id] = unread;
        });
        setUnreadCountsByConversation(initialUnread);

        // בחירת שיחה ראשונה אוטומטית
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

  /* ---------------------------------------------------------------------------
   *   טעינת הודעות לשיחה הנבחרת (Single Source of Truth)
   * -------------------------------------------------------------------------*/
  const messagesAreaRef = useRef();
  const messagesAreaOnScreen = useOnScreen(messagesAreaRef, "200px");

  useEffect(() => {
    // אין סוקט / אין שיחה / אזור לא גלוי → לא נטען
    if (!socket || !socket.connected || !selected?.conversationId) {
      setMessages([]);
      return;
    }
    if (!messagesAreaOnScreen) return;

    // סימון כ‑נקרא
    socket.emit("markMessagesRead", selected.conversationId, (resp) => {
      if (!resp.ok) {
        console.error("Failed to mark read", resp.error);
      } else {
        setUnreadCountsByConversation((prev) => {
          const next = { ...prev };
          delete next[selected.conversationId];
          return next;
        });
      }
    });

    // עזיבת החדר הקודם
    if (prevSelectedRef.current && prevSelectedRef.current !== selected.conversationId) {
      socket.emit("leaveConversation", prevSelectedRef.current, () => {});
    }

    // הצטרפות לחדר החדש
    socket.emit("joinConversation", selected.conversationId, (ack) => {
      if (!ack.ok) setError("לא ניתן להצטרף לשיחה");
    });

    // הבאת היסטוריה מהשרת (socket)
    socket.emit("getHistory", { conversationId: selected.conversationId }, (res) => {
      if (res.ok) setMessages(res.messages || []);
      else {
        setMessages([]);
        setError("שגיאה בטעינת ההודעות");
      }
    });

    prevSelectedRef.current = selected.conversationId;
  }, [socket, selected, messagesAreaOnScreen]);

  /* ---------------------------------------------------------------------------
   *   מאזין לנוטיפיקציות של הודעה חדשה
   * -------------------------------------------------------------------------*/
  useEffect(() => {
    if (!socket) return;

    const handleNew = (msg) => {
      const convoId = msg.conversationId || msg.conversation_id;
      if (convoId && convoId !== selected?.conversationId) {
        setUnreadCountsByConversation((prev) => ({
          ...prev,
          [convoId]: (prev[convoId] || 0) + 1,
        }));
      }
    };

    socket.on("newClientMessageNotification", handleNew);
    return () => socket.off("newClientMessageNotification", handleNew);
  }, [socket, selected?.conversationId]);

  /* ---------------------------------------------------------------------------
   *   בחירת שיחה מסרגל הצד
   * -------------------------------------------------------------------------*/
  const handleSelect = (conversationId, partnerId) => {
    setSelected({ conversationId, partnerId });
  };

  if (!initialized) return <p className={styles.loading}>טוען מידע…</p>;

  return (
    <div className={styles.chatContainer}>
      {/* סרגל שיחות */}
      <aside className={styles.sidebarInner}>
        {loading ? (
          <p className={styles.loading}>טוען שיחות…</p>
        ) : (
          <ConversationsList
            conversations={convos}
            businessId={businessId}
            selectedConversationId={selected?.conversationId}
            onSelect={handleSelect}
            unreadCountsByConversation={unreadCountsByConversation}
            isBusiness
          />
        )}
        {error && <p className={styles.error}>{error}</p>}
      </aside>

      {/* אזור הודעות */}
      <section ref={messagesAreaRef} className={styles.chatArea}>
        {selected ? (
          <BusinessChatTab
            conversationId={selected.conversationId}
            businessId={businessId}
            customerId={selected.partnerId}
            businessName={user?.businessName || user?.name}
            socket={socket}
            /* props החדשים לפי Option B */
            initialMessages={messages}
            onMessagesChange={setMessages}
          />
        ) : (
          <div className={styles.emptyMessage}>בחר שיחה כדי לראות הודעות</div>
        )}
      </section>
    </div>
  );
}
