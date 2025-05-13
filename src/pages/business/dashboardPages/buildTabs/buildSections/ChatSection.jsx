// 📁 src/pages/business/dashboardPages/buildTabs/buildSections/ChatSection.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import ChatComponent from "@components/ChatComponent";
import API from "@api";
import "./ChatSection.css";

export default function ChatSection({ renderTopBar, isBusiness = false }) {
  const { user, initialized } = useAuth();
  const [newPartnerId, setNewPartnerId] = useState("");
  const [selected, setSelected] = useState({ conversationId: null, partnerId: null });
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing conversations
  useEffect(() => {
    if (!initialized) return;
    fetchConversations();
  }, [initialized]);

  const fetchConversations = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await API.get("/chat/conversations", { withCredentials: true });
      setConversations(res.data);
    } catch (err) {
      console.error("שגיאה בטעינת שיחות", err);
      setError("שגיאה בטעינת שיחות");
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new conversation inline
  const startNewConversation = async () => {
    if (!newPartnerId.trim()) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await API.post(
        "/chat/conversations",
        { otherId: newPartnerId.trim() },
        { withCredentials: true }
      );
      const convId = res.data.conversationId;
      // Refresh and select
      await fetchConversations();
      setSelected({ conversationId: convId, partnerId: newPartnerId.trim() });
      setNewPartnerId("");
    } catch (err) {
      console.error("שגיאה ביצירת שיחה", err);
      setError("לא ניתן לפתוח שיחה");
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialized) {
    return <div className="loading-screen">🔄 טוען שיחות…</div>;
  }

  return (
    <div className="chat-section">
      <aside className="chat-sidebar">
        <h3>שיחות</h3>

        {/* Inline new conversation input */}
        <div className="new-conversation">
          <input
            type="text"
            placeholder="הזן מזהה משתמש"
            value={newPartnerId}
            onChange={e => setNewPartnerId(e.target.value)}
            disabled={isLoading}
          />
          <button
            onClick={startNewConversation}
            disabled={!newPartnerId.trim() || isLoading}
          >
            התחל שיחה
          </button>
        </div>

        {isLoading && <div className="spinner">טעינה…</div>}
        {error && <div className="error-banner">{error}</div>}

        {!isLoading && !error && conversations.length === 0 && (
          <div className="no-conversations">אין שיחות קיימות</div>
        )}

        {conversations.length > 0 && (
          <ul className="convo-list">
            {conversations.map(conv => {
              const isUserBusiness = isBusiness || user.id === conv.business._id;
              const partnerId = isUserBusiness
                ? conv.customer._id
                : conv.business._id;
              const partnerName = isUserBusiness
                ? conv.customer.name || "לקוח"
                : conv.business.businessName || "עסק";
              return (
                <li
                  key={conv._id}
                  className={`convo-item ${
                    selected.conversationId === conv._id ? "selected" : ""
                  }`}
                  onClick={() =>
                    setSelected({ conversationId: conv._id, partnerId })
                  }
                >
                  {partnerName}
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      <main className="chat-main">
        {selected.conversationId ? (
          <ChatComponent
            userId={user.id}
            partnerId={selected.partnerId}
            initialConversationId={selected.conversationId}
            isBusiness={isBusiness}
          />
        ) : (
          <div className="chat-placeholder">
            בחרי שיחה מהרשימה או התחל חדשה
          </div>
        )}
      </main>

      <div className="preview-column">
        {renderTopBar?.()}
      </div>
    </div>
  );
}
