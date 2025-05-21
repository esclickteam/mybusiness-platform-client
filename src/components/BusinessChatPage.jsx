// src/components/BusinessChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import { io } from "socket.io-client";

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const businessId = user?.businessId || user?.business?._id;
  const token = localStorage.getItem("token");

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    console.log("BusinessChatPage init:", { initialized, businessId, token });
    if (!initialized || !businessId || !token) {
      console.warn("Skipping socket connect: missing data", { initialized, businessId, token });
      return;
    }

    setLoading(true);
    const socketUrl = import.meta.env.VITE_SOCKET_URL;

    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      withCredentials: true,
      auth: {
        token,
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
              const convoId = first._id || first.conversationId;
              const partnerId = first.participants.find((p) => p !== businessId) || "";
              setSelected({ conversationId: convoId, partnerId });
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

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      console.log("Socket disconnected and cleaned up");
    };
  }, [initialized, businessId, token]);

  const handleSelect = (conversationId, partnerId) => {
    console.log(`Conversation selected: ${conversationId} with partner ${partnerId}`);
    setSelected({ conversationId, partnerId });
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
            <div className={styles.emptyMessage}>בחר שיחה כדי לראות הודעות</div>
          )}
        </section>
      </div>
    </div>
  );
}
