// src/components/ChatLayout.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';            // תיקן נתיב אם צריך
import ChatPage from './ChatPage.jsx';

export default function ChatLayout({
  clientProfilePic,
  businessProfilePic,
  isBusiness
}) {
  const { businessId } = useParams();
  const { user } = useAuth();

  // userId אמיתי: אם isBusiness נשתמש ב־businessId, אחרת ב־user.id מהקונטקסט
  const userId = isBusiness
    ? businessId
    : user?.id;  

  return (
    <ChatPage
      isBusiness={isBusiness}
      userId={userId}
      clientProfilePic={clientProfilePic}
      businessProfilePic={businessProfilePic}
      initialPartnerId={businessId}
    />
  );
}
