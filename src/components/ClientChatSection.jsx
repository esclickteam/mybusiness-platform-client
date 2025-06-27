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
  const [otherPartyName, setOtherPartyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  // conversationType - לפי ההקשר שלנו זה תמיד user-business (אם צריך לשנות, לשנות כאן)
  const conversationType = "user-business";

  // 1. אתחול הסוקט וחיבור לאירועים כלליים
  useEffect(() => {
    if (!initialized || !userId || !businessId) return;
    if (socketRef.current) return; // כבר אתחלנו

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

    const socket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token, role: "chat", businessId },
      withCredentials: true,
      autoConnect: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setError("");
      if (conversationId) {
        socket.emit(
          "getHistory",
          { conversationId, conversationType, limit: 50 },
          handleHistory
        );
        socket.emit("joinConversation", conversationId, conversationType === "business-business");
        socket.emit("joinRoom", businessId);
      }
    });

    socket.on("disconnect", (reason) => {
      if (reason !== "io client disconnect") {
        setError("Socket disconnected unexpectedly: " + reason);
      }
    });

    socket.on("connect_error", (err) => {
      setError("שגיאה בחיבור לסוקט: " + err.message);
    });

    return () => {
      socket.off();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [initialized, userId, businessId, conversationId]);

  // 2. מציאת שיחה קיימת או פתיחת שיחה חדשה
  useEffect(() => {
    if (!socketRef.current || !userId) return;

    setLoading(true);
    socketRef.current.emit(
      "getConversations",
      { userId },
      (res) => {
        if (res.ok) {
          const existing = res.conversations.find(
            (c) =>
              c.otherParty?.id === businessId ||
              String(c.otherParty?.id) === String(businessId)
          );
          if (existing) {
            setConversationId(existing.conversationId);
            setOtherPartyName(existing.otherParty?.name || "");
            setError("");
            setLoading(false);
          } else {
            socketRef.current.emit(
              "startConversation",
              { otherUserId: businessId },
              (res2) => {
                if (res2.ok) {
                  setConversationId(res2.conversationId);
                  setError("");
                } else {
                  setError("שגיאה ביצירת השיחה: " + (res2.error || "לא ידוע"));
                }
                setLoading(false);
              }
            );
          }
        } else {
          setError("שגיאה בשליפת השיחות: " + (res.error || "לא ידוע"));
          setLoading(false);
        }
      }
    );
  }, [userId, businessId]);

  // 3. הפונקציה לטיפול בתגובה מהיסטוריית הודעות
  const handleHistory = (res) => {
    if (res.ok) {
      setMessages(Array.isArray(res.messages) ? res.messages : []);
      setError("");
    } else {
      setMessages([]);
      setError("שגיאה בטעינת ההודעות: " + (res.error || "לא ידוע"));
    }
    setLoading(false);
  };

  // 4. מאזינים להודעות בזמן אמת אחרי שהשיחה נבחרה
  useEffect(() => {
    if (!socketRef.current || !conversationId) return;

    // אפס התצוגה והטענת ההיסטוריה
    setMessages([]);
    setLoading(true);
    socketRef.current.emit("getHistory", { conversationId, conversationType, limit: 50 }, handleHistory);

    // הצטרפות לחדר ולעקוב אחרי הודעות
    socketRef.current.emit("joinConversation", conversationId, conversationType === "business-business");
    socketRef.current.emit("joinRoom", businessId);

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        const idx = prev.findIndex(
          (m) => m._id === msg._id || m.tempId === msg.tempId
        );
        if (idx !== -1) {
          const newArr = [...prev];
          newArr[idx] = { ...newArr[idx], ...msg };
          return newArr;
        }
        return [...prev, msg];
      });
    };

    const handleApproved = (msg) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === msg._id ||
          (m.isRecommendation && m.recommendationId === msg.recommendationId)
            ? { ...m, ...msg, status: "approved" }
            : m
        )
      );
    };

    socketRef.current.on("newMessage", handleNewMessage);
    socketRef.current.on("newAiSuggestion", (msg) => msg.status !== "pending" && handleNewMessage(msg));
    socketRef.current.on("messageApproved", handleApproved);

    return () => {
      socketRef.current.off("newMessage", handleNewMessage);
      socketRef.current.off("newAiSuggestion", handleNewMessage);
      socketRef.current.off("messageApproved", handleApproved);
      socketRef.current.emit("leaveConversation", conversationId, conversationType === "business-business");
    };
  }, [conversationId, businessId]);

  if (loading) return <div className={styles.loading}>טוען…</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.whatsappBg} dir="rtl">
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          <h3 className={styles.sidebarTitle}>שיחה עם העסק</h3>
          <div className={styles.convItemActive}>{otherPartyName || businessId}</div>
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
              conversationType={conversationType}
            />
          ) : (
            <div className={styles.emptyMessage}>לא הצלחנו לפתוח שיחה…</div>
          )}
        </section>
      </div>
    </div>
  );
}
