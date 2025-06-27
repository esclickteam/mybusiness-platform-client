import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const AiRecommendations = ({ businessId, token }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!businessId || !token) {
      console.warn("AiRecommendations: missing businessId or token, skipping socket connection");
      return;
    }

    console.log("[Socket] Initializing socket connection...");

    const s = io(SOCKET_URL, {
      auth: { token, businessId },
      transports: ["websocket"],
    });

    s.on("connect", () => {
      console.log(`[Socket] Connected with id: ${s.id}`);
      s.emit("joinRoom", businessId);
      console.log(`[Socket] Emitted joinRoom for businessId: ${businessId}`);
    });

    s.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err);
      setError("שגיאה בקשר לשרת, נסה מחדש מאוחר יותר.");
    });

    s.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected, reason:", reason);
    });

    s.on("newAiSuggestion", (rec) => {
      console.log("[Socket] Received newAiSuggestion:", rec);
      setRecommendations((prev) => {
        if (prev.find((r) => r._id === rec._id)) {
          console.log(`[Socket] Recommendation with id ${rec._id} already exists, skipping`);
          return prev;
        }
        console.log(`[Socket] Adding new recommendation with id ${rec._id}`);
        return [...prev, rec];
      });
    });

    s.on("messageApproved", ({ recommendationId }) => {
      console.log(`[Socket] Received messageApproved for recommendationId: ${recommendationId}`);
      setRecommendations((prev) =>
        prev.map((r) => {
          if (r._id === recommendationId || r.id === recommendationId) {
            console.log(`[Socket] Updating recommendation ${recommendationId} status to approved`);
            return { ...r, status: "approved" };
          }
          return r;
        })
      );
      setLoadingIds((ids) => {
        const newIds = new Set(ids);
        newIds.delete(recommendationId);
        return newIds;
      });
    });

    s.on("recommendationRejected", ({ recommendationId }) => {
      console.log(`[Socket] Received recommendationRejected for recommendationId: ${recommendationId}`);
      setRecommendations((prev) => prev.filter((r) => r._id !== recommendationId && r.id !== recommendationId));
      setLoadingIds((ids) => {
        const newIds = new Set(ids);
        newIds.delete(recommendationId);
        return newIds;
      });
    });

    setSocket(s);

    return () => {
      console.log("[Socket] Disconnecting socket...");
      s.disconnect();
    };
  }, [businessId, token]);

  const approveRecommendation = async (id) => {
    setLoadingIds((ids) => new Set(ids).add(id));
    setError(null);
    console.log(`[Action] Approving recommendation: ${id}`);
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

      if (!res.ok) {
        console.error(`[Action] Approval failed: ${data.error || "Unknown error"}`);
        throw new Error(data.error || "Failed to approve");
      }

      // סטטוס יתעדכן גם משידור ה-Socket.IO (messageApproved), אבל נשמור פה לצורך מיידיות UI
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id || r._id === id ? { ...r, status: "approved" } : r))
      );
    } catch (err) {
      console.error(`[Action] Error approving recommendation: ${err.message}`);
      setError("שגיאה באישור ההמלצה: " + err.message);
      setLoadingIds((ids) => {
        const newIds = new Set(ids);
        newIds.delete(id);
        return newIds;
      });
    }
  };

  const rejectRecommendation = async (id) => {
    setLoadingIds((ids) => new Set(ids).add(id));
    setError(null);
    console.log(`[Action] Rejecting recommendation: ${id}`);
    try {
      const res = await fetch("/api/chat/rejectRecommendation", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recommendationId: id }),
      });

      if (!res.ok) {
        console.error("[Action] Reject failed");
        throw new Error("Failed to reject");
      }

      setRecommendations((prev) => prev.filter((r) => r.id !== id && r._id !== id));
    } catch (err) {
      console.error(`[Action] Error rejecting recommendation: ${err.message}`);
      setError("שגיאה בדחיית ההמלצה: " + err.message);
      setLoadingIds((ids) => {
        const newIds = new Set(ids);
        newIds.delete(id);
        return newIds;
      });
    }
  };

  return (
    <div>
      <h3>המלצות AI ממתינות לאישור</h3>
      {error && <p style={{ color: "red" }}>שגיאה: {error}</p>}
      {recommendations.filter((r) => r.status === "pending").length === 0 && <p>אין המלצות חדשות.</p>}
      <ul>
        {recommendations
          .filter((r) => r.status === "pending")
          .map(({ _id, id, text }) => {
            const recId = _id || id;
            const isLoading = loadingIds.has(recId);
            return (
              <li
                key={recId}
                style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "0.5rem" }}
              >
                <p>{text}</p>
                <button onClick={() => approveRecommendation(recId)} disabled={isLoading}>
                  {isLoading ? "טוען..." : "אשר ושלח"}
                </button>
                <button onClick={() => rejectRecommendation(recId)} disabled={isLoading}>
                  {isLoading ? "טוען..." : "דחה"}
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default AiRecommendations;
