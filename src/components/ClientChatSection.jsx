import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import createSocket from "../socket";
import API from "../api";

export default function ClientChatSection() {
  const { businessId } = useParams();
  const { user, initialized, refreshAccessToken, logout } = useAuth();
  const userId = user?.userId || user?.id || null;

  const [conversationId, setConversationId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const socketRef = useRef(null);
  const prevConversationIdRef = useRef(null);

  useEffect(() => {
    if (!initialized || !userId || !businessId) return;

    (async () => {
      console.log("Refreshing access token...");
      const token = await refreshAccessToken();
      if (!token) {
        setError("אין טוקן תקין, אנא התחבר מחדש");
        logout();
        console.error("No valid token, user logged out.");
        return;
      }

      console.log("Creating socket connection...");
      const sock = await createSocket(refreshAccessToken, logout, businessId);
      if (!sock) {
        setError("חיבור לסוקט נכשל");
        console.error("Socket connection failed.");
        return;
      }

      socketRef.current = sock;
      console.log("Socket connected:", sock.id);

      sock.on("connect_error", (err) => {
        setError("שגיאה בחיבור לסוקט: " + err.message);
        console.error("WebSocket connection error:", err);
      });

      sock.on("tokenExpired", async () => {
        console.log("Token expired, refreshing...");
        const newToken = await refreshAccessToken();
        if (!newToken) {
          logout();
          console.error("Token expired and could not be refreshed, user logged out.");
          return;
        }
        sock.auth.token = newToken;
        sock.disconnect();
        sock.connect();
      });

      sock.on("disconnect", (reason) => {
        console.warn("Socket disconnected:", reason);
      });
    })();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      prevConversationIdRef.current = null;
    };
  }, [initialized, userId, businessId, refreshAccessToken, logout]);

  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !businessId) return;

    const tryEmit = () => {
      setLoading(true);
      setError("");
      console.log("Attempting to start conversation with businessId:", businessId);

      sock.emit("startConversation", { otherUserId: businessId }, (res) => {
        if (res?.ok) {
          setConversationId(res.conversationId);
          setError("");
          console.log("Conversation started successfully, ID:", res.conversationId);
        } else {
          setError("שגיאה ביצירת השיחה: " + (res.error || "לא ידוע"));
          setConversationId(null);
          console.error("Failed to start conversation:", res.error || "Unknown error");
        }
        setLoading(false);
      });
    };

    if (sock.connected) {
      tryEmit();
    } else {
      sock.once("connect", tryEmit);
    }

    return () => {
      sock.off("connect", tryEmit);
    };
  }, [businessId]);

  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !conversationId || !userId) return;

    setLoading(true);
    console.log("Fetching conversation details for conversationId:", conversationId);

    API.get("/conversations", { params: { userId } })
      .then((response) => {
        console.log("Conversations loaded:", response.data); // לוג תגובה
        const conv = response.data.find((c) =>
          [c.conversationId, c._id, c.id].map(String).includes(String(conversationId))
        );
        if (conv) {
          setBusinessName(conv.businessName || "");
          setError("");
          console.log("Business name found:", conv.businessName);
        } else {
          setBusinessName("");
          setError("לא נמצאה שיחה מתאימה");
          console.error("Conversation not found for conversationId:", conversationId);
        }
      })
      .catch((err) => {
        setBusinessName("");
        setError("שגיאה בטעינת שם העסק");
        console.error("Error fetching conversation details:", err);
      })
      .finally(() => setLoading(false));
  }, [conversationId, userId]);

  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !conversationId) return;

    if (prevConversationIdRef.current && prevConversationIdRef.current !== conversationId) {
      sock.emit("leaveConversation", prevConversationIdRef.current);
      console.log("Left previous conversation:", prevConversationIdRef.current);
    }

    sock.emit("joinConversation", conversationId, (ack) => {
      if (!ack.ok) {
        setError("לא ניתן להצטרף לשיחה");
        console.error("Failed to join conversation:", ack.error);
        return;
      }
      setError("");
      console.log("Joined conversation:", conversationId);
    });

    // טעינת ההיסטוריה והצבת ההודעות בסטייט כאן
    sock.emit("getHistory", { conversationId }, (res) => {
      if (res.ok) {
        console.log("History messages loaded:", res.messages);
        setMessages(res.messages || []);
      } else {
        setError("שגיאה בטעינת ההודעות");
        setMessages([]);
        console.error("Failed to load message history:", res.error);
      }
    });

    prevConversationIdRef.current = conversationId;

    const handleNewMessage = (msg) => {
      console.log("New message received:", msg);
      setMessages((prev) => {
        const exists = prev.some(
          (m) => (m._id && msg._id && m._id === msg._id) ||
                 (m.tempId && msg.tempId && m.tempId === msg.tempId)
        );
        if (exists) return prev;
        return [...prev, msg];
      });
    };

    sock.on("newMessage", handleNewMessage);

    return () => {
      sock.emit("leaveConversation", conversationId);
      sock.off("newMessage", handleNewMessage);
    };
  }, [conversationId]);

  if (loading) return <div className={styles.loading}>טוען…</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          <h3 className={styles.sidebarTitle}>שיחה עם העסק</h3>
          <div className={styles.convItemActive}>{businessName || businessId}</div>
        </aside>
        <section className={styles.chatArea}>
          {conversationId ? (
            <ClientChatTab
              socket={socketRef.current}
              conversationId={conversationId}
              businessId={businessId}
              userId={userId}
              messages={messages}
              setMessages={setMessages}
            />
          ) : (
            <div className={styles.emptyMessage}>לא הצלחנו לפתוח שיחה…</div>
          )}
        </section>
      </div>
    </div>
  );
}
