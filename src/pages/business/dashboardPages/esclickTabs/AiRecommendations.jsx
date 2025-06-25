import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { HDate, Event, Location, HebrewCalendar, Luach } from '@hebcal/core'; // דוגמה לספריה לתאריכים עבריים

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

function formatHebrewDate(date) {
  // המרת תאריך רגיל לתאריך עברי עם ספריית hebcal/core
  try {
    const hd = new HDate(date);
    return hd.renderGematriya(); // או כל פורמט אחר שנוח לך
  } catch {
    return new Date(date).toLocaleDateString();
  }
}

const AiRecommendations = ({ businessId, token }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");

  useEffect(() => {
    if (!businessId || !token) return;

    const s = io(SOCKET_URL, {
      auth: { token, businessId },
      transports: ["websocket"],
    });

    s.on("connect", () => {
      s.emit("joinRoom", businessId);
    });

    s.on("newAiSuggestion", (rec) => {
      setRecommendations((prev) => {
        if (prev.find((r) => r._id === rec._id)) return prev;
        return [...prev, rec];
      });
    });

    s.on("messageApproved", ({ recommendationId }) => {
      setRecommendations((prev) =>
        prev.map((r) =>
          r._id === recommendationId || r.id === recommendationId
            ? { ...r, status: "approved" }
            : r
        )
      );
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [businessId, token]);

  const approveRecommendation = async (id) => {
    setLoading(true);
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

      alert("ההמלצה אושרה ונשלחה!");
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id || r._id === id ? { ...r, status: "approved" } : r))
      );
    } catch (err) {
      setError("שגיאה באישור ההמלצה: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const rejectRecommendation = async (id) => {
    setLoading(true);
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

      setRecommendations((prev) => prev.filter((r) => r.id !== id && r._id !== id));
      alert("ההמלצה נדחתה");
    } catch (err) {
      setError("שגיאה בדחיית ההמלצה: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecommendations = recommendations.filter(r => r.status === filterStatus);

  return (
    <div>
      <h3>המלצות AI ממתינות לאישור</h3>

      <label htmlFor="statusFilter">סינון לפי סטטוס: </label>
      <select
        id="statusFilter"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="pending">ממתינות לאישור</option>
        <option value="approved">מאושרות</option>
        <option value="rejected">נדחות</option>
        <option value="sent">נשלחו</option>
      </select>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {filteredRecommendations.length === 0 && <p>אין המלצות במצב זה.</p>}

      <ul>
        {filteredRecommendations.map(({ _id, id, text, createdAt, conversationId }) => (
          <li
            key={_id || id}
            style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "0.5rem" }}
          >
            <p>{text}</p>
            <small>תאריך: {formatHebrewDate(createdAt)}</small><br />
            <a
              href={`/chat/${conversationId}`} // עדכן לפי הנתיב האמיתי שלך
              target="_blank"
              rel="noopener noreferrer"
            >
              מעבר לשיחה
            </a>

            {filterStatus === "pending" && (
              <div style={{ marginTop: "0.5rem" }}>
                <button onClick={() => approveRecommendation(_id || id)} disabled={loading}>
                  אשר ושלח
                </button>
                <button onClick={() => rejectRecommendation(_id || id)} disabled={loading}>
                  דחה
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AiRecommendations;
