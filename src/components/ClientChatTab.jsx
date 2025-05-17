import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api"; 
import "./ClientChatTab.css";

export default function ClientChatTab({ businessId, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();

  // התחברות ל-socket ולמשיכת ההיסטוריה
  useEffect(() => {
    // 1. fetch history
    API.get("/chat/history", { params: { businessId } })
      .then(res => setMessages(res.data))
      .catch(console.error);

    // 2. התחברות ל-socket
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL, {
      query: { businessId, userId: user.id, role: "client" }
    });
    socketRef.current.on("chat:newMessage", msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [businessId, user.id]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = {
      businessId,
      userId: user.id,
      sender: "client",
      text: input.trim(),
      createdAt: new Date().toISOString()
    };
    socketRef.current.emit("chat:sendMessage", msg);
    setMessages(prev => [...prev, msg]);
    setInput("");
  };

  return (
    <div className="chat-container client">
      <div className="message-list">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message ${m.sender === "client" ? "mine" : "theirs"}`}
          >
            <div className="text">{m.text}</div>
            <div className="time">
              {new Date(m.createdAt).toLocaleTimeString("he-IL", {
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
