import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import ChatComponent from "../../../../../components/ChatComponent";
import styles from "./ChatSection.module.css";
import { io } from "socket.io-client";

export default function ChatSection({ isBusiness = false }) {
  const { user, initialized, refreshAccessToken, logout } = useAuth();

  const [clients, setClients] = useState([]);
  const [newPartnerId, setNewPartnerId] = useState("");
  const [selected, setSelected] = useState({
    conversationId: null,
    partnerId: null,
    customerId: null,
  });
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const businessId = user?.businessId;
  const socketRef = useRef();

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

  // טען לקוחות
  useEffect(() => {
    if (!initialized || !businessId) return;

    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/business/clients", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch clients");
        const data = await res.json();
        setClients(data);
      } catch (err) {
        console.error("שגיאה בטעינת לקוחות", err);
        setError("לא ניתן לטעון לקוחות");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [initialized, businessId]);

  // התחבר לסוקט ונהל אירועים
  useEffect(() => {
    if (!initialized || !businessId) return;

    async function setupSocket() {
      try {
        const accessToken = await refreshAccessToken();
        if (!accessToken) {
          logout();
          return;
        }

        socketRef.current = io(SOCKET_URL, {
          auth: {
            token: accessToken,
            role: "business",
            businessId,
          },
          transports: ["websocket"],
          autoConnect: false,
        });

        socketRef.current.connect();

        socketRef.current.on("connect", () => {
          console.log("🔌 Connected to dashboard socket:", socketRef.current.id);
          fetchConversations();
        });

        socketRef.current.on("connect_error", (err) => {
          console.error("❌ Dashboard socket connection error:", err.message);
          setError("שגיאה בחיבור לסוקט: " + err.message);
        });

        socketRef.current.on("tokenExpired", async () => {
          console.log("🚨 Token expired, refreshing...");
          const newToken = await refreshAccessToken();
          if (!newToken) {
            logout();
            return;
          }
          socketRef.current.auth.token = newToken;
          socketRef.current.disconnect();
          socketRef.current.connect();
        });

        socketRef.current.on("disconnect", (reason) => {
          console.warn("🔌 Disconnected dashboard socket:", reason);
          // כאן אפשר להוסיף לוגיקה לחיבור מחדש אוטומטי אם רוצים
        });
      } catch (e) {
        console.error("Error setting up socket:", e);
        setError("שגיאה בהתחברות לסוקט");
      }
    }

    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🔌 Disconnected dashboard socket");
      }
    };
  }, [initialized, businessId, refreshAccessToken, logout]);

  // בקשת שיחות
  const fetchConversations = () => {
    if (!socketRef.current) return;
    setIsLoading(true);
    setError("");
    const userIdToSend = user?.userId || businessId;
    socketRef.current.emit("getConversations", { userId: userIdToSend }, (res) => {
      if (res.ok) {
        const convs = Array.isArray(res.conversations) ? res.conversations : [];
        setConversations(convs);
      } else {
        setError("שגיאה בטעינת שיחות");
      }
      setIsLoading(false);
    });
  };

  // התחלת שיחה חדשה
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
          customerId: newPartnerId,
        });
      } else {
        setError("לא ניתן לפתוח שיחה");
      }
      setIsLoading(false);
    });
  };

  // בחירת שיחה מהרשימה
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
            userId={user.userId || user.id}
            partnerId={selected.partnerId}
            customerId={selected.customerId}
            initialConversationId={selected.conversationId}
            isBusiness={isBusiness}
            socket={socketRef.current}
          />
        ) : (
          <div className={styles.chatPlaceholder}>בחר שיחה מהרשימה או התחל חדשה</div>
        )}
      </main>

      <aside className={styles.chatSidebar}>
        <h3>שיחות</h3>
        <div className={styles.newConversation}>
          <select
            value={newPartnerId}
            onChange={(e) => setNewPartnerId(e.target.value)}
            disabled={isLoading}
          >
            <option value="">בחר לקוח...</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <button onClick={startNewConversation} disabled={!newPartnerId || isLoading}>
            התחל שיחה
          </button>
        </div>

        {isLoading && <div className={styles.spinner}>טעינה…</div>}
        {error && <div className={styles.errorBanner}>{error}</div>}
        {!isLoading && conversations.length === 0 && (
          <div className={styles.noConversations}>אין שיחות קיימות</div>
        )}

        <ul className={styles.convoList}>
          {conversations.map((conv) => {
            const isUserBusiness = isBusiness || user?.userId === conv.business._id;
            const partnerId = isUserBusiness ? conv.customer._id : conv.business._id;
            const partnerName = isUserBusiness ? conv.customer.name : conv.business.businessName;
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
                    customerId,
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
