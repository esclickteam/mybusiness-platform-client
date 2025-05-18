// src/components/BusinessChatPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css"; // <-- CSS Module

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
        if (data.length > 0 && !selected) {
          const first = data[0];
          const convoId = first._id || first.conversationId || first.id;
          const partnerId = Array.isArray(first.participants)
            ? first.participants.find(p => p !== businessId)
            : null;
          setSelected({ conversationId: convoId, partnerId });
        }
      })
      .finally(() => setLoading(false));
  }, [initialized, businessId]);

  const handleSelect = (conversationId, partnerId) => {
    setSelected({ conversationId, partnerId });
  };

  if (!initialized) return <p>טוען מידע...</p>;

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatPage}>
        <aside className={styles.chatSidebar}>
          {loading
            ? <p className={styles.loading}>טוען שיחות…</p>
            : <ConversationsList
                conversations={convos}
                businessId={businessId}
                selectedConversationId={selected?.conversationId}
                onSelect={handleSelect}
                isBusiness={true}
              />
          }
        </aside>

        <main className={styles.chatMain}>
          <div className={styles.chatContainer}>
            <section className={styles.sidebarInner}>
              {/* ConversationsList במקום פנימי אם רוצים */}
            </section>
            <section className={styles.chatArea}>
              {selected
                ? <BusinessChatTab
                    conversationId={selected.conversationId}
                    businessId={businessId}
                    customerId={selected.partnerId}
                  />
                : <div className={styles.emptyMessage}>
                    בחר שיחה כדי לראות הודעות
                  </div>
              }
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
