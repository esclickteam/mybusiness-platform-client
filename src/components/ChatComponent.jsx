// src/components/ChatComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiSend, FiPaperclip } from 'react-icons/fi';
import API from '../api';
import './ChatComponent.css';

const SOCKET_URL = 'https://api.esclick.co.il';
const API_BASE = 'https://api.esclick.co.il/api/messages';

export default function ChatComponent({
  userId,
  partnerId,
  clientProfilePic,
  businessProfilePic,
  isBusiness = false
}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [file, setFile] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [socketReady, setSocketReady] = useState(false);

  const containerRef = useRef(null);
  const socketRef = useRef(null);

  // 1) Load chat history
  useEffect(() => {
    if (!userId || !partnerId) return;
    const endpoint = isBusiness
      ? `${API_BASE}/conversations/${partnerId}`
      : `${API_BASE}/client/${partnerId}`;

    API.get(endpoint, { withCredentials: true })
      .then(({ data }) => setMessages(data))
      .catch(console.error);
  }, [userId, partnerId, isBusiness]);

  // 2) Setup Socket.IO once
  useEffect(() => {
    if (!userId || !partnerId) return;

    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketReady(true);
      const room = isBusiness
        ? `chat:business:${userId}:client:${partnerId}`
        : `chat:business:${partnerId}:client:${userId}`;
      socket.emit('joinRoom', room);
    });

    socket.on('newMessage', msg => {
      setMessages(prev => [...prev, msg]);
      socket.emit('messageDelivered', { messageId: msg.id });
    });

    socket.on('typing', ({ from }) => setTypingUsers(prev => Array.from(new Set([...prev, from]))));
    socket.on('stopTyping', ({ from }) => setTypingUsers(prev => prev.filter(id => id !== from)));

    return () => {
      socket.off();
      socket.disconnect();
    };
  }, [userId, partnerId, isBusiness]);

  // 3) Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  // 4) Typing indicator
  const handleTyping = e => {
    setMessage(e.target.value);
    const socket = socketRef.current;
    if (socketReady && socket) {
      socket.emit('typing', { from: userId });
      clearTimeout(handleTyping.timeout);
      handleTyping.timeout = setTimeout(() => {
        socket.emit('stopTyping', { from: userId });
      }, 800);
    }
  };

  // 5) Send message (Socket.IO or REST fallback)
  const sendMessage = async (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text && !file) return;

    // הדפסת הערכים כדי לוודא שהם לא undefined
    console.log('userId:', userId);  // מזהה הלקוח
    console.log('partnerId:', partnerId);  // מזהה העסק

    // ודא שהמזהים קיימים לפני שליחה
    if (!userId || !partnerId) {
      console.error('מזהה הלקוח או מזהה העסק לא מוגדרים');
      return;
    }

    setIsSending(true);

    // ההודעה הזמנית ל-optimistic UI
    const tempId = Date.now().toString();
    const optimisticMsg = {
      id: tempId,
      from: userId,          // מזהה הלקוח
      to: partnerId,         // מזהה העסק
      text,
      fileName: file?.name || null,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);

    const socket = socketRef.current;
    if (socketReady && socket) {
      socket.emit('sendMessage', optimisticMsg, ack => {
        if (ack.success) {
          setMessages(prev =>
            prev.map(m => m.id === tempId ? { ...m, id: ack.messageId, delivered: true } : m)
          );
        }
        setIsSending(false);
      });
    } else {
      // שליחה דרך API (fallback במקרה שאין Socket.IO)
      const formData = new FormData();
      formData.append("client", userId);          // מזהה הלקוח
      formData.append("business", partnerId);    // מזהה העסק
      formData.append("fromName", "John Doe");   // שם השולח
      formData.append("content", text);          // תוכן ההודעה
      if (file) formData.append("file", file);  // אם יש קובץ, נוסיף אותו

      try {
        const response = await API.post('/api/messages/send', formData, { withCredentials: true });
        setMessages(prev =>
          prev.map(m => m.id === tempId ? { ...response.data, delivered: true } : m)
        );
      } catch (error) {
        console.error("שגיאה בשליחת ההודעה", error);
      } finally {
        setIsSending(false);
      }
    }

    setMessage("");
    setFile(null);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) sendMessage(e);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const renderTyping = () => {
    const others = typingUsers.filter(id => id !== userId);
    if (!others.length) return null;
    return (
      <div className="chat__typing">
        …{others.map(id => id === partnerId ? 'אתה' : 'העסק').join(', ')} מקלידים
      </div>
    );
  };

  return (
    <div className="chat">
      <header className="chat__header">צ'אט</header>
      <div className="chat__body" ref={containerRef}>
        {messages.map((m, idx) => {
          const isMine = m.from === userId;
          const avatar = isMine
            ? (isBusiness ? businessProfilePic : clientProfilePic)
            : (isBusiness ? clientProfilePic : businessProfilePic);
          return (
            <div key={m.id || idx} className={`chat__message ${isMine ? 'mine' : 'theirs'}`}>
              <img src={avatar} className="chat__avatar" alt="" />
              <div className="chat__bubble">
                {m.text && <p className="chat__text">{m.text}</p>}
                {m.fileName && <p className="chat__file">{m.fileName}</p>}
                <div className="chat__meta">
                  <span className="chat__time">
                    {new Date(m.timestamp).toLocaleTimeString('he-IL', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                  {m.delivered && <span className="chat__status">✔</span>}
                </div>
              </div>
            </div>
          );
        })}
        {renderTyping()}
      </div>

      <form className="chat__input" onSubmit={sendMessage}>
        <button type="submit" disabled={isSending && !file && !message.trim()}>
          <FiSend size={20} />
        </button>
        <input
          type="text"
          placeholder="כתוב הודעה..."
          value={message}
          onChange={handleTyping}
          onKeyDown={onKeyDown}
        />
        <label className="chat__attach">
          <FiPaperclip size={20} />
          <input type="file" onChange={handleFile} />
        </label>
      </form>
    </div>
  );
}
