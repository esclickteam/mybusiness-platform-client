// 📁 src/components/ConversationsList.jsx
import React, { useState, useEffect } from "react";
import API from "../api";
import "./ConversationsList.css";

export default function ConversationsList({ isBusiness, onSelect }) {
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = isBusiness
      ? "/messages/conversations/business"
      : "/messages/conversations/user";
    API.get(endpoint, { withCredentials: true })
      .then(res => setConvos(res.data))
      .catch(err => console.error("❌ fetch convos:", err))
      .finally(() => setLoading(false));
  }, [isBusiness]);

  if (loading) return <p>טוען…</p>;
  if (!convos.length) return <p>אין שיחות להצגה</p>;

  return convos.map(c => (
    <div
      key={c._id}
      className="conversation-item"
      onClick={() => onSelect({ conversationId: c._id, partnerId: c.partnerId })}
    >
      <strong>{c.participantName}</strong>
      <span className="last-message">{c.lastMessage}</span>
    </div>
  ));
}
