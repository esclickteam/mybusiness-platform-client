import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiSend, FiPaperclip } from 'react-icons/fi';
import API from '../api';
import './ChatComponent.css';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = 'https://api.esclick.co.il';

export default function ChatComponent({ partnerId, isBusiness = false }) {
  const { user } = useAuth();
  const userId = user?.userId; // חשוב: user.userId

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  const containerRef = useRef(null);
  const socketRef = useRef(null);

  // 1) טען או צור שיחה
  useEffect(() => {
    if (!userId || !partnerId) return;

    (async () => {
      try {
        const { data: convos } = await API.get('/messages/conversations', { withCredentials: true });
        const convo = convos.find(c => c.participants.some(p => p.toString() === partnerId));

        if (convo) {
          setConversationId(convo._id);
          const { data: msgs } = await API.get(`/messages/${convo._id}/messages`, { withCredentials: true });
          setMessages(msgs);
        } else {
          setConversationId(null);
          setMessages([]);
          console.log("⏩ שיחה חדשה תיווצר...");
        }
      } catch (err) {
        console.error('שגיאה בשליפת שיחה:', err);
        setConversationId(null);
        setMessages([]);
      }
    })();
  }, [partnerId, userId]);

  // 2) הגדרת Socket.IO
  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: { token: localStorage.getItem('token') },
    });
    socketRef.current = socket;

    if (conversationId) {
      socket.emit('joinRoom', conversationId);
      console.log(`⏩ User ${userId} joined room ${conversationId}`);
      socket.on('newMessage', msg =>
        setMessages(prev => [...prev, msg])
      );
      socket.on('typing', ({ from }) =>
        setTypingUsers(prev => [...new Set([...prev, from])])
      );
      socket.on('stopTyping', ({ from }) =>
        setTypingUsers(prev => prev.filter(id => id !== from))
      );
    }

    return () => socket.disconnect();
  }, [conversationId, userId]);

  // גלילה אוטומטית למטה
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  // אינדיקטור הקלדה
  const handleTyping = e => {
    setMessage(e.target.value);
    const socket = socketRef.current;
    if (!socket || !conversationId) return;

    socket.emit('typing', { conversationId, from: userId });
    clearTimeout(handleTyping.timeout);
    handleTyping.timeout = setTimeout(() => {
      socket.emit('stopTyping', { conversationId, from: userId });
    }, 800);
  };

  // 3) שליחת הודעה (optimistic + יצירת שיחה)
  const sendMessage = async e => {
    e?.preventDefault();
    const text = message.trim();
    if (!text && !file) return;

    setIsSending(true);
    const tempId = Date.now().toString();
    const optimistic = {
      id: tempId,
      from: userId,
      to: partnerId,
      text,
      fileName: file?.name,
      timestamp: new Date().toISOString(),
      delivered: false,
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      // קודם הגדר convId
      let convId = conversationId;
      if (!convId) {
        const { data } = await API.post(
          '/messages',
          { otherId: partnerId },
          { withCredentials: true }
        );
        convId = data.conversationId.toString().trim();
        setConversationId(convId);
        console.log('⏩ created conversationId:', convId); // לוג של יצירת שיחה
      }

      // עכשיו לוג לשליחת הודעה
      console.log('⏩ sending message to convId:', convId, 'userId:', userId);

      const form = new FormData();
      if (file) form.append('fileData', file);
      form.append('text', text);

      const { data: saved } = await API.post(
        `/messages/${convId}/messages`,
        form,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      // עדכון ההודעות הממתינות (optimistic UI)
      setMessages(prev =>
        prev.map(m =>
          m.id === tempId ? { ...saved, delivered: true } : m
        )
      );
    } catch (err) {
      console.error('❌ שגיאה בשליחת ההודעה:', err);
    } finally {
      setIsSending(false);
      setMessage('');
      setFile(null);
    }
  };

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) sendMessage(e);
  };
  const handleFile = e => setFile(e.target.files[0] || null);

  const renderTyping = () => {
    const others = typingUsers.filter(id => id !== userId);
    if (!others.length) return null;
    const names = others
      .map(id => (id === partnerId ? (isBusiness ? 'לקוח' : 'עסק') : 'משתמש'))
      .join(', ');
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
                <span className="chat__time">
                  {new Date(m.timestamp).toLocaleTimeString('he-IL', {
                    hour: '2-digit',
                    minute: '2-digit'
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
        <button type="submit" disabled={isSending || (!message.trim() && !file)}>
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
