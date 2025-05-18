// src/components/BusinessChatPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import "./ClientChatTab.css"; // תשתמש באותו CSS של הלקוח

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const businessId = user?.businessId;

  const [convos, setConvos]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(false);

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

  const handleSelect = conv => {
    const customerId = conv.participants.find(p => p !== businessId);
    setSelected({
      conversationId: conv._id,
      partnerId:      customerId,
    });
  };

  if (!initialized) return <p>טוען מידע...</p>;

  return (
    <div className="whatsapp-bg">
      <div className="chat-container client">
        <div style={{ display: "flex", height: "100%" }}>
          <aside style={{
            width: "110px",
            background: "#efeae2",
            borderLeft: "1px solid #eee",
            overflowY: "auto"
          }}>
            {loading
              ? <p style={{ textAlign: "center", marginTop: 40 }}>טוען שיחות…</p>
              : <ConversationsList
                  conversations={convos}
                  businessId={businessId}
                  selectedConversationId={selected?.conversationId}
                  onSelect={handleSelect}
                />
            }
          </aside>
          <section style={{ flex: 1, background: "#fff", display: "flex", flexDirection: "column" }}>
            {selected
              ? <BusinessChatTab
                  conversationId={selected.conversationId}
                  businessId={businessId}
                  customerId={selected.partnerId}
                />
              : <p style={{ margin: 40, textAlign: "center", color: "#aaa" }}>
                  בחר שיחה כדי לראות הודעות
                </p>
            }
          </section>
        </div>
      </div>
    </div>
  );
}
