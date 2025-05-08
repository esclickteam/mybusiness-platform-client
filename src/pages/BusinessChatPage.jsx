// src/pages/BusinessChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./BusinessChatPage.css";

const API_BASE = "https://api.esclick.co.il";

export default function BusinessChatPage() {
  const { user, loading: authLoading } = useAuth();
  const businessId = user?.businessId;

  const [convos, setConvos]             = useState([]);
  const [activeClient, setActiveClient] = useState(null);
  const [messages, setMessages]         = useState([]);
  const [newText, setNewText]           = useState("");
  const socketRef = useRef(null);

  // אם עוד טוען auth או אין businessId — נציג loading
  if (authLoading) {
    return <div className="loading-screen">🔄 מוודא הרשאה…</div>;
  }
  if (!businessId) {
    return <div className="error-screen">❌ אין לך הרשאת עסק לצ׳אט הזה</div>;
  }

  // 1) טען את רשימת השיחות
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/messages/conversations`, { withCredentials: true })
      .then(res => {
        setConvos(res.data);
        // אם יש שיחות, הפוך את הראשונה לאקטיבית
        if (res.data.length > 0) {
          setActiveClient(res.data[0].clientId);
        }
      })
      .catch(console.error);
  }, []);

  // 2) טען היסטוריית הודעות כשמשתנה activeClient
  useEffect(() => {
    if (!activeClient) {
      setMessages([]);
      return;
    }
    axios
      .get(`${API_BASE}/api/messages/conversations/${activeClient}`, { withCredentials: true })
      .then(res => setMessages(res.data))
      .catch(console.error);
  }, [activeClient]);

  // 3) התחבר ל-Socket.IO
  useEffect(() => {
    const socket = io(API_BASE, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("registerBusiness", businessId);
    });

    socket.on("newMessage", msg => {
      // מזהה הלקוח שבאמת הגיע
      const clientId = msg.clientId || msg.from;
      // אם זו שיחה חדשה, הוסף אותה לסיידבר
      setConvos(prev => {
        if (!prev.find(c => c.clientId === clientId)) {
          return [...prev, { clientId, name: msg.name || "לקוח" }];
        }
        return prev;
      });
      // אם זה אקטיבי, הוסף ל־messages
      if (clientId === activeClient) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => socket.disconnect();
  }, [businessId, activeClient]);

  // 4) שלח הודעה
  const sendMessage = () => {
    const text = newText.trim();
    if (!text || !activeClient || !socketRef.current) return;

    const msg = {
      from:    businessId,
      to:      "client",
      toId:    activeClient,
      text,
      clientId: activeClient,
    };

    socketRef.current.emit("sendMessage", msg, ack => {
      if (ack.success) {
        setMessages(prev => [
          ...prev,
          { ...msg, id: ack.messageId, timestamp: new Date().toISOString() }
        ]);
        setNewText("");
      }
    });
  };

  const onKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        <h4>שיחות</h4>
        {convos.length === 0 ? (
          <p className="no-convos">אין הודעות מלקוחות</p>
        ) : (
          <ul>
            {convos.map((c, idx) => (
              <li key={c.clientId}>
                <button
                  className={c.clientId === activeClient ? "active" : ""}
                  onClick={() => setActiveClient(c.clientId)}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section className="chat-window">
        {!activeClient ? (
          <p className="placeholder">בחר שיחה כדי להתחיל</p>
        ) : (
          <>
            <div className="messages-list">
              {messages.map((m, idx) => (
                <div
                  key={m.id || m._id || idx}
                  className={`message-item ${
                    m.from === businessId ? "outgoing" : "incoming"
                  }`}
                >
                  <p>{m.text}</p>
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
