// src/pages/business/dashboardPages/buildTabs/buildSections/ChatSection.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import ChatComponent from "../../../../../components/ChatComponent";
import styles from "./ChatSection.module.css";
import io from "socket.io-client";

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
  const socketRef = useRef();

  // טען לקוחות
  useEffect(() => {
    if (!initialized || !businessId) return;
    setIsLoading(true);
    fetchClients();
  }, [initialized, businessId]);

  const fetchClients = async () => {
    try {
      // כאן תוכל להשאיר API רגיל כי זה לא צ׳אט
      const res = await fetch("/business/clients", {
        credentials: "include"
      });
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error("שגיאה בטעינת לקוחות", err);
      setError("לא ניתן לטעון לקוחות");
    }
    setIsLoading(false);
  };

  // התחבר ל-socket וטעינת שיחות
  useEffect(() => {
    if (!initialized || !businessId) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      query: { userId: businessId, role: "business" },
    });

    fetchConversations();

    return () => {
      socketRef.current.disconnect();
    };
  }, [initialized, businessId]);

  const fetchConversations = () => {
    if (!socketRef.current) return;
    setIsLoading(true);
    setError("");
    socketRef.current.emit("getConversations", {}, (res) => {
      if (res.ok) {
        const convs = Array.isArray(res.conversations) ? res.conversations : [];
        setConversations(convs);
      } else {
        setError("שגיאה בטעינת שיחות");
      }
      setIsLoading(false);
    });
  };

  // התחלת שיחה חדשה דרך socket
  const startNewConversation = () => {
    if (!newPartnerId || !socketRef.current) return;
    setIsLoading(true);
    setError("");
    socketRef.current.emit("startConversation", { otherUserId: newPartnerId }, (res) => {
      if (res.ok) {
        fetchConversations();
        setSelected({
          conversationId: res.conversationId,
          partnerId: newPartnerId,
          customerId: newPartnerId
        });
      } else {
        setError("לא ניתן לפתוח שיחה");
      }
      setIsLoading(false);
    });
  };

  const handleSelect = ({ conversationId, partnerId, customerId }) => {
    setSelected({ conversationId, partnerId, customerId });
  };

  if (!initialized) {
    return <div className={styles.loadingScreen}>🔄 טוען…</div>;
  }
  if (!businessId) {
    return <div className={styles.errorBanner}>לא נמצא מזהה עסק</div>;
  }

  return (
    <div className={styles.chatSection}>
      <main className={styles.chatMain}>
        {selected.conversationId ? (
          <ChatComponent
            userId={user.id}
            partnerId={selected.partnerId}
            customerId={selected.customerId}
            initialConversationId={selected.conversationId}
            isBusiness={isBusiness}
            socket={socketRef.current} // במידת הצורך
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
                  handleSelect({
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
