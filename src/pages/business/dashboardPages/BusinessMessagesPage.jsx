// BusinessMessagesPage.jsx
import React, { useEffect, useState } from "react";
import API from "../../../api";
import BusinessChat from "./BusinessChatComponent";
import "./BusinessMessagesPage.css";

const BusinessMessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?.userId;
        const userEmail = storedUser?.email;

        if (!userId) {
          console.warn("⚠️ אין userId בלוקאל סטורג'"); 
          return;
        }

        console.log("📡 מבצע קריאה ל-conversations של:", userId);
        const { data } = await API.get(`/business/${userId}/conversations`);
        console.log("📥 שיחות שהתקבלו מהשרת:", data);

        if (data.length > 0) {
          setConversations(data);
          setSelected(data[0]);
        } else {
          console.log("💬 לא נמצאו שיחות מהשרת. בודק אם להציג שיחת דמו...");
          if (userEmail === "newuser@example.com") {
            console.log("✅ טוען שיחת דמו עבור המשתמש שלך");
            const demo = {
              clientId: "demo123",
              name: "דנה כהן",
              messages: [
                { text: "שלום, רציתי לבדוק אם יש משלוחים גם לראשון לציון?", sender: "client" },
                { text: "היי דנה, כן! אנחנו שולחים לראשון לציון בימים ראשון–חמישי.", sender: "business" },
                { text: "תוך כמה זמן מגיע בערך?", sender: "client" },
                { text: "עד 2 ימי עסקים, ואם תזמיני היום לפני 14:00 – זה יישלח היום!", sender: "business" },
              ],
            };
            setConversations([demo]);
            setSelected(demo);
          } else {
            console.log("🔒 משתמש אינו מורשה לשיחת דמו (לא newuser@example.com)");
          }
        }
      } catch (error) {
        console.error("❌ שגיאה בטעינת השיחות:", error);
      }
    };

    fetchMessages();
  }, []);

  const getLastMessagePreview = (conversation) => {
    const last = conversation.messages?.[conversation.messages.length - 1];
    return last?.text?.slice(0, 40) || "הודעה חדשה";
  };

  return (
    <div className="messages-page">
      {/* Sidebar */}
      <aside className="chat-sidebar">
        <h4>שיחות</h4>
        {conversations.map((c, i) => (
          <div
            key={i}
            className={`chat-list-item ${selected?.clientId === c.clientId ? "active" : ""}`}
            onClick={() => setSelected(c)}
          >
            <strong>{c.name || "לקוח ללא שם"}</strong>
            <p>{getLastMessagePreview(c)}</p>
          </div>
        ))}
      </aside>

      {/* Main Chat */}
      <main className="chat-main">
        {selected ? (
          <BusinessChat
            currentUser={{ _id: JSON.parse(localStorage.getItem("user"))?.userId }}
            partnerId={selected.clientId}
            partnerName={selected.name}
            demoMessages={selected.messages}
          />
        ) : (
          <div className="empty-chat">בחר שיחה כדי להתחיל</div>
        )}
      </main>
    </div>
  );
};

export default BusinessMessagesPage;
