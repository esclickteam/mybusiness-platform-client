import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiSend, FiPaperclip } from 'react-icons/fi';
import API from '../api';
import './ChatComponent.css';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = 'https://api.esclick.co.il';
const API_BASE   = 'https://api.esclick.co.il/api/conversations';

export default function ChatComponent({ partnerId, conversationId, isBusiness = false }) {
  const { user } = useAuth();
  const userId = user?.id;

  const [message, setMessage]         = useState('');
  const [messages, setMessages]       = useState([]);
  const [isSending, setIsSending]     = useState(false);
  const [file, setFile]               = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);

  const containerRef = useRef(null);
  const socketRef    = useRef(null);

  // Load conversation history
  useEffect(() => {
    if (!conversationId) return;
    API.get(`${API_BASE}/${conversationId}/messages`, { withCredentials: true })
      .then(({ data }) => setMessages(data))
      .catch(err => console.error('Error loading history', err));
  }, [conversationId]);

  // Socket.IO setup
  useEffect(() => {
    if (!conversationId || !userId) return;
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: { token: localStorage.getItem('token') }
    });
    socketRef.current = socket;

    socket.on('connect', () => socket.emit('joinRoom', conversationId));
    socket.on('newMessage', msg => setMessages(prev => [...prev, msg]));
    socket.on('typing', ({ from }) => setTypingUsers(prev => [...new Set([...prev, from])]));
    socket.on('stopTyping', ({ from }) => setTypingUsers(prev => prev.filter(id => id !== from)));

    return () => socket.disconnect();
  }, [conversationId, userId]);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages, typingUsers]);

  // Typing indicator
  const handleTyping = e => {
    setMessage(e.target.value);
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit('typing', { conversationId, from: userId });
    clearTimeout(handleTyping.timeout);
    handleTyping.timeout = setTimeout(
      () => socket.emit('stopTyping', { conversationId, from: userId }),
      800
    );
  };

  // Send message
  const sendMessage = async e => {
    e?.preventDefault();
    if (!userId || !conversationId) return;

    const text = message.trim();
    if (!text && !file) return;

    const tempId = Date.now().toString();
    const optimistic = { id: tempId, from: userId, to: partnerId, text, fileName: file?.name, timestamp: new Date().toISOString(), delivered: false };
    setMessages(prev => [...prev, optimistic]);
    setIsSending(true);

    const socket = socketRef.current;
    if (socket.connected) {
      socket.emit('sendMessage', { conversationId, text, fileUrl: '' }, ({ success, messageId }) => {
        setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: messageId, delivered: success } : m));
        setIsSending(false);
      });
    } else {
      const form = new FormData();
      if (file) form.append('fileData', file);
      form.append('text', text);
      try {
        const { data: saved } = await API.post(
          `${API_BASE}/${conversationId}/messages`,
          form,
          { withCredentials: true }
        );
        setMessages(prev => prev.map(m => m.id === tempId ? { ...saved, delivered: true } : m));
      } catch (err) {
        console.error('Error sending via REST:', err);
      } finally {
        setIsSending(false);
      }
    }

    setMessage('');
    setFile(null);
  };

  const onKeyDown = e => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(e); };
  const handleFile = e => { setFile(e.target.files[0] || null); };

  const renderTyping = () => {
    const others = typingUsers.filter(id => id !== userId);
    if (!others.length) return null;
    const names = others.map(id => id === partnerId ? (isBusiness ? 'לקוח' : 'עסק') : '…').join(', ');
    return <div className="chat__typing">…{names} מקלידים…</div>;
  };

  return (
    <div className="chat">
      <header className="chat__header">צ'אט</header>
      <div className="chat__body" ref={containerRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat__message ${m.from === userId ? 'mine' : 'theirs'}`}> 
            <div className="chat__bubble">
              {m.text && <p className="chat__text">{m.text}</p>}
              {m.fileUrl && (
                <div className="chat__attachment">
                  {/\.(jpe?g|gif|png)$/i.test(m.fileName) ? (
                    <img src={m.fileUrl} alt={m.fileName} className="chat__img" />
                  ) : (
                    <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="chat__file-link">
                      הורד {m.fileName}
                    </a>
                  )}
                </div>
              )}
              <div className="chat__meta">
                <span className="chat__time">{new Date(m.timestamp).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'})}</span>
                {m.delivered && <span className="chat__status">✔</span>}
              </div>
            </div>
          </div>
        ))}
        {renderTyping()}
      </div>
      <form className="chat__input" onSubmit={sendMessage}>
        <button type="submit" disabled={isSending && !message.trim()}><FiSend size={20} /></button>
        <input type="text" placeholder="כתוב הודעה..." value={message} onChange={handleTyping} onKeyDown={onKeyDown} />
        <label className="chat__attach"><FiPaperclip size={20} /><input type="file" onChange={handleFile} /></label>
      </form>
    </div>
  );
}