import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import ConversationsList from './ConversationsList';

export default function BusinessChatListWrapper() {
  const { businessId } = useParams();
  const [convos, setConvos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/messages', { withCredentials: true })
      .then(res => setConvos(res.data))
      .catch(console.error);
  }, []);

  const handleSelect = convo => {
    const clientId = convo.participants.find(id => id !== businessId);
    navigate(`/business/${businessId}/chat/${clientId}`);
  };

  return (
    <ConversationsList
      conversations={convos}
      isBusiness={true}
      onSelect={handleSelect}
    />
  );
}
