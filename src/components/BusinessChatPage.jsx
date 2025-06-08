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
  const businessId = user?.businessId || user?.business?._id;

  const { resetMessagesCount, updateMessagesCount } = useOutletContext();

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const socket = useSocket();
  const prevSelectedRef = useRef(null);
  const selectedRef = useRef(selected);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // Reset unread messages count on mount
  useEffect(() => {
    if (resetMessagesCount) resetMessagesCount();
  }, [resetMessagesCount]);

  // Load conversations list
  useEffect(() => {
    if (!initialized || !businessId) return;

    setLoading(true);
    API.get("/conversations", { params: { businessId } })
      .then(({ data }) => {
        setConvos(data);
        if (data.length > 0) {
          const first = data[0];
          const convoId = first.conversationId || first._id;
          const partnerId = first.partnerId || first.participants.find((p) => p !== businessId);
          setSelected({ conversationId: convoId, partnerId });
          // כשהשיחה הראשונית נטענת, נסמן הודעות כנקראות ונעדכן את הספירה:
          if (socket) {
            socket.emit('markMessagesRead', convoId, (response) => {
              if (response.ok) {
                updateMessagesCount(response.unreadCount);
              } else {
                console.error("Failed to mark messages as read:", response.error);
              }
            });
          }
        }
      })
      .catch(() => {
        setError("שגיאה בטעינת שיחות");
      })
      .finally(() => setLoading(false));
  }, [initialized, businessId, socket, updateMessagesCount]);

  // Manage joining/leaving conversation on selection change
  useEffect(() => {
    if (!socket || !socket.connected || !selected?.conversationId) {
      setMessages([]);
      return;
    }

    if (resetMessagesCount) resetMessagesCount();

    socket.emit("markMessagesRead", selected.conversationId, (response) => {
      if (!response.ok) {
        console.error("Failed to mark messages as read:", response.error);
      } else {
        updateMessagesCount(response.unreadCount);
      }
    });

    if (prevSelectedRef.current && prevSelectedRef.current !== selected.conversationId) {
      socket.emit("leaveConversation", prevSelectedRef.current, (ack) => {
        if (!ack.ok) {
          console.error("Failed to leave previous conversation:", ack.error);
        }
      });
    }

    socket.emit("joinConversation", selected.conversationId, (ack) => {
      if (!ack.ok) {
        setError("לא ניתן להצטרף לשיחה");
      }
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
  }, [selected, resetMessagesCount, socket, updateMessagesCount]);

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
