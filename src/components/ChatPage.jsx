import React, { useState, useEffect } from 'react';
import ConversationsList from './ConversationsList';
import ChatComponent     from './ChatComponent';
import API               from '../api';
import './ChatPage.css';

/**
 * Props:
 *  - isBusiness: boolean
 *  - userId: string
 *  - clientProfilePic, businessProfilePic: string URLs
 *  - initialPartnerId: string (start a new chat with this partner)
 */
export default function ChatPage({
  isBusiness,
  userId,
  clientProfilePic,
  businessProfilePic,
  initialPartnerId = null,
}) {
  const [selected, setSelected] = useState(null);
  // selected = { conversationId: string | null, partnerId: string }

  // Auto-select initial partner if provided
  useEffect(() => {
    if (initialPartnerId && !selected) {
      setSelected({ conversationId: null, partnerId: initialPartnerId });
    }
  }, [initialPartnerId, selected]);

  // Fetch existing conversations list
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    API.get('/messages', { withCredentials: true })
      .then(res => setConversations(res.data))
      .catch(err => console.error('Failed to load conversations:', err));
  }, []);

  // Select conversation when clicked in list
  const handleSelectConvo = convo => {
    setSelected({
      partnerId: convo.participants.find(id => id !== userId),
      conversationId: convo._id,
    });
  };

  // Create or fetch conversationId when partnerId changes
  useEffect(() => {
    if (!selected || !selected.partnerId || selected.conversationId) return;
    API.post(
      '/messages',
      { otherId: selected.partnerId },
      { withCredentials: true }
    )
      .then(res => {
        setSelected(prev => ({
          ...prev,
          conversationId: res.data.conversationId,
        }));
        // refresh conversations list
        return API.get('/messages', { withCredentials: true });
      })
      .then(res => setConversations(res.data))
      .catch(err => console.error('Failed to create/fetch conversation:', err));
  }, [selected, userId]);

  return (
    <div className="chat-page">
      <aside>
        <ConversationsList
          conversations={conversations}
          isBusiness={isBusiness}
          onSelect={handleSelectConvo}
        />
      </aside>

      <main>
        {selected && selected.partnerId ? (
          selected.conversationId ? (
            <ChatComponent
              userId={userId}
              partnerId={selected.partnerId}
              conversationId={selected.conversationId}
              clientProfilePic={clientProfilePic}
              businessProfilePic={businessProfilePic}
              isBusiness={isBusiness}
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
