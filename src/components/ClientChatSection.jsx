import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ClientChatTab from "./ClientChatTab";
import styles from "./ClientChatSection.module.css";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

export default function ClientChatSection() {
  const { businessId: businessIdFromParams, threadId } = useParams();
  const { user, initialized } = useAuth();
  const userId = user?.userId;

  const [conversationId, setConversationId] = useState(threadId || null);
  const [businessId] = useState(businessIdFromParams);
  const [businessName, setBusinessName] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);

  /* ----------------------------------------------------------
     CONNECT SOCKET ONCE
  ---------------------------------------------------------- */
  useEffect(() => {
    if (!initialized || !userId) return;
    if (socketRef.current) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const token = localStorage.getItem("token");

    socketRef.current = io(socketUrl, {
      transports: ["websocket"],
      auth: { token },
    });

    socketRef.current.on("connect", () => console.log("Connected:", socketRef.current.id));
    socketRef.current.on("disconnect", () => console.log("Disconnected"));

    return () => socketRef.current?.disconnect();
  }, [initialized, userId]);

  /* ----------------------------------------------------------
     CREATE/JOIN CONVERSATION
  ---------------------------------------------------------- */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !userId || !businessId) return;

    // If exists → join
    if (conversationId) {
      socket.emit(
        "joinConversation",
        "user-business",
        conversationId,
        false,
        () => {}
      );
      return;
    }

    // Otherwise create a new conversation
    socket.emit(
      "startConversation",
      { otherUserId: businessId, isBusinessToBusiness: false },
      (res) => {
        if (res?.ok) {
          setConversationId(res.conversationId);
        }
      }
    );
  }, [userId, businessId, conversationId]);

  /* ----------------------------------------------------------
     LOAD HISTORY + LISTEN NEW MESSAGES (ONE LISTENER)
  ---------------------------------------------------------- */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) return;

    setLoading(true);

    socket.emit("getHistory", { conversationId }, (res) => {
      if (res.ok) {
        const unique = Array.from(
          new Map(res.messages.map((m) => [m._id || m.tempId, m])).values()
        );
        setMessages(unique);
      }
      setLoading(false);
    });

    const handleNewMessage = (msg) => {
      const msgId = msg._id || msg.tempId;

      setMessages((prev) => {
        if (prev.some((m) => m._id === msgId || m.tempId === msgId)) return prev;
        return [...prev, msg];
      });
    };

    socket.off("newMessage");
    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [conversationId]);

  /* ----------------------------------------------------------
     SEND MESSAGE (WITH TEMP MESSAGE)
  ---------------------------------------------------------- */
  const sendMessage = (text) => {
    const socket = socketRef.current;
    if (!socket || !text.trim()) return;

    const tempId = uuidv4();
    const msg = {
      _id: tempId,
      tempId,
      text,
      from: userId,
      to: businessId,
      timestamp: new Date().toISOString(),
      sending: true,
    };

    setMessages((prev) => [...prev, msg]);

    socket.emit(
      "sendMessage",
      {
        conversationId,
        from: userId,
        to: businessId,
        text,
        tempId,
        conversationType: "user-business",
      },
      (ack) => {
        if (!ack.ok) {
          setMessages((prev) =>
            prev.map((m) =>
              m.tempId === tempId ? { ...m, failed: true, sending: false } : m
            )
          );
          return;
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.tempId === tempId ? ack.message : m
          )
        );
      }
    );
  };

  /* ----------------------------------------------------------
     FETCH BUSINESS NAME
  ---------------------------------------------------------- */
  useEffect(() => {
    if (!businessId) return;

    const token = localStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

    fetch(`${baseUrl}/api/business/${businessId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBusinessName(data?.businessName || "Business"));
  }, [businessId]);

  /* ----------------------------------------------------------
     RENDER
  ---------------------------------------------------------- */
  return (
    <div className={styles.whatsappBg}>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebarInner}>
          <h3>Chat with {businessName}</h3>
        </aside>

        <section className={styles.chatArea}>
          <ClientChatTab
            messages={messages}
            onSendMessage={sendMessage}
            loading={loading}
            userId={userId}
          />
        </section>
      </div>
    </div>
  );
}
