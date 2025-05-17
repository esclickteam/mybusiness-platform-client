// src/components/ClientChatTab.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api";
import "./ClientChatTab.css";

export default function ClientChatTab({ conversationId, businessId, userId }) {
  // בדיקה שהפרופס עוברים נכון
  console.log("💥 props in ClientChatTab:", { conversationId, businessId, userId });

  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const socketRef = useRef();

  useEffect(() => {
    console.log("🔄 ClientChatTab mounted", { conversationId, businessId, userId });

    if (!conversationId) {
      console.warn("⚠️ No conversationId, aborting useEffect");
      return;
    }

    // 1) טען היסטוריה
    console.log("📥 Fetching history for", conversationId);
    API.get("/messages/history", {
      params: { conversationId },
      withCredentials: true
    })
      .then(res => {
        console.log("✅ History loaded:", res.data);
        setMessages(res.data);
      })
      .catch(err => {
        console.error("❌ Error loading history:", err);
      });

    // 2) התחבר ל־Socket.IO
    console.log("🌐 Connecting to socket with query", { conversationId, businessId, userId });
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL, {
      query: { conversationId, businessId, userId, role: "client" }
    });

    socketRef.current.on("connect", () => {
      console.log("🔌 Socket connected:", socketRef.current.id);
      socketRef.current.emit("joinRoom", conversationId);
      console.log("➡️ joinRoom emitted for", conversationId);
    });

    socketRef.current.on("newMessage", msg => {
      console.log("📨 Received newMessage:", msg);
      setMessages(prev => [...prev, msg]);
    });

    socketRef.current.on("disconnect", reason => {
      console.log("🔌 Socket disconnected:", reason);
    });

    return () => {
      console.log("🧹 Cleaning up socket");
      socketRef.current.disconnect();
      setMessages([]);
    };
  }, [conversationId, businessId, userId]);

  const sendMessage = () => {
    console.log("✉️ sendMessage called with input:", input);
    if (!input.trim()) {
      console.warn("⚠️ Empty input, ignoring");
      return;
    }
    if (!conversationId) {
      console.error("❌ No conversationId, cannot send");
      return;
    }

    const msg = {
      conversationId,
      from: userId,
      to:   businessId,
      text: input.trim(),
      timestamp: new Date().toISOString()
    };
    console.log("🚀 Emitting sendMessage:", msg);

    socketRef.current.emit("sendMessage", msg, ack => {
      console.log("📣 sendMessage ack:", ack);
      if (ack?.success) {
        console.log("✅ Message acknowledged, updating local state");
        setMessages(prev => [...prev, msg]);
        setInput("");
      } else {
        console.error("❌ Failed to send message:", ack?.error);
      }
    });
  };

  return (
    <div className="chat-container client">
      <div className="message-list">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message ${m.from === userId ? "mine" : "theirs"}`}
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
