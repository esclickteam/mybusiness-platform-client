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

  const containerRef = useRef(null);
  const socketRef    = useRef(null);

  // Load history on conversationId change
  useEffect(() => {
    if (!conversationId) return;
    API.get(`${API_BASE}/conversations/${conversationId}`, { withCredentials: true })
      .then(({ data }) => setMessages(data))
      .catch(err => console.error('Error loading history', err));
  }, [conversationId]);

  // Initialize socket and join room
  useEffect(() => {
    if (!conversationId || !userId) return;
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinRoom', conversationId);
    });

    socket.on('newMessage', msg => {
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

  // Typing indicator
  const handleTyping = e => {
    setMessage(e.target.value);
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit('typing', { conversationId, from: userId });
    clearTimeout(handleTyping.timeout);
    handleTyping.timeout = setTimeout(() => {
      socket.emit('stopTyping', { conversationId, from: userId });
    }, 800);
  };

  // Send message (WS or REST fallback)
  const sendMessage = async e => {
    e?.preventDefault();
    console.log('🔔 sendMessage fired:', { message, file, conversationId });
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

    const socket = socketRef.current;
    if (socket) {
      socket.emit('sendMessage', optimisticMsg, ack => {
        console.log('sendMessage ack:', ack);
        if (ack.success) {
          setMessages(prev =>
            prev.map(m =>
              m.id === tempId
                ? { ...m, id: ack.messageId, delivered: true }
                : m
            )
          );
        }
        setIsSending(false);
      });
    } else {
      // REST fallback
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
        setMessages(prev => [
          ...prev.filter(m => m.id !== tempId),
          { ...res.data, delivered: true }
        ]);
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
      <div className="chat__body" ref={containerRef}>
        {messages.map((m, idx) => {
          const isMine = m.from === userId;
          return (
            <div key={m.id || idx} className={`chat__message ${isMine ? 'mine' : 'theirs'}`}>
              <div className="chat__bubble">
                {m.content && <p className="chat__text">{m.content}</p>}
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
                  <span className="chat__time">
                    {new Date(m.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
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