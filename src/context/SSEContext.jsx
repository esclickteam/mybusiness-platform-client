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
          console.log("📨 [SSE] raw event data:", e.data);
          const ev = JSON.parse(e.data);
          console.log("📊 [SSE] parsed event:", ev);

          setUpdates((prev) => {
            if (
              prev.length > 0 &&
              prev[0].timestamp === ev.timestamp &&
              prev[0].message === ev.message
            ) {
              console.log("⚠️ Duplicate event, skipping update");
              return prev;
            }
            return [ev, ...prev].slice(0, 20);
          });
        } catch (err) {
          console.error("❌ Error parsing SSE data:", err, "Raw data:", e.data);
        }
      });

      es.onerror = (err) => {
        console.error("❌ [SSE] error", err);
        es.close();
        setTimeout(() => {
          startStream();
        }, 5000);
      };
    };

    if (withHistory) {
      fetch(historyUrl, { credentials: "include" })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          console.log("📭 Loaded history data:", data);
          setUpdates(data);
        })
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
