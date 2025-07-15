import React, { useState, useEffect, useMemo } from "react";
import { useNotifications } from "../context/NotificationsContext";

export default function NotificationsPanel() {
  const { 
    notifications, 
    unreadCount,       // <-- קיבלנו גם את המוני הקריאות שלא נקראו 
    markAsRead, 
    clearRead 
  } = useNotifications();

  const [open, setOpen] = useState(false);

  // הורדת כפילויות לפי threadId/id
  const deduped = useMemo(() => {
    const map = new Map();
    for (const nf of notifications) {
      const key = nf.threadId || nf.id;
      if (!key) continue;
      if (map.has(key)) {
        const prev = map.get(key);
        const newer = new Date(nf.timestamp) > new Date(prev.timestamp);
        map.set(key, {
          ...prev,
          ...nf,
          timestamp: newer ? nf.timestamp : prev.timestamp,
          unreadCount: Math.max(prev.unreadCount, nf.unreadCount),
        });
      } else {
        map.set(key, { ...nf });
      }
    }
    return Array.from(map.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [notifications]);

  // כאשר מתעדכנת הרשימה – לוג לבדיקה
  useEffect(() => {
    console.log("🔔 raw notifications:", notifications);
    console.log("🔔 deduped:", deduped);
  }, [notifications, deduped]);

  const handleIconClick = () => setOpen(o => !o);

  const handleItemClick = async (nf) => {
    const id = nf.threadId || nf.id;
    if (!nf.read && id) {
      await markAsRead(id);
    }
    setOpen(false);
  };

  const handleClearAll = async () => {
    try {
      await clearRead();
    } catch (e) {
      console.error("Error clearing read notifications:", e);
    }
  };

  const formatDate = ts =>
    new Date(ts).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short"
    });

  return (
    <div style={{ position: "relative" }}>
      {/* האייקון עם הבאדג' */}
      <button 
        onClick={handleIconClick}
        style={{ position: "relative", background: "none", border: "none", cursor: "pointer" }}
        aria-label={`התראות חדשות: ${unreadCount}`}
      >
        <span style={{ fontSize: 24 }}>🔔</span>
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              width: 18,
              height: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* הפאנל של ההתראות */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: 32,
            right: 0,
            width: 320,
            maxHeight: 400,
            overflowY: "auto",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            borderRadius: 8,
            zIndex: 1000,
          }}
        >
          {/* כותרת */}
          <div
            style={{
              padding: "8px 12px",
              borderBottom: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 700,
            }}
          >
            התראות
            {deduped.length > 0 && (
              <button 
                onClick={handleClearAll} 
                style={{
                  background: "none",
                  border: "none",
                  color: "#007bff",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                ניקוי כל ההתראות
              </button>
            )}
          </div>

          {/* גוף הפאנל */}
          {deduped.length === 0 ? (
            <div style={{ padding: 15, textAlign: "center" }}>אין התראות</div>
          ) : (
            deduped.map((nf) => {
              const key = nf.threadId || nf.id;
              return (
                <div
                  key={key}
                  onClick={() => handleItemClick(nf)}
                  style={{
                    padding: "10px 15px",
                    borderBottom: "1px solid #eee",
                    backgroundColor: nf.read ? "#fff" : "#e8f4ff",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: nf.read ? "normal" : "700",
                  }}
                  title={nf.text}
                >
                  <div>{nf.text}</div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#666",
                        opacity: 0.7,
                        marginRight: 10,
                      }}
                    >
                      {formatDate(nf.timestamp)}
                    </div>
                    {!nf.read && nf.unreadCount > 0 && (
                      <div
                        style={{
                          backgroundColor: "#d00",
                          color: "white",
                          borderRadius: "50%",
                          width: 22,
                          height: 22,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                        aria-label={`${nf.unreadCount} התראות לא נקראו`}
                      >
                        {nf.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
