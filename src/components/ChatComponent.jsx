// src/components/ChatComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiSend, FiPaperclip, FiImage, FiMic, FiFileText } from 'react-icons/fi';
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
  const containerRef = useRef(null);

  // Load chat history
  useEffect(() => {
    async function loadHistory() {
      try {
        const endpoint = isBusiness
          ? '/api/business/my/messages'        // עבור עסק מחובר
          : `/api/messages/client/${userId}`; // עבור לקוח
  
        const { data } = await API.get(endpoint);
        setMessages(isBusiness ? data.messages : data);
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  
    if (userId) loadHistory();
  }, [userId, isBusiness]);
  
  
  
  

  // Connect & register socket
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (userId && token) {
      socket.auth = { userId, token };
      socket.connect();

      const registerEvent = isBusiness ? 'registerBusiness' : 'registerClient';
      socket.emit(registerEvent, userId);

      socket.on('newMessage', msg => {
        socket.emit('messageDelivered', { messageId: msg.id });
        setMessages(prev => [...prev, { ...msg, delivered: true }]);
      });

      socket.on('messageDelivered', ({ messageId }) => {
        setMessages(prev =>
          prev.map(m => (m.id === messageId ? { ...m, delivered: true } : m))
        );
      });

      socket.on('messageRead', ({ messageId }) => {
        setMessages(prev =>
          prev.map(m => (m.id === messageId ? { ...m, read: true } : m))
        );
      });

      socket.on('typing', ({ from }) => {
        setTypingUsers(prev => Array.from(new Set([...prev, from])));
      });

      socket.on('stopTyping', ({ from }) => {
        setTypingUsers(prev => prev.filter(id => id !== from));
      });

      socket.on('connect_error', err => console.error('Socket error:', err));
    }

    return () => {
      socket.off('newMessage');
      socket.off('messageDelivered');
      socket.off('messageRead');
      socket.off('typing');
      socket.off('stopTyping');
      socket.disconnect();
    };
  }, [userId, isBusiness]);

  // Mark read on display
  useEffect(() => {
    messages.forEach(msg => {
      if (msg.delivered && !msg.read) socket.emit('messageRead', { messageId: msg.id });
    });
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages, typingUsers]);

  const renderTypingIndicator = () => {
    const others = typingUsers.filter(id => id !== userId);
    if (!others.length) return null;
    return (
      <div className="chat__typing">
        {others.map(id => (id === userId ? 'אתה' : 'העסק')).join(', ')} מקלידים…
      </div>
    );
  };

  const handleTyping = e => {
    setMessage(e.target.value);
    socket.emit('typing', { from: userId });
    clearTimeout(handleTyping.timeout);
    handleTyping.timeout = setTimeout(() => socket.emit('stopTyping', { from: userId }), 1000);
  };

  const sendMessage = e => {
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
      file: file ? file.name : null
    };

    socket.emit('sendMessage', msg, ack => {
      if (ack.success) {
        setMessages(prev =>
          prev.map(m => (m.id === msg.id ? { ...m, delivered: true } : m))
        );
      }
    });

    setMessages(prev => [...prev, msg]);
    setMessage('');
    setFile(null);
    setIsSending(false);
  };

  const handleFile = e => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  return (
    <div className="chat">
      <header className="chat__header">צ'אט עם העסק</header>
      <div className="chat__body" ref={containerRef}>
        {messages.map((msg, idx) => {
          const isClient = msg.from === 'client';
          const time = new Date(msg.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
          return (
            <div
              key={msg.id || idx}
              className={`chat__message ${
                isClient ? 'chat__message--client' :  'chat__message--biz'
              }`}>
              <img className="chat__avatar" src={isClient ? clientProfilePic : businessProfilePic} alt="" />
              <div className="chat__content">
                {msg.text && <div className="chat__text">{msg.text}</div>}
                {msg.file && <div className="chat__file">{msg.file}</div>}
                <div className="chat__meta">
                  <span className="chat__time">{time}</span>
                  {msg.delivered && <span className="chat__status">✔</span>}
                  {msg.read && <span className="chat__status">✔✔</span>}
                </div>
              </div>
            </div>
          );
        })}
        {renderTypingIndicator()}
      </div>

      {/* Updated input row */}
      <form className="chat__input" onSubmit={sendMessage}>
        <button type="submit" className="chat__send-text" disabled={isSending && !file}>
          <FiSend size={24} />
        </button>
        <div className="chat__input-field">
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="כתוב הודעה..."
          />
        </div>
        <label className="chat__attach">
          <FiPaperclip size={24} />
          <input type="file" onChange={handleFile} />
        </label>
      </form>
    </div>
  );
}
