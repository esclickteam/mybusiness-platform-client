// src/components/ClientChatSection.jsx
import React, { useState, useEffect } from "react";
import API from "../api";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css"; // תשתמש ב־CSS דומה לזה של העסק

export default function ClientChatSection({ userId }) {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState({
    conversationId: null,
    businessId: null,
    partnerId: null
  });
  const [isLoading, setIsLoading] = useState(false);

  // טען את כל השיחות של הלקוח
  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    API.get("/messages/conversations", { withCredentials: true })
      .then(res => setConversations(res.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [userId]);

  return (
    <div className={styles.chatSection}>
      {/* Sidebar — כל השיחות */}
      <aside className={styles.chatSidebar}>
        <h3>העסקים שלי</h3>
        {isLoading && <div className={styles.spinner}>טעינה…</div>}
        {!isLoading && conversations.length === 0 && (
          <div className={styles.noConversations}>אין שיחות קיימות</div>
        )}
        <ul className={styles.convoList}>
          {conversations.map(conv => {
            const partnerId = conv.business?._id;
            const partnerName = conv.business?.businessName || partnerId;
            return (
              <li
                key={conv.conversationId}
                className={`${styles.convoItem} ${
                  selected.conversationId === conv.conversationId ? styles.selected : ""
                }`}
                onClick={() =>
                  setSelected({
                    conversationId: conv.conversationId,
                    businessId: partnerId,
                    partnerId: partnerId
                  })
                }
              >
                {partnerName}
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main Chat Area */}
      <main className={styles.chatMain}>
        {selected.conversationId ? (
          <ClientChatTab
            conversationId={selected.conversationId}
            businessId={selected.businessId}
            userId={userId}
            partnerId={selected.partnerId}
          />
        ) : (
          <div className={styles.chatPlaceholder}>
            בחר שיחה מרשימה
          </div>
        )}
      </main>
    </div>
  );
}
