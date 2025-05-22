import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import { io } from "socket.io-client";

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const businessId = user?.businessId || user?.business?._id;

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    console.log("BusinessChatPage init:", { initialized, businessId });
    if (!initialized || !businessId) {
      console.warn("Skipping socket connect: missing data", { initialized, businessId });
      return;
    }

    setLoading(true);
    const socketUrl = import.meta.env.VITE_SOCKET_URL;

    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      withCredentials: true,
      auth: {
        role: "business-dashboard",
        businessId,
      },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
      socketRef.current.emit(
        "getConversations",
        { userId: businessId },
        ({ ok, conversations, error }) => {
          setLoading(false);
          if (ok && Array.isArray(conversations)) {
            setConvos(conversations);
            if (!selected && conversations.length > 0) {
              const first = conversations[0];
              const convoId = first._id ? String(first._id) : ""; // תמיד string
              const partnerId =
                Array.isArray(first.participants)
                  ? first.participants.find((p) => p !== businessId)
                  : first.partnerId || "";
              console.log("Auto-selecting conversation:", convoId, "partner:", partnerId);
              if (convoId && partnerId) {
                setSelected({ conversationId: convoId, partnerId });
              }
            }
          } else {
            console.error("Error loading conversations:", error);
          }
        }
      );
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setLoading(false);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    // עדכון שיחה עם הודעה חדשה
    const handleNewMessage = (msg) => {
      setConvos((prevConvos) => {
        const convoIndex = prevConvos.findIndex(
          (c) =>
            String(c._id) === String(msg.conversationId) ||
            String(c.conversationId) === String(msg.conversationId)
        );
        if (convoIndex === -1) return prevConvos;
        const updatedConvo = {
          ...prevConvos[convoIndex],
          updatedAt: new Date().toISOString(),
        };
        const newConvos = [...prevConvos];
        newConvos.splice(convoIndex, 1);
        return [updatedConvo, ...newConvos];
      });
    };

    socketRef.current.on("newMessage", handleNewMessage);

    return () => {
      socketRef.current?.off("newMessage", handleNewMessage);
      socketRef.current?.disconnect();
      socketRef.current = null;
      console.log("Socket disconnected and cleaned up");
    };
  }, [initialized, businessId, selected]);

  const handleSelect = (conversationId, partnerId) => {
    // תמיד ודא string תקני!
    if (conversationId && partnerId) {
      console.log(`Conversation selected: ${conversationId} with partner ${partnerId}`);
      setSelected({ conversationId: String(conversationId), partnerId: String(partnerId) });
    }
  };

  if (!initialized) {
    return <p className={styles.loading}>טוען מידע…</p>;
  }

  return (
    <div className={styles.whatsappBg}>
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
              isBusiness={true}
            />
          )}
        </aside>
        <section className={styles.chatArea}>
          {selected?.conversationId && selected.partnerId ? (
            <BusinessChatTab
              conversationId={selected.conversationId}
              businessId={businessId}
              customerId={selected.partnerId}
              businessName={user?.businessName || user?.name}
              socket={socketRef.current}
            />
          ) : (
            <div className={styles.emptyMessage}>
              בחרי שיחה כדי לראות הודעות
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
