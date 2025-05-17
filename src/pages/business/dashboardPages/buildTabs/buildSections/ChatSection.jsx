// src/pages/business/dashboardPages/buildTabs/buildSections/ChatSection.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import API from "@api";
import ChatComponent from "../../../../../components/ChatComponent";
import "./ChatSection.css";

export default function ChatSection({ renderTopBar, isBusiness = false }) {
  const { user, initialized } = useAuth();

  const [clients, setClients] = useState([]);
  const [newPartnerId, setNewPartnerId] = useState("");
  const [selected, setSelected] = useState({ conversationId: null, partnerId: null });
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const businessId = user?.businessId;

  // 1. טוען את כל הלקוחות
  useEffect(() => {
    if (!initialized || !businessId) return;
    setIsLoading(true);
    API.get("/business/clients", { withCredentials: true })
      .then(res => setClients(res.data))
      .catch(err => {
        console.error("שגיאה בטעינת לקוחות", err);
        setError("לא ניתן לטעון לקוחות");
      })
      .finally(() => setIsLoading(false));
  }, [initialized, businessId]);

  // 2. טוען שיחות קיימות
  useEffect(() => {
    if (!initialized || !businessId) return;
    fetchConversations();
  }, [initialized, businessId]);

  const fetchConversations = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await API.get("/messages/conversations", { withCredentials: true });
      setConversations(res.data);
    } catch (err) {
      console.error("שגיאה בטעינת שיחות", err);
      setError("שגיאה בטעינת שיחות");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. פותח או מוצא שיחה חדשה
  const startNewConversation = async () => {
    if (!newPartnerId) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await API.post(
        "/messages/conversations",
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
  if (!businessId) return <div className="error-banner">לא נמצא מזהה עסק</div>;

  return (
    <div className="chat-section">
      <aside className="chat-sidebar">
        <h3>שיחות</h3>

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
            const isUserBus = isBusiness || user.userId === conv.business._id;
            const partnerId = isUserBus ? conv.customer._id : conv.business._id;
            const partnerName = isUserBus
              ? conv.customer.name
              : conv.business.businessName;
            return (
              <li
                key={conv.conversationId}
                className={`convo-item ${
                  selected.conversationId === conv.conversationId ? "selected" : ""
                }`}
                onClick={() =>
                  setSelected({ conversationId: conv.conversationId, partnerId })
                }
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
            userId={user.userId}                    // <-- פה
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
