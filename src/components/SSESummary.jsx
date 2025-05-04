// src/components/SSESummary.jsx
import React from 'react';
import { MdPersonAdd, MdStorefront, MdRateReview, MdInfo } from 'react-icons/md';
import './SSESummary.css';

export default function SSESummary({ updates }) {
  // Debug: log incoming updates and types
  console.log('SSESummary updates:', updates);
  updates.forEach(u => console.log('  type:', u.type, 'message:', u.message || u.title));

  // סופרים אירועים לפי סוג, כולל מיפוי סוגים ממחרוזות שונות
  const countByType = updates.reduce((acc, u) => {
    const rawType = (u.type || '').toString().toLowerCase();
    const msg = (u.message || u.title || '').toString();
    let t;

    if (/signup|client/.test(rawType) || /לקוח/.test(msg)) {
      t = 'client';
    } else if (/owner|business/.test(rawType) || /עסק/.test(msg)) {
      t = 'business';
    } else if (/review/.test(rawType) || /ביקו/.test(msg)) {
      t = 'review';
    } else {
      console.warn('SSESummary: unmapped type', u.type);
      t = 'info';
    }

    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const cards = [
    { type: 'client',   label: 'לקוחות חדשים', icon: <MdPersonAdd /> },
    { type: 'business', label: 'עסקים חדשים',   icon: <MdStorefront /> },
    { type: 'review',   label: 'ביקורות חדשות', icon: <MdRateReview /> },
  ];

  return (
    <div className="sse-summary">
      {cards.map(c => (
        <div key={c.type} className="sse-card">
          <div className="sse-icon">{c.icon}</div>
          <div className="sse-info">
            <div className="sse-count">{countByType[c.type] || 0}</div>
            <div className="sse-label">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}