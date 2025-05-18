import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";

export default function ClientChatSection() {
  const { businessId } = useParams();
  const { user, initialized } = useAuth();
  const userId = user?.id || null;

  const [conversationId, setConversationId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  // כשיש businessId ו־userId, יוצרים או מקבלים שיחה
  useEffect(() => {
    if (!userId || !businessId) return;

    setIsCreating(true);
    API.post(
      "/api/messages/conversations",
      { otherId: businessId },
      { withCredentials: true }
    )
      .then((res) => {
        setConversationId(res.data.conversationId);
      })
      .catch((err) => {
        console.warn("❌ [CREATE] Error creating conversation:", err);
        setError("שגיאה ביצירת שיחה");
      })
      .finally(() => {
        setIsCreating(false);
      });
  }, [businessId, userId]);

  if (!initialized) {
    return <div>טוען משתמש...</div>;
  }

  return (
    <div className={styles.chatSection}>
      <aside className={styles.chatSidebar}>
        <h3>שיחה עם העסק</h3>
        {!businessId && (
          <div className={styles.noConversations}>לא נבחר עסק</div>
        )}
        {businessId && isCreating && (
          <div className={styles.spinner}>יוצר שיחה…</div>
        )}
        {businessId && error && (
          <div className={styles.error}>{error}</div>
        )}
        {businessId && !isCreating && !error && (
          <ul className={styles.convoList}>
            <li className={styles.selected}>
              {businessId}
            </li>
          </ul>
        )}
      </aside>

      <main className={styles.chatMain}>
        {conversationId ? (
          <ClientChatTab
            conversationId={conversationId}
            businessId={businessId}
            userId={userId}
            partnerId={businessId}
          />
        ) : businessId ? (
          <div className={styles.chatPlaceholder}>טוען שיחה…</div>
        ) : (
          <div className={styles.chatPlaceholder}>בחר עסק לצ'אט</div>
        )}
      </main>
    </div>
  );
}
