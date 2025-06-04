import React, { createContext, useState, useEffect } from "react";

export const SSEContext = createContext({ updates: [] });

export function SSEProvider({ children, businessId, withHistory = false }) {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    if (!businessId) {
      console.warn("🔴 No businessId for SSE, skipping connection");
      return;
    }

    const baseUrl = import.meta.env.VITE_SSE_URL || "/api/updates";
    const token = localStorage.getItem("token");

    const streamUrl = token
      ? `${baseUrl}/stream/${businessId}?token=${encodeURIComponent(token)}`
      : `${baseUrl}/stream/${businessId}`;

    const historyUrl = `${baseUrl}/history`;

    let es;

    const startStream = () => {
      console.log("🔌 [SSE] connecting to", streamUrl);
      es = new EventSource(streamUrl, { withCredentials: true });

      es.addEventListener("statsUpdate", (e) => {
        try {
          const ev = JSON.parse(e.data);
          setUpdates((prev) => {
            // הימנעות משכפול עדכון עם אותו טיימסטמפ והודעה
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
      });

      es.onerror = (err) => {
        console.error("❌ [SSE] error", err);
        es.close();
        // ניסיון חיבור מחדש אחרי 5 שניות
        setTimeout(() => {
          startStream();
        }, 5000);
      };
    };

    if (withHistory) {
      fetch(historyUrl, { credentials: "include" })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setUpdates(data))
        .catch((err) => console.warn("📭 No history loaded:", err))
        .finally(() => startStream());
    } else {
      startStream();
    }

    return () => {
      es?.close();
      console.log("🔴 [SSE] connection closed");
    };
  }, [businessId, withHistory]);

  return (
    <SSEContext.Provider value={{ updates }}>
      {children}
    </SSEContext.Provider>
  );
}
