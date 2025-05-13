// src/pages/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import ConversationsList from '../components/ConversationsList';
import ChatComponent from '../components/ChatComponent';
import API from '../api';
import './ChatPage.css';

/**
 * Props:
 *  - isBusiness: boolean
 *  - userId: string
 *  - clientName: string
 *  - businessName: string
 *  - clientProfilePic: string (URL)
 *  - businessProfilePic: string (URL)
 *  - initialPartnerId: string (start a new chat with this partner)
 */
export default function ChatPage({
  isBusiness,
  userId,
  clientName,
  businessName,
  clientProfilePic,
  businessProfilePic,
  initialPartnerId = null,
}) {
  const [selected, setSelected] = useState(null);
  // selected = { conversationId: string | null, partnerId: string }

  // 1) auto‐select initial partner
  useEffect(() => {
    if (initialPartnerId && !selected) {
      setSelected({ conversationId: null, partnerId: initialPartnerId });
    }
  }, [initialPartnerId, selected]);

  // 2) handle click on a convo item
  const handleSelectConvo = ({ conversationId, partnerId }) => {
    setSelected({ conversationId, partnerId });
  };

  // 3) when partnerId changes without a conversationId → create/fetch convo
  useEffect(() => {
    if (!selected || !selected.partnerId || selected.conversationId) return;

    API.post(
      '/chat/conversations',
      { otherId: selected.partnerId },
      { withCredentials: true }
    )
      .then(res => {
        setSelected(prev => ({
          ...prev,
          conversationId: res.data.conversationId,
        }));
      })
      .catch(err =>
        console.error('Failed to create/fetch conversation:', err)
      );
  }, [selected]);

  return (
    <div className="chat-page">
      <aside>
        <ConversationsList
          onSelect={handleSelectConvo}
          selectedConversationId={selected?.conversationId}
          userId={userId}
          clientProfilePic={clientProfilePic}
          businessProfilePic={businessProfilePic}
        />
      </aside>

      <main>
        {selected?.partnerId ? (
          selected.conversationId ? (
            <ChatComponent
              userId={userId}
              partnerId={selected.partnerId}
              initialConversationId={selected.conversationId}
              isBusiness={isBusiness}
              businessName={businessName}
              clientName={clientName}
            />
          ) : (
            <div className="loading-chat">טוען שיחה…</div>
          )
        ) : (
          <div className="no-chat-placeholder">
            בחר שיחה בסיידבר כדי להתחיל
          </div>
        )}
      </main>
    </div>
  );
}
