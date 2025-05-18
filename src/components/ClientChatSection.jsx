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

  // טען את כל השיחות כשמשתנה userId
  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    API.get("/messages/conversations", { withCredentials: true })
      .then(res => {
        setConversations(res.data || []);
        // ניקוי בחירת שיחה במעבר בין עסקים שונים
        setSelected({
          conversationId: null,
          businessId: null,
          partnerId: null
        });
      })
      .catch(err => {
        console.warn("שגיאה בטעינת שיחות:", err);
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  // דיבאג
  useEffect(() => {
    console.log("conversations:", conversations);
    console.log("selected:", selected);
    console.log("businessId from URL:", businessId);
  }, [conversations, selected, businessId]);

  // יצירת שיחה חדשה אם נכנסנו לעסק שאין לו שיחה
  useEffect(() => {
    if (!userId || !businessId || isLoading) return;
    if (selected.businessId === businessId && selected.conversationId) return;

    // בדוק אם יש כבר שיחה עם העסק הזה
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

    // אין שיחה — צור חדשה
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
      .catch(err => {
        console.warn("שגיאה ביצירת שיחה:", err);
      });
    // eslint-disable-next-line
  }, [businessId, userId, isLoading, conversations]); // conversations dependency - לא תיצור לולאה כי מוסיפים פעם אחת

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
