import React, { useState, useEffect } from "react";
import API from "../api";
import "./ConversationsList.css";

/**
 * Props:
 *  - onSelect: function({ conversationId, partnerId })
 *  - selectedConversationId: string | null
 *  - userId: string
 *  - clientProfilePic: string URL
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
  const [error, setError]   = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    // קריאה לנתיב החדש /chat/conversations
    API.get("/chat/conversations", { withCredentials: true })
      .then((res) => setConvos(res.data))
      .catch((err) => {
        console.error("❌ fetch convos:", err);
        setError("שגיאה בטעינת שיחות");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>טוען…</p>;
  if (error)   return <p className="error-banner">{error}</p>;
  if (!convos.length) return <p>אין שיחות להצגה</p>;

  return (
    <div className="conversations-list">
      {convos.map((c) => {
        // קביעת הפרטנר לפי תפקיד המשתמש
        const partnerId = userId === c.business
          ? c.customer
          : c.business;
        // קביעת השם להצגה
        const partnerName = userId === c.business
          ? (c.customer.name || "משתמש")
          : (c.business.businessName || "עסק");

        return (
          <div
            key={c._id}
            className={`conversation-item ${
              c._id === selectedConversationId ? "selected" : ""
            }`}
            onClick={() => onSelect({ conversationId: c._id, partnerId })}
          >
            <div className="info">
              <strong>{partnerName}</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}
