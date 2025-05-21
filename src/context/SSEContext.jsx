// src/context/SSEContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const SSEContext = createContext({ updates: [] });

export function SSEProvider({ children, businessId }) {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    if (!businessId) {
      console.error("No businessId found for SSE connection");
      return;
    }

    // וודא ש-VITE_SSE_URL מסתיים ללא /stream או /history
    const baseUrl = import.meta.env.VITE_SSE_URL || "/api/updates";

    // שמור שלא יכפיל /stream
    const streamUrl = `${baseUrl}/stream/${businessId}`;
    const historyUrl = `${baseUrl}/history`;

    let es;

    // 1) טען היסטוריה
    fetch(historyUrl, { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(data => setUpdates(data))
      .catch(err => console.error("Error loading updates history:", err))
      .finally(() => {
        console.log("🔌 [SSE] connecting to", streamUrl);
        es = new EventSource(streamUrl, { withCredentials: true });

        es.onmessage = e => {
          try {
            const ev = JSON.parse(e.data);
            setUpdates(prev => {
              if (
                prev.length > 0 &&
                prev[0].timestamp === ev.timestamp &&
                prev[0].message === ev.message
              ) {
                return prev;
              }
              return [ev, ...prev].slice(0, 20);
            });
          } catch (err) {
            console.error("Invalid SSE data:", err);
          }
        };

        es.onerror = err => {
          console.error("❌ [SSE] error", err);
          es.close();
        };
      });

    // 2) Cleanup on unmount
    return () => {
      if (es) {
        es.close();
        console.log("🔴 [SSE] connection closed");
      }
    };
  }, [businessId]);

  return (
    <SSEContext.Provider value={{ updates }}>
      {children}
    </SSEContext.Provider>
  );
}
