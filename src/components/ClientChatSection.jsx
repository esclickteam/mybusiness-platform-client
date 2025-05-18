// src/components/ClientChatSection.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";

export default function ClientChatSection() {
  const { businessId } = useParams();
  const { user, loading, initialized } = useAuth();

  // כאן אנחנו באמת קוראים user.userId, כפי שהגדרתם ב־AuthContext
  const userId = user?.userId || null;

  const [conversationId, setConversationId] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // ממתינים גם לטעינה הראשונית (initialized) וגם שהכתובת params בואו:
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

  // עד שהאתחול של ה־AuthContext לא הסתיים, לא מציגים כלום
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
        <div className={styles.partnerName}>{businessId}</div>
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
