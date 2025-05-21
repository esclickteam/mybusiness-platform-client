// src/context/SSEContext.jsx
import React, { createContext, useState, useEffect } from "react";

// יצירת הקונטקסט לשימוש בכל הקומפוננטות
export const SSEContext = createContext({ updates: [] });

export function SSEProvider({ children, businessId, withHistory = false }) {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    if (!businessId) {
      console.warn("🔴 No businessId for SSE, skipping connection");
      return;
    }

    const baseUrl    = import.meta.env.VITE_SSE_URL || "/api/updates";
    const streamUrl  = `${baseUrl}/stream/${businessId}`;
    const historyUrl = `${baseUrl}/history`;

    let es;

    // פונקציה שמתחילה את חיבור ה־SSE
    const startStream = () => {
      console.log("🔌 [SSE] connecting to", streamUrl);
      es = new EventSource(streamUrl, { withCredentials: true });

      // מאזין לעדכוני סטטיסטיקה
      es.addEventListener("statsUpdate", (e) => {
        try {
          const ev = JSON.parse(e.data);
          setUpdates((prev) => {
            // הימנעות משכפול
            if (
              prev.length > 0 &&
              prev[0].timestamp === ev.timestamp &&
              prev[0].message === ev.message
            ) {
              return prev;
            }
            return [ev, ...prev].slice(0, 20); // מגביל ל־20 אחרונים
          });
        } catch (err) {
          console.error("Invalid SSE data:", err);
        }
      });

      // טיפול בשגיאות SSE
      es.onerror = (err) => {
        console.error("❌ [SSE] error", err);
        es.close();
      };
    };

    // שלב ראשון: היסטוריה אם נדרש
    if (withHistory) {
      fetch(historyUrl, { credentials: "include" })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setUpdates(data))
        .catch((err) => console.warn("📭 No history loaded:", err))
        .finally(() => startStream());
    } else {
      startStream();
    }

    // ניקוי בעת סגירה
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
