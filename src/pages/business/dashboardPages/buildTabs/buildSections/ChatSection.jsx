// src/pages/business/dashboardPages/buildTabs/buildSections/ChatSection.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import API from "@api";
import ChatComponent from "../../../../../components/ChatComponent";
import styles from "./ChatSection.module.css";

export default function ChatSection({ isBusiness = false }) {
  const { user, initialized } = useAuth();

  const [clients, setClients] = useState([]);
  const [newPartnerId, setNewPartnerId] = useState("");
  const [selected, setSelected] = useState({
    conversationId: null,
    partnerId: null,
    customerId: null
  });
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const businessId = user?.businessId;

  // טען את כל הלקוחות
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

  // טען שיחות קיימות
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

  // פתח שיחה חדשה
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
      setSelected({
        conversationId: convId,
        partnerId: newPartnerId,
        customerId: newPartnerId // כי פותחים שיחה מול לקוח חדש
      });
    } catch (err) {
      console.error("שגיאה ביצירת שיחה", err);
      setError("לא ניתן לפתוח שיחה");
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialized) {
    return <div className={styles.loadingScreen}>🔄 טוען…</div>;
  }
  if (!businessId) {
    return <div className={styles.errorBanner}>לא נמצא מזהה עסק</div>;
  }

  return (
    <div className={styles.chatSection}>
      {/* --- אזור הצ'אט (שיחה שנבחרה) --- */}
      <main className={styles.chatMain}>
        {selected.conversationId ? (
          <ChatComponent
            userId={user.id}
            partnerId={selected.partnerId}
            customerId={selected.customerId}
            initialConversationId={selected.conversationId}
            isBusiness={isBusiness}
          />
        ) : (
          <div className={styles.chatPlaceholder}>
            בחר שיחה מהרשימה או התחל חדשה
          </div>
        )}
      </main>

      {/* --- Sidebar --- */}
      <aside className={styles.chatSidebar}>
        <h3>שיחות</h3>
        <div className={styles.newConversation}>
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
        {isLoading && <div className={styles.spinner}>טעינה…</div>}
        {error && <div className={styles.errorBanner}>{error}</div>}
        {!isLoading && conversations.length === 0 && (
          <div className={styles.noConversations}>אין שיחות קיימות</div>
        )}
        <ul className={styles.convoList}>
          {conversations.map(conv => {
            const isUserBus = isBusiness || user.id === conv.business._id;
            const partnerId = isUserBus ? conv.customer._id : conv.business._id;
            const partnerName = isUserBus
              ? conv.customer.name
              : conv.business.businessName;
            const customerId = conv.customer?._id;
            return (
              <li
                key={conv.conversationId}
                className={`${styles.convoItem} ${
                  selected.conversationId === conv.conversationId ? styles.selected : ""
                }`}
                onClick={() =>
                  setSelected({
                    conversationId: conv.conversationId,
                    partnerId,
                    customerId
                  })
                }
              >
                {partnerName}
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
