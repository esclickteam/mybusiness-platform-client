// src/pages/BusinessChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./BusinessChatPage.css";

const API_BASE = "https://api.esclick.co.il";

export default function BusinessChatPage() {
  const { user, loading: authLoading } = useAuth();
  const businessUserId = user?.id;

  const [convos, setConvos]                     = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages]                 = useState([]);
  const [newText, setNewText]                   = useState("");
  const socketRef = useRef(null);

  // 0) הגנה בשלב רינדור
  if (authLoading) {
    return <div className="loading-screen">🔄 מוודא הרשאה…</div>;
  }
  if (!businessUserId) {
    return <div className="error-screen">❌ אין לך הרשאת עסק לצ׳אט הזה</div>;
  }

  // 1) טען את רשימת השיחות
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/messages`, { withCredentials: true })
      .then(res => {
        // res.data = [{ _id, participants: [clientUserId, businessUserId] }, ...]
        const convosData = res.data.map(c => {
          const clientId = c.participants.find(p => p !== businessUserId);
          return {
            conversationId: c._id,
            clientId,
            name: clientId, // אם תרצו שם: תעשו populate ב-backend
          };
        });
        setConvos(convosData);
        if (convosData.length > 0) {
          setActiveConversation(convosData[0]);
        }
      })
      .catch(console.error);
  }, [businessUserId]);

  // 2) טען הודעות של שיחה נבחרת
  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }
    axios
      .get(
        `${API_BASE}/api/messages/${activeConversation.conversationId}/messages`,
        { withCredentials: true }
      )
      .then(res => setMessages(res.data))
      .catch(console.error);
  }, [activeConversation]);

  // 3) Socket.IO: חיבור, הצטרפות לחדר, קבלת הודעות בזמן אמת
  useEffect(() => {
    if (!activeConversation) return;

    const socket = io(API_BASE, {
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      // מצטרפים לחדר של השיחה הנבחרת
      socket.emit("joinRoom", activeConversation.conversationId);
    });

    socket.on("newMessage", msg => {
      // אם ההודעה שייכת לשיחה הנוכחית, מציגים
      if (msg.conversationId === activeConversation.conversationId) {
        setMessages(prev => [...prev, msg]);
      }
      // ואם זו שיחה שלא הייתה ברשימה, מוסיפים אותה לסיידבר
      setConvos(prev => {
        if (!prev.find(c => c.conversationId === msg.conversationId)) {
          const clientId = msg.from === businessUserId ? msg.to : msg.from;
          return [
            ...prev,
            { conversationId: msg.conversationId, clientId, name: clientId },
          ];
        }
        return prev;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [businessUserId, activeConversation]);

  // 4) שליחת הודעה
  const sendMessage = () => {
    const text = newText.trim();
    if (!text || !activeConversation || !socketRef.current) return;

    const msg = {
      conversationId: activeConversation.conversationId,
      from: businessUserId,
      to: activeConversation.clientId,
      text,
      timestamp: new Date().toISOString(),
    };

    socketRef.current.emit("sendMessage", msg, ack => {
      if (ack.success) {
        setMessages(prev => [...prev, msg]);
        setNewText("");
      } else {
        console.error("Failed to send message", ack.error);
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
                  className={
                    c.conversationId === activeConversation?.conversationId
                      ? "active"
                      : ""
                  }
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
                  key={m._id || idx}
                  className={`message-item ${
                    m.from === businessUserId ? "outgoing" : "incoming"
                  }`}
                >
                  <p>{m.text}</p>
                  <small>
                    {new Date(m.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
