import React, { useState, useEffect } from 'react';
import API from '../api';
import './ConversationsList.css';  // CSS styles for sidebar

/**
 * Props:
 *  - isBusiness: boolean, whether current user is a business or a client
 *  - partnerId: when isBusiness===false, the conversationId to fetch messages for
 *  - onSelect: function({ conversationId, partnerId }) callback when selecting a conversation
 */
export default function ConversationsList({ isBusiness, partnerId, onSelect }) {
  const [convos, setConvos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    setLoading(true);

    // עסק רואה רשימת שיחות
    // לקוח רואה רק את השיחה מול העסק הנבחר
    const url = isBusiness
      ? '/api/messages/conversations'
      : `/api/messages/conversations/${partnerId}`;

    API.get(url, { withCredentials: true })
      .then(res => {
        if (isBusiness) {
          // שרת מחזיר מערך שיחות עם clientId, clientName, lastMessage, updatedAt, unreadCount
          setConvos(res.data);
        } else {
          // שרת מחזיר מערך הודעות; נאחד לאובייקט שיחה אחד
          const msgs = res.data;
          const last = msgs[msgs.length - 1] || {};
          setConvos([{
            conversationId: partnerId,
            businessId:      partnerId,
            businessName:    last.toBusinessName || last.businessName || 'העסק',
            lastMessage:     last.content || last.text || '',
            updatedAt:       last.timestamp,
            unreadCount:     0
          }]);
        }
      })
      .catch(err => console.error('Error loading conversations', err))
      .finally(() => setLoading(false));
  }, [isBusiness, partnerId]);

  if (loading) {
    return <div className="sidebar-spinner">טוען שיחות…</div>;
  }

  const filtered = convos.filter(c => {
    const name = isBusiness ? c.clientName : c.businessName;
    return name.toLowerCase().includes(search.toLowerCase());
  });

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
              partnerId:      isBusiness ? c.clientId : c.businessId
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
            <small>
              {new Date(c.updatedAt).toLocaleString('he-IL', {
                day:    '2-digit',
                month:  '2-digit',
                hour:   '2-digit',
                minute: '2-digit'
              })}
            </small>
          )}
        </div>
      ))}
    </div>
  );
}