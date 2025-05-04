// src/components/SSESummary.jsx
import React from 'react';
import { MdPersonAdd, MdStorefront, MdRateReview, MdInfo } from 'react-icons/md';
import './SSESummary.css';

export default function SSESummary({ updates }) {
  // מונים כמה אירועים מכל סוג עם נורמליזציה
  const countByType = updates.reduce((acc, u) => {
    // נרמול סוגי אירועים כדי להתאים לכרטיסים
    let t = u.type;
    // מפה כל סוג בפלטפורמה לאחד משלושת הכרטיסים
    if (t === 'signup' || t === 'client')         t = 'client';
    else if (t === 'owner-update' || t === 'business') t = 'business';
    else if (t === 'review')                       t = 'review';
    else                                           t = 'info'; // לא מיוצג

    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  // הגדרות כרטיסים
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
