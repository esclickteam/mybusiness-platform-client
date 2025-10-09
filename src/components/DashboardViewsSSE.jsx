import React, { useEffect, useState, useRef } from "react";

export default function DashboardViewsSSE({ businessId }) {
  const [viewsCount, setViewsCount] = useState(0);
  const [error, setError] = useState(null);
  const evtSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!businessId) return;

    const connect = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("אין טוקן לאימות");
        return;
      }

      const url = `${import.meta.env.VITE_API_URL}/sse/dashboard-stats/${businessId}?token=${encodeURIComponent(token)}`;

      const evtSource = new EventSource(url);
      evtSourceRef.current = evtSource;
      setError(null);

      evtSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.views_count !== undefined) {
            setViewsCount(data.views_count);
          }
        } catch (err) {
          console.error("Error parsing SSE data:", err);
        }
      };

      evtSource.onerror = (err) => {
        console.error("SSE connection error:", err);
        evtSource.close();
        setError("תקלה בחיבור לשרת, מנסה להתחבר מחדש...");
        // נתקן תוך 5 שניות
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      };
    };

    connect();

    return () => {
      if (evtSourceRef.current) {
        evtSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [businessId]);

  if (!businessId) return <div>מחכה ל-businessId…</div>;

  return (
    <div>
      <h3>צפיות בפרופיל בזמן אמת (SSE)</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>מספר צפיות: {viewsCount}</p>
    </div>
  );
}
