// src/components/UpdatesTicker.jsx
import React, { useState, useEffect } from 'react';
import '../styles/UpdatesTicker.css';

export default function UpdatesTicker() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = import.meta.env.VITE_SSE_URL;
    if (!url) {
      console.error('❌ VITE_SSE_URL is not defined');
      setLoading(false);
      return;
    }
    console.log('🔌 Connecting SSE to', url);

    const es = new EventSource(url, { withCredentials: true });

    es.onmessage = e => {
      console.log('🔔 SSE onmessage got:', e.data);  // <<< פה הלוג

      try {
        const data = JSON.parse(e.data);
        setUpdates(prev => [data, ...prev].slice(0, 10));
      } catch (err) {
        console.error('Invalid SSE data format:', err);
      } finally {
        setLoading(false);
      }
    };

    es.onerror = err => {
      console.error('SSE connection error:', err);
      es.close();
      setLoading(false);
    };

    return () => es.close();
  }, []);

  if (loading) {
    return <div className="updates-ticker loading">🔄 טוען עדכונים…</div>;
  }

  if (updates.length === 0) {
    return <div className="updates-ticker no-updates">אין עדכונים חדשים</div>;
  }

  return (
    <ul className="updates-ticker">
      {updates.map((u, i) => (
        <li key={i} className={`update-item update-${u.type}`}>
          <small>{new Date(u.timestamp).toLocaleTimeString('he-IL')}</small>
          {' – '}
          {u.message}
        </li>
      ))}
    </ul>
  );
}
