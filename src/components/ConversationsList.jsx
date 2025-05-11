// src/components/ConversationsList.jsx

import React, { useState, useEffect } from 'react';
import API from '../api';
import './ConversationsList.css';

/**
 * Props:
 *  - isBusiness: boolean
 *  - onSelect: ({ conversationId, partnerId }) => void
 */
export default function ConversationsList({ isBusiness, onSelect }) {
  const [convos, setConvos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const meId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    setLoading(true);

    // קריאה ל־GET /api/messages/conversations (API.baseURL = '/api/messages')
    API.get('/conversations', { withCredentials: true })
      .then(res => {
        const all = Array.isArray(res.data) ? res.data : [];

        const formatted = all.map(c => {
          const other = c.participants.find(p => p !== meId) || '';

          return {
            conversationId: c.conversationId,
            partnerId:      other,
            partnerName:    isBusiness
              ? other   // אפשר להחליף בהמשך בקריאה לשם המשתמש
              : (c.businessName || '---'),
            lastMessage: c.lastMessage?.text || '',
            updatedAt:   c.updatedAt,
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
          onClick={() => onSelect({
            conversationId: c.conversationId,
            partnerId:      c.partnerId
          })}
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
