import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConversationsList from './ConversationsList';
import ChatPage from './ChatPage';
import './ConversationsList.css';
import socket from '../socket';

export default function BusinessChatWrapper() {
  const { businessId: routeBusinessId } = useParams();
  const { accessToken, user } = useAuth();
  const businessId = user?.businessId || routeBusinessId;

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (!businessId || !accessToken) return;

    // Configure and connect socket
    socket.auth = { token: accessToken, role: 'business', businessId };
    socket.connect();

    // Fetch conversations
    socket.emit('getConversations', { businessId }, ({ ok, conversations = [], error }) => {
      if (ok) {
        setConvos(conversations);
        if (!selected && conversations.length > 0) {
          const first = conversations[0];
          const convoId = first._id || first.conversationId || first.id;
          const partnerId = (first.participants || []).find(pid => pid !== businessId) || first.customer?._id || null;
          setSelected({ conversationId: convoId, partnerId });
        }
      } else {
        console.error('Error loading conversations:', error);
      }
    });

    return () => {
      socket.disconnect();
      setConvos([]);
      setSelected(null);
    };
  }, [businessId, accessToken]);

  const handleSelect = (conversationId) => {
    const convo = convos.find(
      c => c._id === conversationId || c.conversationId === conversationId || c.id === conversationId
    );
    if (!convo) return setSelected(null);
    const partnerId = (convo.participants || []).find(pid => pid !== businessId) || convo.customer?._id || null;
    setSelected({ conversationId, partnerId });

    // Join selected conversation
    if (hasJoinedRef.current) {
      socket.emit('leaveConversation', selected.conversationId);
    }
    socket.emit('joinConversation', conversationId, ack => {
      if (!ack.ok) console.error('joinConversation failed:', ack.error);
    });
    hasJoinedRef.current = true;
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
      {selected && selected.partnerId ? (
        <ChatPage
          isBusiness={true}
          userId={businessId}
          partnerId={selected.partnerId}
          conversationId={selected.conversationId}
          socket={socket}
        />
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b5b5b5' }}>
          בחר שיחה כדי לראות הודעות
        </div>
      )}
    </div>
  );
}