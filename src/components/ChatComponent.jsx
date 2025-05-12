// 📁 src/components/ChatComponent.jsx
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import API from "../api";
import "./ChatComponent.css";

const SOCKET_URL = process.env.REACT_APP_API_URL || "https://api.esclick.co.il";

export default function ChatComponent({ conversationId, partnerId, isBusiness }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    // load history
    API.get(`/messages/${conversationId}`, { withCredentials: true })
      .then(res => setMessages(res.data))
      .catch(err => console.error("❌ load history:", err));

    // connect socket
    socketRef.current = io(SOCKET_URL, { withCredentials: true });
    socketRef.current.emit("join", conversationId);

    socketRef.current.on("message", msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [conversationId]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const msg = { conversationId, text, to: partnerId };
    socketRef.current.emit("sendMessage", msg);
    setMessages(prev => [...prev, { ...msg, fromSelf: true }]);
    setText("");
  };

  return (
    <div className="chat-component">
      <div className="messages-list">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message-item ${m.fromSelf ? "self" : ""}`}
          >
            <p>{m.text}</p>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="הודעה…"
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>שלח</button>
      </div>
    </div>
  );
}
