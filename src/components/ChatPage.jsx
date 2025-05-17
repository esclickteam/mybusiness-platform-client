// src/components/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

  useEffect(() => {
    // fetch all convs
    fetch(
      `/api/chat/conversations?businessId=${
        isBusiness ? userId : initialPartnerId
      }`,
      {
        credentials: 'include'
      }
    )
      .then(res => res.json())
      .then(data => setConversations(data))
      .catch(console.error);
  }, [userId, initialPartnerId, isBusiness]);

  const handleSelect = ({ conversationId, partnerId }) => {
    setSelected({ conversationId, partnerId });
  };

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
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
