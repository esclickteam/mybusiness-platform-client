import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import * as jwtDecode from "jwt-decode";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import { io } from "socket.io-client";

function decodeJwt(token) {
  return jwtDecode.default ? jwtDecode.default(token) : jwtDecode(token);
}

export default function BusinessChatPage() {
  const { user, initialized, refreshToken } = useAuth();
  const businessId = user?.businessId || user?.business?._id;

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  function isTokenValid(token) {
    if (!token) return false;
    try {
      const { exp } = decodeJwt(token);
      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  }

  async function initSocket(token) {
    if (socketRef.current) {
      console.log("Disconnecting old socket");
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    console.log("Connecting socket to", socketUrl);
    const socket = io(socketUrl, {
      path: "/socket.io",
      withCredentials: true,
      auth: { token, role: "chat", businessId },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit(
        "getConversations",
        { userId: businessId },
        ({ ok, conversations = [], error: errMsg }) => {
          console.log("getConversations response:", { ok, conversations, errMsg });
          setLoading(false);
          if (ok) {
            setConvos(conversations);
            if (!selected && conversations.length > 0) {
              const first = conversations[0];
              const convoId = first._id || first.conversationId;
              const partnerId = Array.isArray(first.participants)
                ? first.participants.find((p) => String(p) !== String(businessId))
                : first.partnerId;
              console.log("Selecting first conversation:", convoId, partnerId);
              setSelected({ conversationId: String(convoId), partnerId });
            }
          } else {
            console.error("Error loading conversations:", errMsg);
            setError("לא ניתן לטעון שיחות: " + errMsg);
          }
        }
      );
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setLoading(false);
      setError("שגיאת חיבור: " + err.message);
    });

    socket.on("newMessage", (msg) => {
      console.log("newMessage received:", msg);
      setConvos((prev) => {
        const idx = prev.findIndex((c) => String(c._id) === msg.conversationId);
        if (idx === -1) return prev;
        const updated = { ...prev[idx], updatedAt: msg.timestamp || new Date().toISOString() };
        const copy = [...prev];
        copy.splice(idx, 1);
        return [updated, ...copy];
      });
      setMessages((prev) =>
        msg.conversationId === selected?.conversationId && !prev.some((m) => m._id === msg._id)
          ? [...prev, msg]
          : prev
      );
    });
  }

  useEffect(() => {
    if (!initialized || !businessId) return;

    async function prepareSocket() {
      console.log("Preparing socket with businessId:", businessId);
      setLoading(true);
      let token = user?.accessToken;

      if (!isTokenValid(token)) {
        console.log("Token expired or invalid, refreshing...");
        try {
          token = await refreshToken();
          console.log("Token refreshed:", token);
        } catch (e) {
          setError("טוקן לא תקף ולא ניתן לרענן");
          setLoading(false);
          return;
        }
      }

      await initSocket(token);
      setLoading(false);
    }

    prepareSocket();

    return () => {
      if (socketRef.current) {
        console.log("Disconnecting socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initialized, businessId, user?.accessToken]);

  useEffect(() => {
    if (socketRef.current && selected?.conversationId) {
      console.log("Joining convo:", selected.conversationId);
      socketRef.current.emit(
        "joinConversation",
        selected.conversationId,
        (ack) => {
          if (!ack.ok) console.error("Failed to join:", ack.error);
          else console.log("Joined conversation successfully");
        }
      );
    }
  }, [selected]);

  useEffect(() => {
    if (!initialized) return;
    if (!selected?.conversationId) {
      console.log("No conversation selected, clearing messages");
      setMessages([]);
      return;
    }

    const loadHistory = async () => {
      try {
        console.log("Loading message history for conversation:", selected.conversationId);
        setLoading(true);
        const res = await fetch(
          `/api/conversations/history?conversationId=${selected.conversationId}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        console.log("Message history loaded:", data.length, "messages");
        setMessages(data);
      } catch (e) {
        console.error("Error loading history:", e);
        setMessages([]);
        setError("שגיאה בטעינת היסטוריה");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [initialized, selected]);

  const handleSelect = (conversationId, partnerId) => {
    console.log("Conversation selected:", conversationId, partnerId);
    setSelected({ conversationId: String(conversationId), partnerId });
  };

  if (!initialized) return <p className={styles.loading}>טוען מידע…</p>;

  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          {loading && <p className={styles.loading}>טוען…</p>}
          {!loading && (
            <ConversationsList
              conversations={convos}
              businessId={businessId}
              selectedConversationId={selected?.conversationId}
              onSelect={handleSelect}
              isBusiness={true}
            />
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </aside>
        <section className={styles.chatArea}>
          {selected?.conversationId && selected.partnerId ? (
            <BusinessChatTab
              conversationId={selected.conversationId}
              businessId={businessId}
              customerId={selected.partnerId}
              businessName={user?.businessName || user?.name}
              socket={socketRef.current}
              messages={messages}
              setMessages={setMessages}
            />
          ) : (
            <div className={styles.emptyMessage}>בחר שיחה כדי לראות הודעות</div>
          )}
        </section>
      </div>
    </div>
  );
}
