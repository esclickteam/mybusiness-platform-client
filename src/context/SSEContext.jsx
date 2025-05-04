// src/context/SSEContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const SSEContext = createContext({ updates: [] });

export function SSEProvider({ children }) {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const streamUrl  =
      import.meta.env.VITE_SSE_URL || "/api/updates/stream";
    const historyUrl =
      import.meta.env.VITE_SSE_URL
        ? import.meta.env.VITE_SSE_URL.replace(/\/stream$/, "/history")
        : "/api/updates/history";

    let es;  // נמנע משגיאת scope ב-cleanup

    // טען היסטוריה
    fetch(historyUrl, { credentials: "include" })
      .then(res => res.json())
      .then(data => setUpdates(data))
      .catch(err => console.error("Error loading updates history:", err))
      .finally(() => {
        console.log("🔌 [SSE] connecting to", streamUrl);
        es = new EventSource(streamUrl, { withCredentials: true });

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
      });

    // cleanup של ה־EventSource
    return () => {
      if (es) {
        es.close();
        console.log("🔴 [SSE] connection closed");
      }
    };
  }, []);

  return (
    <SSEContext.Provider value={{ updates }}>
      {children}
    </SSEContext.Provider>
  );
}
