// 📁 ChatTestPage.jsx

import React from 'react';
import ChatMessages from './ChatMessages';

const testMessages = [
  {
    id: '1',
    from: 'customer',
    clientId: 'abc123',
    text: 'היי! לקוח כאן 😊',
    timestamp: Date.now(),
  },
  {
    id: '2',
    from: 'business',
    text: 'שלום וברוך הבא לעסק שלנו! 👋',
    timestamp: Date.now(),
  },
  {
    id: '3',
    from: 'system',
    text: 'הודעת מערכת: השיחה הועברה לשירות',
    timestamp: Date.now(),
  },
];

const ChatTestPage = () => {
  return (
    <div style={{ padding: 40 }}>
      <h2>📨 בדיקת תצוגת צ'אט</h2>
      <ChatMessages messages={testMessages} currentClientId="abc123" />
    </div>
  );
};

export default ChatTestPage;