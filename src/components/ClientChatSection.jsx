import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import BizuplyLoader from "./ui/BizuplyLoader";

export default function ClientChatSection() {
  const { businessId: businessIdFromParams, clientId, threadId } = useParams();
  const { user, initialized } = useAuth();
  const userId = user?.userId || null;

  const [conversationId, setConversationId] = useState(threadId || null);
  const [businessName, setBusinessName] = useState("");
  const [businessId, setBusinessId] = useState(businessIdFromParams || null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const socketRef = useRef(null);

  /* ===========================================================
     1) SOCKET INITIALIZATION (one time only)
  ============================================================ */
  useEffect(() => {
    if (!initialized || !userId) return;
    if (socketRef.current) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

    console.log("🌐 Connecting to socket:", socketUrl);

    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token },
      withCredentials: true,
      autoConnect: true,
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected:", socketRef.current.id);
      setError("");
    });

    socketRef.current.on("disconnect", (reason) => {
      console.warn("⚠️ Disconnected:", reason);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Socket error:", err);
      setError("Error connecting to chat: " + err.message);
    });

    return () => {
      console.log("🔌 Disconnect socket");
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [initialized, userId]);

  /* ===========================================================
     2) OPEN EXISTING OR CREATE NEW CONVERSATION
  ============================================================ */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !initialized || !userId || !businessId) return;

    setLoading(true);

    // EXISTING conversation
    if (conversationId) {
      console.log("💬 Joining existing conversation:", conversationId);

      socket.emit("joinRoom", conversationId, (res) => {
        console.log("📌 Joined room:", conversationId);
        setLoading(false);
      });

      return;
    }

    // NEW conversation
    console.log("🆕 Creating new conversation...");

    socket.emit(
      "startConversation",
      { otherUserId: businessId, isBusinessToBusiness: false },
      (res) => {
        if (res?.ok) {
          console.log("🎉 Conversation created:", res.conversationId);
          setConversationId(res.conversationId);

          socket.emit("joinRoom", res.conversationId, (joinRes) => {
            console.log("📌 Joined new room:", res.conversationId);
          });
        } else {
          console.error("❌ Failed to create conversation:", res?.error);
          setError("Unable to open chat with this business.");
        }

        setLoading(false);
      }
    );
  }, [initialized, userId, businessId, conversationId]);

  /* ===========================================================
     3) LOAD HISTORY + LISTEN FOR REAL-TIME MESSAGES
  ============================================================ */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) return;

    console.log("📜 Fetching message history:", conversationId);
    setLoading(true);

    socket.emit("getHistory", { conversationId }, (res) => {
      if (res.ok) {
        console.log(`📥 Loaded ${res.messages.length} messages`);
        setMessages(Array.isArray(res.messages) ? res.messages : []);
      } else {
        console.error("❌ Error loading history:", res.error);
        setMessages([]);
        setError("Error loading messages.");
      }
      setLoading(false);
    });

    /* ---- REAL-TIME INCOMING MESSAGES ---- */
    const handleNewMessage = (msg) => {
      console.log("💬 New message:", msg);

      setMessages((prev) => {
        const exists = prev.some(
          (m) =>
            (m._id && msg._id && m._id === msg._id) ||
            (m.tempId && msg.tempId && m.tempId === msg.tempId)
        );
        if (exists) {
          console.log("⏩ Duplicate skipped");
          return prev;
        }
        return [...prev, msg];
      });
    };

    socket.on("newMessage", handleNewMessage);

    // Cleanup listener
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId]);

  /* ===========================================================
     4) LOAD BUSINESS NAME
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
          data?.business?.businessName || data?.businessName || "Business";
        setBusinessName(name);
      })
      .catch(() => setBusinessName("Unknown"));
  }, [businessId, businessName]);

  /* ===========================================================
     5) UI STATES
  ============================================================ */
  if (loading)
    return <BizuplyLoader fullScreen label="Loading the conversation..." />;

  if (error)
    return (
      <div className={styles.errorWrapper}>
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Refresh
        </button>
      </div>
    );

  /* ===========================================================
     6) RENDER CHAT UI
  ============================================================ */
  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          <h3 className={styles.sidebarTitle}>Chat with the business</h3>
          <div className={styles.convItemActive}>
            {businessName || "Business"}
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
