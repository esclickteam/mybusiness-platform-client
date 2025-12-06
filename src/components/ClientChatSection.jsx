import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import createSocket from "../socket"; // ✅ שימוש ב־createSocket שלך

export default function ClientChatSection() {
  const { businessId: businessIdFromParams, clientId, threadId } = useParams();
  const { user, initialized, getValidAccessToken, logout } = useAuth();
  const userId = user?.userId || null;

  const [conversationId, setConversationId] = useState(threadId || null);
  const [businessName, setBusinessName] = useState("");
  const [businessId, setBusinessId] = useState(businessIdFromParams || null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const socketRef = useRef(null);

  /* ===========================================================
     1️⃣ יצירת חיבור Socket יחיד עם בדיקות בטוחות
  ============================================================ */
  useEffect(() => {
    if (!initialized || !userId || socketRef.current) return;

    (async () => {
      try {
        // ✅ ודא שהפונקציות קיימות, אחרת ספק גרסאות דיפולטיביות
        const tokenGetter =
          typeof getValidAccessToken === "function"
            ? getValidAccessToken
            : async () => localStorage.getItem("token");

        const logoutHandler = typeof logout === "function" ? logout : () => {};

        const socket = await createSocket(tokenGetter, logoutHandler, businessId);
        socketRef.current = socket;
        console.log("✅ Connected to global socket:", socket?.id);
      } catch (err) {
        console.error("❌ Error initializing socket:", err);
        setError("Unable to connect to chat server.");
      }
    })();

    return () => {
      console.log("🔌 Disconnecting socket...");
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [initialized, userId, businessId]);

  /* ===========================================================
     2️⃣ יצירת שיחה חדשה או הצטרפות לשיחה קיימת
  ============================================================ */
  useEffect(() => {
    const socket = socketRef.current;
    if (!initialized || !userId || !businessId || !socket) return;

    setLoading(true);
    setError("");

    if (conversationId) {
      socket.emit(
        "joinConversation",
        "user-business",
        conversationId,
        false,
        (res) => {
          if (res?.ok) {
            console.log("💬 Joined existing conversation:", conversationId);
          } else {
            console.warn("⚠️ Failed to join room:", res?.error);
          }
          setLoading(false);
        }
      );
      return;
    }

    console.log("🆕 Creating new conversation...");
    socket.emit(
      "startConversation",
      { otherUserId: businessId, isBusinessToBusiness: false },
      (res) => {
        if (res?.ok) {
          setConversationId(res.conversationId);
          console.log("✅ New conversation created:", res.conversationId);
          socket.emit(
            "joinConversation",
            "user-business",
            res.conversationId,
            false
          );
        } else {
          console.error("❌ Failed to create conversation:", res?.error);
          setError("Unable to create conversation.");
        }
        setLoading(false);
      }
    );
  }, [initialized, userId, businessId, conversationId]);

  /* ===========================================================
     3️⃣ טעינת היסטוריית הודעות והאזנה בזמן אמת
  ============================================================ */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) return;

    console.log("📜 Loading message history for:", conversationId);
    setLoading(true);

    socket.emit("getHistory", { conversationId }, (res) => {
      if (res.ok) {
        console.log(`✅ Loaded ${res.messages.length} messages`);
        setMessages(Array.isArray(res.messages) ? res.messages : []);
      } else {
        console.error("❌ Error loading messages:", res.error);
        setError("Error loading messages.");
      }
      setLoading(false);
    });

    const handleNewMessage = (msg) => {
      console.log("📩 New message received:", msg);
      setMessages((prev) => {
        const exists = prev.some(
          (m) =>
            (m._id && msg._id && m._id === msg._id) ||
            (m.tempId && msg.tempId && m.tempId === msg.tempId)
        );
        if (exists) {
          console.log("⏩ Duplicate message skipped:", msg.text);
          return prev;
        }
        return [...prev, msg];
      });
    };

    socket.off("newMessage", handleNewMessage);
    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [conversationId]);

  /* ===========================================================
     4️⃣ טעינת שם העסק
  ============================================================ */
  useEffect(() => {
    if (!businessId || businessName) return;

    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");
    const token = localStorage.getItem("token");

    fetch(`${baseUrl}/api/business/${businessId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const name =
          data?.business?.businessName || data?.businessName || "Unnamed business";
        setBusinessName(name);
      })
      .catch((err) => {
        console.error("Error fetching business name:", err);
        setBusinessName("Unknown business");
      });
  }, [businessId, businessName]);

  /* ===========================================================
     5️⃣ מצבי טעינה / שגיאה
  ============================================================ */
  if (loading)
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Loading the conversation...</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.errorWrapper}>
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg mt-3 hover:bg-purple-700 transition"
        >
          Refresh
        </button>
      </div>
    );

  /* ===========================================================
     6️⃣ ממשק צ'אט
  ============================================================ */
  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          <h3 className={styles.sidebarTitle}>Chat with the business</h3>
          <div className={styles.convItemActive}>
            {businessName || "Unknown business"}
          </div>
        </aside>

        <section className={styles.chatArea}>
          <ClientChatTab
            socket={socketRef.current}
            conversationId={conversationId}
            setConversationId={setConversationId}
            businessId={businessId}
            userId={userId}
            messages={messages}
            setMessages={setMessages}
          />
        </section>
      </div>
    </div>
  );
}
