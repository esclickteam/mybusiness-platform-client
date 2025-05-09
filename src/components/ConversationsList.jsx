// src/components/Chat/ConversationsList.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';
import './ConversationsList.css';  // CSS styles for sidebar

/**
 * Props:
 *  - isBusiness: boolean, whether current user is a business or a client
 *  - partnerId: when client=true, the businessId to fetch the single convo for
 *  - onSelect: function({ conversationId, partnerId }) callback when selecting a conversation
 */
export default function ConversationsList({ isBusiness, partnerId, onSelect }) {
  const [convos, setConvos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    setLoading(true);

    let url;
    if (isBusiness) {
      // עסק רואה את כל השיחות עם לקוחותיו
      url = '/api/messages/conversations';
    } else {
      // לקוח רואה רק את השיחה מול העסק הנבחר (partnerId)
      url = `/api/messages/client/${partnerId}`;
    }

    API.get(url, { withCredentials: true })
      .then(res => {
        // נרצה אחידות למערך שיחות גם אצל הלקוח
        const data = res.data;
        setConvos(isBusiness
          ? data
          : // עבור לקוח, res.data הוא מערך הודעות; נמיר למערך בעל פריט אחד
            [{
              conversationId: partnerId,
              businessId: partnerId,
              businessName: data[0]?.businessName || 'העסק',
              lastMessage: data[data.length - 1]?.text || '',
              updatedAt: data[data.length - 1]?.timestamp,
              unreadCount: 0
            }]
        );
      })
      .catch(err =>
        console.error('Error loading conversations', err)
      )
      .finally(() => setLoading(false));
  }, [isBusiness, partnerId]);

  if (loading) {
    return <div className="sidebar-spinner">טוען שיחות…</div>;
  }

  // סינון לפי שם
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
              partnerId: isBusiness ? c.clientId : c.businessId
            })
          }
        >
          <div className="sidebar-item__content">
            <strong>
              {isBusiness ? c.clientName : c.businessName}
            </strong>
            {c.lastMessage && <p>{c.lastMessage}</p>}
          </div>

          {c.unreadCount > 0 && (
            <span className="sidebar-item__badge">
              {c.unreadCount}
            </span>
          )}
          {c.updatedAt && (
            <small>
              {new Date(c.updatedAt).toLocaleString('he-IL', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </small>
          )}
        </div>
      ))}
    </div>
  );
}
