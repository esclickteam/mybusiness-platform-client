// src/components/BusinessChatWrapper.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConversationsList from './ConversationsList';
import ChatPage from './ChatPage';
import './ConversationsList.css';
import { createSocket } from '../socket';
import { ensureValidToken, getBusinessId } from "../utils/authHelpers";

export default function BusinessChatWrapper() {
  const { businessId: routeBusinessId } = useParams();
  const { initialized, refreshToken }     = useAuth();
  const businessId                       = getBusinessId() || routeBusinessId;

  const [convos, setConvos]     = useState([]);
  const [selected, setSelected] = useState(null);
  const socketRef               = useRef(null);
  const hasJoinedRef            = useRef(false);

  // Initialize & authenticate socket + fetch convos
  useEffect(() => {
    if (!initialized || !businessId) return;
    let isMounted = true;
    let sock;

    (async () => {
      try {
        const token = await ensureValidToken(refreshToken);

        sock = createSocket();
        sock.auth = { token, role: 'business', businessId };
        sock.connect();
        socketRef.current = sock;

        // Fetch conversations
        sock.emit('getConversations', { businessId }, ({ ok, conversations = [], error }) => {
          if (!isMounted) return;
          if (ok) {
            setConvos(conversations);
            if (!selected && conversations.length > 0) {
              const first = conversations[0];
              const convoId = first._id || first.conversationId || first.id;
              const partnerId =
                (first.participants || []).find(pid => pid !== businessId) ||
                first.customer?._id ||
                null;
              setSelected({ conversationId: convoId, partnerId });
            }
          } else {
            console.error('Error loading conversations:', error);
          }
        });
      } catch (e) {
        console.error('Socket init failed:', e);
      }
    })();

    return () => {
      isMounted = false;
      sock?.disconnect();
      setConvos([]);
      setSelected(null);
    };
  }, [initialized, businessId, refreshToken]);

  const handleSelect = (conversationId) => {
    if (!socketRef.current) return;
    // Leave previous
    if (hasJoinedRef.current && selected?.conversationId) {
      socketRef.current.emit('leaveConversation', selected.conversationId);
    }
    // Join new
    socketRef.current.emit('joinConversation', conversationId, (ack) => {
      if (!ack.ok) console.error('joinConversation failed:', ack.error);
    });
    hasJoinedRef.current = true;

    // Update selection
    const convo = convos.find(
      c =>
        c._id === conversationId ||
        c.conversationId === conversationId ||
        c.id === conversationId
    );
    const partnerId =
      (convo?.participants || []).find(pid => pid !== businessId) ||
      convo?.customer?._id ||
      null;
    setSelected({ conversationId, partnerId });
  };

  return (
    <div className="business-chat-wrapper" style={{ display: 'flex', height: '100%' }}>
      <ConversationsList
        conversations={convos}
        businessId={businessId}
        isBusiness={true}
        selectedConversationId={selected?.conversationId}
        onSelect={handleSelect}
      />
      {selected?.conversationId && selected.partnerId ? (
        <ChatPage
          isBusiness={true}
          userId={businessId}
          partnerId={selected.partnerId}
          conversationId={selected.conversationId}
          socket={socketRef.current}
        />
      ) : (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b5b5b5'
          }}
        >
          בחר שיחה כדי לראות הודעות
        </div>
      )}
    </div>
  );
}
