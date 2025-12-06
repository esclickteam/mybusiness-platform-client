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

  const safeSetBusinessId = (newId) => setBusinessId((prev) => newId ?? prev);

  const socketRef = useRef(null);

  /* ============================================================
        SOCKET INIT — FIX + LOGS
  ============================================================ */
  useEffect(() => {
    if (!initialized || !userId) return;

    if (socketRef.current && socketRef.current.connected) {
      console.log("⚠️ socket already connected, skipping init");
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

    console.log("🔌 INIT SOCKET →", socketUrl);

    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token, role: "chat" },
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 800,
    });

    // Connect now
    socketRef.current.connect();

    socketRef.current.on("connect", () => {
      console.log("🟢 SOCKET CONNECTED:", socketRef.current.id);
      setError("");
    });

    socketRef.current.on("disconnect", (reason) => {
      console.warn("🔴 SOCKET DISCONNECTED:", reason);
      if (reason !== "io client disconnect") {
        setError("Socket disconnected: " + reason);
      }
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ CONNECT ERROR:", err.message);
      setError("Socket connection error: " + err.message);
    });

    return () => {
      if (socketRef.current) {
        console.log("🔌 SOCKET CLEANUP → disconnect");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initialized, userId]);

  /* ============================================================
        AUTO JOIN ROOM — FULL LOGGING
  ============================================================ */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) {
      console.log("⏳ Waiting for socket or conversationId…");
      return;
    }

    const join = () => {
      console.log(
        `📌 JOINING ROOM → user-business-${conversationId}`
      );
      socket.emit(
        "joinConversation",
        "user-business",
        conversationId,
        false,
        (res) => console.log("📥 JOIN RESPONSE:", res)
      );
    };

    if (socket.connected) {
      console.log("🔄 socket already connected — joining room now");
      join();
    }

    socket.on("connect", () => {
      console.log("🔄 SOCKET RECONNECTED — joining room again");
      join();
    });

    return () => {
      console.log(
        `🚪 LEAVE ROOM → user-business-${conversationId}`
      );
      socket.emit(
        "leaveConversation",
        "user-business",
        conversationId,
        false
      );

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
        .then((res) => res.json())
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

            console.log("✔ SELECTED CONVERSATION:", conv);

            setConversationId(conv.conversationId);
            setBusinessName(conv.otherParty?.name || "");
            safeSetBusinessId(conv.otherParty?.id);
          } else {
            console.log("⚠️ No conversations found");
            setConversationId(null);
            setBusinessName("");
            safeSetBusinessId(businessIdFromParams);
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Error:", err);
          setError("Error loading user conversations");
          setLoading(false);
        });
    } else {
      fetch(`${baseUrl}/api/conversations/${threadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("📥 Conversation:", data);

          if (!data.ok) throw new Error(data.error || "Error loading conversation");

          setConversationId(threadId);
          setBusinessName(data.conversation.businessName || "");
          safeSetBusinessId(businessIdFromParams);
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Error:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [threadId, clientId, businessIdFromParams]);

  /* ============================================================
        LOAD HISTORY + LISTEN FOR LIVE MESSAGES
        (FULL LOGGING)
  ============================================================ */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) {
      console.log("⏳ Waiting for socket or conversation before loading history…");
      return;
    }

    if (!socket.connected) {
      console.warn("⚠️ Socket not ready yet — history load postponed");
      return;
    }

    console.log("📜 Loading message history for:", conversationId);
    setLoading(true);

    socket.emit("getHistory", { conversationId }, (res) => {
      console.log("📥 HISTORY RESPONSE:", res);

      if (res.ok) {
        setMessages(Array.isArray(res.messages) ? res.messages : []);
        setError("");
      } else {
        setMessages([]);
        setError("Error loading messages");
      }
      setLoading(false);
    });

    const handleNew = (msg) => {
      console.log("💬 NEW MESSAGE RECEIVED:", msg);

      setMessages((prev) => {
        const exists = prev.some(
          (m) =>
            m._id === msg._id ||
            (m.tempId && msg.tempId && m.tempId === msg.tempId)
        );
        return exists ? prev : [...prev, msg];
      });
    };

    socket.on("newMessage", handleNew);

    return () => {
      console.log("🔕 Removing newMessage listener");
      socket.off("newMessage", handleNew);
    };
  }, [conversationId]);

  /* ============================================================
        UI
  ============================================================ */
  if (loading) return <div className={styles.loading}>Loading…</div>;
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
