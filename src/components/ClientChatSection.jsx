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

  const conversationType = "user-business";

  // 1. אתחול הסוקט בלבד
  useEffect(() => {
    if (!initialized || !userId || !businessId) return;
    if (socketRef.current) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

    const socket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token, role: "chat", businessId },
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setError("");
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
  }, [initialized, userId, businessId]);

  // 2. קבלת השיחה הקיימת או יצירת חדשה
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !userId) return;
    setLoading(true);

    socket.emit("getConversations", { userId }, (res) => {
      if (res.ok) {
        const existing = res.conversations.find(
          (c) => String(c.otherParty?.id) === String(businessId)
        );
        if (existing) {
          setConversationId(existing.conversationId);
          setOtherPartyName(existing.otherParty?.name || "");
          setLoading(false);
        } else {
          socket.emit(
            "startConversation",
            { otherUserId: businessId },
            (res2) => {
              if (res2.ok) {
                setConversationId(res2.conversationId);
              } else {
                setError(
                  "שגיאה ביצירת השיחה: " + (res2.error || "לא ידוע")
                );
              }
              setLoading(false);
            }
          );
        }
      } else {
        setError("שגיאה בשליפת השיחות: " + (res.error || "לא ידוע"));
        setLoading(false);
      }
    });
  }, [userId, businessId]);

  // 3. ברגע שיש conversationId – משיכת היסטוריה והצטרפות לחדר
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) return;

    setMessages([]);
    setLoading(true);

    // הפסקת מאזינים קיימים (למניעת כפילויות)
    socket.off("newMessage");
    socket.off("newAiSuggestion");
    socket.off("messageApproved");

    // משיכת היסטוריה
    socket.emit(
      "getHistory",
      { conversationId, conversationType, limit: 50 },
      (res) => {
        if (res.ok) {
          setMessages(Array.isArray(res.messages) ? res.messages : []);
          setError("");
        } else {
          setMessages([]);
          setError("שגיאה בטעינת ההודעות: " + (res.error || "לא ידוע"));
        }
        setLoading(false);
      }
    );

    // הצטרפות לחדר השיחה
    socket.emit("joinConversation", conversationId);

    // מאזינים להודעות בזמן אמת
    socket.on("newMessage", (msg) => {
      setMessages((prev) => {
        const idx = prev.findIndex(
          (m) => m._id === msg._id || m.tempId === msg.tempId
        );
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], ...msg };
          return copy;
        }
        return [...prev, msg];
      });
    });
    socket.on("newAiSuggestion", (msg) => {
      if (msg.status !== "pending") {
        socket.emit("newMessage", msg);
      }
    });
    socket.on("messageApproved", (msg) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === msg._id ||
          (m.isRecommendation && m.recommendationId === msg.recommendationId)
            ? { ...m, ...msg, status: "approved" }
            : m
        )
      );
    });

    return () => {
      socket.off("newMessage");
      socket.off("newAiSuggestion");
      socket.off("messageApproved");
      socket.emit("leaveConversation", conversationId);
    };
  }, [conversationId]);

  if (loading) return <div className={styles.loading}>טוען…</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.whatsappBg} dir="rtl">
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          <h3 className={styles.sidebarTitle}>שיחה עם העסק</h3>
          <div className={styles.convItemActive}>
            {otherPartyName || businessId}
          </div>
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
            <div className={styles.emptyMessage}>
              לא הצלחנו לפתוח שיחה…
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
