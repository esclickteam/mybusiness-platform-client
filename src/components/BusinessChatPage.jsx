import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import "./ClientChatTab.css"; // אותו CSS של הלקוח

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

  const handleSelect = ({ conversationId, partnerId }) => {
    setSelected({ conversationId, partnerId });
  };

  if (!initialized) return <p>טוען מידע...</p>;

  return (
    <div className="whatsapp-bg" style={{
      minHeight: "80vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        display: "flex",
        gap: "32px",
        width: "100%",
        maxWidth: "900px",
        alignItems: "flex-start"
      }}>
        <aside className="sidebar-business"
          style={{
            width: "200px",
            minWidth: "110px",
            background: "#ede7f6",
            borderLeft: "2px solid #c3a6fa",
            borderRadius: "16px",
            height: "650px",
            overflowY: "auto",
            boxShadow: "0 6px 32px #c3a6fa18"
          }}>
          {loading
            ? <p style={{ textAlign: "center", marginTop: 40 }}>טוען שיחות…</p>
            : <ConversationsList
                conversations={convos}
                businessId={businessId}
                selectedConversationId={selected?.conversationId}
                onSelect={handleSelect}
                isBusiness={true}
              />
          }
        </aside>
        <div className="chat-container client">
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
        </div>
      </div>
    </div>
  );
}
