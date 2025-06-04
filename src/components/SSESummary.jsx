import React from 'react';
import { MdPersonAdd, MdStorefront, MdRateReview } from 'react-icons/md';
import './SSESummary.css';

export default function SSESummary({ updates = [] }) {
  if (!updates.length) {
    return (
      <div className="sse-summary-empty">
        אין עדכונים חדשים
      </div>
    );
  }

  // סופרים אירועים לפי סוג מדויק עם סינון כפילויות
  const seen = new Set();
  const countByType = updates.reduce((acc, u) => {
    const key = u.message || u.title || u._id || '';
    if (seen.has(key)) return acc;
    seen.add(key);

    const type = (u.type || '').toLowerCase();

    let mappedType;
    switch (type) {
      case 'new_customer':
        mappedType = 'client';
        break;
      case 'new_business':
        mappedType = 'business';
        break;
      case 'new_review':
        mappedType = 'review';
        break;
      default:
        mappedType = 'info';
        console.warn('לא נמצא מיפוי ל-type:', type);
        break;
    }

    acc[mappedType] = (acc[mappedType] || 0) + 1;
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
