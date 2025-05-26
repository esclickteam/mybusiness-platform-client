export function startSSEConnection(businessId) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("⚠️ No auth token found in localStorage");
    return null; // או throw new Error(...) אם תרצה לעצור את התהליך
  }

  // הוספת הטוקן ל-URL כפרמטר
  const url = `${import.meta.env.VITE_SSE_URL}/stream/${businessId}?token=${encodeURIComponent(token)}`;

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
