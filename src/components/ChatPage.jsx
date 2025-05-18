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
  initialPartnerId
}) {
  const { state } = useLocation();
  const initialConversationId = state?.conversationId || null;
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(
    initialConversationId && initialPartnerId
      ? { conversationId: initialConversationId, partnerId: initialPartnerId }
      : null
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;

    API.get('/messages/conversations', { withCredentials: true })
      .then(res => {
        setConversations(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error('שגיאה בטעינת שיחות:', err);
        setError('לא ניתן לטעון שיחות');
      });
  }, [userId]);

  const handleSelect = ({ conversationId, partnerId }) => {
    setSelected({ conversationId, partnerId });
  };

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        {error && <div className="error-banner">{error}</div>}
        <ConversationsList
          conversations={conversations}
          businessId={userId} //← גם בצד לקוח זה userId!
          isBusiness={isBusiness}
          onSelect={handleSelect}
          selectedConversationId={selected?.conversationId}
        />
      </aside>
      <main className="chat-main">
        {selected ? (
          <ChatComponent
            isBusiness={isBusiness}
            userId={userId}
            partnerId={selected.partnerId}
            initialConversationId={selected.conversationId}
          />
        ) : (
          <div className="empty-chat">בחר שיחה כדי להתחיל</div>
        )}
      </main>
    </div>
  );
}
