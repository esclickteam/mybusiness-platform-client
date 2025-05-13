// 📁 src/pages/business/dashboardPages/buildTabs/buildSections/ChatSection.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import ChatComponent from "@components/ChatComponent";
import API from "@api";
import "./ChatSection.css";

export default function ChatSection({ renderTopBar, isBusiness = false }) {
  const { user, initialized } = useAuth();

  const [clients, setClients]         = useState([]);
  const [newPartnerId, setNewPartnerId] = useState("");
  const [selected, setSelected]       = useState({ conversationId: null, partnerId: null });
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState("");

  // טוען את רשימת הלקוחות לעסק
  useEffect(() => {
    if (!initialized) return;
    API.get("/business/clients", { withCredentials: true })
      .then(res => setClients(res.data))
      .catch(err => console.error("שגיאה בטעינת לקוחות", err));
  }, [initialized]);

  // טוען שיחות קיימות
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

  // פותח או מוצא שיחה עם הלקוח הנבחר
  const startNewConversation = async () => {
    if (!newPartnerId) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await API.post(
        "/chat/conversations",
        { otherId: newPartnerId },
        { withCredentials: true }
      );
      const convId = res.data.conversationId;
      await fetchConversations();
      setSelected({ conversationId: convId, partnerId: newPartnerId });
    } catch (err) {
      console.error("שגיאה ביצירת שיחה", err);
      setError("לא ניתן לפתוח שיחה");
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialized) return <div className="loading-screen">🔄 טוען…</div>;

  return (
    <div className="chat-section">
      <aside className="chat-sidebar">
        <h3>שיחות</h3>

        {/* בחירת לקוח מתוך Dropdown */}
        <div className="new-conversation">
          <select
            value={newPartnerId}
            onChange={e => setNewPartnerId(e.target.value)}
            disabled={isLoading}
          >
            <option value="">בחר לקוח...</option>
            {clients.map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={startNewConversation}
            disabled={!newPartnerId || isLoading}
          >
            התחל שיחה
          </button>
        </div>

        {isLoading && <div className="spinner">טעינה…</div>}
        {error && <div className="error-banner">{error}</div>}
        {!isLoading && conversations.length === 0 && (
          <div className="no-conversations">אין שיחות קיימות</div>
        )}

        <ul className="convo-list">
          {conversations.map(conv => {
            const isUserBus = isBusiness || user.id === conv.business._id;
            const partnerId = isUserBus ? conv.customer._id : conv.business._id;
            const partnerName = isUserBus
              ? conv.customer.name
              : conv.business.businessName;
            return (
              <li
                key={conv._id}
                className={`convo-item ${
                  selected.conversationId === conv._id ? "selected" : ""
                }`}
                onClick={() => setSelected({ conversationId: conv._id, partnerId })}
              >
                {partnerName}
              </li>
            );
          })}
        </ul>
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
            בחרי שיחה מרשימה או התחל חדשה
          </div>
        )}
      </main>

      <div className="preview-column">{renderTopBar?.()}</div>
    </div>
  );
}
