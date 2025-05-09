// src/components/ChatLayout.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ChatPage from './ChatPage.jsx';

/**
 * ChatLayout: משמש ל־ChatRoute בתוך ה־App.jsx
 * שולף את businessId מה־URL ומעביר אותו ב־props ל־ChatPage
 * clientProfilePic, businessProfilePic עוברות מה־App.jsx
 */
export default function ChatLayout({ clientProfilePic, businessProfilePic }) {
  const { businessId } = useParams();

  return (
    <ChatPage
      isBusiness={true}
      userId={businessId}
      clientProfilePic={clientProfilePic}
      businessProfilePic={businessProfilePic}
    />
  );
}
