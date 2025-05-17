// src/components/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '@api'; // או נתיב נכון ל־API שלך
import ChatComponent from './ChatComponent';
import ConversationsList from './ConversationsList';
import './ChatPage.css';

export default function ChatPage({
  isBusiness,
  userId,
  businessName,
  clientName,
  businessProfilePic,
  clientProfilePic,
  initialPartnerId
}) {
  const { state } = useLocation();
  const initialConversationId = state?.conversationId || null;
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState({
    conversationId: initialConversationId,
    partnerId: initialPartnerId
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isBusiness || !userId) return; // רק לעסקים, ורק אם יש userId

    API.get('/messages/conversations', { withCredentials: true })
      .then(res => {
        setConversations(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error('שגיאה בטעינת שיחות:', err);
        setError('לא ניתן לטעון שיחות');
      });
  }, [isBusiness, userId]);

  const handleSelect = ({ conversationId, partnerId }) => {
    setSelected({ conversationId, partnerId });
  };

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        {error && <div className="error-banner">{error}</div>}
        <ConversationsList
          conversations={conversations}
          isBusiness={isBusiness}
          onSelect={handleSelect}
          selectedConversationId={selected.conversationId}
          userId={userId}
          clientProfilePic={clientProfilePic}
          businessProfilePic={businessProfilePic}
        />
      </aside>
      <main className="chat-main">
        <ChatComponent
          isBusiness={isBusiness}
          userId={userId}
          partnerId={selected.partnerId}
          initialConversationId={selected.conversationId}
        />
      </main>
    </div>
  );
}
