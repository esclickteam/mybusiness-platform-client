import React, { useState, useEffect, useRef } from "react";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import API from "../api"; // הנחה: מודול API מוגדר מראש, למשל axios

export default function ClientChatSection() {
  const { user, initialized } = useAuth();
  const userId = user?.userId || null;

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);

  const socketRef = useRef(null);

  const conversationType = "user-business";

  // מצב לפתיחת שיחה חדשה
  const [creatingNewChat, setCreatingNewChat] = useState(false);
  const [newChatTarget, setNewChatTarget] = useState("");
  const [creatingLoading, setCreatingLoading] = useState(false);

  // 1. טעינת שיחות קיימות
  useEffect(() => {
    if (!initialized || !userId) return;

    setLoading(true);
    setError("");

    API.get("/messages/user-conversations")
      .then(({ data }) => {
        if (data.conversations && Array.isArray(data.conversations) && data.conversations.length > 0) {
          setConversations(data.conversations);
          setSelectedConversation(data.conversations[0]);
        } else {
          setConversations([]);
          setSelectedConversation(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("שגיאה בטעינת השיחות: " + (err.message || "לא ידוע"));
        setLoading(false);
      });
  }, [initialized, userId]);

  // 2. חיבור וטיול Socket כשנבחרת שיחה
  useEffect(() => {
    if (!selectedConversation || !userId) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

    if (socketRef.current) {
      socketRef.current.emit("leaveConversation", selectedConversation.conversationId, conversationType === "business-business");
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token, role: "chat" },
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setError("");
      socket.emit("joinConversation", selectedConversation.conversationId, conversationType === "business-business", (ack) => {
        if (!ack.ok) {
          setError("כשל בהצטרפות לחדר השיחה: " + (ack.error || ""));
        }
      });
    });

    socket.on("disconnect", (reason) => {
      if (reason !== "io client disconnect") {
        setError("Socket ניתק באופן בלתי צפוי: " + reason);
      }
    });

    socket.on("connect_error", (err) => {
      setError("שגיאה בחיבור לסוקט: " + err.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveConversation", selectedConversation.conversationId, conversationType === "business-business");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [selectedConversation, userId]);

  // 3. טעינת היסטוריית הודעות והאזנה בזמן אמת
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !selectedConversation) return;

    setMessages([]);
    setLoading(true);

    socket.off("newMessage");
    socket.off("newAiSuggestion");
    socket.off("messageApproved");

    socket.emit(
      "getHistory",
      { conversationId: selectedConversation.conversationId, conversationType, limit: 50 },
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

    socket.on("newMessage", (msg) => {
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m._id === msg._id || m.tempId === msg.tempId);
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
          m._id === msg._id || (m.isRecommendation && m.recommendationId === msg.recommendationId)
            ? { ...m, ...msg, status: "approved" }
            : m
        )
      );
    });

    return () => {
      socket.off("newMessage");
      socket.off("newAiSuggestion");
      socket.off("messageApproved");
    };
  }, [selectedConversation, conversationType]);

  // 4. יצירת שיחה חדשה ושליחת הודעה ראשונית
  const handleCreateNewChat = async () => {
    if (!newChatTarget.trim()) {
      alert("אנא הזן מזהה לקוח או עסק לפתיחת שיחה חדשה");
      return;
    }

    try {
      setCreatingLoading(true);

      // קריאה ל-API ללא conversationId
      const response = await API.post("/messages/send", {
        to: newChatTarget.trim(),
        content: "הודעה ראשונית",
      });

      const newMessage = response.data.message;
      const newConversationId = newMessage.conversationId;

      const newConv = {
        conversationId: newConversationId,
        businessId: newMessage.toId,
        clientName: "לקוח חדש", // מומלץ לקבל מהשרת או לממש UI לבחירת שם
        businessName: "עסק חדש", // גם כאן
        lastMessage: newMessage,
        unreadCount: 0,
      };

      setConversations((prev) => [newConv, ...prev]);
      setSelectedConversation(newConv);
      setCreatingNewChat(false);
      setNewChatTarget("");
    } catch (e) {
      alert("שגיאה ביצירת שיחה חדשה: " + (e.response?.data?.error || e.message || "לא ידוע"));
    } finally {
      setCreatingLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>טוען שיחות והודעות...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.whatsappBg} dir="rtl">
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          <h3 className={styles.sidebarTitle}>השיחות שלי</h3>
          <button onClick={() => setCreatingNewChat(true)}>+ שיחה חדשה</button>

          {creatingNewChat && (
            <div className={styles.newChatForm}>
              <input
                type="text"
                placeholder="הכנס מזהה לקוח או עסק"
                value={newChatTarget}
                onChange={(e) => setNewChatTarget(e.target.value)}
                disabled={creatingLoading}
              />
              <button onClick={handleCreateNewChat} disabled={creatingLoading}>
                {creatingLoading ? "יוצר..." : "פתח שיחה"}
              </button>
              <button onClick={() => setCreatingNewChat(false)} disabled={creatingLoading}>
                ביטול
              </button>
            </div>
          )}

          <div className={styles.conversationList}>
            {conversations.length === 0 && <div>אין שיחות זמינות</div>}
            {conversations.map((conv) => (
              <div
                key={conv.conversationId}
                className={
                  selectedConversation?.conversationId === conv.conversationId
                    ? styles.convItemActive
                    : styles.convItem
                }
                onClick={() => {
                  setSelectedConversation(conv);
                  setMessages([]);
                }}
              >
                {conv.businessName || conv.clientName || "עסק לא מזוהה"}
                {conv.unreadCount > 0 && (
                  <span className={styles.unreadCount}>{conv.unreadCount}</span>
                )}
              </div>
            ))}
          </div>
        </aside>

        <section className={styles.chatArea}>
          {selectedConversation ? (
            <ClientChatTab
              socket={socketRef.current}
              conversationId={selectedConversation.conversationId}
              businessId={selectedConversation.businessId}
              userId={userId}
              messages={messages}
              setMessages={setMessages}
              conversationType={conversationType}
            />
          ) : (
            <div className={styles.emptyMessage}>בחר שיחה כדי להתחיל שיחה</div>
          )}
        </section>
      </div>
    </div>
  );
}
