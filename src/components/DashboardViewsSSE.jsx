import React, { useEffect, useState } from "react";

export default function DashboardViewsSSE({ businessId }) {
  const [viewsCount, setViewsCount] = useState(0);

  useEffect(() => {
    if (!businessId) return;

    const evtSource = new EventSource(`${process.env.REACT_APP_API_URL}/sse/dashboard-stats/${businessId}`);

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
    };

    return () => {
      evtSource.close();
    };
  }, [businessId]);

  if (!businessId) return <div>מחכה ל-businessId…</div>;

  return (
    <div>
      <h3>צפיות בפרופיל בזמן אמת (SSE)</h3>
      <p>מספר צפיות: {viewsCount}</p>
    </div>
  );
}
