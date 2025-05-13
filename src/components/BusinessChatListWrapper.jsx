// 📁 src/components/BusinessChatListWrapper.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../api';
import ConversationsList from './ConversationsList';
import ChatComponent from './ChatComponent';

export default function BusinessChatListWrapper({
  clientProfilePic = '',
  businessProfilePic = ''
}) {
  const { businessId, partnerId } = useParams();
  const [convos, setConvos] = useState([]);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Extract selectedConversationId from URL if present
  // URL shape: /business/:businessId/chat/:partnerId
  const selectedConversationId = pathname.includes('/chat/')
    ? pathname.split('/').pop()
    : null;

  useEffect(() => {
    API.get("/chat/conversations",    { withCredentials: true })
      .then(res => setConvos(res.data))
      .catch(console.error);
  }, []);

  const handleSelect = ({ conversationId, partnerId }) => {
    navigate(`/business/${businessId}/chat/${partnerId}`);
  };

  return (
    <div className="business-chat-wrapper">
      <ConversationsList
        conversations={convos}
        isBusiness={true}
        onSelect={handleSelect}
        selectedConversationId={selectedConversationId}
        userId={businessId}
        clientProfilePic={clientProfilePic}
        businessProfilePic={businessProfilePic}
      />

      {partnerId && (
        <ChatComponent
          userId={businessId}
          partnerId={partnerId}
          initialConversationId={selectedConversationId}
          isBusiness={true}
        />
      )}
    </div>
  );
}
