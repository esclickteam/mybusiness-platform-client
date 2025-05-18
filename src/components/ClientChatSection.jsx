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

  // אם businessId קיים ב-URL ואין שיחה – צור חדשה
  useEffect(() => {
    if (!userId || !businessId) return;
    // בדוק אם כבר יש שיחה
    const existingConv = conversations.find(
      c => c.business?._id === businessId
    );
    if (existingConv) {
      if (selected.conversationId !== existingConv.conversationId) {
        setSelected({
          conversationId: existingConv.conversationId,
          businessId,
          partnerId: businessId
        });
      }
      return;
    }
    // אין — צור חדשה
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
        console.log("✨ שיחה חדשה נוצרה", conv);
      })
      .catch((err) => {
        console.warn("שגיאה ביצירת שיחה:", err);
      });
    // eslint-disable-next-line
  }, [businessId, userId, conversations]); // בלי isLoading, תלוי רק ב-conversations

  // דיבאג
  useEffect(() => {
    console.log("conversations:", conversations);
    console.log("selected:", selected);
    console.log("businessId from URL:", businessId);
  }, [conversations, selected, businessId]);

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
