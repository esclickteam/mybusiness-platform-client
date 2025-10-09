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

  // Prevent overwriting valid values with null/undefined
  const safeSetBusinessId = (newId) => setBusinessId((prev) => newId ?? prev);

  const socketRef = useRef(null);

  // Create socket connection
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

    socketRef.current.on("connect", () => setError(""));

    socketRef.current.on("disconnect", (reason) => {
      if (reason !== "io client disconnect") {
        setError("Socket disconnected unexpectedly: " + reason);
      }
    });

    socketRef.current.on("connect_error", (err) =>
      setError("Socket connection error: " + err.message)
    );

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [initialized, userId]);

  // Load conversations based on parameters
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
          console.error("Error fetching user conversations:", err);
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
          const participants = data.conversation.participants || [];
          if (!participants.includes(clientId)) {
            throw new Error("The conversation does not include the requested client");
          }
          setConversationId(threadId);
          setBusinessName(data.conversation.businessName || "");
          safeSetBusinessId(businessIdFromParams);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching specific conversation:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [threadId, clientId, businessIdFromParams]);

  // Load business name if missing
  useEffect(() => {
    if (businessId && !businessName) {
      const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");
      const token = localStorage.getItem("token");

      fetch(`${baseUrl}/api/business/${businessId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch business name");
          return res.json();
        })
        .then((data) => {
          // According to server response structure
          if (data.business?.businessName) {
            setBusinessName(data.business.businessName);
          } else if (data.businessName) {
            setBusinessName(data.businessName);
          } else {
            setBusinessName("Unknown business");
          }
        })
        .catch((err) => {
          console.error("Error fetching business name:", err);
          setBusinessName("Unknown business");
        });
    }
  }, [businessId, businessName]);

  // Listen for messages and history via socket
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected || !conversationId) {
      setMessages([]);
      return;
    }

    setLoading(true);

    socket.emit("getHistory", { conversationId }, (res) => {
      if (res.ok) {
        setMessages(Array.isArray(res.messages) ? res.messages : []);
        setError("");
      } else {
        setMessages([]);
        setError("Error loading messages: " + (res.error || "Unknown"));
      }
      setLoading(false);
    });

    const handleNew = (msg) => {
      setMessages((prev) => {
        const idx = prev.findIndex(
          (m) =>
            m._id === msg._id ||
            (m.tempId && msg.tempId && m.tempId === msg.tempId)
        );
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], ...msg };
          return next;
        }
        return [...prev, msg];
      });
    };

    const handleApproved = (msg) =>
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, status: "approved" } : m))
      );

    socket.on("newMessage", handleNew);
    socket.on("messageApproved", handleApproved);

    socket.emit("joinConversation", conversationId);
    if (businessId) socket.emit("joinRoom", businessId);

    return () => {
      socket.off("newMessage", handleNew);
      socket.off("messageApproved", handleApproved);
      socket.emit("leaveConversation", conversationId);
      if (businessId) socket.emit("leaveRoom", businessId);
    };
  }, [conversationId, businessId]);

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
