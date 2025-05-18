// src/components/BusinessChatPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import "./BusinessChatPage.css";

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const businessId = user?.businessId;

  const [convos, setConvos]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(false);

  // 1) טוען את כל השיחות של העסק
  useEffect(() => {
    if (!initialized || !businessId) return;
    setLoading(true);
    API.get("/messages/conversations", {
      params: { businessId },
      withCredentials: true,
    })
      .then(res => {
        const data = res.data.conversations || res.data;
        setConvos(data);
      })
      .finally(() => setLoading(false));
  }, [initialized, businessId]);

  // 2) כשבוחרים שיחה — מוצאים מי הלקוח, ושולחים ל־BusinessChatTab
  const handleSelect = conv => {
    const customerId = conv.participants.find(p => p !== businessId);
    setSelected({
      conversationId: conv._id,
      partnerId:     customerId,
    });
  };

  if (!initialized) return <p>טוען מידע...</p>;

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        {loading
          ? <p>טוען שיחות…</p>
          : <ConversationsList
              conversations={convos}
              businessId={businessId}
              selectedConversationId={selected?.conversationId}
              onSelect={handleSelect}
            />
        }
      </aside>

      <section className="chat-main">
        {selected
          ? <BusinessChatTab
              conversationId={selected.conversationId}
              businessId={businessId}
              customerId={selected.partnerId}
            />
          : <p>בחר שיחה כדי לראות הודעות</p>
        }
      </section>
    </div>
  );
}
