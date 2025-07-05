import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const AiRecommendations = ({ businessId, token }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!businessId || !token) {
      console.warn(
        "AiRecommendations: missing businessId or token, skipping socket connection"
      );
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token, businessId },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("joinRoom", businessId);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setError("שגיאה בקשר לשרת, נסה מחדש מאוחר יותר.");
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    // מאזין רק להמלצות AI
    socket.on("newAiSuggestion", (rec) => {
      // אם backend מביא שדות נוספים, אפשר לסנן כאן:
      // אם אתה מוסיף rec.isGenerated = true מהשרת, אפשר לבדוק: if (!rec.isGenerated) return;

      setRecommendations((prev) => {
        const idx = prev.findIndex((r) => r._id === rec._id || r.id === rec._id);
        if (idx !== -1) {
          // עדכון אם השתנה
          if (prev[idx].text !== rec.text || prev[idx].status !== rec.status) {
            const updated = [...prev];
            updated[idx] = rec;
            return updated;
          }
          return prev;
        }
        // הוספה ראשונה
        return [...prev, rec];
      });
    });

    socket.on("messageApproved", ({ recommendationId }) => {
      setRecommendations((prev) =>
        prev.map((r) =>
          r._id === recommendationId || r.id === recommendationId
            ? { ...r, status: "approved" }
            : r
        )
      );
      setLoadingIds((ids) => {
        const next = new Set(ids);
        next.delete(recommendationId);
        return next;
      });
    });

    socket.on("recommendationRejected", ({ recommendationId }) => {
      setRecommendations((prev) =>
        prev.filter((r) => r._id !== recommendationId && r.id !== recommendationId)
      );
      setLoadingIds((ids) => {
        const next = new Set(ids);
        next.delete(recommendationId);
        return next;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [businessId, token]);

  const approveRecommendation = async (id) => {
    setLoadingIds((ids) => new Set(ids).add(id));
    setError(null);
    try {
      const res = await fetch("/api/chat/send-approved", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ businessId, recommendationId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve");

      setRecommendations((prev) =>
        prev.map((r) =>
          r._id === id || r.id === id ? { ...r, status: "approved" } : r
        )
      );
    } catch (err) {
      setError("שגיאה באישור ההמלצה: " + err.message);
    } finally {
      setLoadingIds((ids) => {
        const next = new Set(ids);
        next.delete(id);
        return next;
      });
    }
  };

  const rejectRecommendation = async (id) => {
    setLoadingIds((ids) => new Set(ids).add(id));
    setError(null);
    try {
      const res = await fetch("/api/chat/rejectRecommendation", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recommendationId: id }),
      });
      if (!res.ok) throw new Error("Failed to reject");

      setRecommendations((prev) =>
        prev.filter((r) => r._id !== id && r.id !== id)
      );
    } catch (err) {
      setError("שגיאה בדחיית ההמלצה: " + err.message);
    } finally {
      setLoadingIds((ids) => {
        const next = new Set(ids);
        next.delete(id);
        return next;
      });
    }
  };

  // מציגים רק המלצות במצב 'pending'
  const pending = recommendations.filter((r) => r.status === "pending");

  return (
    <div>
      <h3>המלצות AI ממתינות לאישור</h3>
      {error && <p style={{ color: "red" }}>שגיאה: {error}</p>}
      {pending.length === 0 ? (
        <p>אין המלצות חדשות.</p>
      ) : (
        <ul>
          {pending.map(({ _id, id, text }) => {
            const recId = _id || id;
            const isLoading = loadingIds.has(recId);
            return (
              <li
                key={recId}
                style={{
                  marginBottom: "1rem",
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                }}
              >
                <p>{text}</p>
                <button
                  onClick={() => approveRecommendation(recId)}
                  disabled={isLoading}
                >
                  {isLoading ? "טוען..." : "אשר ושלח"}
                </button>{" "}
                <button
                  onClick={() => rejectRecommendation(recId)}
                  disabled={isLoading}
                >
                  {isLoading ? "טוען..." : "דחה"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AiRecommendations;
