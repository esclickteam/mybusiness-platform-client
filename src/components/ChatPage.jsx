// src/components/ChatPage.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConversationsList from './ConversationsList';
import ChatComponent from './ChatComponent';
import API from '../api';
import { createSocket } from '../socket';
import { ensureValidToken, getBusinessId } from '../authHelpers';
import './ChatPage.css';

export default function ChatPage({ isBusiness }) {
  const { initialized, refreshToken } = useAuth();
  const user = useAuth().user;
  const userId = user?.userId;
  const businessId = getBusinessId();
  const { state } = useLocation();
  const initialConversationId = state?.conversationId || null;

  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(
    initialConversationId && state?.partnerId
      ? { conversationId: initialConversationId, partnerId: state.partnerId }
      : null
  );
  const [error, setError] = useState('');
  const socketRef = useRef(null);

  // Initialize & authenticate socket + load initial convos
  useEffect(() => {
    if (!initialized) return;
    let sock;
    (async () => {
      try {
        const token = await ensureValidToken();
        sock = createSocket();
        sock.auth = {
          token,
          role: isBusiness ? 'business' : 'client',
          businessId,
        };
        sock.connect();
        socketRef.current = sock;

        sock.emit(
          'getConversations',
          { userId: businessId || userId },
          (res) => {
            if (res.ok) {
              const convs = Array.isArray(res.conversations)
                ? res.conversations
                : [];
              setConversations(convs);
              if (!selected && convs.length > 0) {
                const first = convs[0];
                const convoId = first._id || first.conversationId;
                const partnerId = isBusiness
                  ? first.customer?._id ||
                    first.participants.find((p) => p !== businessId)
                  : first.business?._id ||
                    first.participants.find((p) => p !== userId);
                setSelected({ conversationId: convoId, partnerId });
              }
            } else {
              console.error('Error loading conversations:', res.error);
              setError('לא ניתן לטעון שיחות: ' + (res.error || 'שגיאה'));
            }
          }
        );
      } catch (e) {
        console.error('Socket init failed:', e);
        setError('❌ טוקן לא תקף');
      }
    })();

    return () => {
      sock?.disconnect();
      setConversations([]);
      setSelected(null);
    };
  }, [initialized, businessId, userId, isBusiness, refreshToken]);

  // Listen for incoming messages
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock) return;
    const handler = (message) => {
      setConversations((prev) =>
        prev.map((conv) =>
          String(conv._id) === message.conversationId ||
          String(conv.conversationId) === message.conversationId
            ? {
                ...conv,
                messages: [...(conv.messages || []), message],
                updatedAt: message.timestamp,
              }
            : conv
        )
      );
      if (selected?.conversationId === message.conversationId) {
        setSelected((prev) => ({
          ...prev,
          messages: [...(prev.messages || []), message],
        }));
      }
    };
    sock.on('newMessage', handler);
    return () => {
      sock.off('newMessage', handler);
    };
  }, [selected]);

  const handleSelect = ({ conversationId, partnerId }) => {
    setSelected({ conversationId, partnerId });
  };

  if (!initialized) return <p className="loading">⏳ טוען משתמש…</p>;
  if (!selected) return <p className="empty-chat">בחר שיחה כדי להתחיל</p>;

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        {error && <div className="error-banner">{error}</div>}
        <ConversationsList
          conversations={conversations}
          businessId={businessId || userId}
          isBusiness={isBusiness}
          onSelect={handleSelect}
          selectedConversationId={selected.conversationId}
        />
      </aside>
      <main className="chat-main">
        <ChatComponent
          isBusiness={isBusiness}
          initialConversationId={selected.conversationId}
          partnerId={selected.partnerId}
        />
      </main>
    </div>
  );
}
