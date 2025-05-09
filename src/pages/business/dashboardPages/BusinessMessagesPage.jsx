import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import ChatComponent from "../../../components/ChatComponent";
import API from "../../../api";
import "./BusinessMessagesPage.css";

export default function BusinessMessagesPage() {
  const { user, loading: authLoading } = useAuth();
  // במשתמש ה-JWT יש user.userId, לא id או _id
  const businessUserId = user?.userId;
  const businessProfilePic = user?.profilePicUrl || "/default-business.png";
  const defaultClientPic = "/default-client.png";

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // הוספת log לבדוק אם businessUserId מוגדר כראוי
    console.log("businessUserId:", businessUserId);

    if (!businessUserId) return;

    setIsLoading(true);
    API.get(
      "/messages/conversations", // וודא שזו הכתובת הנכונה
      { withCredentials: true }
    )
      .then(({ data }) => {
        console.log("📬 raw conversations payload:", data);

        if (!data || data.length === 0) {
          console.warn("⚠️ No conversations found!");
        }

        // נניח ש־data זה מערך של המסמכים כפי שמגיע מ־Mongoose
        const list = data.map(conv => {
          // מוציאים את המזהה של השותף (שאינו העסק)
          const other = conv.participants.find(p => {
            const id =
              typeof p === "string"
                ? p
                : p.userId
                ? p.userId.toString()
                : p._id
                ? p._id.toString()
                : "";
            return id !== businessUserId.toString();
          });

          if (!other) {
            console.error("❌ No valid participant found in conversation:", conv);
            return null; // מוודאים שלא נקבל ערכים חסרים
          }

          // ממירים את other למחרוזת
          const clientId =
            typeof other === "string"
              ? other
              : other.userId
              ? other.userId.toString()
              : other._id
              ? other._id.toString()
              : "";

          return {
            conversationId: conv._id.toString(),
            clientId,
          };
        }).filter(Boolean); // מסנן ערכים ריקים

        console.log("✅ mapped conversation list:", list);
        setConversations(list);

        // אם יש לפחות שיחה אחת, נפעיל אותה אוטומטית
        if (list.length > 0) {
          setActiveConversationId(list[0].conversationId);
        }
      })
      .catch(err => {
        console.error("❌ שגיאה בטעינת השיחות:", err);
        setError("❌ לא ניתן לטעון את השיחות, נסה שוב מאוחר יותר");
      })
      .finally(() => setIsLoading(false));
  }, [businessUserId]);

  useEffect(() => {
    console.log("📬 activeConversationId:", activeConversationId);
  }, [activeConversationId]);

  if (authLoading) return <div className="loading-screen">🔄 טוען הרשאה…</div>;
  if (isLoading) return <div className="loading-screen">🔄 טוען שיחות…</div>;
  if (error) return <div className="error-screen">{error}</div>;

  if (!conversations.length) {
    return (
      <div className="empty-chat">
        <h3>עדיין אין לך שיחות</h3>
        <p>כשתקבל הודעה חדשה היא תופיע כאן.</p>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <aside className="chat-sidebar">
        <h4>שיחות מלקוחות</h4>
        <ul>
          {conversations.map(({ conversationId, clientId }) => (
            <li key={conversationId}>
              <button
                className={conversationId === activeConversationId ? "active" : ""}
                onClick={() => {
                  console.log(`📬 Switching to conversation ${conversationId}`);
                  setActiveConversationId(conversationId);
                }}
              >
                {/* כאן תוכלו להחליף את clientId לשם או אימייל על ידי fetch נוסף */}
                לקוח: {clientId}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat-main">
        {activeConversationId && (
          <ChatComponent
            conversationId={activeConversationId}
            partnerId={conversations.find(c => c.conversationId === activeConversationId).clientId}
            isBusiness={true}
            clientProfilePic={defaultClientPic}
            businessProfilePic={businessProfilePic}
          />
        )}
      </main>
    </div>
  );
}
