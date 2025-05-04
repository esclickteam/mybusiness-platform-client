// src/components/SSESummary.jsx
import React from 'react';
import { MdPersonAdd, MdStorefront, MdRateReview, MdInfo } from 'react-icons/md';
import './SSESummary.css';

export default function SSESummary({ updates }) {
  // מונים כמה אירועים מכל סוג באמצעות ניתוח הודעת הטקסט
  const countByType = updates.reduce((acc, u) => {
    let t;
    const msg = u.message || '';
    // אם ההודעה מדברת על לקוח
    if (/לקוח/.test(msg)) t = 'client';
    // אם היא על בעל עסק
    else if (/עסק/.test(msg)) t = 'business';
    // אם היא על ביקורת
    else if (/ביקורת/.test(msg)) t = 'review';
    else t = 'info';

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
