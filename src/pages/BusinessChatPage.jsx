// src/pages/BusinessChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./BusinessChatPage.css";

export default function BusinessChatPage() {
  const { user } = useAuth();
  const businessId = user?.businessId;
  const [convos, setConvos]           = useState([]);
  const [activeClient, setActiveClient] = useState(null);
  const [messages, setMessages]       = useState([]);
  const [newText, setNewText]         = useState("");
  const socketRef = useRef(null);

  // 1. פתיחת חיבור Socket.IO
  useEffect(() => {
    if (!businessId) return;

    const socket = io("https://api.esclick.co.il", {
      withCredentials: true,   // שולח את ה-cookie אוטומטית
      transports: ["websocket"]
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("registerBusiness", businessId);
    });

    socket.on("newMessage", (msg) => {
      // אם ההודעה מיועדת ללקוח הפעיל, הוסף אותה
      if (msg.clientId === activeClient) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => socket.disconnect();
  }, [businessId, activeClient]);

  // 2. טעינת רשימת השיחות
  useEffect(() => {
    if (!businessId) return;
    axios.get("https://api.esclick.co.il/api/messages/conversations", {
      withCredentials: true
    })
    .then(res => setConvos(res.data))
    .catch(console.error);
  }, [businessId]);

  // 3. טעינת היסטוריית הודעות של לקוח מסוים
  const selectClient = (clientId) => {
    setActiveClient(clientId);
    setMessages([]);
    axios.get(
      `https://api.esclick.co.il/api/messages/conversations/${clientId}`,
      { withCredentials: true }
    )
    .then(res => setMessages(res.data))
    .catch(console.error);
  };

  // 4. שליחת הודעה
  const sendMessage = () => {
    if (!newText.trim() || !socketRef.current) return;
    const msg = {
      from: businessId,
      to: "client",
      toId: activeClient,
      text: newText.trim(),
      clientId: activeClient
    };
    // אפשר גם לכתוב REST קודם, אם רוצים לשמור במסד לפני השידור
    socketRef.current.emit("sendMessage", msg, (ack) => {
      if (ack.success) {
        setMessages(prev => [...prev, { ...msg, id: ack.messageId, timestamp: new Date() }]);
        setNewText("");
      }
    });
  };

  // שליחה בלחיצה על Enter
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        <h4>שיחות</h4>
        <ul>
          {convos.map(c => (
            <li key={c.clientId}>
              <button
                className={c.clientId === activeClient ? "active" : ""}
                onClick={() => selectClient(c.clientId)}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="chat-window">
        {!activeClient ? (
          <p className="placeholder">בחר שיחה כדי להתחיל</p>
        ) : (
          <>
            <div className="messages-list">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`message-item ${
                    m.from === businessId ? "outgoing" : "incoming"
                  }`}
                >
                  <p>{m.text || m.content}</p>
                  <small>{new Date(m.timestamp).toLocaleTimeString()}</small>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="הקלד הודעה..."
                value={newText}
                onChange={e => setNewText(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button onClick={sendMessage} disabled={!newText.trim()}>
                ✈️
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
