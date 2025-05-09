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
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages]         = useState([]);
  const [newText, setNewText]           = useState("");
  const socketRef = useRef(null);

  if (authLoading) {
    return <div className="loading-screen">🔄 מוודא הרשאה…</div>;
  }
  if (!businessId) {
    return <div className="error-screen">❌ אין לך הרשאת עסק לצ׳אט הזה</div>;
  }

  // 1) טען את רשימת השיחות
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/conversations`, { withCredentials: true })
      .then(res => {
        const convosData = res.data.map(c => {
          const client = c.participants.find(p => p._id !== businessId);
          return {
            conversationId: c._id,
            clientId: client._id,
            name: client.name || "לקוח"
          };
        });
        setConvos(convosData);
        if (convosData.length > 0) {
          setActiveConversation(convosData[0]);
        }
      })
      .catch(console.error);
  }, [businessId]);

  // 2) טען הודעות של שיחה נבחרת
  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }
    axios
      .get(`${API_BASE}/api/conversations/${activeConversation.conversationId}`, { withCredentials: true })
      .then(res => setMessages(res.data))
      .catch(console.error);
  }, [activeConversation]);

  // 3) Socket.IO
  useEffect(() => {
    const socket = io(API_BASE, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("registerBusiness", businessId);
    });

    socket.on("newMessage", msg => {
      const clientId = msg.clientId || msg.from;
      // אם זו שיחה חדשה – הוסף
      setConvos(prev => {
        if (!prev.find(c => c.clientId === clientId)) {
          return [...prev, {
            clientId,
            name: msg.name || "לקוח",
            conversationId: msg.conversationId || ""
          }];
        }
        return prev;
      });

      if (clientId === activeConversation?.clientId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => socket.disconnect();
  }, [businessId, activeConversation]);

  // 4) שליחת הודעה
  const sendMessage = () => {
    const text = newText.trim();
    if (!text || !activeConversation || !socketRef.current) return;

    const msg = {
      from: businessId,
      to: activeConversation.clientId,
      text,
      conversationId: activeConversation.conversationId,
      clientId: activeConversation.clientId,
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
            {convos.map(c => (
              <li key={c.conversationId}>
                <button
                  className={c.clientId === activeConversation?.clientId ? "active" : ""}
                  onClick={() => setActiveConversation(c)}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section className="chat-window">
        {!activeConversation ? (
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
