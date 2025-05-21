// src/components/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ChatComponent from './ChatComponent';
import ConversationsList from './ConversationsList';
import './ChatPage.css';
import io from 'socket.io-client';

export default function ChatPage({
  isBusiness,
  userId,
  initialPartnerId
}) {
  const { state } = useLocation();
  const initialConversationId = state?.conversationId || null;
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(
    initialConversationId && initialPartnerId
      ? { conversationId: initialConversationId, partnerId: initialPartnerId }
      : null
  );
  const [error, setError] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    if (!userId) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
socketRef.current = io(socketUrl, {
  auth: { userId, role: isBusiness ? 'business' : 'client' },
  transports: ["websocket"],
});


    socketRef.current.emit('getConversations', {}, (res) => {
      if (res.ok) {
        const convs = Array.isArray(res.conversations) ? res.conversations : [];
        setConversations(convs);

        if (!selected && convs.length > 0) {
          const first = convs[0];
          const convoId = first._id || first.conversationId;
          const partnerId = (first.participants || []).find(pid => pid !== userId) || first.customer?._id || null;
          setSelected({ conversationId: convoId, partnerId });
        }
      } else {
        setError('לא ניתן לטעון שיחות: ' + (res.error || 'שגיאה בלתי ידועה'));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, isBusiness, selected]);

  const handleSelect = ({ conversationId, partnerId }) => {
    setSelected({ conversationId, partnerId });
  };

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        {error && <div className="error-banner">{error}</div>}
        <ConversationsList
          conversations={conversations}
          businessId={userId} // גם בצד לקוח זה userId
          isBusiness={isBusiness}
          onSelect={handleSelect}
          selectedConversationId={selected?.conversationId}
        />
      </aside>
      <main className="chat-main">
        {selected ? (
          <ChatComponent
            isBusiness={isBusiness}
            userId={userId}
            partnerId={selected.partnerId}
            initialConversationId={selected.conversationId}
            socket={socketRef.current} // ניתן להעביר את הסוקט אם תרצה
          />
        ) : (
          <div className="empty-chat">בחר שיחה כדי להתחיל</div>
        )}
      </main>
    </div>
  );
}
