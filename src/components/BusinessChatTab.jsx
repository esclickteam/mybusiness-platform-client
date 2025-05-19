// src/components/BusinessChatTab.jsx
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
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // התחבר לסוקט עם conversationId, userId ו-role
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      query: {
        conversationId,
        userId: businessId,
        role: "business",
      },
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinRoom", conversationId);
    });

    socketRef.current.on("newMessage", msg => {
      setMessages(prev =>
        prev.some(m => (m._id && msg._id && m._id === msg._id))
          ? prev
          : [...prev, msg]
      );
    });

    socketRef.current.on("typing", ({ from }) => {
      if (from === customerId) {
        setIsTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 1800);
      }
    });

    return () => {
      socketRef.current.disconnect();
      clearTimeout(typingTimeout.current);
      setMessages([]);
    };
  }, [conversationId, businessId, customerId]);

  // גלילה אוטומטית לתחתית
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || !customerId || sending) return;
    setSending(true);

    try {
      const form = new FormData();
      form.append("conversationId", conversationId);
      form.append("to", customerId);
      form.append("text", input.trim());
      // אם תרצה לצרף קובץ: form.append("fileData", fileObj);

      await API.post("/messages/send", form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("שגיאה בשליחת ההודעה. נסה שוב.");
    } finally {
      setSending(false);
    }
  };

  const handleInput = e => {
    setInput(e.target.value);
    if (socketRef.current && !sending) {
      socketRef.current.emit("typing", {
        conversationId,
        from: businessId,
        to: customerId,
      });
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
                (m.from === businessId ? " mine" : " theirs")
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
        {isTyping && <div className="typing-indicator">הלקוח מקליד...</div>}
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
