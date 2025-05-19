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
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();
  const messageListRef = useRef();
  const typingTimeout = useRef();

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);

    // 1. טען היסטוריה
    API.get("/messages/history", {
      params: { conversationId },
    })
      .then((res) => {
        setMessages(Array.isArray(res.data) ? res.data : res.data.messages || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error loading history:", e);
        setLoading(false);
      });

    // 2. התחבר ל־Socket.IO
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      path: "/socket.io",
      query: { conversationId, userId, role: "client" },
    });

    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) => {
        const exists = prev.some(
          m =>
            (m._id && msg._id && m._id === msg._id) ||
            (m.timestamp === msg.timestamp && m.from === msg.from && m.text === msg.text)
        );
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    // "העסק מקליד..."
    socketRef.current.on("typing", ({ from }) => {
      if (from === businessId) {
        setIsTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 1800);
      }
    });

    return () => {
      socketRef.current?.disconnect();
      setMessages([]);
      clearTimeout(typingTimeout.current);
    };
  }, [conversationId, userId, businessId]);

  // גלילה אוטומטית
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !conversationId || sending) return;
    const toId = businessId || partnerId;
    const msgPayload = {
      conversationId,
      from: userId,
      to: toId,
      text,
      timestamp: new Date().toISOString(),
      status: "sending",
    };

    setSending(true);

    if (socketRef.current?.connected) {
      socketRef.current.emit("sendMessage", msgPayload, (ack) => {
        setSending(false);
        if (ack?.success) setInput("");
        else fallbackPost(msgPayload);
      });
    } else {
      fallbackPost(msgPayload);
    }
  };

  // שליחת "מקליד..." כל עוד מקלידים
  const handleInput = (e) => {
    setInput(e.target.value);
    if (socketRef.current && !sending) {
      socketRef.current.emit("typing", { conversationId, from: userId, to: businessId });
    }
  };

  const fallbackPost = (msgPayload) => {
    API.post("/messages/history", msgPayload)
      .then((res) => {
        setMessages((prev) => [...prev, res.data.message]);
        setInput("");
      })
      .catch((err) => console.error("⮕ REST fallback error:", err));
  };

  // צרף קובץ - UX בלבד (טריגר לא קשור)
  const handleAttach = () => {
    alert("תמיכה בקבצים תתווסף בקרוב :)");
  };

  return (
    <div className="chat-container client">
      <div className="message-list" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && (
          <div className="empty">עדיין אין הודעות</div>
        )}
        {messages.map((m, i) =>
          m.system ? (
            <div key={i} className="system-message">{m.text}</div>
          ) : (
            <div
              key={m._id || i}
              className={
                "message" +
                (m.from?.toString() === userId?.toString() ? " mine" : " theirs") +
                (m.status === "sending" ? " sending" : "")
              }
            >
              <div className="text">{m.text}</div>
              <div className="meta">
                <span className="time">
                  {new Date(m.timestamp).toLocaleTimeString("he-IL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {m.from?.toString() === userId?.toString() && (
                  <span className={`status ${m.status || "sent"}`} />
                )}
              </div>
            </div>
          )
        )}
        {isTyping && (
          <div className="typing-indicator">העסק מקליד...</div>
        )}
      </div>
      <div className="input-bar client">
        <input
          type="text"
          placeholder="הקלד הודעה..."
          value={input}
          disabled={sending}
          onChange={handleInput}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && sendMessage()
          }
          className="inputField"
        />
        <button
          className="sendButtonFlat"
          onClick={sendMessage}
          title="שלח"
          disabled={sending || !input.trim()}
        >
          <span className="arrowFlat">◀</span>
        </button>
        <button
          type="button"
          className="attachBtn"
          title="צרף קובץ"
          onClick={handleAttach}
        >
          📎
        </button>
      </div>
    </div>
  );
}
