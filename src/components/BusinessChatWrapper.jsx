// src/components/BusinessChatWrapper.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ConversationsList from './ConversationsList';
import ChatPage from './ChatPage';
import './ConversationsList.css';
import io from 'socket.io-client';

export default function BusinessChatWrapper() {
  const { businessId } = useParams();
  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    if (!businessId) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
socketRef.current = io(socketUrl, {
  auth: { userId: businessId, role: "business" },
  transports: ["websocket"],
});


    // בקש שיחות דרך socket (צריך להוסיף אירוע כזה בשרת)
    socketRef.current.emit("getConversations", { userId: businessId }, (res) => {
  if (res.ok) {
    const data = Array.isArray(res.conversations) ? res.conversations : [];
    setConvos(data);

        if (data.length > 0 && !selected) {
          const first = data[0];
          const convoId = first._id || first.conversationId || first.id;
          const partnerId = (first.participants || []).find(pid => pid !== businessId) || first.customer?._id || null;
          setSelected({ conversationId: convoId, partnerId });
        }
      } else {
        console.error("Error loading conversations:", res.error);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [businessId]);

  const handleSelect = (conversationId) => {
    const convo = convos.find(
      c =>
        c._id === conversationId ||
        c.conversationId === conversationId ||
        c.id === conversationId
    );
    if (!convo) return setSelected(null);
    const partnerId =
      (convo.participants || []).find(pid => pid !== businessId) ||
      convo.customer?._id || null;
    setSelected({ conversationId, partnerId });
  };

  return (
    <div className="business-chat-wrapper" style={{ display: 'flex', height: '100%' }}>
      <ConversationsList
        conversations={convos}
        businessId={businessId}
        isBusiness={true}
        selectedConversationId={selected?.conversationId}
        onSelect={handleSelect}
      />
      {selected && selected.partnerId ? (
        <ChatPage
          isBusiness={true}
          userId={businessId}
          partnerId={selected.partnerId}
          conversationId={selected.conversationId}
          socket={socketRef.current} // אם תרצה להעביר את הסוקט כפרופ
        />
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#b5b5b5" }}>
          בחר שיחה כדי לראות הודעות
        </div>
      )}
    </div>
  );
}
