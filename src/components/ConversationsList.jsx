// 📁 src/components/ConversationsList.jsx
import React, { useState, useEffect } from "react";
import API from "../api";
import "./ConversationsList.css";

/**
 * Props:
 *  - onSelect: function({ conversationId, partnerId })
 *  - selectedConversationId: string | null
 *  - userId: string
 *  - clientProfilePic: string URL  // can pass if you ever want to re-enable avatars
 *  - businessProfilePic: string URL
 */
export default function ConversationsList({
  onSelect,
  selectedConversationId,
  userId,
  clientProfilePic,
  businessProfilePic,
}) {
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    API.get("/messages/conversations", { withCredentials: true })
      .then((res) => setConvos(res.data))
      .catch((err) => {
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
      {convos.map((c) => {
        // מציאת המזהה של הפרטנר
        const partnerId = c.participants.find((p) => p !== userId);
        // האם הצד השני הוא עסק?
        const isPartnerBusiness = Boolean(c.businessName);
        // שם התצוגה
        const name = c.businessName || partnerId || "משתמש";

        return (
          <div
            key={c._id}
            className={`conversation-item ${
              c._id === selectedConversationId ? "selected" : ""
            }`}
            onClick={() => onSelect({ conversationId: c._id, partnerId })}
          >
            
            <div className="info">
              <strong>{name}</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}
