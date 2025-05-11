import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiSend, FiPaperclip } from 'react-icons/fi';
import API from '../api';
import './ChatComponent.css';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = 'https://api.esclick.co.il';

export default function ChatComponent({ partnerId, isBusiness = false }) {
  const { user, initialized } = useAuth();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [partnerName, setPartnerName] = useState('');
  const containerRef = useRef(null);
  const socketRef = useRef(null);

  // מזהה המשתמש הנוכחי
  const userId = user?.userId;
  // השם שיוצג עבור המשתמש הנוכחי
  const currentName = isBusiness
    ? (user?.businessName || 'העסק')
    : (user?.name || 'הלקוח');

  // טוען את השם של השותף לשיחה (עסק <-> לקוח)
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
        setPartnerName(name || '');
      })
      .catch(console.error);
  }, [partnerId, isBusiness]);

  // טוען או יוצר שיחה וקורא את ההודעות הראשוניות
  useEffect(() => {
    if (!userId || !partnerId) return;
    (async () => {
      try {
        const { data: convos } = await API.get('/messages/conversations', { withCredentials: true });
        const convo = convos.find(c =>
          c.participants.some(p => p.toString() === partnerId)
        );
        if (convo) {
          setConversationId(convo._id);
          const { data: msgs } = await API.get(
            `/messages/${convo._id}/messages`,
            { withCredentials: true }
          );
          setMessages(msgs);
        }
      } catch (err) {
        console.error('Error loading conversation:', err);
      }
    })();
  }, [partnerId, userId]);

  // הגדרת Socket.IO
  useEffect(() => {
    if (!conversationId) return;
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: { token: localStorage.getItem('token') },
    });
    socketRef.current = socket;
    socket.emit('joinRoom', conversationId);

    socket.on('newMessage', msg => {
      setMessages(prev => [...prev, msg]);
    });
    socket.on('typing', ({ from }) => {
      setTypingUsers(prev => Array.from(new Set([...prev, from])));
    });
    socket.on('stopTyping', ({ from }) => {
      setTypingUsers(prev => prev.filter(id => id !== from));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [conversationId]);

  // גלילה לתחתית בהודעות חדשות
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!initialized) return null;

  // טיפול בטייפינג
  const handleTyping = e => {
    setMessage(e.target.value);
    if (!socketRef.current || !conversationId) return;
    socketRef.current.emit('typing', { conversationId, from: userId });
    clearTimeout(handleTyping.timeout);
    handleTyping.timeout = setTimeout(() => {
      socketRef.current.emit('stopTyping', { conversationId, from: userId });
    }, 800);
  };

  // שליחת הודעה
  const sendMessage = async e => {
    e?.preventDefault();
    const text = message.trim();
    if (!text && !file) return;

    setIsSending(true);
    const tempId = Date.now().toString();

    // הודעה אופטימית
    const optimisticMsg = {
      id: tempId,
      from: userId,
      to: partnerId,
      text,
      fileName: file?.name,
      timestamp: new Date().toISOString(),
      delivered: false,
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      let convId = conversationId;
      if (!convId) {
        const { data } = await API.post(
          '/messages',
          { otherId: partnerId },
          { withCredentials: true }
        );
        convId = data.conversationId;
        setConversationId(convId);
      }

      const form = new FormData();
      if (file) form.append('fileData', file);
      form.append('text', text);

      const { data: saved } = await API.post(
        `/messages/${convId}/messages`,
        form,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setMessages(prev =>
        prev.map(m => (m.id === tempId ? { ...saved, delivered: true } : m))
      );
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
      setMessage('');
      setFile(null);
    }
  };

  // הצגת טייפינג
  const renderTyping = () => {
    const others = typingUsers.filter(id => id !== userId);
    if (!others.length) return null;
    const names = others
      .map(id => (id === partnerId ? partnerName : 'מישהו'))
      .join(', ');
    return <div className="chat__typing">…{names} מקלידים…</div>;
  };

  return (
    <div className="chat">
      <header className="chat__header">
        {currentName} – {partnerName || '...'}
      </header>

      <div className="chat__body" ref={containerRef}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`chat__message ${m.from === userId ? 'mine' : 'theirs'}`}
          >
            <div className="chat__bubble">
              {m.text && <p className="chat__text">{m.text}</p>}
              {m.fileUrl && (
                <div className="chat__attachment">
                  {/\.(jpe?g|gif|png)$/i.test(m.fileName) ? (
                    <img src={m.fileUrl} alt={m.fileName} className="chat__img" />
                  ) : (
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chat__file-link"
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
        <button
          type="submit"
          disabled={isSending || (!message.trim() && !file)}
        >
          <FiSend size={20} />
        </button>
        <input
          type="text"
          placeholder="כתוב הודעה..."
          value={message}
          onChange={handleTyping}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) sendMessage(e);
          }}
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
