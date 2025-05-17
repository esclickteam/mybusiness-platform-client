// src/components/BusinessChatTab.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api"; 
import "./BusinessChatTab.css";

export default function BusinessChatTab({ conversationId, businessId, customerId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    if (!conversationId) return;

    // 1. Load history for this conversation (תיקון: תמיכה בכל סוגי התשובות)
    API.get("/messages/history", {
      params: { conversationId },
      withCredentials: true
    })
      .then(res => {
        // תומך גם במערך וגם באובייקט עם messages
        setMessages(Array.isArray(res.data) ? res.data : res.data.messages || []);
      })
      .catch(console.error);

    // 2. Connect to socket room for this conversation
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL, {
      query: { conversationId, businessId, userId: businessId, role: "business" }
    });
    socketRef.current.emit("joinRoom", conversationId);

    socketRef.current.on("newMessage", msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
      setMessages([]);
    };
  }, [conversationId, businessId]);

  const sendMessage = () => {
    if (!input.trim() || !conversationId) return;

    const msg = {
      conversationId,
      from: businessId,
      to:   customerId,
      text: input.trim(),
      timestamp: new Date().toISOString()
    };

    socketRef.current.emit("sendMessage", msg, ack => {
      if (ack?.success) {
        setMessages(prev => [...prev, msg]);
        setInput("");
      } else {
        console.error("Send failed", ack?.error);
      }
    });
  };

  return (
    <div className="chat-container business">
      <div className="message-list">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message ${m.from === businessId ? "mine" : "theirs"}`}
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
