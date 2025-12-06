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
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const socketRef = useRef(null);

  /* ===========================================================
     🔌 1. Create & Maintain Socket Connection (once)
  ============================================================ */
  useEffect(() => {
    if (!initialized || !userId) return;
    if (socketRef.current) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

    console.log("🌐 Connecting to socket:", socketUrl);

    const socket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token },
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setError("");
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
      if (reason !== "io client disconnect") {
        setError("Lost connection to chat server.");
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err);
      setError("Unable to connect to chat server.");
    });

    return () => {
      console.log("🔌 Disconnecting socket...");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [initialized, userId]);

  /* ===========================================================
     🧠 2. If no conversation → create one. If exists → join it.
  ============================================================ */
  useEffect(() => {
    const socket = socketRef.current;
    if (!initialized || !socket || !userId || !businessId) return;

    setLoading(true);
    setError("");

    // If conversation already exists → join
    if (conversationId) {
      console.log("💬 Joining existing conversation:", conversationId);
      socket.emit(
        "joinConversation",
        "user-business",
        conversationId,
        false,
        (res) => {
          if (res?.ok) console.log("📥 Joined conversation room");
          else console.warn("⚠️ Join failed:", res?.error);
          setLoading(false);
        }
      );
      return;
    }

    // Otherwise → create new conversation
    console.log("🆕 Creating new conversation...");
    socket.emit(
      "startConversation",
      { otherUserId: businessId, isBusinessToBusiness: false },
      (res) => {
        if (res?.ok) {
          console.log("🎉 New conversation created:", res.conversationId);
          setConversationId(res.conversationId);

          socket.emit(
            "joinConversation",
            "user-business",
            res.conversationId,
            false,
            (joinRes) => {
              if (joinRes?.ok) console.log("📥 Joined after creation");
              else console.warn("⚠️ Failed joining new room");
            }
          );
        } else {
          console.error("❌ Failed to create conversation:", res.error);
          setError("Unable to start chat with business.");
        }
        setLoading(false);
      }
    );
  }, [initialized, userId, businessId, conversationId]);

  /* ===========================================================
     💬 3. Load History + Add Single newMessage Listener
  ============================================================ */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) return;

    console.log("📜 Loading history for conversation:", conversationId);
    setLoading(true);

    // Load history
    socket.emit("getHistory", { conversationId }, (res) => {
      if (res.ok) {
        console.log(`📦 Loaded ${res.messages.length} messages`);

        // Unique messages only
        const unique = Array.from(
          new Map(
            res.messages.map((msg) => [
              msg._id || msg.tempId,
              msg,
            ])
          ).values()
        );

        setMessages(unique);
        setError("");
      } else {
        console.error("❌ History error:", res.error);
        setMessages([]);
        setError("Unable to load messages.");
      }

      setLoading(false);
    });

    /* --------------------------
       FIX: remove old listener 
       then add ONE listener only
    ---------------------------*/
    const handleNewMessage = (msg) => {
      console.log("📩 New message:", msg);

      setMessages((prev) => {
        const exists = prev.some(
          (m) =>
            (m._id && msg._id && m._id === msg._id) ||
            (m.tempId && msg.tempId && m.tempId === msg.tempId) ||
            (m._id && msg.tempId && m._id === msg.tempId) ||
            (m.tempId && msg._id && m.tempId === msg._id)
        );

        if (exists) {
          console.log("⏩ Duplicate message skipped.");
          return prev;
        }

        return [...prev, msg];
      });
    };

    socket.off("newMessage"); // 🔥 Critical fix
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId]);

  /* ===========================================================
     📛 4. Load business name
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
      .catch(() => {
        setBusinessName("Business");
      });
  }, [businessId, businessName]);

  /* ===========================================================
     🖼️ 5. UI Rendering
  ============================================================ */
  if (loading)
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Loading conversation…</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.errorWrapper}>
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg mt-3 hover:bg-purple-700"
        >
          Refresh
        </button>
      </div>
    );

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          <h3 className={styles.sidebarTitle}>Chat with the Business</h3>
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
