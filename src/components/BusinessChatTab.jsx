import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api";
import "./BusinessChatTab.css";

export default function BusinessChatTab({ conversationId, businessId, customerId }) {
  console.log("💥 [BusinessChatTab] props:", { conversationId, businessId, customerId });

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    console.log("🔄 [useEffect] conversationId:", conversationId, "businessId:", businessId, "customerId:", customerId);

    if (!conversationId) {
      console.warn("⚠️ [useEffect] No conversationId, aborting useEffect");
      return;
    }

    // 1. Load history for this conversation
    API.get("/messages/history", {
      params: { conversationId },
      withCredentials: true
    })
      .then(res => {
        const loaded = Array.isArray(res.data) ? res.data : res.data.messages || [];
        setMessages(loaded);
        console.log("✅ [History] loaded:", loaded.length, "messages.");
      })
      .catch(err => {
        console.error("❌ [History] Error loading history:", err);
      });

    // 2. Connect to socket room for this conversation
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    console.log("🔗 Connecting to socket at:", socketUrl);
    socketRef.current = io(socketUrl, {
      query: { conversationId, businessId, userId: businessId, role: "business" }
    });
    socketRef.current.on("connect", () => {
      console.log("🔌 [Socket] connected:", socketRef.current.id);
      socketRef.current.emit("joinRoom", conversationId);
      console.log("➡️ [Socket] joinRoom emitted for", conversationId);
    });

    socketRef.current.on("newMessage", msg => {
      console.log("📨 [Socket] Received newMessage:", msg);
      setMessages(prev => [...prev, msg]);
    });

    socketRef.current.on("disconnect", reason => {
      console.log("🔌 [Socket] disconnected:", reason);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setMessages([]);
    };
  }, [conversationId, businessId, customerId]);

  const sendMessage = () => {
    if (!input.trim()) {
      console.warn("⚠️ [Send] Empty input, ignoring");
      return;
    }
    if (!conversationId) {
      console.error("❌ [Send] No conversationId, cannot send");
      return;
    }
    if (!customerId) {
      console.error("❌ [Send] No customerId, cannot send");
      return;
    }

    const msg = {
      conversationId,
      from: businessId,
      to: customerId,
      text: input.trim(),
      timestamp: new Date().toISOString()
    };
    console.log("🚀 [Socket] Emitting sendMessage:", msg);

    socketRef.current.emit("sendMessage", msg, ack => {
      console.log("📣 [Socket] sendMessage ack:", ack);
      if (ack?.success) {
        setMessages(prev => [...prev, msg]);
        setInput("");
      } else {
        alert("שגיאה בשליחת ההודעה. נסה שוב.");
      }
    });
  };

  // Debug info bar
  const debugBar = (
    <div style={{ fontSize: "0.7em", background: "#eee", padding: 4, direction: "ltr" }}>
      <b>conversationId:</b> {conversationId}<br />
      <b>businessId:</b> {businessId} <b>customerId:</b> {customerId}
    </div>
  );

  return (
    <div className="chat-container business">
      {debugBar}
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
