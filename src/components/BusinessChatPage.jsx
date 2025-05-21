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
      console.warn("Skipping socket connect: missing data", {
        initialized,
        businessId,
      });
      return;
    }

    setLoading(true);
    const socketUrl = import.meta.env.VITE_SOCKET_URL;

    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,  // שולח עוגיות אוטומטית
      auth: {
        role: "business-dashboard",
        businessId: businessId,
      },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
      socketRef.current.emit("getConversations", { userId: businessId }, (res) => {
        const data = Array.isArray(res.conversations) ? res.conversations : [];
        setLoading(false);
        if (res.ok) {
          setConvos(data);
          if (data.length > 0 && !selected) {
            const first = data[0];
            const convoId = first._id || first.conversationId;
            const partnerId = Array.isArray(first.participants)
              ? first.participants.find((p) => p !== businessId) || ""
              : "";
            setSelected({ conversationId: convoId, partnerId });
            console.log(`Selected first conversation ${convoId} with partner ${partnerId}`);
          }
        } else {
          console.error("Error loading conversations:", res.error);
        }
      });
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
  }, [initialized, businessId]); // שים לב - לא להוסיף selected כאן

  const handleSelect = (conversationId, partnerId) => {
    console.log(`Conversation selected: ${conversationId} with partner ${partnerId}`);
    setSelected({ conversationId, partnerId });
  };

  if (!initialized) {
    return <p className={styles.loading}>טוען מידע…</p>;
  }

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer} style={{ flexDirection: "row" }}>
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

        <section className={styles.chatArea} style={{ flex: 1 }}>
          {selected?.conversationId && selected.partnerId ? (
            <BusinessChatTab
              conversationId={selected.conversationId}
              businessId={businessId}
              customerId={selected.partnerId}
              businessName={user?.businessName}
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
