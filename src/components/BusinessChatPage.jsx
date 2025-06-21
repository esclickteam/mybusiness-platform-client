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
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const socket = useSocket();
  const prevSelectedRef = useRef(null);

  // Map של ספירת הודעות לא נקראו לכל שיחה
  const [unreadCountsByConversation, setUnreadCountsByConversation] = useState({});

  // חישוב הסכום הכולל של הודעות לא נקראות להצגה בתפריט
  const totalUnreadCount = Object.values(unreadCountsByConversation).reduce((a, b) => a + b, 0);

  // עדכון ספירת הודעות כללית ב-outlet context לצורך התראה בתפריט הצד
  useEffect(() => {
    if (updateMessagesCount) {
      updateMessagesCount(totalUnreadCount);
    }
  }, [totalUnreadCount, updateMessagesCount]);

  // טעינת רשימת השיחות
  useEffect(() => {
    if (!initialized || !businessId) return;

    setLoading(true);
    API.get("/conversations", { params: { businessId } })
      .then(({ data }) => {
        setConvos(data);

        const initialUnread = {};
        data.forEach((convo) => {
          const id = convo.conversationId || convo._id;
          const unread = convo.unreadCount || 0;
          if (unread > 0) initialUnread[id] = unread;
        });
        setUnreadCountsByConversation(initialUnread);

        if (data.length > 0) {
          const first = data[0];
          const convoId = first.conversationId || first._id;
          const partnerId = first.partnerId || first.participants.find((p) => p !== businessId);
          setSelected({ conversationId: convoId, partnerId });
        }
      })
      .catch(() => {
        setError("שגיאה בטעינת שיחות");
      })
      .finally(() => setLoading(false));
  }, [initialized, businessId]);

  // שימוש ב-useOnScreen עבור אזור התצוגה של ההודעות
  const messagesAreaRef = useRef();
  const messagesAreaOnScreen = useOnScreen(messagesAreaRef, "200px");

  // ניהול טעינת ההודעות רק כשהאזור נראה במסך
  useEffect(() => {
    if (!socket || !socket.connected || !selected?.conversationId) {
      setMessages([]);
      return;
    }
    if (!messagesAreaOnScreen) return; // מחכים עד שהאזור נראה

    // סימון השיחה כנקראה בשרת
    socket.emit("markMessagesRead", selected.conversationId, (response) => {
      if (!response.ok) {
        console.error("Failed to mark messages as read:", response.error);
      } else {
        setUnreadCountsByConversation((prev) => {
          const updated = { ...prev };
          delete updated[selected.conversationId];
          return updated;
        });
      }
    });

    // עזיבת השיחה הקודמת אם שונה
    if (prevSelectedRef.current && prevSelectedRef.current !== selected.conversationId) {
      socket.emit("leaveConversation", prevSelectedRef.current, (ack) => {
        if (!ack.ok) {
          console.error("Failed to leave previous conversation:", ack.error);
        }
      });
    }

    // הצטרפות לשיחה החדשה
    socket.emit("joinConversation", selected.conversationId, (ack) => {
      if (!ack.ok) {
        setError("לא ניתן להצטרף לשיחה");
        console.error("Failed to join conversation:", ack.error);
      }
    });

    // טעינת היסטוריית ההודעות
    socket.emit("getHistory", { conversationId: selected.conversationId }, (res) => {
      if (res.ok) {
        setMessages(res.messages || []);
      } else {
        setMessages([]);
        setError("שגיאה בטעינת ההודעות");
        console.error("Failed to load messages:", res.error);
      }
    });

    prevSelectedRef.current = selected.conversationId;
  }, [selected, socket, messagesAreaOnScreen]);

  // מאזין להודעות חדשות
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      const convoId = message.conversationId || message.conversation_id;

      if (convoId && convoId !== selected?.conversationId) {
        setUnreadCountsByConversation((prev) => {
          const prevCount = prev[convoId] || 0;
          return { ...prev, [convoId]: prevCount + 1 };
        });
      }
    };

    socket.on("newClientMessageNotification", handleNewMessage);

    return () => {
      socket.off("newClientMessageNotification", handleNewMessage);
    };
  }, [socket, selected?.conversationId]);

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
            unreadCountsByConversation={unreadCountsByConversation}
            isBusiness
          />
        )}
        {error && <p className={styles.error}>{error}</p>}
      </aside>

      <section ref={messagesAreaRef} className={styles.chatArea}>
        {selected ? (
          <BusinessChatTab
            conversationId={selected.conversationId}
            businessId={businessId}
            customerId={selected.partnerId}
            businessName={user?.businessName || user?.name}
            socket={socket}
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
