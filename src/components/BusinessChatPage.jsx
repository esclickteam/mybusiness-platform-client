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

  // טען שיחות מהשרת
  useEffect(() => {
    if (!initialized || !businessId) return;
    setLoading(true);

    API.get("/messages/conversations", { withCredentials: true })
      .then(res => {
        // השרת מחזיר מערך של { conversationId, participants, ... }
        const data = Array.isArray(res.data) ? res.data : [];
        setConvos(data);

        // אם זו הפעם הראשונה, בחר אוטומטית את השיחה הראשונה
        if (data.length && !selected) {
          const first = data[0];
          const convoId   = first.conversationId;
          const partnerId = first.participants.find(p => p !== businessId) || "";
          setSelected({ conversationId: convoId, partnerId });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [initialized, businessId]);

  // בחר שיחה בסיידבר
  const handleSelect = (conversationId) => {
    const convo = convos.find(c => c.conversationId === conversationId);
    if (!convo) return;
    const partnerId = convo.participants.find(p => p !== businessId) || "";
    setSelected({ conversationId, partnerId });
  };

  if (!initialized) {
    return <p className={styles.loading}>טוען מידע…</p>;
  }

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        {/* Sidebar */}
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

        {/* Chat area */}
        <section className={styles.chatArea}>
          {selected?.conversationId && selected.partnerId ? (
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
