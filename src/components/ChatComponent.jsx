import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiSend, FiPaperclip } from 'react-icons/fi';
import API from '../api';
import './ChatComponent.css';
import { useAuth } from '../context/AuthContext';

// Ensure your .env has REACT_APP_API_URL, default to fallback if missing
const SOCKET_URL = process.env.REACT_APP_API_URL || 'https://api.esclick.co.il';

export default function ChatComponent({
  partnerId,
  isBusiness = false,
}) {
  const { user, initialized } = useAuth();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [partnerName, setPartnerName] = useState('');
  const containerRef = useRef(null);
  const socketRef = useRef(null);

  const userId = user?.userId;
  const currentName = isBusiness
    ? (user?.businessName || 'העסק')
    : (user?.name || 'הלקוח');

  // Fetch partner name
  useEffect(() => {
    if (!partnerId) return;
    const endpoint = isBusiness
      ? `/users/${partnerId}`
      : `/business/${partnerId}`;
    API.get(endpoint)
      .then(res => {
        const data = isBusiness ? res.data.user : res.data.business;
        const name = isBusiness
          ? (data.name || data.fullName)
          : data.businessName;
        setPartnerName(name || '---');
      })
      .catch(() => setPartnerName('---'));
  }, [partnerId, isBusiness]);

  // Load or create conversation, then fetch messages
  useEffect(() => {
    if (!initialized || !userId || !partnerId) return;
    (async () => {
      try {
        const { data: convos } = await API.get(
          '/messages/conversations'
        );

        const existing = Array.isArray(convos)
          ? convos.find(c =>
              c.participants.includes(userId) &&
              c.participants.includes(partnerId)
            )
          : null;

        let convId = existing?._id;
        if (!convId) {
          const { data: created } = await API.post(
            '/messages/conversations',
            { otherId: partnerId }
          );
          convId = created.conversationId;
        }

        setConversationId(convId);

        if (convId) {
          const { data: msgs } = await API.get(
            `/messages/conversations/${convId}/messages`
          );
          setMessages(msgs);
        }
      } catch (err) {
        console.error('Error loading conversation:', err);
      }
    })();
  }, [initialized, userId, partnerId]);

  // Setup Socket.IO for real-time
  useEffect(() => {
    if (!conversationId) return;
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: { token: sessionStorage.getItem('token') },
    });
    socketRef.current = socket;

    socket.on('connect', () =>
      console.log('⚡ Socket connected, joined room:', conversationId)
    );
    socket.on('connect_error', err =>
      console.error('⚠️ Socket.IO error:', err)
    );

    socket.emit('joinRoom', conversationId);

    socket.on('newMessage', msg => {
      console.log('📥 newMessage', msg);
      setMessages(prev => [...prev, msg]);
    });
    socket.on('typing', ({ from }) =>
      setTypingUsers(prev => Array.from(new Set([...prev, from])))
    );
    socket.on('stopTyping', ({ from }) =>
      setTypingUsers(prev => prev.filter(id => id !== from))
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [conversationId]);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!initialized) return null;

  // Typing
  const handleTyping = e => {
    setText(e.target.value);
    if (socketRef.current) {
      socketRef.current.emit('typing', {
        conversationId,
        from: userId,
      });
      clearTimeout(handleTyping.timeout);
      handleTyping.timeout = setTimeout(() => {
        socketRef.current.emit('stopTyping', {
          conversationId,
          from: userId,
        });
      }, 800);
    }
  };

  const renderTyping = () => {
    const others = typingUsers.filter(id => id !== userId);
    if (!others.length) return null;
    const names = others
      .map(id => (id === partnerId ? partnerName : 'מישהו'))
      .join(', ');
    return <div className="chat__typing">…{names} מקלידים…</div>;
  };

  // Send
  const sendMessage = async e => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed && !file) return;

    setIsSending(true);
    const timestamp = new Date().toISOString();
    // Optimistic update
    setMessages(prev => [
      ...prev,
      { from: userId, to: partnerId, text: trimmed, timestamp, delivered: false },
    ]);

    try {
      const form = new FormData();
      if (file) form.append('fileData', file);
      form.append('text', trimmed);

      const { data: saved } = await API.post(
        `/messages/conversations/${conversationId}/messages`,
        form
      );

      setMessages(prev =>
        prev.map(m =>
          m.timestamp === timestamp ? { ...saved, delivered: true } : m
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
      setText('');
      setFile(null);
    }
  };

  return (
    <div className="chat">
      <header className="chat__header">
        {currentName} – {partnerName || '...'}
      </header>
      <div className="chat__body" ref={containerRef}>
        {messages.map(m => (
          <div
            key={m._id || m.timestamp}
            className={`chat__message ${
              m.from === userId ? 'mine' : 'theirs'
            }`}
          >
            <div className="chat__bubble">
              <div className="chat__sender-name">
                {m.from === userId ? currentName : partnerName}
              </div>
              {m.text && <p className="chat__text">{m.text}</p>}
              {m.fileUrl && (
                <div className="chat__attachment">
                  {/(jpe?g|png|gif)/i.test(m.fileName) ? (
                    <img
                      src={m.fileUrl}
                      alt={m.fileName}
                      className="chat__img"
                    />
                  ) : (
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      הורד {m.fileName}
                    </a>
                  )}
                </div>
              )}
              <div className="chat__meta">
                <span className="chat__time">
                  {new Date(m.timestamp).toLocaleTimeString('he-IL', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {m.delivered && <span className="chat__status">✔</span>}
              </div>
            </div>
          </div>
        ))}
        {renderTyping()}
      </div>
      <form className="chat__input" onSubmit={sendMessage}>
        <button type="submit" disabled={isSending || (!text.trim() && !file)}>
          <FiSend size={20} />
        </button>
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder="כתוב הודעה..."
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(e)}
        />
        <label className="chat__attach">
          <FiPaperclip size={20} />
          <input
            type="file"
            onChange={e => setFile(e.target.files[0] || null)}
          />
        </label>
      </form>
    </div>
  );
}
