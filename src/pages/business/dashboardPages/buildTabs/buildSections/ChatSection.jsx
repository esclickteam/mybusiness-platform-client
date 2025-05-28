// src/pages/business/dashboardPages/buildTabs/buildSections/ChatSection.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import ChatComponent from "../../../../../components/ChatComponent";
import styles from "./ChatSection.module.css";
import socket from "../../../../../socket";
import API from "../../../../../api";

export default function ChatSection({ isBusiness = false }) {
  const { accessToken, user, initialized, refreshToken } = useAuth();
  const businessId = user?.businessId;

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
  const hasJoinedRef = useRef(false);

  // Load clients list
  useEffect(() => {
    if (!initialized || !businessId) return;
    setIsLoading(true);
    fetch("/business/clients", { credentials: "include" })
      .then(r => r.json())
      .then(data => setClients(data))
      .catch(err => {
        console.error("שגיאה בטעינת לקוחות", err);
        setError("לא ניתן לטעון לקוחות");
      })
      .finally(() => setIsLoading(false));
  }, [initialized, businessId]);

  // Initialize socket
  useEffect(() => {
    if (!initialized || !businessId || !accessToken) return;

    (async () => {
      let token = accessToken;
      try {
        token = await refreshToken();
      } catch {
        setError("❌ טוקן לא תקף");
        return;
      }
      socket.auth = { token, role: "business", businessId };
      socket.connect();
    })();

    return () => {
      socket.disconnect();
      setConversations([]);
      setSelected({
        conversationId: null,
        partnerId: null,
        customerId: null
      });
    };
  }, [initialized, businessId, accessToken]);

  // Fetch existing conversations
  useEffect(() => {
    if (!socket.connected) return;
    setIsLoading(true);
    setError("");
    socket.emit("getConversations", { userId: businessId }, res => {
      setIsLoading(false);
      if (res.ok) {
        setConversations(res.conversations);
      } else {
        console.error("שגיאה בטעינת שיחות", res.error);
        setError("שגיאה בטעינת שיחות");
      }
    });
  }, [socket.connected]);

  // Start new conversation
  const startNewConversation = () => {
    if (!newPartnerId || !socket.connected) return;
    setIsLoading(true);
    setError("");
    socket.emit("startConversation", { otherUserId: newPartnerId }, res => {
      setIsLoading(false);
      if (res.ok) {
        const convoId = res.conversationId;
        setSelected({
          conversationId: convoId,
          partnerId: newPartnerId,
          customerId: newPartnerId
        });
        // Refresh list
        socket.emit("getConversations", { userId: businessId }, r => {
          if (r.ok) setConversations(r.conversations);
        });
      } else {
        console.error("לא ניתן לפתוח שיחה", res.error);
        setError("לא ניתן לפתוח שיחה");
      }
    });
  };

  const handleSelect = ({ conversationId, partnerId, customerId }) => {
    // Leave previous
    if (hasJoinedRef.current) {
      socket.emit("leaveConversation", selected.conversationId);
    }
    // Join new
    socket.emit("joinConversation", conversationId);
    hasJoinedRef.current = true;
    setSelected({ conversationId, partnerId, customerId });
  };

  if (!initialized)
    return <div className={styles.loadingScreen}>🔄 טוען…</div>;
  if (!businessId)
    return <div className={styles.errorBanner}>לא נמצא מזהה עסק</div>;

  return (
    <div className={styles.chatSection}>
      <main className={styles.chatMain}>
        {selected.conversationId ? (
          <ChatComponent
            isBusiness={isBusiness}
            initialConversationId={selected.conversationId}
            partnerId={selected.partnerId}
          />
        ) : (
          <div className={styles.chatPlaceholder}>
            בחר שיחה מהרשימה או התחל חדשה
          </div>
        )}
      </main>

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
        <ul className={styles.convoList}>
          {conversations.map(conv => {
            const isUserBus = isBusiness;
            const partnerId = isUserBus
              ? conv.customer._id
              : conv.business._id;
            const partnerName = isUserBus
              ? conv.customer.name
              : conv.business.businessName;
            const convoId = conv.conversationId;
            return (
              <li
                key={convoId}
                className={`${styles.convoItem} ${
                  selected.conversationId === convoId
                    ? styles.selected
                    : ""
                }`}
                onClick={() =>
                  handleSelect({
                    conversationId: convoId,
                    partnerId,
                    customerId: conv.customer._id
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
