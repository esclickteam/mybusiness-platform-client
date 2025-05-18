import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";

export default function ClientChatSection({ userId: userIdProp }) {
  const { businessId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState({
    conversationId: null,
    businessId: null,
    partnerId: null
  });
  const [isLoading, setIsLoading] = useState(false);

  // userId מתוך פרופס או מה-storage
  const userId = userIdProp || JSON.parse(localStorage.getItem("user"))?.userId;

  // טען את כל השיחות
  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    API.get("/messages/conversations", { withCredentials: true })
      .then(res => setConversations(res.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [userId]);

  // אם נכנסו עם businessId מה-URL – אתחל שיחה מיידית
  useEffect(() => {
    if (!userId || !businessId) return;

    // בדוק אם יש כבר שיחה
    const existingConv = conversations.find(
      c => c.business?._id === businessId
    );
    if (existingConv) {
      setSelected({
        conversationId: existingConv.conversationId,
        businessId,
        partnerId: businessId
      });
      return;
    }

    // אם אין — צור חדשה
    API.post(
      "/messages/conversations",
      { otherId: businessId },
      { withCredentials: true }
    )
      .then(res => {
        const conv = res.data;
        setConversations(prev => [...prev, conv]);
        setSelected({
          conversationId: conv.conversationId,
          businessId,
          partnerId: businessId
        });
      })
      .catch(() => {});
  }, [businessId, userId, conversations]);

  return (
    <div className={styles.chatSection}>
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
                  selected.conversationId === conv.conversationId
                    ? styles.selected
                    : ""
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

      <main className={styles.chatMain}>
        {selected.conversationId ? (
          <ClientChatTab
            conversationId={selected.conversationId}
            businessId={selected.businessId}
            userId={userId}
            partnerId={selected.partnerId}
          />
        ) : (
          <div className={styles.chatPlaceholder}>בחר שיחה מרשימה</div>
        )}
      </main>
    </div>
  );
}
