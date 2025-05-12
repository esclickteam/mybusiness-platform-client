// src/components/BusinessChatListWrapper.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../api';
import ConversationsList from './ConversationsList';

export default function BusinessChatListWrapper({
  clientProfilePic = '',
  businessProfilePic = ''
}) {
  const { businessId } = useParams();
  const [convos, setConvos] = useState([]);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Extract selectedConversationId from URL if present
  const selectedConversationId = pathname.split('/').slice(-2)[0] || null;

  useEffect(() => {
    API.get('/messages/conversations', { withCredentials: true })
      .then(res => setConvos(res.data))
      .catch(console.error);
  }, []);

  const handleSelect = ({ conversationId, partnerId }) => {
    navigate(`/business/${businessId}/chat/${partnerId}`);
  };

  return (
    <ConversationsList
      conversations={convos}
      isBusiness={true}
      onSelect={handleSelect}
      selectedConversationId={selectedConversationId}
      userId={businessId}
      clientProfilePic={clientProfilePic}
      businessProfilePic={businessProfilePic}
    />
  );
}
