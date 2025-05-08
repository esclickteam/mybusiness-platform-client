// src/pages/BusinessChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./BusinessChatPage.css";

const API_BASE = "https://api.esclick.co.il";

export default function BusinessChatPage() {
  const { user } = useAuth();
  const businessId = user?.businessId;
  const [convos, setConvos]       = useState([]);
  const [activeClient, setActiveClient] = useState(null);
  const [messages, setMessages]   = useState([]);
  const [newText, setNewText]     = useState("");
  const socketRef = useRef(null);

  // 1) Load conversations once
  useEffect(() => {
    if (!businessId) return;
    axios
      .get(`${API_BASE}/api/messages/conversations`, { withCredentials: true })
      .then(res => {
        setConvos(res.data);
        if (res.data.length > 0) {
          setActiveClient(res.data[0].clientId);
        }
      })
      .catch(console.error);
  }, [businessId]);

  // 2) Load messages when activeClient changes
  useEffect(() => {
    if (!activeClient) return;
    axios
      .get(`${API_BASE}/api/messages/conversations/${activeClient}`, { withCredentials: true })
      .then(res => setMessages(res.data))
      .catch(console.error);
  }, [activeClient]);

  // 3) Setup Socket.IO
  useEffect(() => {
    if (!businessId) return;
    const socket = io(API_BASE, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("registerBusiness", businessId);
    });

    socket.on("newMessage", msg => {
      // Determine the clientId from the incoming message
      // It might come as msg.clientId, or msg.fromUser, or msg.from
      const clientId = msg.clientId || msg.fromUser || msg.from;
      
      // If this is a brand-new conversation, add to the sidebar
      setConvos(prev => {
        if (!prev.find(c => c.clientId === clientId)) {
          return [...prev, { clientId, name: msg.name || msg.fromName || "לקוח" }];
        }
        return prev;
      });

      // If the message belongs to the open chat, append it
      if (clientId === activeClient) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => socket.disconnect();
  }, [businessId, activeClient]);

  // 4) Send a new message
  const sendMessage = () => {
    if (!newText.trim() || !activeClient || !socketRef.current) return;
    const msg = {
      from: businessId,
      to: "client",
      toId: activeClient,
      text: newText.trim(),
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
        <ul>
          {convos.map(c => (
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
      </aside>

      <section className="chat-window">
        {!activeClient ? (
          <p className="placeholder">בחר שיחה כדי להתחיל</p>
        ) : (
          <>
            <div className="messages-list">
              {messages.map(m => (
                <div
                  key={m.id || m._id}
                  className={`message-item ${
                    (m.from === businessId || m.fromUser === businessId)
                      ? "outgoing"
                      : "incoming"
                  }`}
                >
                  <p>{m.text || m.content}</p>
                  <small>
                    {new Date(m.timestamp).toLocaleTimeString()}
                  </small>
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
