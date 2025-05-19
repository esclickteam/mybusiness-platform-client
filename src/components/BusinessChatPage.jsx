// src/components/BusinessChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import io from "socket.io-client";

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const businessId = user?.businessId;
  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef();

  useEffect(() => {
    if (!initialized || !businessId) return;

    setLoading(true);

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      query: { userId: businessId, role: "business" },
    });

    socketRef.current.emit("getConversations", {}, (res) => {
      if (res.ok) {
        const data = Array.isArray(res.conversations) ? res.conversations : [];
        setConvos(data);
        if (data.length && !selected) {
          const first = data[0];
          const convoId = first._id || first.conversationId;
          const partnerId = first.participants.find((p) => p !== businessId) || "";
          setSelected({ conversationId: convoId, partnerId });
        }
      } else {
        console.error("Error loading conversations:", res.error);
      }
      setLoading(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [initialized, businessId]);

  const handleSelect = (conversationId) => {
    const convo = convos.find((c) => (c._id || c.conversationId) === conversationId);
    if (!convo) return;
    const partnerId = convo.participants.find((p) => p !== businessId) || "";
    setSelected({ conversationId, partnerId });
  };

  if (!initialized) {
    return <p className={styles.loading}>טוען מידע…</p>;
  }

  // כאן אנחנו בודקים האם יש שיחה נבחרת.
  // אם כן, לא מציגים את הסיידבר, רק את הצ'אט.
  // אם לא, מציגים רק את הסיידבר עם רשימת השיחות (או טקסט טעינה).
  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer} style={{ flexDirection: selected ? "column" : "row" }}>
        {!selected && (
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
        )}

        <section className={styles.chatArea} style={{ flex: 1 }}>
          {selected?.conversationId && selected.partnerId ? (
            <BusinessChatTab
              conversationId={selected.conversationId}
              businessId={businessId}
              customerId={selected.partnerId}
              socket={socketRef.current}
            />
          ) : (
            !loading && <div className={styles.emptyMessage}>בחר שיחה כדי לראות הודעות</div>
          )}
        </section>
      </div>
    </div>
  );
}
