import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import API, { setAccessToken } from "../api";

export default function ClientChatSection() {
  const { businessId } = useParams();
  const { user, initialized, refreshToken } = useAuth();
  const userId = user?.id || user?.userId;

  const [conversationId, setConversationId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  // הגדרת טוקן לאוט' ב-API
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setAccessToken(token);
  }, []);

  // Initialize socket
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

  // Start or get existing conversation via REST
  useEffect(() => {
    if (!initialized || !userId || !businessId) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        console.log("ClientChatSection: Fetching conversations for userId:", userId);
        // 2a. נסה למצוא שיחה קיימת - שים לב לפרמטר: userId (ולא businessId)
        const res = await API.get("/conversations", { params: { userId } });
        console.log("Conversations received:", res.data);

        const conv = res.data.find(c => String(c.partnerId) === String(businessId));
        if (conv) {
          setConversationId(conv.conversationId);
          setBusinessName(conv.businessName || "");
          console.log("Using existing conversation:", conv.conversationId);
        } else {
          // 2b. אם לא נמצאה, צור חדשה
          console.log("No existing conversation, creating new one with otherId:", businessId);
          const post = await API.post("/conversations", { otherId: businessId });
          setConversationId(post.data.conversationId);
          // אחרי יצירה, קרא שוב כדי לקבל שם העסק
          const getRes = await API.get("/conversations", { params: { userId } });
          const newConv = getRes.data.find(c => c.conversationId === post.data.conversationId);
          setBusinessName(newConv?.businessName || "");
          console.log("Created and loaded new conversation:", post.data.conversationId);
        }
      } catch (e) {
        console.error("Error init client conversation:", e);
        if (e.response) {
          setError(`שגיאה מהשרת: ${e.response.status} - ${e.response.data?.message || e.response.statusText}`);
        } else if (e.request) {
          setError("שגיאת רשת - לא התקבל מענה מהשרת");
        } else {
          setError("שגיאה לא צפויה: " + e.message);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [initialized, userId, businessId]);

  // Load business name via socket
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

  // REST fallback: get conversations list and find existing
  useEffect(() => {
    if (!initialized || !userId || conversationId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    API.get("/conversations", { params: { userId } })
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
      .catch((e) => {
        console.error("REST fallback client failed:", e);
        setError("שגיאה בטעינת שיחות");
      })
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
