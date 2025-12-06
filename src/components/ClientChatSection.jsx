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
     1. Connect to Socket
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
      console.log("✅ Connected to socket:", socketRef.current.id);
      setError("");
    });

    socketRef.current.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
      if (reason !== "io client disconnect") {
        setError("The connection to the chat server was disconnected.");
      }
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
      setError("Error connecting to chat: " + err.message);
    });

    return () => {
      console.log("🔌 Disconnecting socket...");
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [initialized, userId]);

  /* ===========================================================
     2. Create or open conversation
  ============================================================ */
  useEffect(() => {
    if (!initialized || !userId || !businessId || !socketRef.current) return;

    const socket = socketRef.current;
    setLoading(true);
    setError("");

    if (conversationId) {
      console.log("💬 Existing conversation found:", conversationId);

      socket.emit(
        "joinConversation",
        "user-business",
        conversationId,
        false,
        (res) => {
          if (res?.ok) console.log("✅ Joined existing conversation:", res);
          else console.warn("⚠️ Failed to join room:", res?.error);
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
          console.log("✅ New conversation created:", res.conversationId);
          setConversationId(res.conversationId);

          socket.emit(
            "joinConversation",
            "user-business",
            res.conversationId,
            false,
            (joinRes) => {
              if (joinRes?.ok) console.log("📥 Joined new room:", joinRes);
              else console.warn("⚠️ Failed to join room:", joinRes?.error);
            }
          );
        } else {
          console.error("❌ Failed to create conversation:", res?.error);
          setError("Unable to create a new conversation with the business.");
        }

        setLoading(false);
      }
    );
  }, [initialized, userId, businessId, conversationId]);

  /* ===========================================================
     3. Load message history ONLY
     ❗️ Removed all listeners — ClientChatTab is the only listener
  ============================================================ */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) return;

    console.log("📜 Loading message history:", conversationId);
    setLoading(true);

    socket.emit("getHistory", { conversationId }, (res) => {
      if (res.ok) {
        console.log(`✅ Loaded ${res.messages.length} messages`);
        setMessages(Array.isArray(res.messages) ? res.messages : []);
        setError("");
      } else {
        console.error("❌ Error loading messages:", res.error);
        setMessages([]);
        setError("Error loading messages");
      }
      setLoading(false);
    });
  }, [conversationId]);

  /* ===========================================================
     4. Load Business Name
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
     5. Loading + Error UI
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
     6. Render Chat
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
