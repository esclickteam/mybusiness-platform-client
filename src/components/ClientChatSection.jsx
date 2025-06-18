import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

export default function ClientChatSection() {
  const { businessId } = useParams();
  const { user, initialized } = useAuth();
  const userId = user?.userId || null;

  const [conversationId, setConversationId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  // 1️⃣ Initialize socket once when dependencies are ready
  useEffect(() => {
    if (!initialized || !userId || !businessId) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

    console.log("Creating socket with:", { token, businessId });

    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      transports: ['websocket'],
      auth: { token, role: "chat", businessId },
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
      setError("");
    });

    socketRef.current.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
      if (reason !== "io client disconnect") {
        setError("Socket disconnected unexpectedly: " + reason);
      }
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connect_error:", err.message);
      setError("שגיאה בחיבור לסוקט: " + err.message);
    });

    return () => {
      if (socketRef.current) {
        console.log("Disconnecting socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initialized, userId, businessId]);

  // 2️⃣ Start or get conversation once
  useEffect(() => {
    if (!socketRef.current || !businessId) return;

    setLoading(true);
    console.log("Requesting startConversation with businessId:", businessId);

    socketRef.current.emit(
      "startConversation",
      { otherUserId: businessId },
      (res) => {
        if (res.ok) {
          console.log("Conversation started, ID:", res.conversationId);
          setConversationId(res.conversationId);
          setError("");
        } else {
          console.error("Error starting conversation:", res.error);
          setError("שגיאה ביצירת השיחה: " + (res.error || "לא ידוע"));
        }
        setLoading(false);
      }
    );
  }, [businessId]);

  // 3️⃣ After conversationId is ready, load business name
  useEffect(() => {
    if (!socketRef.current || !conversationId) return;

    console.log("Loading conversations to get business name, conversationId:", conversationId);

    socketRef.current.emit(
      "getConversations",
      { userId },
      (res) => {
        if (res.ok) {
          console.log("Conversations received:", res.conversations.length);
          const conv = res.conversations.find((c) =>
            [c.conversationId, c._id, c.id].map(String).includes(String(conversationId))
          );
          if (conv) {
            console.log("Found conversation businessName:", conv.businessName);
            setBusinessName(conv.businessName || "");
            setError("");
          } else {
            console.warn("Conversation not found in conversations list");
            setBusinessName("");
          }
        } else {
          console.error("Error loading conversations:", res.error);
          setError("שגיאה בטעינת שם העסק");
        }
      }
    );
  }, [conversationId, userId]);

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
