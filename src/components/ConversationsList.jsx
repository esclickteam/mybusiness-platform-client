import React, { useState, useEffect } from 'react';
import API from '../api';
import './ConversationsList.css'; // CSS styles for sidebar

/**
 * Props:
 *  - isBusiness: boolean, whether current user is a business or a client
 *  - partnerId: when isBusiness===false, the conversationId to fetch messages for
 *  - onSelect: function({ conversationId, partnerId }) callback when selecting a conversation
 */
export default function ConversationsList({ isBusiness, partnerId, onSelect }) {
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);

    API.get('/api/conversations', { withCredentials: true })
      .then(res => {
        const allConvos = res.data;

        if (isBusiness) {
          // עסק: מחזיר clientName ו־clientId מתוך participants
          const formatted = allConvos.map(c => {
            const client = c.participants.find(p => p._id !== undefined); // assume always two participants
            return {
              conversationId: c.conversationId || c._id,
              clientId: client._id,
              clientName: client.name || 'לקוח',
              lastMessage: c.lastMessage?.text || c.lastMessage?.content || '',
              updatedAt: c.updatedAt,
              unreadCount: 0,
            };
          });
          setConvos(formatted);
        } else {
          // לקוח: מציג את העסק
          const convo = allConvos.find(c =>
            c.participants.some(p => p._id === partnerId)
          );
          if (convo) {
            const business = convo.participants.find(p => p._id === partnerId);
            setConvos([{
              conversationId: convo._id,
              businessId: business._id,
              businessName: business.name || 'העסק',
              lastMessage: convo.lastMessage?.text || convo.lastMessage?.content || '',
              updatedAt: convo.updatedAt,
              unreadCount: 0,
            }]);
          } else {
            setConvos([]);
          }
        }
      })
      .catch(err => {
        console.error('Error loading conversations', err);
        setConvos([]);
      })
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
