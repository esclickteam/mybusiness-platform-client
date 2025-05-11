// src/components/ConversationsList.jsx

import React, { useState, useEffect } from 'react';
import API from '../api';
import './ConversationsList.css'; // CSS styles for sidebar

/**
 * Props:
 *  - isBusiness: boolean, whether current user is a business or a client
 *  - onSelect: function({ conversationId, partnerId }) callback when selecting a conversation
 */
export default function ConversationsList({ isBusiness, onSelect }) {
  const [convos, setConvos]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  // Get the current userId from localStorage or context
  const meId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    setLoading(true);

    // 1) תקן כאן לקריאה למערך השיחות
    API.get('/messages/conversations', { withCredentials: true })
      .then(res => {
        const all = Array.isArray(res.data) ? res.data : [];

        const formatted = all.map(c => {
          // אם זה עסק, partnerId זה המשתמש; אם לקוח, זה העסק
          const other = c.participants.find(p => p !== meId) || '';
          const partnerName = isBusiness
            ? (c.participantsMeta?.find(u => u._id === other)?.name || '---')
            : (c.businessName || '---');

          return {
            conversationId: c._id,
            partnerId,
            partnerName,
            lastMessage: c.messages?.length
              ? c.messages[c.messages.length - 1].text
              : '',
            updatedAt: c.updatedAt,
            unreadCount: 0,
          };
        });

        setConvos(formatted);
      })
      .catch(err => {
        console.error('Error loading conversations', err);
        setConvos([]);
      })
      .finally(() => setLoading(false));
  }, [isBusiness, meId]);

  if (loading) return <div className="sidebar-spinner">טוען שיחות…</div>;
  if (!convos.length) return <div className="empty-chat">אין שיחות כרגע</div>;

  const filtered = convos.filter(c =>
    c.partnerName.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sidebar">
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="חפש שיחה..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.map(c => (
        <div
          key={c.conversationId}
          className="sidebar-item"
          onClick={() =>
            onSelect({
              conversationId: c.conversationId,
              partnerId:      c.partnerId
            })
          }
        >
          <div className="sidebar-item__content">
            <strong>{c.partnerName}</strong>
            {c.lastMessage && <p>{c.lastMessage}</p>}
          </div>
          {c.unreadCount > 0 && (
            <span className="sidebar-item__badge">{c.unreadCount}</span>
          )}
        </div>
      ))}
    </div>
  );
}
