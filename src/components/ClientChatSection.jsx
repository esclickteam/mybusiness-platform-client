import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

export default function ClientChatSection() {
  const { businessId: businessIdFromParams } = useParams();
  const { user, initialized } = useAuth();
  const userId = user?.userId || null;

  const [conversationId, setConversationId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [businessId, setBusinessId] = useState(businessIdFromParams || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  // יצירת socket פעם אחת בלבד
  useEffect(() => {
    if (!initialized || !userId) return;
    if (socketRef.current) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token, role: "chat" },
      withCredentials: true,
      autoConnect: true,
    });

    socketRef.current.on("connect", () => {
      setError("");
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
  }, [initialized, userId]);

  // טעינת שיחות המשתמש (user-conversations) ולקיחת שיחה ראשונה
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError("");

    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

    fetch(`${baseUrl}/api/messages/user-conversations`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.conversations && data.conversations.length > 0) {
          let conv = null;
          if (businessIdFromParams) {
            conv = data.conversations.find(
              (c) => String(c.businessId) === String(businessIdFromParams)
            );
          }
          if (!conv) conv = data.conversations[0];

          setConversationId(conv.conversationId);
          setBusinessName(conv.businessName);
          setBusinessId(conv.businessId);
          setError("");
        } else {
          // אין שיחות קיימות — נשאיר conversationId null
          setConversationId(null);
          setBusinessName("");
          setBusinessId(businessIdFromParams || null);
          setError(""); // לא להציג שגיאה
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user conversations:", err);
        setError("שגיאה בטעינת שיחות המשתמש");
        setLoading(false);
      });
  }, [userId, businessIdFromParams]);

  // טעינת היסטוריית הודעות והאזנות בזמן אמת
  useEffect(() => {
    if (!socketRef.current || !socketRef.current.connected || !conversationId) {
      setMessages([]);
      return;
    }

    setLoading(true);

    socketRef.current.emit("getHistory", { conversationId }, (res) => {
      if (res.ok) {
        setMessages(Array.isArray(res.messages) ? res.messages : []);
        setError("");
      } else {
        setMessages([]);
        setError("שגיאה בטעינת ההודעות: " + (res.error || "לא ידוע"));
      }
      setLoading(false);
    });

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
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

    const handleMessageApproved = (msg) => {
      setMessages((prev) => {
        const idx = prev.findIndex(
          (m) =>
            m._id === msg._id ||
            (m.isRecommendation && msg.recommendationId && m.recommendationId === msg.recommendationId)
        );
        if (idx !== -1) {
          const newMessages = [...prev];
          newMessages[idx] = { ...newMessages[idx], ...msg, status: "approved" };
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
    socketRef.current.on("messageApproved", handleMessageApproved);

    socketRef.current.emit("joinConversation", conversationId);
    if (businessId) {
      socketRef.current.emit("joinRoom", businessId);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("newMessage", handleNewMessage);
        socketRef.current.off("newAiSuggestion", handleNewMessage);
        socketRef.current.off("messageApproved", handleMessageApproved);
        socketRef.current.emit("leaveConversation", conversationId);
      }
    };
  }, [conversationId, businessId]);

  if (loading) return <div className={styles.loading}>טוען…</div>;

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          <h3 className={styles.sidebarTitle}>שיחה עם העסק</h3>
          <div className={styles.convItemActive}>{businessName || businessId || "עסק לא ידוע"}</div>
        </aside>
        <section className={styles.chatArea}>
          {/* תמיד מציגים ClientChatTab גם כשאין conversationId */}
          <ClientChatTab
            socket={socketRef.current}
            conversationId={conversationId} // יכול להיות null
            businessId={businessId}
            userId={userId}
            messages={messages}
            setMessages={setMessages}
            setConversationId={setConversationId} // מוסיפים כדי לעדכן conversationId ביצירת שיחה חדשה
          />
        </section>
      </div>
    </div>
  );
}
