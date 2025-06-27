import React, { useState, useEffect, useRef } from "react";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import API from "../api";

export default function ClientChatSection() {
  const { user, initialized } = useAuth();
  const userId = user?.userId || null;
  const businessId = user?.businessId || null;

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);

  const socketRef = useRef(null);

  const conversationType = "user-business";

  useEffect(() => {
    if (!initialized || !userId) return;

    setLoading(true);
    setError("");

    const fetchConversations = async () => {
      try {
        let response;

        if (businessId) {
          // משתמש הוא עסק - טוען שיחות עם לקוחות
          response = await API.get("/messages/client-conversations");
        } else {
          // משתמש הוא לקוח - טוען שיחות עם עסקים
          response = await API.get("/messages/user-conversations");
        }

        const data = response.data;

        if (data.conversations && data.conversations.length > 0) {
          setConversations(data.conversations);
          setSelectedConversation(data.conversations[0]);
        } else {
          // אין שיחות קיימות - יצירת שיחה ראשונית רק ללקוח
          if (!businessId) {
            if (!user.businessToChatWith) {
              setError("יש לבחור עסק להתחלת שיחה");
              setConversations([]);
              setSelectedConversation(null);
              setLoading(false);
              return;
            }

            try {
              const res = await API.post("/messages/send", {
                to: user.businessToChatWith,
                content: "שלום, מתחילים שיחה חדשה",
              });

              const newMessage = res.data.message;
              const newConv = {
                conversationId: newMessage.conversationId,
                businessId: newMessage.toId,
                clientName: user.name || "לקוח",
                businessName: "העסק שלי",
                lastMessage: newMessage,
                unreadCount: 0,
              };

              setConversations([newConv]);
              setSelectedConversation(newConv);
            } catch (err) {
              setError("שגיאה ביצירת שיחה ראשונית: " + (err.message || "לא ידוע"));
              setConversations([]);
              setSelectedConversation(null);
            }
          } else {
            // משתמש עסקי ואין שיחות
            setConversations([]);
            setSelectedConversation(null);
          }
        }
      } catch (err) {
        setError("שגיאה בטעינת השיחות: " + (err.message || "לא ידוע"));
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [initialized, userId, businessId, user]);

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
