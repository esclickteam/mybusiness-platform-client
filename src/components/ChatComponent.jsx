import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiSend, FiPaperclip } from 'react-icons/fi';
import API from '../api';
import './ChatComponent.css';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = 'https://api.esclick.co.il';

export default function ChatComponent({ partnerId, isBusiness = false }) {
  // 1) Hooks תמיד קודם לכל תנאי early-return
  const { user, initialized } = useAuth();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const containerRef = useRef(null);
  const socketRef = useRef(null);

  // 2) חכה ל־AuthContext לאיתחול לפני כל לוגיקה
  if (!initialized) {
    return <div>טעינה...</div>;  // ממתינים לאיתחול
  }

  const userId = user?.userId;

  // 3) לוג לדיבוג
  useEffect(() => {
    console.log('🔍 Authenticated user:', user);
    console.log('🔍 Using userId:', userId);
  }, [user, userId]);

  // 4) Load or create conversation
  useEffect(() => {
    if (!userId || !partnerId) return;

    (async () => {
      try {
        console.log('⏩ Fetching conversations for userId:', userId);
        const { data: convos } = await API.get(
          '/messages/conversations',
          { withCredentials: true }
        );
        console.log('⏩ Conversations fetched:', convos);

        const convo = convos.find(c =>
          c.participants.some(p => p.toString() === partnerId)
        );

        if (convo) {
          const convId = convo._id.toString();
          setConversationId(convId);
          console.log('⏩ Using existing conversationId:', convId);

          const { data: msgs } = await API.get(
            `/messages/${convId}/messages`,
            { withCredentials: true }
          );
          console.log('⏩ Messages loaded:', msgs);
          setMessages(msgs);
        } else {
          console.log('⏩ No conversation found; will create one on send.');
          setConversationId(null);
          setMessages([]);
        }
      } catch (err) {
        console.error('❌ Error loading conversation:', err);
        setConversationId(null);
        setMessages([]);
      }
    })();
  }, [partnerId, userId]);

  // 5) Socket.IO setup & join room
  useEffect(() => {
    if (!conversationId) return;

    console.log(`⏩ Connecting socket for room ${conversationId}`);
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: { token: localStorage.getItem('token') },
    });
    socketRef.current = socket;

    socket.emit('joinRoom', conversationId);
    console.log(`⏩ Emitted joinRoom: ${conversationId}`);

    socket.on('newMessage', msg => {
      console.log('🔔 Received newMessage via socket:', msg);
      setMessages(prev => [...prev, msg]);
    });

    socket.on('typing', ({ from }) => {
      console.log('🔔 Received typing from:', from);
      setTypingUsers(prev => Array.from(new Set([...prev, from])));
    });

    socket.on('stopTyping', ({ from }) => {
      console.log('🔔 Received stopTyping from:', from);
      setTypingUsers(prev => prev.filter(id => id !== from));
    });

    return () => {
      console.log('⏩ Disconnecting socket');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [conversationId]);

  // 6) Auto-scroll to bottom on new messages or typing indicator
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  // 7) Typing indicator emitter
  const handleTyping = e => {
    setMessage(e.target.value);
    if (!socketRef.current || !conversationId) return;

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
  };

  // 8) Send message (optimistic + API)
  const sendMessage = async e => {
    e?.preventDefault();
    const text = message.trim();
    if (!text && !file) return;

    setIsSending(true);
    const tempId = Date.now().toString();
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
        console.log('⏩ Creating new conversation with otherId:', partnerId);
        const { data } = await API.post(
          '/messages',
          { otherId: partnerId },
          { withCredentials: true }
        );
        convId = data.conversationId.toString().trim();
        setConversationId(convId);
        console.log('⏩ Created conversationId:', convId);
      }

      console.log(
        '⏩ Posting message to conversation',
        convId,
        'from user',
        userId
      );
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
      console.log('⏩ API saved message:', saved);

      setMessages(prev =>
        prev.map(m =>
          m.id === tempId ? { ...saved, delivered: true } : m
        )
      );
    } catch (err) {
      console.error('❌ Error sending message:', err);
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

  // 9) Render typing indicator below messages
  const renderTyping = () => {
    const others = typingUsers.filter(id => id !== userId);
    if (!others.length) return null;
    const names = others
      .map(id =>
        id === partnerId ? (isBusiness ? 'לקוח' : 'עסק') : 'משתמש'
      )
      .join(', ');
    return <div className="chat__typing">…{names} מקלידים…</div>;
  };

  // 10) JSX render
  return (
    <div className="chat">
      <header className="chat__header">צ'אט</header>
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
