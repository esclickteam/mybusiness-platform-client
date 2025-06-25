import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const AiRecommendations = ({ businessId, token }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!businessId || !token) return;

    const s = io(process.env.REACT_APP_SOCKET_URL, {
      auth: { token, businessId },
      transports: ["websocket"],
    });

    s.on("connect", () => {
      s.emit("joinRoom", businessId);
    });

    s.on("newAiSuggestion", (rec) => {
      setRecommendations((prev) => [...prev, rec]);
    });

    s.on("updateRecommendationStatus", ({ id, status }) => {
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    });

    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [businessId, token]);

  const approveRecommendation = async (id) => {
    setLoading(true);
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
    } catch (err) {
      alert("שגיאה באישור ההמלצה: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const rejectRecommendation = async (id) => {
    setLoading(true);
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
      setRecommendations((prev) => prev.filter((r) => r.id !== id));
      alert("ההמלצה נדחתה");
    } catch (err) {
      alert("שגיאה בדחיית ההמלצה: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>המלצות AI ממתינות לאישור</h3>
      {recommendations.length === 0 && <p>אין המלצות חדשות.</p>}
      <ul>
        {recommendations
          .filter((r) => r.status === "pending")
          .map(({ id, text }) => (
            <li key={id} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "0.5rem" }}>
              <p>{text}</p>
              <button onClick={() => approveRecommendation(id)} disabled={loading}>
                אשר ושלח
              </button>
              <button onClick={() => rejectRecommendation(id)} disabled={loading}>
                דחה
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default AiRecommendations;
