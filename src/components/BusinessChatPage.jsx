import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const businessId = user?.businessId;
  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // דיבאג: תראה מה businessId שלך באמת!
  useEffect(() => {
    console.log("🔍 businessId from useAuth:", businessId);
    console.log("🔍 user object:", user);
  }, [businessId, user]);

  // שליפת שיחות מהשרת
  useEffect(() => {
    if (!initialized || !businessId) return;
    setLoading(true);
    API.get("/messages/conversations", {
      params: { businessId },
      withCredentials: true,
    })
      .then(res => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.conversations || [];
        setConvos(data);

        // דיבאג: תראה בדיוק איך נראות השיחות ומה ה-participants
        console.log("📦 Conversations from API:", data);

        // אם אין selected - בחירת השיחה הראשונה כברירת מחדל
        if (data.length && !selected) {
          const first = data[0];
          const convoId = first._id || first.conversationId || first.id;
          // דיבאג: תראה מי ה-businessId ומה יש ב-participants
          console.log("🟠 first.convo:", first);
          // תמיד חפש את ה-partner שהוא לא בעל העסק, ואם אין - חפש customer._id
          const partnerId =
            (Array.isArray(first.participants)
              ? first.participants.find(p => p !== businessId)
              : null) ||
            first.customer?._id ||
            "";
          console.log("🟣 Auto-select partnerId:", partnerId, "for convoId:", convoId);
          setSelected({ conversationId: convoId, partnerId });
        }
      })
      .finally(() => setLoading(false));
  }, [initialized, businessId]);

  // טיפול בבחירת שיחה מהסיידבר
  const handleSelect = (conversationId, partnerIdFromSidebar) => {
    // תמיד לוג - תדע בדיוק מה קורה!
    console.log("🟢 handleSelect", { conversationId, partnerIdFromSidebar });

    let partnerId = partnerIdFromSidebar;
    if (!partnerId) {
      // גיבוי: נסה לחלץ את partnerId מהשיחה עצמה
      const convo = convos.find(
        c =>
          c._id === conversationId ||
          c.conversationId === conversationId ||
          c.id === conversationId
      );
      if (convo) {
        console.log("🟠 fallback convo for selection:", convo);
        partnerId =
          (Array.isArray(convo.participants)
            ? convo.participants.find(p => p !== businessId)
            : null) ||
          convo.customer?._id ||
          "";
      }
    }
    console.log("🔵 Selecting convo", conversationId, "with partnerId:", partnerId);
    setSelected({ conversationId, partnerId });
  };

  if (!initialized) return <p className={styles.loading}>טוען מידע…</p>;

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        {/* סיידבר */}
        <aside className={styles.sidebarInner}>
          {loading ? (
            <p className={styles.loading}>טוען שיחות…</p>
          ) : (
            <ConversationsList
              conversations={convos}
              businessId={businessId}
              selectedConversationId={selected?.conversationId}
              // שים לב - פה מעבירים גם conversationId וגם partnerId
              onSelect={handleSelect}
              isBusiness={true}
            />
          )}
        </aside>

        {/* אזור הצ'אט */}
        <section className={styles.chatArea}>
          {selected && selected.partnerId ? (
            <>
              <div style={{ color: "#a9a", fontSize: "13px", marginBottom: 4 }}>
                🔵 <b>businessId:</b> {businessId} <b>partnerId:</b> {selected.partnerId}
              </div>
              <BusinessChatTab
                conversationId={selected.conversationId}
                businessId={businessId}
                customerId={selected.partnerId}
              />
            </>
          ) : (
            <div className={styles.emptyMessage}>
              בחר שיחה כדי לראות הודעות
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
