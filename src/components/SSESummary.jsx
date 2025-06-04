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

  // ניקח את העדכון האחרון כדי להציג את המספרים העדכניים
  const latest = updates[0];

  const cards = [
    {
      type: 'client',
      label: 'לקוחות חדשים',
      icon: <MdPersonAdd />,
      count: latest.open_leads_count ?? 0,
    },
    {
      type: 'business',
      label: 'עסקים חדשים',
      icon: <MdStorefront />,
      count: latest.orders_count ?? 0,
    },
    {
      type: 'review',
      label: 'ביקורות חדשות',
      icon: <MdRateReview />,
      count: latest.reviews_count ?? 0,
    },
  ];

  return (
    <div className="sse-summary">
      {cards.map(c => (
        <div key={c.type} className="sse-card">
          <div className="sse-icon">{c.icon}</div>
          <div className="sse-info">
            <div className="sse-count">{c.count}</div>
            <div className="sse-label">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
