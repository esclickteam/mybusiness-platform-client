import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api";
import "./ClientChatTab.css";

export default function ClientChatTab({
  conversationId,
  businessId,
  userId,
  partnerId,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();
  const messageListRef = useRef();

  useEffect(() => {
    if (!conversationId) return;

    // 1. טען היסטוריה
    API.get("/messages/history", {
      params: { conversationId },
    })
      .then((res) => setMessages(res.data))
      .catch((e) => console.error("Error loading history:", e));

    // 2. התחבר ל־Socket.IO
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      query: { conversationId, businessId, userId, role: "client" },
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected, id =", socketRef.current.id);
      socketRef.current.emit("joinRoom", { conversationId });
    });
    socketRef.current.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
    });
    socketRef.current.on("newMessage", (msg) => {
      console.log("🆕 Received via socket:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.off("newMessage");
      socketRef.current.disconnect();
      socketRef.current = null;
      setMessages([]);
    };
  }, [conversationId]);

  // גלילה אוטומטית
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    console.log("🚀 sendMessage called with:", { text, conversationId });

    if (!text || !conversationId) return;

    const toId = businessId || partnerId;
    const msgPayload = {
      conversationId,
      from: userId,
      to: toId,
      text,
      timestamp: new Date().toISOString(),
    };

    // אם אין סוקט או לא מחובר – נשלח דרך HTTP
    if (!socketRef.current || !socketRef.current.connected) {
      console.warn("⚠️ socket not connected, using REST fallback");
      return API.post("/messages/history", msgPayload)
        .then((res) => {
          console.log("⮕ REST fallback success:", res.data);
          setMessages((prev) => [...prev, res.data.message]);
          setInput("");
        })
        .catch((err) => console.error("⮕ REST fallback error:", err));
    }

    // אחרת – נסה לשלוח דרך socket
    socketRef.current.emit("sendMessage", msgPayload, (ack) => {
      console.log("📝 sendMessage ACK:", ack);
      if (ack?.success) {
        setInput("");
      } else {
        console.warn("⚠️ socket ack failed, falling back to REST");
        API.post("/messages/history", msgPayload)
          .then((res) => {
            console.log("⮕ REST after socket-fail:", res.data);
            setMessages((prev) => [...prev, res.data.message]);
            setInput("");
          })
          .catch((err) => console.error("⮕ fallback error:", err));
      }
    });
  };

  return (
    <div className="whatsapp-bg">
      <div className="chat-container client">
        <div className="message-list" ref={messageListRef}>
          {messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`message ${m.from === userId ? "mine" : "theirs"}`}
            >
              <div className="text">{m.text}</div>
              <div className="time">
                {new Date(m.timestamp).toLocaleTimeString("he-IL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="input-bar">
          <input
            type="text"
            placeholder="הקלד הודעה..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && sendMessage()
            }
          />
          <button onClick={sendMessage} title="שלח">
            ✈️
          </button>
        </div>
      </div>
    </div>
  );
}
