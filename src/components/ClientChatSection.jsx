import React, { useState, useEffect, useRef } from "react";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import API from "../api"; // הנחה: מודול API מוגדר מראש, למשל axios

export default function ClientChatSection() {
  // קבלת פרטי המשתמש
  const { user, initialized } = useAuth();
  const userId = user?.userId || null;

  // רשימת שיחות שהמשתמש מעורב בהן
  const [conversations, setConversations] = useState([]);
  // השיחה שנבחרה כרגע
  const [selectedConversation, setSelectedConversation] = useState(null);
  // סטטוס טעינה
  const [loading, setLoading] = useState(true);
  // הודעות שגיאה
  const [error, setError] = useState("");
  // הודעות השיחה הנוכחית
  const [messages, setMessages] = useState([]);

  // שמירת מופע הסוקט
  const socketRef = useRef(null);

  // סוג השיחה (ניתן לשנות לפי צורך)
  const conversationType = "user-business";

  // ---------------------------------
  // 1. טעינת רשימת השיחות מהשרת דרך API
  // ---------------------------------
  useEffect(() => {
    if (!initialized || !userId) return; // מחכים לאתחול ולאחזור מזהה משתמש

    setLoading(true);   // מצביע על טעינה
    setError("");       // איפוס שגיאות

    // קריאה לנקודת הקצה לצורך קבלת שיחות
    API.get("/messages/user-conversations")
      .then(({ data }) => {
        if (data.conversations && Array.isArray(data.conversations) && data.conversations.length > 0) {
          setConversations(data.conversations);
          setSelectedConversation(data.conversations[0]);  // בוחרים אוטומטית שיחה ראשונה
        } else {
          // אין שיחות
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

  // ---------------------------------
  // 2. אתחול WebSocket כשהמשתמש בוחר שיחה חדשה
  // ---------------------------------
  useEffect(() => {
    // אין שיחה נבחרת? לא עושים כלום
    if (!selectedConversation || !userId) return;

    // URL לשרת ה־Socket.IO
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    // Token לאימות
    const token = localStorage.getItem("token");

    // ניקוי סוקט קודם (אם יש) כדי למנוע חיבורים כפולים
    if (socketRef.current) {
      socketRef.current.emit(
        "leaveConversation",
        selectedConversation.conversationId,
        conversationType === "business-business"
      );
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // יצירת חיבור חדש לסוקט
    const socket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token, role: "chat" },
      withCredentials: true,
    });
    socketRef.current = socket;

    // טיפול בהתחברות
    socket.on("connect", () => {
      setError("");
      // הצטרפות לחדר השיחה עם פרמטר המגדיר האם זו שיחה בין עסקים
      socket.emit(
        "joinConversation",
        selectedConversation.conversationId,
        conversationType === "business-business",
        (ack) => {
          if (!ack.ok) {
            setError("כשל בהצטרפות לחדר השיחה: " + (ack.error || ""));
          }
        }
      );
    });

    // טיפול בניתוק
    socket.on("disconnect", (reason) => {
      if (reason !== "io client disconnect") {
        setError("Socket ניתק באופן בלתי צפוי: " + reason);
      }
    });

    // טיפול בשגיאת חיבור
    socket.on("connect_error", (err) => {
      setError("שגיאה בחיבור לסוקט: " + err.message);
    });

    // ניקוי בעת פירוק הקומפוננטה או שינוי שיחה
    return () => {
      if (socketRef.current) {
        socketRef.current.emit(
          "leaveConversation",
          selectedConversation.conversationId,
          conversationType === "business-business"
        );
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [selectedConversation, userId]);

  // ---------------------------------
  // 3. טיפול בטעינת היסטוריית ההודעות וקבלת הודעות בזמן אמת
  // ---------------------------------
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !selectedConversation) return;

    setMessages([]);
    setLoading(true);

    // ניקוי מאזינים ישנים
    socket.off("newMessage");
    socket.off("newAiSuggestion");
    socket.off("messageApproved");

    // טעינת היסטוריית ההודעות מהשרת דרך Socket.IO
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

    // מאזין לקבלת הודעות חדשות בזמן אמת
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

    // מאזין לקבלת המלצות AI
    socket.on("newAiSuggestion", (msg) => {
      if (msg.status !== "pending") {
        socket.emit("newMessage", msg);
      }
    });

    // מאזין לעדכון סטטוס הודעות שאושרו
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

    // ניקוי מאזינים בזמן פירוק
    return () => {
      socket.off("newMessage");
      socket.off("newAiSuggestion");
      socket.off("messageApproved");
    };
  }, [selectedConversation, conversationType]);

  // ---------------------------------
  // 4. הצגה בהתאם למצב הטעינה והחיבור
  // ---------------------------------
  if (loading) {
    return <div className={styles.loading}>טוען שיחות והודעות...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.whatsappBg} dir="rtl">
      <div className={styles.chatContainer}>
        {/* סיידבר עם רשימת שיחות */}
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
                  setMessages([]); // ניקוי הודעות כשמשנים שיחה
                }}
              >
                {/* הצגת שם העסק או הלקוח */}
                {conv.businessName || conv.clientName || "עסק לא מזוהה"}

                {/* ספירת הודעות שלא נקראו */}
                {conv.unreadCount > 0 && (
                  <span className={styles.unreadCount}>
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* אזור הצגת הודעות */}
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
