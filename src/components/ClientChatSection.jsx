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

  // 1) יצירת (או מציאת) השיחה
  useEffect(() => {
    if (!initialized || !userId || !businessId) return;

    API.post(
      "/messages/conversations",
      { otherId: businessId },
      { withCredentials: true }
    )
      .then(res => {
        setConversationId(res.data.conversationId);
      })
      .catch(err => {
        console.warn("❌ Error creating conversation:", err);
        setError("שגיאה ביצירת שיחה");
      });
  }, [initialized, userId, businessId]);

  // 2) ברגע שיש conversationId – שליפה של כל השיחות ואז מיון לפי זה
  useEffect(() => {
    if (!conversationId) return;

    API.get("/messages/conversations", { withCredentials: true })
      .then(res => {
        // מבני ה־backend שעידכנו:
        // [{ conversationId, businessName, customerName, messages }, …]
        const conv = res.data.find(c => c.conversationId === conversationId);
        if (conv) {
          setBusinessName(conv.businessName);
        }
      })
      .catch(err => {
        console.warn("❌ Error fetching conversations:", err);
      })
      .finally(() => {
        setBusy(false);
      });
  }, [conversationId]);

  if (!initialized || busy) {
    return <div className={styles.spinner}>טוען…</div>;
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
