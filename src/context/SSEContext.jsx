// src/context/SSEContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const SSEContext = createContext({
  updates: [],
});

export function SSEProvider({ children }) {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const streamUrl   = import.meta.env.VITE_SSE_URL || "/api/updates/stream";
    const historyUrl  = import.meta.env.VITE_SSE_URL
      ? import.meta.env.VITE_SSE_URL.replace(/\/stream$/, "/history")
      : "/api/updates/history";

    // 1) נטען קודם את ההיסטוריה
    fetch(historyUrl, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setUpdates(data);               // למלא ב–state ההיסטורית
      })
      .catch(err => console.error("Error loading updates history:", err))
      .finally(() => {
        // 2) לאחר מכן פותחים SSE לחיבורים חיים
        console.log("🔌 [SSE] connecting to", streamUrl);
        const es = new EventSource(streamUrl, { withCredentials: true });

        es.onmessage = e => {
          try {
            const ev = JSON.parse(e.data);
            setUpdates(prev => [ev, ...prev].slice(0, 20));
          } catch (err) {
            console.error("Invalid SSE data:", err);
          }
        };

        es.onerror = err => {
          console.error("❌ [SSE] error", err);
          es.close();
        };

        // clean up
        return () => es.close();
      });
  }, []);

  return (
    <SSEContext.Provider value={{ updates }}>
      {children}
    </SSEContext.Provider>
  );
}
