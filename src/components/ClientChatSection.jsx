// src/components/ClientChatSection.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import { createSocket } from "../socket";
import API, { setAccessToken } from "../api";
import { ensureValidToken } from "../utils/authHelpers";



export default function ClientChatSection() {
  const { businessId: routeBusinessId } = useParams();
  const { accessToken, initialized, refreshToken } = useAuth();
  const userId = useAuth().user?.userId;
  const businessId = routeBusinessId;

  const socketRef = useRef(null);
  const hasJoinedRef = useRef(false);

  const [conversationId, setConversationId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Configure axios with the latest token
  useEffect(() => {
    if (accessToken) setAccessToken(accessToken);
  }, [accessToken]);

  // 2. Initialize socket with a valid token
  useEffect(() => {
    if (!initialized || !userId) return;

    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const token = await ensureValidToken();
        const socket = createSocket();
        socket.auth = { token, role: "client", businessId };
        socket.connect();
        socketRef.current = socket;

        socket.on("connect_error", err => {
          if (isMounted) {
            setError("שגיאת socket: " + err.message);
            setLoading(false);
          }
        });
      } catch (e) {
        console.error("Cannot initialize socket:", e);
        if (isMounted) setError("❌ טוקן לא תקף ולא ניתן להתחבר");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
    };
  }, [initialized, userId, refreshToken]);

  // 3. Start or fetch existing conversation via REST
  useEffect(() => {
    if (!initialized || !userId || !businessId) return;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/conversations", { params: { userId } });
        const conv = res.data.find(c => String(c.partnerId) === String(businessId));
        if (conv) {
          setConversationId(conv.conversationId);
          setBusinessName(conv.businessName || "");
        } else {
          const post = await API.post("/conversations", { otherId: businessId });
          setConversationId(post.data.conversationId);
          hasJoinedRef.current = true;
          setBusinessName(post.data.businessName || "");
        }
      } catch (e) {
        console.error("Error init client conversation:", e);
        setError(
          e.response
            ? `שגיאה מהשרת: ${e.response.status} - ${e.response.data?.message || e.response.statusText}`
            : "שגיאת רשת - לא התקבל מענה מהשרת"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [initialized, userId, businessId]);

  // 4. Join conversation room & load businessName via socket
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !conversationId) return;

    if (hasJoinedRef.current) {
      socket.emit("leaveConversation", conversationId);
    }

    socket.emit("joinConversation", conversationId, ack => {
      if (!ack.ok) setError("לא ניתן להצטרף לשיחה");
    });

    socket.emit("getConversations", { userId }, res => {
      if (res.ok) {
        const conv = res.conversations.find(
          c => String(c.conversationId) === String(conversationId)
        );
        setBusinessName(conv?.businessName || "");
      }
    });
  }, [socketRef.current?.connected, conversationId, userId]);

  if (loading) return <div className={styles.loading}>טוען…</div>;
  if (error)   return <div className={styles.error}>{error}</div>;

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
            <div className={styles.emptyMessage}>
              לא הצלחנו לפתוח שיחה…
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
