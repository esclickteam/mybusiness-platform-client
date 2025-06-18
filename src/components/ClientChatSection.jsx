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
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  // יצירת socket פעם אחת בלבד
  useEffect(() => {
    if (!initialized || !userId || !businessId) return;
    if (socketRef.current) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token, role: "chat", businessId },
      withCredentials: true,
      autoConnect: true,
    });

    socketRef.current.on("connect", () => {
      setError("");
      if (conversationId) {
        socketRef.current.emit(
          "getConversations",
          { userId },
          (res) => {
            if (res.ok) {
              const conv = res.conversations.find((c) =>
                [c.conversationId, c._id, c.id].map(String).includes(String(conversationId))
              );
              if (conv) {
                setBusinessName(conv.businessName || "");
                setError("");
              } else {
                setBusinessName("");
              }
            } else {
              setError("שגיאה בטעינת שם העסק");
            }
          }
        );
      }
    });

    socketRef.current.on("disconnect", (reason) => {
      if (reason !== "io client disconnect") {
        setError("Socket disconnected unexpectedly: " + reason);
      }
    });

    socketRef.current.on("connect_error", (err) => {
      setError("שגיאה בחיבור לסוקט: " + err.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initialized, userId, businessId, conversationId]);

  // פתיחת שיחה חדשה עם העסק
  useEffect(() => {
    if (!socketRef.current || !businessId) return;

    setLoading(true);
    socketRef.current.emit(
      "startConversation",
      { otherUserId: businessId },
      (res) => {
        if (res.ok) {
          setConversationId(res.conversationId);
          setError("");
        } else {
          setError("שגיאה ביצירת השיחה: " + (res.error || "לא ידוע"));
        }
        setLoading(false);
      }
    );
  }, [businessId]);

  // טעינת היסטוריית הודעות כאשר יש conversationId ו-socket מחובר
  useEffect(() => {
    if (!socketRef.current || !socketRef.current.connected || !conversationId) {
      setMessages([]);
      return;
    }

    // בקשת ההיסטוריה הראשונית (כולל המלצות)
    socketRef.current.emit("getHistory", { conversationId }, (res) => {
      if (res.ok) {
        setMessages(res.messages || []);
        setError("");
      } else {
        setMessages([]);
        setError("שגיאה בטעינת ההודעות: " + (res.error || "לא ידוע"));
      }
    });

    // מאזינים לאירועים בזמן אמת לעדכון ההודעות וההמלצות
    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        // מניעת כפילויות: אם כבר קיימת הודעה עם אותו מזהה - עדכון
        const existsIdx = prev.findIndex((m) => {
          if (m.isRecommendation && msg.isRecommendation) {
            return m.recommendationId === msg.recommendationId;
          }
          if (!m.isRecommendation && !msg.isRecommendation) {
            return m._id === msg._id || m.tempId === msg.tempId;
          }
          return false;
        });
        if (existsIdx !== -1) {
          const newMessages = [...prev];
          newMessages[existsIdx] = { ...newMessages[existsIdx], ...msg };
          return newMessages;
        }
        return [...prev, msg];
      });
    };

    socketRef.current.on("newMessage", handleNewMessage);
    socketRef.current.on("newAiSuggestion", (msg) => {
      if (msg.status !== "pending") {
        handleNewMessage(msg);
      }
    });

    // ניקוי מאזינים בקומפוננטה יוצאת
    return () => {
      if (socketRef.current) {
        socketRef.current.off("newMessage", handleNewMessage);
        socketRef.current.off("newAiSuggestion", handleNewMessage);
      }
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
