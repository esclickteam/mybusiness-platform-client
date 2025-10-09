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
        setError("No authentication token found");
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
        setError("Connection issue — attempting to reconnect...");
        // Retry after 5 seconds
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

  if (!businessId) return <div>Waiting for businessId…</div>;

  return (
    <div>
      <h3>Real-Time Profile Views (SSE)</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Number of views: {viewsCount}</p>
    </div>
  );
}
