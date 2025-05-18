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
  const [businessName, setBusinessName]     = useState("");
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");

  // 1) יצירת או איתור השיחה
  useEffect(() => {
    if (!initialized || !userId || !businessId) return;
    API.post("/messages/conversations",
      { otherId: businessId },
      { withCredentials: true }
    )
      .then(res => setConversationId(res.data.conversationId))
      .catch(() => setError("שגיאה ביצירת השיחה"))
      .finally(() => setLoading(false));
  }, [initialized, userId, businessId]);

  // 2) שליפת שם העסק
  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    API.get("/messages/conversations",
      { params: { businessId }, withCredentials: true }
    )
      .then(res => {
        const arr = Array.isArray(res.data)
          ? res.data
          : res.data.conversations || [];
        const conv = arr.find(c =>
          [c.conversationId, c._id, c.id]
            .map(String)
            .includes(String(conversationId))
        );
        setBusinessName(conv?.businessName || "");
      })
      .catch(() => setError("שגיאה בטעינת שם העסק"))
      .finally(() => setLoading(false));
  }, [conversationId, businessId]);

  if (loading) return <div className={styles.loading}>טוען…</div>;
  if (error)   return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        {/* sidebarInner */}
        <aside className={styles.sidebarInner}>
          <h3 className={styles.sidebarTitle}>שיחה עם העסק</h3>
          <div className={styles.convItemActive}>
            {businessName || businessId}
          </div>
        </aside>

        {/* chatArea */}
        <section className={styles.chatArea}>
          {conversationId ? (
            <ClientChatTab
              conversationId={conversationId}
              businessId={businessId}
              userId={userId}
              partnerId={businessId}
            />
          ) : (
            <div className={styles.emptyMessage}>
              לא הצלחנו לפתוח שיחה…
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
