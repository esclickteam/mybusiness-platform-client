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

  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState({
    conversationId: null,
    businessId: null,
    partnerId: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    API.get("/messages/conversations", { withCredentials: true })
      .then((res) => {
        setConversations(res.data || []);
        console.log("🎯 [LOAD] conversations loaded:", res.data);
      })
      .catch((err) => {
        console.warn("❌ [LOAD] Error loading conversations:", err);
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!userId || !businessId) return;

    const existingConv = conversations.find(
      (c) => c.business?._id === businessId
    );
    if (existingConv) {
      if (selected.conversationId !== existingConv.conversationId) {
        setSelected({
          conversationId: existingConv.conversationId,
          businessId,
          partnerId: businessId,
        });
      }
      return;
    }

    API.post(
      "/messages/conversations",
      { otherId: businessId },
      { withCredentials: true }
    )
      .then((res) => {
        const conv = res.data;
        setConversations((prev) => {
          // אם כבר קיימת שיחה עם אותו conversationId, לא מוסיפים שוב
          if (prev.some((c) => c.conversationId === conv.conversationId)) {
            return prev;
          }
          return [...prev, conv];
        });
        setSelected({
          conversationId: conv.conversationId,
          businessId,
          partnerId: businessId,
        });
        console.log("✨ [CREATE] New conversation created:", conv);
      })
      .catch((err) => {
        console.warn("❌ [CREATE] Error creating conversation:", err);
      });
  }, [businessId, userId, conversations]);

  if (!initialized) return <div>טוען משתמש...</div>;

  return (
    <div className={styles.chatSection}>
      <aside className={styles.chatSidebar}>
        <h3>העסקים שלי</h3>
        {isLoading && <div className={styles.spinner}>טעינה…</div>}
        {!isLoading && conversations.length === 0 && (
          <div className={styles.noConversations}>אין שיחות קיימות</div>
        )}
        <ul className={styles.convoList}>
          {conversations.map((conv) => {
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
                    partnerId: partnerId,
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
