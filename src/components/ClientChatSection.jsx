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
        SOCKET INIT — FIX: NO DUPLICATE SOCKETS
  ============================================================ */
  useEffect(() => {
    if (!initialized || !userId) return;

    if (socketRef.current && socketRef.current.connected) {
      return; // לא לפתוח סוקט חדש!
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token, role: "chat" },
      withCredentials: true,
      autoConnect: false, // 🔥 חשוב!!
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 800,
    });

    socketRef.current.connect();

    socketRef.current.on("connect", () => {
      console.log("CLIENT SOCKET CONNECTED");
      setError("");
    });

    socketRef.current.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
      if (reason !== "io client disconnect") {
        setError("Socket disconnected: " + reason);
      }
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
      setError("Socket connection error: " + err.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initialized, userId]);

  /* ============================================================
        AUTO JOIN SERVER ROOM (REAL FIX)
  ============================================================ */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) return;

    const join = () => {
      console.log("JOIN → user-business:", conversationId);
      socket.emit(
        "joinConversation",
        "user-business",
        conversationId,
        false,
        (res) => console.log("JOIN RESPONSE:", res)
      );
    };

    if (socket.connected) join();

    socket.on("connect", join);

    return () => {
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

    if (!threadId || !clientId) {
      fetch(`${baseUrl}/api/messages/user-conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.conversations) && data.conversations.length) {
            let conv = null;

            if (businessIdFromParams) {
              conv = data.conversations.find(
                (c) => String(c.otherParty?.id) === String(businessIdFromParams)
              );
            }

            if (!conv) conv = data.conversations[0];

            setConversationId(conv.conversationId);
            setBusinessName(conv.otherParty?.name || "");
            safeSetBusinessId(conv.otherParty?.id);
          } else {
            setConversationId(null);
            setBusinessName("");
            safeSetBusinessId(businessIdFromParams);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Error loading user conversations");
          setLoading(false);
        });
    } else {
      fetch(`${baseUrl}/api/conversations/${threadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.ok) throw new Error(data.error || "Error loading conversation");

          setConversationId(threadId);
          setBusinessName(data.conversation.businessName || "");
          safeSetBusinessId(businessIdFromParams);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [threadId, clientId, businessIdFromParams]);

  /* ============================================================
        LOAD BUSINESS NAME
  ============================================================ */
  useEffect(() => {
    if (businessId && !businessName) {
      const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");
      const token = localStorage.getItem("token");

      fetch(`${baseUrl}/api/business/${businessId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setBusinessName(
            data.business?.businessName ||
              data.businessName ||
              "Unknown business"
          );
        })
        .catch(() => setBusinessName("Unknown business"));
    }
  }, [businessId, businessName]);

  /* ============================================================
        LOAD HISTORY + LISTEN FOR MESSAGES
  ============================================================ */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) return;

    if (!socket.connected) {
      console.warn("Socket not ready yet – waiting...");
      return;
    }

    setLoading(true);

    socket.emit("getHistory", { conversationId }, (res) => {
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
