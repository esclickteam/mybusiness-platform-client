// src/components/BusinessConversationsList.jsx
import React, { useEffect, useState } from 'react';
import socket from '../socket';

export default function BusinessConversationsList({ onSelectConversation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // בקשת שיחות מהשרת דרך Socket.IO
    socket.emit('getConversations', { userId: null }, (res) => {
      if (res.ok) {
        setConversations(res.conversations);
      } else {
        alert('Error loading conversations: ' + res.error);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <p>טוען שיחות...</p>;
  if (conversations.length === 0) return <p>אין שיחות פעילות</p>;

  return (
    <ul>
      {conversations.map((conv) => (
        <li key={conv._id} onClick={() => onSelectConversation(conv._id)}>
          שיחה עם: {conv.participants.join(', ')} {/* תתאים להצגה שלך */}
        </li>
      ))}
    </ul>
  );
}
