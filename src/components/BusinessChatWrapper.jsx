// src/components/BusinessChatWrapper.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ConversationsList from './ConversationsList';
import ChatPage from './ChatPage';
import API from '../api';
import './ConversationsList.css';

export default function BusinessChatWrapper() {
  const { businessId } = useParams();
  const [convos, setConvos]     = useState([]);
  const [selected, setSelected] = useState(null);

  // טען שיחות לעסק
  useEffect(() => {
    API.get('/messages/conversations', { withCredentials: true })
      .then(res => {
        // תמיכה גם במבנה עם conversations
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.conversations || [];
        setConvos(data);

        // ברירת מחדל – בחירת שיחה ראשונה אם יש
        if (data.length > 0 && !selected) {
          const first = data[0];
          const convoId =
            first._id || first.conversationId || first.id;
          // חפש את ה-partnerId שהוא לא businessId
          const partnerId =
            (first.participants || []).find(pid => pid !== businessId) ||
            first.customer?._id || null;
          setSelected({ conversationId: convoId, partnerId });
        }
      })
      .catch(console.error);
  // לא נכניס selected לתלויות כדי לא לגרום לולאת רינדור
  }, [businessId]);

  // בחירת שיחה מהסיידבר
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
        />
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#b5b5b5" }}>
          בחר שיחה כדי לראות הודעות
        </div>
      )}
    </div>
  );
}
