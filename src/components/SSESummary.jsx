// src/components/SSESummary.jsx
import React from 'react';
import { MdPersonAdd, MdStorefront, MdRateReview, MdInfo } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import './SSESummary.css';

export default function SSESummary({ updates }) {
  const navigate = useNavigate();

  // Debug: log incoming updates and types
  console.log('SSESummary updates:', updates);
  updates.forEach(u => console.log('  type:', u.type, 'message:', u.message || u.title));

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
    <div className="sse-summary-wrapper">
      <h4 className="sse-summary-title">📈 מה קורה עכשיו בעסקליק?</h4>
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
      <div className="sse-more-link" style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button onClick={() => navigate('/updates')} className="see-more-button">
          ← ראו את כל העדכונים
        </button>
      </div>
    </div>
  );
}
