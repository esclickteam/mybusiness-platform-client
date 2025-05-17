// src/components/ClientChatTab.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api";
import "./ClientChatTab.css";

export default function ClientChatTab({ conversationId, businessId, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const socketRef = useRef();

  useEffect(() => {
    if (!conversationId) return;

    // 1) טען היסטוריה
    API.get("/messages/history", {
      params: { conversationId },
      withCredentials: true
    })
      .then(res => setMessages(res.data))
      .catch(console.error);

    // 2) התחבר ל־Socket.IO
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL, {
      query: { conversationId, businessId, userId: user.id, role: "client" }
    });

    // הצטרף לחדר השיחה
    socketRef.current.emit("joinRoom", conversationId);

    // 3) מאזין להודעות חדשות
    socketRef.current.on("newMessage", msg => {
      setMessages(prev => [...prev, msg]);
    });

    // נקה ב־unmount
    return () => {
      socketRef.current.disconnect();
      setMessages([]);
    };
  }, [conversationId, businessId, user.id]);

  const sendMessage = () => {
    if (!input.trim() || !conversationId) return;

    const msg = {
      conversationId,
      from: user.id,
      to:   businessId,
      text: input.trim(),
      timestamp: new Date().toISOString()
    };

    // שלח לשרת עם callback
    socketRef.current.emit("sendMessage", msg, ack => {
      if (ack?.success) {
        // עדכן תצוגה מקומית
        setMessages(prev => [...prev, msg]);
        setInput("");
      } else {
        console.error("Failed to send:", ack?.error);
      }
    });
  };

  return (
    <div className="chat-container client">
      <div className="message-list">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message ${m.from === user.id ? "mine" : "theirs"}`}
          >
            <div className="text">{m.text}</div>
            <div className="time">
              {new Date(m.timestamp).toLocaleTimeString("he-IL", {
                hour: "2-digit",
                minute: "2-digit"
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
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>שלח</button>
      </div>
    </div>
  );
}
