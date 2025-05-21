// src/sse.js
import API from './api'; // נתיב ל-API שלך

export function startSSEConnection(businessId) {
  const url = `${API.defaults.baseURL}/updates/stream/${businessId}`;
  const eventSource = new EventSource(url, { withCredentials: true });

  eventSource.onopen = () => console.log('🔌 [SSE] connected to', url);
  eventSource.onmessage = (e) => {
    console.log('📨 [SSE] message:', e.data);
    // כאן אפשר להוסיף לוגיקה להודעה שהתקבלה
  };
  eventSource.onerror = (err) => {
    console.error('🔴 [SSE] error', err);
    eventSource.close();
  };

  return eventSource;
}
