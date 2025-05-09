import React, { useState, useEffect } from 'react';
import API from '../api';
import './ConversationsList.css'; // CSS styles for sidebar

/**
 * Props:
 *  - isBusiness: boolean, whether current user is a business or a client
 *  - partnerId: when isBusiness===false, the other party’s userId to filter for
 *  - onSelect: function({ conversationId, partnerId }) callback when selecting a conversation
 */
export default function ConversationsList({ isBusiness, partnerId, onSelect }) {
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Get the current userId from localStorage or context
  const meId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    setLoading(true);

    // קוראים ל־GET /messages
    API.get('/messages', { withCredentials: true })
      .then(res => {
        const all = res.data; // כל השיחות: [{ _id, participants: [{ _id, name }] }, ...]

        // ממפים לכל פריט רק את הצד השני בשיחה
        const formatted = all.map(c => {
          // מוציאים את המשתתף השני
          const other = c.participants.find(p => p._id !== meId) || {};

          return {
            conversationId: c._id,
            partnerId: other._id,
            partnerName: other.name || '---',
            // כאן אנחנו יכולים להוסיף את ההודעה האחרונה אם יש
            lastMessage: c.messages[c.messages.length - 1]?.text || '',
            updatedAt: c.updatedAt, // אם תרצה תוכל להוסיף תאריך עדכון במסד
            unreadCount: 0, // תוכל להוסיף שדה בהמשך
          };
        });

        // במצב לקוח/עסק – אותו מיפוי
        setConvos(formatted);
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

  if (!convos.length) {
    return <div className="empty-chat">אין שיחות כרגע</div>;
  }

  const filtered = convos.filter(c =>
    c.partnerName.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase()) // חיפוש גם בהודעה האחרונה
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
              partnerId:       c.partnerId
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
