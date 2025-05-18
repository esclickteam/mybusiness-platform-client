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
        console.log("POST /messages/conversations →", res.data);
        setConversationId(res.data.conversationId);
      })
      .catch(err => {
        console.warn("❌ Error creating conversation:", err);
        setError("שגיאה ביצירת שיחה");
        setBusy(false);
      });
  }, [initialized, userId, businessId]);

  // 2) ברגע שיש conversationId – שליפה של כל השיחות ואז מציאת השיחה שלנו
  useEffect(() => {
    if (!conversationId) return;

    API.get("/messages/conversations", { withCredentials: true })
      .then(res => {
        // תמיכה בתרחישים שונים: אולי res.data הוא מערך, או שיש משם שדה res.data.conversations
        const conversations = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.conversations)
            ? res.data.conversations
            : [];

        console.log("GET /messages/conversations →", conversations);
        const conv = conversations.find(c =>
          [c.conversationId, c._id, c.id]
            .map(String)
            .includes(String(conversationId))
        );
        console.log("Selected conv:", conv);

        if (conv && conv.businessName) {
          setBusinessName(conv.businessName);
        } else {
          console.warn("businessName לא נמצא ב־conv, השדות הזמינים:", conv);
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
