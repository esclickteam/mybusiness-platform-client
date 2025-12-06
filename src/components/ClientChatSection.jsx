import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

export default function ClientChatSection() {
  const { businessId: businessIdFromParams, clientId, threadId } = useParams();
  const { user, initialized } = useAuth();
  const userId = user?.userId || null;

  const [conversationId, setConversationId] = useState(threadId || null);
  const [businessName, setBusinessName] = useState("");
  const [businessId, setBusinessId] = useState(businessIdFromParams || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);

  const socketRef = useRef(null);

  const safeSetBusinessId = (newId) => setBusinessId((prev) => newId ?? prev);

  /* ============================================================
      INIT SOCKET (once)
  ============================================================ */
  useEffect(() => {
    if (!initialized || !userId) return;

    if (socketRef.current && socketRef.current.connected) {
      console.log("⚠️ Socket already active — skipping init");
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

    console.log("🔌 INIT SOCKET →", socketUrl);

    const s = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token, role: "chat" },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 500,
    });

    socketRef.current = s;

    s.connect();

    s.on("connect", () => {
      console.log("🟢 SOCKET CONNECTED:", s.id);
      setError("");
    });

    s.on("disconnect", (reason) => {
      console.warn("🔴 SOCKET DISCONNECTED:", reason);
    });

    s.on("connect_error", (err) => {
      console.error("❌ SOCKET ERROR:", err.message);
      setError("Socket error: " + err.message);
    });

    return () => {
      console.log("🔌 CLEANUP SOCKET");
      s.disconnect();
    };
  }, [initialized, userId]);

  /* ============================================================
      GLOBAL newMessage LISTENER (runs once only)
  ============================================================ */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleNew = (msg) => {
      console.log("💬 NEW MESSAGE:", msg);
      setMessages((prev) => {
        const exists = prev.some(
          (m) => m._id === msg._id || (m.tempId && msg.tempId && m.tempId === msg.tempId)
        );
        return exists ? prev : [...prev, msg];
      });
    };

    socket.on("newMessage", handleNew);
    console.log("🟢 Attached newMessage listener");

    return () => {
      socket.off("newMessage", handleNew);
      console.log("🔴 Removed newMessage listener");
    };
  }, []); // RUNS ONCE — REQUIRED

  /* ============================================================
      LOAD HISTORY (only after join + socket ready)
  ============================================================ */
  const loadHistory = () => {
    const socket = socketRef.current;
    if (!socket || !conversationId) return;

    if (!socket.connected) {
      console.log("⏳ Socket not ready — retry history after connect");
      socket.once("connect", loadHistory);
      return;
    }

    console.log("📜 Loading history for:", conversationId);

    socket.emit("getHistory", { conversationId }, (res) => {
      console.log("📥 HISTORY RESPONSE:", res);

      setLoading(false); // ← חשוב! לא להשאיר מסך תקוע

      if (res.ok) {
        setMessages(res.messages || []);
      } else {
        setMessages([]);
      }
    });
  };

  /* ============================================================
      JOIN ROOM → THEN HISTORY
  ============================================================ */
  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || !conversationId) {
      console.log("⏳ Waiting for socket/conversationId for JOIN…");
      return;
    }

    const join = () => {
      console.log("📌 JOIN ROOM user-business →", conversationId);

      socket.emit(
        "joinConversation",
        "user-business",
        conversationId,
        false,
        (res) => {
          console.log("📥 JOIN RESPONSE:", res);

          // 🚀 לא נתקע על לודינג
          setLoading(false);

          if (res?.ok) loadHistory();
        }
      );
    };

    if (socket.connected) {
      console.log("🟢 socket already connected → joining");
      join();
    }

    socket.on("connect", () => {
      console.log("🔄 SOCKET RECONNECTED → joining again");
      join();
    });

    return () => {
      console.log("🚪 LEAVE ROOM:", conversationId);
      socket.emit("leaveConversation", "user-business", conversationId, false);
      socket.off("connect", join);
    };
  }, [conversationId]);

  /* ============================================================
      LOAD CONVERSATION METADATA
  ============================================================ */
  useEffect(() => {
    setLoading(true);
    setError("");

    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");
    const token = localStorage.getItem("token");

    console.log("📂 Loading conversation metadata…");

    if (!threadId || !clientId) {
      fetch(`${baseUrl}/api/messages/user-conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          console.log("📥 Conversations:", data);

          if (Array.isArray(data.conversations) && data.conversations.length) {
            let conv = null;

            if (businessIdFromParams) {
              conv = data.conversations.find(
                (c) => String(c.otherParty?.id) === String(businessIdFromParams)
              );
            }

            if (!conv) conv = data.conversations[0];

            console.log("✔ SELECTED CONV:", conv);

            setConversationId(conv.conversationId);
            setBusinessName(conv.otherParty?.name || "Unknown business");
            safeSetBusinessId(conv.otherParty?.id);
          } else {
            setConversationId(null);
            setBusinessName("Unknown business");
            safeSetBusinessId(businessIdFromParams);
          }

          // ⚠️ אל תכווי loading כאן — החדר עדיין לא נטען!
        })
        .catch((err) => {
          console.error("❌ metadata error:", err);
          setError("Error loading conversation");
          setLoading(false);
        });
    } else {
      fetch(`${baseUrl}/api/conversations/${threadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          console.log("📥 Conversation:", data);

          if (!data.ok) throw new Error(data.error);

          setConversationId(threadId);
          setBusinessName(data.conversation.businessName || "Unknown business");
          safeSetBusinessId(businessIdFromParams);
        })
        .catch((err) => {
          console.error("❌ metadata error:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [threadId, clientId, businessIdFromParams]);

  /* ============================================================
      UI
  ============================================================ */
  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

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
