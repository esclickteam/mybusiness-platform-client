עדכן // src/components/ChatPage.jsx
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

    // 1. fetch initial conversations
    socketRef.current.emit(
      "getConversations",
      { userId },           // ← כאן השתמשנו ב־userId
      (res) => {
        if (res.ok) {
          const convs = Array.isArray(res.conversations) ? res.conversations : [];
          setConversations(convs);

          // בחר ברירת מחדל אם אין שיחה נבחרת
          if (!selected && convs.length > 0) {
            const first = convs[0];
            const convoId = first._id || first.conversationId;
            const partnerId = (first.participants || []).find(pid => pid !== userId)
              || first.customer?._id
              || null;
            setSelected({ conversationId: convoId, partnerId });
          }
        } else {
          setError('לא ניתן לטעון שיחות: ' + (res.error || 'שגיאה'));
        }
      }
    );

    // 2. התקנת מאזין להודעות נכנסות
    socketRef.current.on("newMessage", (message) => {
      // עדכון רשימת השיחות: הוספת ההודעה לשיחה המתאימה
      setConversations(prev =>
        prev.map(conv =>
          (conv._id === message.conversationId || conv.conversationId === message.conversationId)
            ? { ...conv, messages: [...(conv.messages||[]), message] }
            : conv
        )
      );
      // אם זו השיחה הנבחרת – עדכון בתצוגה
      if (selected?.conversationId === message.conversationId) {
        setSelected(prev => ({
          ...prev,
          // שומר את כל הפרטים הקודמים + הוספת ההודעה החדשה
          messages: [...(prev.messages||[]), message]
        }));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  // שימו לב: לא מוסיפים את `selected` ל־deps כדי שלא נרוץ את האפקט שוב בלי צורך
  }, [userId, isBusiness]);

  const handleSelect = ({ conversationId, partnerId }) => {
    setSelected({ conversationId, partnerId });
  };

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        {error && <div className="error-banner">{error}</div>}
        <ConversationsList
          conversations={conversations}
          businessId={userId}
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
            socket={socketRef.current}
            // העבר גם את ההודעות הקיימות אם ברצונך
            existingMessages={selected.messages}
          />
        ) : (
          <div className="empty-chat">בחר שיחה כדי להתחיל</div>
        )}
      </main>
    </div>
  );
}
