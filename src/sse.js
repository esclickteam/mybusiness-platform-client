export function startSSEConnection(businessId) {
  // השתמש ב-VITE_SSE_URL שמוגדר בסביבת הפרודקשן/פיתוח
  const url = `${import.meta.env.VITE_SSE_URL}/stream/${businessId}`;

  const eventSource = new EventSource(url, { withCredentials: true });

  eventSource.onopen = () => {
    console.log('🔌 [SSE] connected to', url);
  };

  eventSource.onmessage = (e) => {
    console.log('📨 [SSE] message:', e.data);
    // כאן אפשר להוסיף לוגיקה לטיפול בהודעות שהתקבלו
  };

  eventSource.onerror = (err) => {
    console.error('🔴 [SSE] error', err);
    // לא סוגר אוטומטית כדי לבדוק שגיאות זמניות
  };

  return eventSource;
}
