import React, { useState, useEffect } from 'react';
import API from '../api'; // Axios config
import './ConversationsList.css';  // CSS styles for sidebar

/**
 * Props:
 *  - isBusiness: boolean, whether current user is a business or a client
 *  - onSelect: function({ conversationId, partnerId }) callback when selecting a conversation
 */
export default function ConversationsList({ isBusiness, onSelect }) {
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const url = isBusiness
      ? '/api/messages/business/conversations'
      : '/api/messages/client/conversations';

    API.get(url, { withCredentials: true })
      .then(res => setConvos(res.data))
      .catch(err => console.error('Error loading conversations', err))
      .finally(() => setLoading(false));
  }, [isBusiness]);

  if (loading) {
    return <div className="sidebar-spinner">טוען שיחות…</div>;
  }

  const filtered = convos.filter(c =>
    (isBusiness ? c.clientName : c.businessName)
      .toLowerCase()
      .includes(search.toLowerCase())
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
              partnerId: isBusiness ? c.clientId : c.businessId
            })
          }
        >
          <div className="sidebar-item__content">
            <strong>{isBusiness ? c.clientName : c.businessName}</strong>
            {c.lastMessage && <p>{c.lastMessage}</p>}
          </div>
          {c.unreadCount > 0 && (
            <span className="sidebar-item__badge">{c.unreadCount}</span>
          )}
          {c.updatedAt && (
            <small>{new Date(c.updatedAt).toLocaleString('he-IL')}</small>
          )}
        </div>
      ))}
    </div>
  );
}
