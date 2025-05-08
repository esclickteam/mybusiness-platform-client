// src/components/ChatComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiSend, FiPaperclip } from 'react-icons/fi';
import API from '../api';
import './ChatComponent.css';

const socket = io('https://api.esclick.co.il', { autoConnect: false });

export default function ChatComponent({
  userId,
  clientProfilePic,
  businessProfilePic,
  isBusiness = false
}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [file, setFile] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const containerRef = useRef();

  // Load chat history
  useEffect(() => {
    async function loadHistory() {
      try {
        const endpoint = isBusiness
          ? `/api/messages/business/${userId}`
          : `/api/messages/client/${userId}`;
        const response = await API.get(endpoint);
        setMessages(response.data);
      } catch (err) {
        console.error('Error loading history:', err);
      }
    }

    if (userId) {
      loadHistory();
    }
  }, [userId, isBusiness]);

  // Connect & register socket
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (userId && token) {
      socket.auth = { userId, token };
      socket.connect();

      const event = isBusiness ? 'registerBusiness' : 'registerClient';
      socket.emit(event, userId);

      socket.on('newMessage', (msg) => {
        socket.emit('messageDelivered', { messageId: msg.id });
        setMessages((prev) => [...prev, { ...msg, delivered: true }]);
      });

      socket.on('messageDelivered', ({ messageId }) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, delivered: true } : m))
        );
      });

      socket.on('messageRead', ({ messageId }) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, read: true } : m))
        );
      });

      socket.on('typing', ({ from }) => {
        setTypingUsers((prev) => Array.from(new Set([...prev, from])));
      });

      socket.on('stopTyping', ({ from }) => {
        setTypingUsers((prev) => prev.filter((id) => id !== from));
      });

      socket.on('connect_error', (err) => console.error('Socket error:', err));
    }

    return () => {
      socket.off();
      socket.disconnect();
    };
  }, [userId, isBusiness]);

  // Mark read
  useEffect(() => {
    messages
      .filter((m) => m.delivered && !m.read)
      .forEach((m) => {
        socket.emit('messageRead', { messageId: m.id });
      });
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  // Typing indicator
  const renderTyping = () => {
    const others = typingUsers.filter((id) => id !== userId);
    if (others.length === 0) return null;
    const names = others.map((id) => (id === userId ? 'אתה' : 'העסק'));
    return <div className="chat__typing">{names.join(', ')} מקלידים…</div>;
  };

  // Handle typing
  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit('typing', { from: userId });
    if (handleTyping.timeout) clearTimeout(handleTyping.timeout);
    handleTyping.timeout = setTimeout(() => {
      socket.emit('stopTyping', { from: userId });
    }, 1000);
  };

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text && !file) return;
    setIsSending(true);

    const msg = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toISOString(),
      from: isBusiness ? 'business' : 'client',
      to: isBusiness ? 'client' : 'business',
      file: file ? file.name : null,
    };

    socket.emit('sendMessage', msg, (ack) => {
      if (ack && ack.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, delivered: true } : m))
        );
      }
    });

    setMessages((prev) => [...prev, msg]);
    setMessage('');
    setFile(null);
    setIsSending(false);
  };

  // Handle file change
  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  return (
    <div className="chat">
      <header className="chat__header">צ'אט עם העסק</header>
      <div className="chat__body" ref={containerRef}>
        {messages.map((msg, idx) => {
          const isClient = msg.from === 'client';
          const time = new Date(msg.timestamp).toLocaleTimeString('he-IL', {
            hour: '2-digit',
            minute: '2-digit',
          });
          return (
            <div
              key={msg.id || idx}
              className={`chat__message ${
                isClient ? 'chat__message--client' : 'chat__message--biz'
              }`}>
              <img
                className="chat__avatar"
                src={isClient ? clientProfilePic : businessProfilePic}
                alt=""
                aria-hidden="true"
              />
              <div className="chat__content">
                {msg.text && <div className="chat__text">{msg.text}</div>}
                {msg.file && (
                  <a href={`/files/${msg.file}`} download className="chat__file">
                    {msg.file}
                  </a>
                )}
                <div className="chat__meta">
                  <span className="chat__time">{time}</span>
                  {msg.delivered && <span className="chat__status">✔</span>}
                  {msg.read && <span className="chat__status">✔✔</span>}
                </div>
              </div>
            </div>
          );
        })}
        {renderTyping()}
      </div>
      <form className="chat__input" onSubmit={sendMessage}>
        <label className="chat__attach">
          <FiPaperclip size={20} />
          <input type="file" onChange={handleFile} />
        </label>
        <input
          type="text"
          value={message}
          onChange={handleTyping}
          placeholder="כתוב הודעה..."
          aria-label="כתוב הודעה"
        />
        <button
          type="submit"
          disabled={isSending && !file}
          className="chat__send"
          aria-label="שלח הודעה"
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
}
