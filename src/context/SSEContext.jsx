// src/context/SSEContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const SSEContext = createContext({
  updates: [],
});

export function SSEProvider({ children }) {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const url =
      import.meta.env.VITE_SSE_URL ||
      "https://api.esclick.co.il/api/updates/stream";
    const es = new EventSource(url, { withCredentials: true });
    console.log("🔌 [SSE] connecting to", url);

    es.onmessage = (e) => {
      console.log("🔔 [SSE] onmessage:", e.data);
      try {
        const data = JSON.parse(e.data);
        setUpdates((prev) => [data, ...prev].slice(0, 10));
      } catch (err) {
        console.error("Invalid SSE data:", err);
      }
    };
    es.onerror = (err) => {
      console.error("❌ [SSE] error", err);
      es.close();
    };
    return () => es.close();
  }, []);

  return (
    <SSEContext.Provider value={{ updates }}>
      {children}
    </SSEContext.Provider>
  );
}
