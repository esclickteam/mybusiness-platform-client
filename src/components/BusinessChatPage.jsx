// src/components/BusinessChatPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const businessId = user?.businessId;
  const [convos, setConvos]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!initialized || !businessId) return;
    setLoading(true);
    API.get("/messages/conversations", {
      params: { businessId },
      withCredentials: true,
    })
      .then(res => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.conversations || [];
        setConvos(data);
        if (data.length && !selected) {
          const first = data[0];
          const convoId = first._id || first.conversationId || first.id;
          const partnerId = first.participants?.find(p => p !== businessId);
          setSelected({ conversationId: convoId, partnerId });
        }
      })
      .finally(() => setLoading(false));
  }, [initialized, businessId]);

  const handleSelect = (conversationId, partnerId) => {
    setSelected({ conversationId, partnerId });
  };

  if (!initialized) return <p className={styles.loading}>טוען מידע…</p>;

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        {/* ---- קודם הסיידבר (בימין!) ---- */}
        <section className={styles.sidebarInner}>
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
        </section>
        
        {/* ---- אחר כך הצ'אט ---- */}
        <section className={styles.chatArea}>
          {selected ? (
            <BusinessChatTab
              conversationId={selected.conversationId}
              businessId={businessId}
              customerId={selected.partnerId}
            />
          ) : (
            <div className={styles.emptyMessage}>
              בחר שיחה כדי לראות הודעות
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
