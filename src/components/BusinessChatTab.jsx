import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api";
import "./BusinessChatTab.css";

export default function BusinessChatTab({ conversationId, businessId, customerId }) {
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
    API.get("/messages/history", {
      params: { conversationId },
      withCredentials: true,
    })
      .then(res => {
        const loaded = Array.isArray(res.data)
          ? res.data
          : res.data.messages || [];
        setMessages(loaded);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // התחבר לסוקט
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      query: { conversationId, businessId, userId: businessId, role: "business" },
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinRoom", conversationId);
    });

    socketRef.current.on("newMessage", msg => {
      setMessages(prev => {
        const exists = prev.some(
          m =>
            (m._id && msg._id && m._id === msg._id) ||
            (m.timestamp === msg.timestamp && m.from === msg.from && m.text === msg.text)
        );
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    // "הלקוח מקליד..."
    socketRef.current.on("typing", ({ from }) => {
      if (from === customerId) {
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
  }, [conversationId, businessId, customerId]);

  // גלילה אוטומטית
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim() || !conversationId || !customerId || sending) return;

    if (!socketRef.current || socketRef.current.disconnected) {
      alert("❌ אין חיבור לשרת הצ'אט. נסה לרענן.");
      return;
    }

    setSending(true);
    const msg = {
      conversationId,
      from: businessId,
      to: customerId,
      text: input.trim(),
      timestamp: new Date().toISOString(),
      status: "sending",
    };

    socketRef.current.emit("sendMessage", msg, ack => {
      setSending(false);
      setInput("");
      if (!ack?.success) alert("שגיאה בשליחת ההודעה. נסה שוב.");
    });
  };

  // שליחת "מקליד..." כל עוד מקלידים
  const handleInput = (e) => {
    setInput(e.target.value);
    if (socketRef.current && !sending) {
      socketRef.current.emit("typing", { conversationId, from: businessId, to: customerId });
    }
  };

  return (
    <>
      <div className="messageList" ref={messageListRef}>
        {loading && <div className="loading">טוען...</div>}
        {!loading && messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m, i) =>
          m.system ? (
            <div key={i} className="system-message">{m.text}</div>
          ) : (
            <div
              key={m._id || i}
              className={
                "message" +
                (m.from === businessId ? " mine" : " theirs") +
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
                {m.from === businessId && (
                  <span className={`status ${m.status || "sent"}`} />
                )}
              </div>
            </div>
          )
        )}
        {isTyping && (
          <div className="typing-indicator">הלקוח מקליד...</div>
        )}
      </div>
      <div className="inputBar">
        <button
          type="button"
          className="attachBtn"
          title="צרף קובץ"
          onClick={() => alert("להוסיף לוגיקת קובץ כאן!")}
        >
          📎
        </button>
        <input
          className="inputField"
          type="text"
          placeholder="הקלד הודעה..."
          value={input}
          disabled={sending}
          onChange={handleInput}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          className="sendButtonFlat"
          onClick={sendMessage}
          title="שלח"
          disabled={sending || !input.trim()}
        >
          <span className="arrowFlat">◀</span>
        </button>
      </div>
    </>
  );
}
