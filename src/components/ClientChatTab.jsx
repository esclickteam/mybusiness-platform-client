// src/components/ClientChatTab.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api"; 
import "./ClientChatTab.css";

export default function ClientChatTab({ conversationId, businessId, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    if (!conversationId) return;

    // 1. fetch history
    API.get("/messages/history", {
      params: { conversationId },
      withCredentials: true
    })
      .then(res => setMessages(res.data))
      .catch(console.error);

    // 2. התחברות ל-socket
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL, {
      query: { conversationId, businessId, userId: user.id, role: "client" }
    });

    socketRef.current.on("newMessage", msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
      setMessages([]); // לאפס כשעוברים לשיחה אחרת
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
    socketRef.current.emit("sendMessage", msg, ack => {
      // אפשר לוודא ב־ack שהשרת קיבל
      if (ack.success) {
        setMessages(prev => [...prev, msg]);
        setInput("");
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
