// src/components/BusinessChatTab.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api";
import "./BusinessChatTab.css";

export default function BusinessChatTab({ conversationId, businessId, customerId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const socketRef = useRef();
  const messageListRef = useRef();

  useEffect(() => {
    if (!conversationId) return;

    // טען היסטוריית הודעות
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
      .catch(() => {});

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
        // מניעת כפילויות גם אם ה־timestamp זהה
        const exists = prev.some(
          m =>
            (m._id && msg._id && m._id === msg._id) ||
            (m.timestamp === msg.timestamp && m.from === msg.from && m.text === msg.text)
        );
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      socketRef.current?.disconnect();
      setMessages([]);
    };
  }, [conversationId, businessId]);

  // גלילה אוטומטית
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !conversationId || !customerId || sending) return;

    setSending(true);
    const msg = {
      conversationId,
      from: businessId,
      to: customerId,
      text: input.trim(),
      // לא צריך timestamp - השרת מוסיף
    };

    socketRef.current.emit("sendMessage", msg, ack => {
      setSending(false);
      if (!ack?.success) {
        alert("שגיאה בשליחת ההודעה. נסה שוב.");
      } else {
        setInput("");
        // ההודעה תגיע אוטומטית מ־newMessage!
      }
    });
  };

  return (
    <>
      {/* רשימת ההודעות */}
      <div className="messageList" ref={messageListRef}>
        {messages.length === 0 && <div className="empty">עדיין אין הודעות</div>}
        {messages.map((m, i) => (
          <div
            key={m._id || i}
            className={`message ${m.from === businessId ? "mine" : "theirs"}`}
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

      {/* שורת הקלט */}
      <div className="inputBar">
        <input
          className="inputField"
          type="text"
          placeholder="הקלד הודעה..."
          value={input}
          disabled={sending}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button className="sendButton" onClick={sendMessage} title="שלח" disabled={sending || !input.trim()}>
          <span role="img" aria-label="send">✈️</span>
        </button>
      </div>
    </>
  );
}
