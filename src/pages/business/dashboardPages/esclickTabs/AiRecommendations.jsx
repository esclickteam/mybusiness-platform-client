import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const AiRecommendations = ({ businessId, token }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!businessId || !token) return;

    console.log("Initializing socket connection...");

    const s = io(SOCKET_URL, {
      auth: { token, businessId },
      transports: ["websocket"],
    });

    s.on("connect", () => {
      console.log("Socket connected, id:", s.id);
      s.emit("joinRoom", businessId);
      console.log(`Emitted joinRoom for businessId: ${businessId}`);
    });

    s.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    s.on("disconnect", (reason) => {
      console.log("Socket disconnected, reason:", reason);
    });

    s.on("newAiSuggestion", (rec) => {
      console.log("Received newAiSuggestion:", rec);
      setRecommendations((prev) => {
        // הימנעות מכפילויות לפי _id
        if (prev.find(r => r._id === rec._id)) return prev;
        return [...prev, rec];
      });
    });

    s.on("messageApproved", ({ recommendationId }) => {
      console.log("Received messageApproved for recommendationId:", recommendationId);
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
      console.log("Disconnecting socket...");
      s.disconnect();
    };
  }, [businessId, token]);

  const approveRecommendation = async (id) => {
    setLoading(true);
    try {
      console.log("Approving recommendation:", id);
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
      alert("שגיאה באישור ההמלצה: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const rejectRecommendation = async (id) => {
    setLoading(true);
    try {
      console.log("Rejecting recommendation:", id);
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
      alert("שגיאה בדחיית ההמלצה: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>המלצות AI ממתינות לאישור</h3>
      {recommendations.filter((r) => r.status === "pending").length === 0 && <p>אין המלצות חדשות.</p>}
      <ul>
        {recommendations
          .filter((r) => r.status === "pending")
          .map(({ _id, id, text }) => (
            <li
              key={_id || id}
              style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "0.5rem" }}
            >
              <p>{text}</p>
              <button onClick={() => approveRecommendation(_id || id)} disabled={loading}>
                אשר ושלח
              </button>
              <button onClick={() => rejectRecommendation(_id || id)} disabled={loading}>
                דחה
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default AiRecommendations;
