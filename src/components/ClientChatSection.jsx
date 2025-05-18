// src/components/ClientChatSection.jsx
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ברגע שיש userId ו־businessId, פותחים/יוצרים שיחה
  useEffect(() => {
    if (!initialized) return;
    if (!userId || !businessId) {
      setLoading(false);
      return;
    }

    API.post(
      "/api/messages/conversations",
      { otherId: businessId },
      { withCredentials: true }
    )
      .then((res) => {
        setConversationId(res.data.conversationId);
      })
      .catch((err) => {
        console.warn("❌ Error creating conversation:", err);
        setError("ניהול שיחה נכשל, נסה שוב");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initialized, userId, businessId]);

  if (!initialized) {
    return <div>טוען משתמש...</div>;
  }

  if (loading) {
    return <div className={styles.spinner}>טוען שיחה…</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.chatSection}>
      <aside className={styles.chatSidebar}>
        <h3>שיחה עם העסק</h3>
        <div className={styles.partnerName}>
          {/* אפשר לשאול את API להוציא את שם העסק */}
          {businessId}
        </div>
      </aside>

      <main className={styles.chatMain}>
        {conversationId ? (
          <ClientChatTab
            conversationId={conversationId}
            businessId={businessId}
            userId={userId}
            partnerId={businessId}
          />
        ) : (
          <div className={styles.chatPlaceholder}>
            לא הצלחנו לפתוח שיחה…
          </div>
        )}
      </main>
    </div>
  );
}
