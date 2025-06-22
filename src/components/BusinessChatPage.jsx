import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import API from "../api";
import { useSocket } from "../context/socketContext";

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const rawBusinessId = user?.businessId || user?.business?._id;

  // המר את businessId למחרוזת
  const businessId =
    rawBusinessId && typeof rawBusinessId === "object" && rawBusinessId._id
      ? rawBusinessId._id.toString()
      : rawBusinessId?.toString();

  const { updateMessagesCount } = useOutletContext();

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const socket = useSocket();
  const prevSelectedRef = useRef(null);

  const [unreadCountsByConversation, setUnreadCountsByConversation] = useState({});

  const totalUnreadCount = Object.values(unreadCountsByConversation).reduce((a, b) => a + b, 0);

  useEffect(() => {
    updateMessagesCount?.(totalUnreadCount);
  }, [totalUnreadCount, updateMessagesCount]);

  // טוען רק שיחות עם לקוחות
  useEffect(() => {
    if (!initialized || !businessId) return;

    setLoading(true);
    API.get("/messages/client-conversations")
      .then(({ data }) => {
        setConvos(data.conversations || []);

        // בניית מפת כמות הודעות שלא נקראו
        const initialUnread = {};
        (data.conversations || []).forEach((c) => {
          if (c.unreadCount > 0) initialUnread[c._id] = c.unreadCount;
        });
        setUnreadCountsByConversation(initialUnread);

        // בוחרים שיחה ראשונה אם קיימת, עם מזהה ועם שם לקוח
        if (data.conversations && data.conversations.length > 0) {
          const first = data.conversations[0];

          // המרה של partnerId למחרוזת
          let partnerIdRaw = first.client || first.business || null;
          let partnerId = partnerIdRaw;
          if (partnerIdRaw && typeof partnerIdRaw === "object") {
            if (partnerIdRaw._id) {
              partnerId = partnerIdRaw._id.toString();
            } else if (partnerIdRaw.toString) {
              partnerId = partnerIdRaw.toString();
            }
          }

          setSelected({
            conversationId: first._id.toString(),
            partnerId,
            partnerName: first.clientName || first.businessName || "לקוח",
          });
        } else {
          setSelected(null);
        }
      })
      .catch(() => setError("שגיאה בטעינת שיחות עם לקוחות"))
      .finally(() => setLoading(false));
  }, [initialized, businessId]);

  const messagesAreaRef = useRef(null);

  // טעינת ההודעות של השיחה הנבחרת
  useEffect(() => {
    if (!socket || !socket.connected || !selected?.conversationId) {
      setMessages([]);
      return;
    }

    socket.emit("markMessagesRead", selected.conversationId, (resp) => {
      if (resp.ok) {
        setUnreadCountsByConversation((prev) => {
          const next = { ...prev };
          delete next[selected.conversationId];
          return next;
        });
      }
    });

    if (prevSelectedRef.current && prevSelectedRef.current !== selected.conversationId) {
      socket.emit("leaveConversation", prevSelectedRef.current);
    }

    socket.emit("joinConversation", selected.conversationId, (ack) => {
      if (!ack.ok) setError("לא ניתן להצטרף לשיחה");
    });

    socket.emit("getHistory", { conversationId: selected.conversationId }, (res) => {
      if (res.ok) {
        setMessages(res.messages || []);
      } else {
        setMessages([]);
        setError("שגיאה בטעינת ההודעות");
      }
    });

    prevSelectedRef.current = selected.conversationId;
  }, [socket, selected]);

  // טיפול בהודעות חדשות בזמן אמת
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      const convoId = msg.conversationId || msg.conversation_id;
      if (convoId && convoId !== selected?.conversationId) {
        setUnreadCountsByConversation((prev) => ({ ...prev, [convoId]: (prev[convoId] || 0) + 1 }));
      }
    };

    socket.on("newClientMessageNotification", handleNewMessage);

    return () => socket.off("newClientMessageNotification", handleNewMessage);
  }, [socket, selected?.conversationId]);

  const handleSelect = (conversationId, partnerId, partnerName) => {
    // המר את partnerId למחרוזת אם צריך
    let idString = partnerId;
    if (partnerId && typeof partnerId === "object") {
      if (partnerId._id) {
        idString = partnerId._id.toString();
      } else if (partnerId.toString) {
        idString = partnerId.toString();
      }
    }
    setSelected({ conversationId: conversationId.toString(), partnerId: idString, partnerName });
  };

  if (!initialized) return <p className={styles.loading}>טוען מידע…</p>;

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
            isBusiness={false} // כאן זה שיחות לקוחות, לא עסקיות
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
            customerName={selected.partnerName} // מעבירים גם את השם
            socket={socket}
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
