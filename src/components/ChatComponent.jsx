import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiSend, FiPaperclip } from 'react-icons/fi';
import API from '../api';
import './ChatComponent.css';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = 'https://api.esclick.co.il';

export default function ChatComponent({ partnerId, isBusiness = false }) {
  const { user } = useAuth();
  const userId = user?.userId;

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  const containerRef = useRef(null);
  const socketRef = useRef(null);

  // 1) יצירת או טעינת שיחה
  useEffect(() => {
    if (!userId || !partnerId) return;
    let mounted = true;

    const initConversation = async () => {
      try {
        // 1.1 קבלת כל השיחות של המשתמש
        const { data: convos } = await API.get(
          '/api/messages/conversations',
          { withCredentials: true }
        );

        // 1.2 מציאת שיחה קיימת עם ה-partner
        let conv = convos.find(c =>
          c.participants.some(p => p.toString() === partnerId)
        );

        // 1.3 אם לא קיימת, צור שיחה חדשה
        if (!conv) {
          const { data } = await API.post(
            '/api/messages',
            { otherId: partnerId },
            { withCredentials: true }
          );
          conv = { _id: data.conversationId };
        }

        if (!mounted) return;
        setConversationId(conv._id);

        // 1.4 שליפה של ההודעות לשיחה הזו
        const { data: msgs } = await API.get(
          `/api/messages/${conv._id}/messages`,
          { withCredentials: true }
        );
        if (mounted) setMessages(msgs);
      } catch (err) {
        console.error('שגיאה בטעינת/יצירת שיחה:', err);
        if (mounted) {
          setConversationId(null);
          setMessages([]);
        }
      }
    };

    initConversation();
    return () => { mounted = false; };
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
      socket.on('newMessage', msg => setMessages(prev => [...prev, msg]));
      socket.on('typing', ({ from }) =>
        setTypingUsers(prev => [...new Set([...prev, from])])
      );
      socket.on('stopTyping', ({ from }) =>
        setTypingUsers(prev => prev.filter(id => id !== from))
      );
    }

    return () => socket.disconnect();
  }, [conversationId, userId]);

  // גלילה אוטומטית
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  // קליטת הקלדה
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

  // 3) שליחת הודעה
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
      let convId = conversationId;
      if (!convId) {
        // יווצר כבר בשלב ה-init, אבל לוודא גם כאן
        const { data } = await API.post(
          '/api/messages',
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
        `/api/messages/${convId}/messages`,
        form,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setMessages(prev =>
        prev.map(m => m.id === tempId ? { ...saved, delivered: true } : m)
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
          <div key={i} className={`chat__message ${m.from === userId ? 'mine' : 'theirs'}`}>...
          </div>
        ))}
        {renderTyping()}
      </div>
      <form className="chat__input" onSubmit={sendMessage}>...</form>
    </div>
  );
}
