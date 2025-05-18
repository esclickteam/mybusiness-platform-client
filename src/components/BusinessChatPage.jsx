// src/components/BusinessChatPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ConversationsList from './ConversationsList';
import ChatPage from './ChatPage';
import API from '../api';

export default function BusinessChatPage() {
  const { businessId } = useParams();
  const [convos, setConvos]     = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    API.get('/messages/conversations', { withCredentials: true })
       .then(r => setConvos(r.data))
       .catch(console.error);
  }, [businessId]);

  return (
    <ConversationsList
      conversations={convos}
      isBusiness={true}
      selectedConversationId={selected?.conversationId}
      onSelect={setSelected}
    >
      {selected && (
        <ChatPage
          isBusiness={true}
          userId={businessId}
          partnerId={selected.partnerId}
          conversationId={selected.conversationId}
        />
      )}
    </ConversationsList>
  );
}
