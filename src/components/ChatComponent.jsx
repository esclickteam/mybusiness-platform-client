import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiSend, FiPaperclip } from 'react-icons/fi';
import API from '../api';
import './ChatComponent.css';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = 'https://api.esclick.co.il';
const API_BASE   = 'https://api.esclick.co.il/api/messages';

export default function ChatComponent({
  partnerId,
  conversationId,
  clientProfilePic,
  businessProfilePic,
  isBusiness = false
}) {
  const { user } = useAuth();
  const userId = user?.id;

  const [message, setMessage]         = useState('');
  const [messages, setMessages]       = useState([]);
  const [isSending, setIsSending]     = useState(false);
  const [file, setFile]               = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [socketReady, setSocketReady] = useState(false);

  const containerRef = useRef(null);
  const socketRef    = useRef(null);

  // Load history
  useEffect(() => {
    if (!conversationId) return;
    API.get(`${API_BASE}/conversations/${conversationId}`, { withCredentials: true })
      .then(({ data }) => setMessages(data))
      .catch(err => console.error('Error loading history', err));
  }, [conversationId]);

  // Socket.IO – connect and join room
  useEffect(() => {
    if (!conversationId || !userId) return;
    console.log('Socket setup props:', { conversationId, userId, partnerId });
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketReady(true);
      socket.emit('joinRoom', conversationId);
    });

    socket.on('newMessage', msg => {
      console.log('Received newMessage:', msg);
      if (msg.conversationId === conversationId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    socket.on('typing', ({ from }) =>
      setTypingUsers(prev => Array.from(new Set([...prev, from])))
    );
    socket.on('stopTyping', ({ from }) =>
      setTypingUsers(prev => prev.filter(id => id !== from))
    );

    return () => {
      socket.off('connect');
      socket.off('newMessage');
      socket.off('typing');
      socket.off('stopTyping');
      socket.disconnect();
    };
  }, [conversationId, userId]);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  // Typing indicator emitter
  const handleTyping = e => {
    setMessage(e.target.value);
    if (!socketReady || !userId) return;
    const socket = socketRef.current;
    socket.emit('typing', { conversationId, from: userId });
    clearTimeout(handleTyping.timeout);
    handleTyping.timeout = setTimeout(() => {
      socket.emit('stopTyping', { conversationId, from: userId });
    }, 800);
  };

  // Send message
  const sendMessage = async e => {
    e.preventDefault();
    console.log('🔔 sendMessage fired:', { message, file, socketReady, conversationId });

    if (!userId) return;
    const content = message.trim();
    if (!content && !file) return;

    const tempId = Date.now().toString();
    const optimisticMsg = {
      id: tempId,
      conversationId,
      from: userId,
      to: partnerId,
      content,
      fileName: file?.name || null,
      timestamp: new Date().toISOString(),
      delivered: false
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setIsSending(true);

    if (socketReady) {
      const socket = socketRef.current;
      socket.emit('sendMessage', optimisticMsg, ack => {
        console.log('sendMessage ack:', ack);
        setMessages(prev =>
          prev.map(m =>
            m.id === tempId
              ? { ...m, id: ack.messageId, delivered: true }
              : m
          )
        );
        setIsSending(false);
      });
    } else {
      const formData = new FormData();
      formData.append('conversationId', conversationId);
      formData.append('to', partnerId);
      formData.append('clientId', userId);
      formData.append('text', content);
      if (file) formData.append('fileData', file);
      try {
        console.log('Sending via REST fallback');
        const res = await API.post(`${API_BASE}/send`, formData, { withCredentials: true });
        console.log('REST response:', res.data);
        setMessages(prev =>
          prev.map(m => (m.id === tempId ? { ...res.data, delivered: true } : m))
        );
      } catch (err) {
        console.error('❌ Error sending message via REST:', err);
      } finally {
        setIsSending(false);
      }
    }

    setMessage('');
    setFile(null);
  };

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) sendMessage(e);
  };
  const handleFile = e => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const renderTyping = () => {
    const others = typingUsers.filter(id => id !== userId);
    if (!others.length) return null;
    return (
      <div className="chat__typing">
        …{others.map(id => (id === partnerId ? 'אתה' : 'העסק')).join(', ')} מקלידים…
      </div>
    );
  };

  return (
    <div className="chat">
      <header className="chat__header">צ'אט</header>
      <div className="chat__body" ref={containerRef}></div>

      <form className="chat__input" onSubmit={sendMessage}>
        <button
          type="button"
          onClick={sendMessage}
          disabled={isSending && !file && !message.trim()}
        >
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