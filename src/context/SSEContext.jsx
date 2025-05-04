// src/context/SSEContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const SSEContext = createContext({ updates: [] });

export function SSEProvider({ children }) {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const streamUrl  = import.meta.env.VITE_SSE_URL || "/api/updates/stream";
    const historyUrl = import.meta.env.VITE_SSE_URL
      ? import.meta.env.VITE_SSE_URL.replace(/\/stream$/, "/history")
      : "/api/updates/history";

    let es;

    // 1) טען היסטוריה
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
            setUpdates(prev => {
              // בדיקה: אם בראש הרשימה כבר קיים אותו אירוע, אל תוסיף
              if (
                prev.length > 0 &&
                prev[0].timestamp === ev.timestamp &&
                prev[0].message   === ev.message
              ) {
                return prev;
              }
              // אחרת, הוסף בראש ונקשור עד 20
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

    // 2) cleanup
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
