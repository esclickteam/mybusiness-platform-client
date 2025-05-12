// 📁 src/components/ConversationsList.jsx
import React, { useState, useEffect } from "react";
import API from "../api";
import "./ConversationsList.css";

export default function ConversationsList({ onSelect }) {
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    API.get("/messages", { withCredentials: true })
      .then(res => setConvos(res.data))
      .catch(err => {
        console.error("❌ fetch convos:", err);
        setError("שגיאה בטעינת שיחות");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>טוען…</p>;
  if (error) return <p className="error-banner">{error}</p>;
  if (!convos.length) return <p>אין שיחות להצגה</p>;

  return (
    <div className="conversations-list">
      {convos.map(c => {
        // נניח ש־participants הוא מערך שני מזהים, האחד הוא המשתמש הנוכחי והשני הוא הפרטנר
        const partnerId = c.participants.find(p => p !== c.currentUserId);
        const name = c.businessName || "שיחה";

        // שליפת ההודעה האחרונה, אם קיימת
        const lastMsg = c.messages?.length
          ? c.messages[c.messages.length - 1].text
          : "";

        return (
          <div
            key={c._id}
            className="conversation-item"
            onClick={() =>
              onSelect({ conversationId: c._id, partnerId })
            }
          >
            <strong>{name}</strong>
            {lastMsg && <span className="last-message">{lastMsg}</span>}
          </div>
        );
      })}
    </div>
  );
}
