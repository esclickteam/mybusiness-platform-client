// src/pages/BusinessChatPage.jsx
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
    console.log("Updating total unread messages count:", totalUnreadCount);
    updateMessagesCount?.(totalUnreadCount);
  }, [totalUnreadCount, updateMessagesCount]);

  useEffect(() => {
    if (!initialized || !businessId) return;

    console.log("Fetching conversations for businessId:", businessId);
    setLoading(true);
    API.get("/conversations", { params: { businessId } })
      .then(({ data }) => {
        console.log("Received conversations:", data);

        setConvos(data);

        const initialUnread = {};
        data.forEach((c) => {
          const id = c.conversationId || c._id;
          const unread = c.unreadCount || 0;
          if (unread > 0) initialUnread[id] = unread;
        });
        setUnreadCountsByConversation(initialUnread);
        console.log("Initial unread counts by conversation:", initialUnread);

        if (data.length > 0) {
          const first = data[0];
          const convoId = first.conversationId || first._id;
          const partnerId = first.partnerId || first.participants?.find((p) => p !== businessId);
          console.log("Selecting first conversation:", convoId, "partnerId:", partnerId);
          setSelected({ conversationId: convoId, partnerId });
        } else {
          console.log("No conversations received");
          setSelected(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching conversations:", err);
        setError("שגיאה בטעינת שיחות");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initialized, businessId]);

  const messagesAreaRef = useRef(null);

  useEffect(() => {
    if (!socket) {
      console.log("No socket instance available");
      setMessages([]);
      return;
    }

    const handleConnect = () => console.log("Socket connected");
    const handleDisconnect = () => console.log("Socket disconnected");
    const handleError = (err) => console.error("Socket error:", err);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("error", handleError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("error", handleError);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !socket.connected) {
      console.log("Socket not connected");
      setMessages([]);
      return;
    }

    if (!selected?.conversationId) {
      console.log("No conversation selected");
      setMessages([]);
      return;
    }

    console.log("Marking messages as read for conversation:", selected.conversationId);
    socket.emit("markMessagesRead", selected.conversationId, (resp) => {
      if (!resp.ok) {
        console.error("Failed to mark messages read:", resp.error);
      } else {
        setUnreadCountsByConversation((prev) => {
          const next = { ...prev };
          delete next[selected.conversationId];
          console.log("Updated unread counts after marking read:", next);
          return next;
        });
      }
    });

    if (prevSelectedRef.current && prevSelectedRef.current !== selected.conversationId) {
      console.log("Leaving previous conversation:", prevSelectedRef.current);
      socket.emit("leaveConversation", prevSelectedRef.current);
    }

    console.log("Joining conversation:", selected.conversationId);
    socket.emit("joinConversation", selected.conversationId, (ack) => {
      if (!ack.ok) {
        console.error("Failed to join conversation:", ack.error);
        setError("לא ניתן להצטרף לשיחה");
      }
    });

    console.log("Requesting message history for conversation:", selected.conversationId);
    socket.emit("getHistory", { conversationId: selected.conversationId }, (res) => {
      if (res.ok) {
        console.log("Received messages history:", res.messages);
        setMessages(res.messages || []);
      } else {
        console.error("Error loading message history:", res.error);
        setMessages([]);
        setError("שגיאה בטעינת ההודעות");
      }
    });

    prevSelectedRef.current = selected.conversationId;
  }, [socket, selected]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessageNotification = (msg) => {
      console.log("New client message notification received:", msg);
      const convoId = msg.conversationId || msg.conversation_id;
      if (convoId && convoId !== selected?.conversationId) {
        setUnreadCountsByConversation((prev) => {
          const updated = { ...prev, [convoId]: (prev[convoId] || 0) + 1 };
          console.log("Updated unread counts on new message:", updated);
          return updated;
        });
      }
    };

    socket.on("newClientMessageNotification", handleNewMessageNotification);

    return () => {
      socket.off("newClientMessageNotification", handleNewMessageNotification);
    };
  }, [socket, selected?.conversationId]);

  const handleSelect = (conversationId, partnerId) => {
    console.log("Conversation selected:", conversationId, "partnerId:", partnerId);
    setSelected({ conversationId, partnerId });
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
