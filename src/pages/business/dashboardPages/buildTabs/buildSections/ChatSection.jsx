// 📁 src/pages/business/dashboardPages/buildTabs/buildSections/ChatSection.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import ChatComponent from "@components/ChatComponent";
import API from "@api";
import "./ChatSection.css";

export default function ChatSection({ renderTopBar }) {
  const { initialized } = useAuth();
  const [selected, setSelected] = useState({ conversationId: null, partnerId: null });
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch conversations list
  useEffect(() => {
    if (!initialized) return;
    setIsLoading(true);
    setError("");
    API.get("/messages", { withCredentials: true })
      .then(res => setConversations(res.data))
      .catch(() => setError("שגיאה בטעינת שיחות"))
      .finally(() => setIsLoading(false));
  }, [initialized]);

  if (!initialized) {
    return <div className="loading-screen">🔄 טוען שיחות…</div>;
  }

  return (
    <div className="chat-section">
      <aside className="chat-sidebar">
        <h3>שיחות נכנסות</h3>
        {isLoading && <div className="spinner">טעינה…</div>}
        {error && <div className="error-banner">{error}</div>}
        {!isLoading && !error && (
          <ul className="convo-list">
            {conversations.map(conv => (
              <li
                key={conv._id}
                className={
                  selected.conversationId === conv._id ? "selected" : ""
                }
                onClick={() =>
                  setSelected({
                    conversationId: conv._id,
                    partnerId: conv.participants.find(p => p !== initialized.userId) || null,
                  })
                }
              >
                {conv.businessName || "שיחה"}
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main className="chat-main">
        {selected.conversationId ? (
          <ChatComponent
            conversationId={selected.conversationId}
            partnerId={selected.partnerId}
            isBusiness={true}
          />
        ) : (
          <div className="chat-placeholder">
            בחרי שיחה מהרשימה כדי להתחיל
          </div>
        )}
      </main>

      <div className="preview-column">{renderTopBar?.()}</div>
    </div>
  );
}