import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import API, { setAccessToken } from "../api";  // הוספת הגדרת הטוקן ב-API "../api";

export default function ClientChatSection() {
  const { businessId } = useParams();
  const { user, initialized, refreshToken } = useAuth();
  const userId = user?.id || user?.userId;

  const [conversationId, setConversationId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  // 0️⃣ הגדרת טוקן לאוט' ב-API
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setAccessToken(token);
  }, []);

  // 1️⃣ Initialize socket
  useEffect(() => {
    if (!initialized || !userId) return;
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("accessToken");

    const socket = io(socketUrl, {
      path: "/socket.io",
      transports: ["polling", "websocket"],
      auth: { token, role: "client" },
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect_error", (err) => {
      setError("שגיאת socket: " + err.message);
      setLoading(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [initialized, userId]);

  // 2️⃣ Start or get existing conversation via REST
  useEffect(() => {
    if (!initialized || !userId || !businessId) return;
    (async () => {
      setLoading(true);
      try {
        // 2a. נסה למצוא שיחה קיימת
        const res = await API.get("/conversations", { params: { businessId: userId } });
        const conv = res.data.find(c => String(c.partnerId) === String(businessId));
        if (conv) {
          setConversationId(conv.conversationId);
          setBusinessName(conv.businessName || "");
        } else {
          // 2b. אם לא נמצאה, צור חדשה
          const post = await API.post("/conversations", { otherId: businessId });
          setConversationId(post.data.conversationId);
          // אחרי יצירה, קרא שוב כדי לקבל שם העסק
          const getRes = await API.get("/conversations", { params: { businessId: userId } });
          const newConv = getRes.data.find(c => c.conversationId === post.data.conversationId);
          setBusinessName(newConv?.businessName || "");
        }
      } catch (e) {
        console.error("Error init client conversation:", e);
        setError("שגיאה בטעינת השיחה");
      } finally {
        setLoading(false);
      }
    })();
  }, [initialized, userId, businessId]);

  // 3️⃣ Load business name via socket
  useEffect(() => {
    if (!socketRef.current || !conversationId) return;
    socketRef.current.emit(
      "getConversations",
      { userId },
      (res) => {
        if (res.ok) {
          const conv = res.conversations.find((c) =>
            [c.conversationId, c._id, c.id]
              .map(String)
              .includes(String(conversationId))
          );
          setBusinessName(conv?.businessName || "");
        } else {
          setError("שגיאה בטעינת שם העסק");
        }
      }
    );
  }, [conversationId, userId]);

  // 4️⃣ REST fallback: get conversations list and find existing
  useEffect(() => {
    if (!initialized || !userId || conversationId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    API.get("/conversations", { params: { businessId: userId } })
      .then((res) => {
        const conv = res.data.find((c) =>
          [c.conversationId, c._id, c.id]
            .map(String)
            .includes(String(conversationId))
        );
        if (conv) {
          setConversationId(conv.conversationId);
          setBusinessName(conv.businessName || "");
        }
      })
      .catch((e) => console.error("REST fallback client failed:", e))
      .finally(() => setLoading(false));
  }, [initialized, userId, conversationId]);

  if (loading) return <div className={styles.loading}>טוען…</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          <h3 className={styles.sidebarTitle}>שיחה עם העסק</h3>
          <div className={styles.convItemActive}>
            {businessName || businessId}
          </div>
        </aside>
        <section className={styles.chatArea}>
          {conversationId ? (
            <ClientChatTab
              socket={socketRef.current}
              conversationId={conversationId}
              businessId={businessId}
              userId={userId}
            />
          ) : (
            <div className={styles.emptyMessage}>לא הצלחנו לפתוח שיחה…</div>
          )}
        </section>
      </div>
    </div>
  );
}
