// src/components/BusinessChatWrapper.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ConversationsList from './ConversationsList';
import ChatPage from './ChatPage';
import API from '../api';
import './ConversationsList.css';

export default function BusinessChatWrapper() {
  const { businessId } = useParams();
  const [convos, setConvos]     = useState([]);
  const [selected, setSelected] = useState(null);

  // טען שיחות לעסק
  useEffect(() => {
    API.get('/messages/conversations', { withCredentials: true })
      .then(res => setConvos(res.data))
      .catch(console.error);
  }, [businessId]);

  return (
    <div className="business-chat-wrapper" style={{ display: 'flex', height: '100%' }}>
      <ConversationsList
        conversations={convos}
        businessId={businessId}
        isBusiness={true}
        selectedConversationId={selected?.conversationId}
        onSelect={setSelected}
      />
      {selected && (
        <ChatPage
          isBusiness={true}
          userId={businessId}
          partnerId={selected.partnerId}
          conversationId={selected.conversationId}
        />
      )}
    </div>
  );
}
