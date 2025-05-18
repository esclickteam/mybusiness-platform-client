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
  const userId = user?.userId || null;

  const [conversationId, setConversationId] = useState(null);
  const [businessName, setBusinessName]   = useState("");
  const [busy, setBusy]                   = useState(true);
  const [error, setError]                 = useState("");

  // 1) פותחים או מוצאים שיחה
  useEffect(() => {
    if (!initialized) return;
    if (!userId || !businessId) {
      setBusy(false);
      return;
    }

    API.post(
      "/messages/conversations",
      { otherId: businessId },
      { withCredentials: true }
    )
      .then((res) => {
        setConversationId(res.data.conversationId);
      })
      .catch((err) => {
        console.warn("❌ Error creating conversation:", err);
        setError("שגיאה ביצירת שיחה");
      })
      .finally(() => {
        setBusy(false);
      });
  }, [initialized, userId, businessId]);

  // 2) מושכים את הנתונים של העסק כדי לקבל את השם
  useEffect(() => {
    if (!businessId) return;
    API.get(`/api/business/${businessId}`, { withCredentials: true })
      .then(res => {
        // מניחים שה־API מחזיר את ה־business תחת res.data.business
        setBusinessName(res.data.business.businessName || res.data.business.name);
      })
      .catch(err => {
        console.warn("❌ Error loading business info:", err);
      });
  }, [businessId]);

  if (!initialized) {
    return <div className={styles.spinner}>טוען משתמש…</div>;
  }

  if (busy) {
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
          {businessName || businessId}
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
