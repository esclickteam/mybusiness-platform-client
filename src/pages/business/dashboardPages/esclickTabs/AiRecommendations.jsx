import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const AiRecommendations = ({ businessId, token, onTokenExpired }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const socketRef = useRef(null);

  const cleanText = (text) => text.replace(/(\*\*|#|\*)/g, "").trim();

  useEffect(() => {
    if (!businessId || !token) return;

    setError(null);
    fetch(`/chat/recommendations?businessId=${businessId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load recommendations");
        return res.json();
      })
      .then((data) => setRecommendations(data))
      .catch((err) => {
        console.error("[Load] error:", err);
        setError("שגיאה בטעינת ההמלצות: " + err.message);
      });
  }, [businessId, token]);

  useEffect(() => {
    if (!businessId || !token) return;

    const socket = io(SOCKET_URL, {
      auth: { token, businessId },
      transports: ["websocket"],
      autoConnect: false,
      reconnection: true,
    });
    socketRef.current = socket;

    const onConnect = () => {
      socket.emit("joinRoom", `business-${businessId}`);
      socket.emit("joinRoom", `dashboard-${businessId}`);
    };

    const onConnectError = (err) => {
      if (err.message.includes("401") && typeof onTokenExpired === "function") {
        onTokenExpired();
      } else {
        setError("שגיאה בקשר לשרת, נסה מחדש מאוחר יותר.");
      }
    };

    const onDisconnect = (reason) => {
      console.log("[Socket] disconnected:", reason);
    };

    const onNewAiSuggestion = (rec) => {
      setRecommendations((prev) => {
        const idx = prev.findIndex((r) => (r._id === rec._id || r.id === rec._id));
        if (idx !== -1) {
          if (prev[idx].text !== rec.text || prev[idx].status !== rec.status) {
            const copy = [...prev];
            copy[idx] = rec;
            return copy;
          }
          return prev;
        }
        return [...prev, rec];
      });
    };

    const onMessageApproved = ({ recommendationId }) => {
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
    };

    const onRecommendationRejected = ({ recommendationId }) => {
      setRecommendations((prev) =>
        prev.map((r) =>
          r._id === recommendationId || r.id === recommendationId
            ? { ...r, status: "rejected" }
            : r
        )
      );
      setLoadingIds((ids) => {
        const next = new Set(ids);
        next.delete(recommendationId);
        return next;
      });
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("disconnect", onDisconnect);
    socket.on("newAiSuggestion", onNewAiSuggestion);
    socket.on("messageApproved", onMessageApproved);
    socket.on("recommendationRejected", onRecommendationRejected);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("disconnect", onDisconnect);
      socket.off("newAiSuggestion", onNewAiSuggestion);
      socket.off("messageApproved", onMessageApproved);
      socket.off("recommendationRejected", onRecommendationRejected);
      socket.disconnect();
    };
  }, [businessId, token, onTokenExpired]);

  useEffect(() => {
    const socket = socketRef.current;
    if (socket && socket.auth) {
      socket.auth.token = token;
      if (socket.connected) {
        socket.disconnect();
        socket.connect();
      }
    }
  }, [token]);

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
        prev.map((r) =>
          r._id === id || r.id === id ? { ...r, status: "rejected" } : r
        )
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

  const startEditing = (rec) => {
    setEditingId(rec._id || rec.id);
    setEditText(cleanText(rec.isEdited ? rec.editedText : rec.commandText || ""));
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveDraft = async (id) => {
    setLoadingIds((ids) => new Set(ids).add(id));
    setError(null);
    try {
      const newText = cleanText(editText);
      const res = await fetch("/api/chat/editRecommendation", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recommendationId: id, newText }),
      });
      if (!res.ok) throw new Error("Failed to save draft");

      setRecommendations((prev) =>
        prev.map((r) =>
          r._id === id || r.id === id
            ? { ...r, isEdited: true, editedText: newText }
            : r
        )
      );
      cancelEditing();
    } catch (err) {
      setError("שגיאה בשמירת טיוטה: " + err.message);
    } finally {
      setLoadingIds((ids) => {
        const next = new Set(ids);
        next.delete(id);
        return next;
      });
    }
  };

  const saveAndApprove = async (id) => {
    setLoadingIds((ids) => new Set(ids).add(id));
    setError(null);
    try {
      const newText = cleanText(editText);
      const res1 = await fetch("/api/chat/editRecommendation", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recommendationId: id, newText }),
      });
      if (!res1.ok) {
        const err = await res1.json();
        throw new Error(err.error || "Failed to edit");
      }
      await approveRecommendation(id);

      setRecommendations((prev) =>
        prev.map((r) =>
          r._id === id || r.id === id
            ? { ...r, status: "approved", isEdited: true, editedText: newText }
            : r
        )
      );
      cancelEditing();
    } catch (err) {
      setError("שגיאה בשמירה ואישור: " + err.message);
    } finally {
      setLoadingIds((ids) => {
        const next = new Set(ids);
        next.delete(id);
        return next;
      });
    }
  };

  const pending = recommendations.filter((r) => r.status === "pending");
  const history = recommendations.filter(
    (r) => r.status === "approved" || r.status === "rejected"
  );

  return (
    <div>
      <h3>המלצות AI ממתינות לאישור</h3>
      {error && <p style={{ color: "red" }}>שגיאה: {error}</p>}

      {pending.length === 0 ? (
        <p>אין המלצות חדשות.</p>
      ) : (
        <ul>
          {pending.map(({ _id, id, text, commandText }) => {
            const recId = _id || id;
            const isLoading = loadingIds.has(recId);
            const isEditing = editingId === recId;

            return (
              <li
                key={recId}
                style={{
                  marginBottom: "1rem",
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                }}
              >
                {isEditing ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) =>
                        setEditText(e.target.value.replace(/(\*\*|#|\*)/g, ""))
                      }
                      rows={10}
                      style={{ width: "100%", resize: "vertical" }}
                    />
                    <div style={{ marginTop: 10 }}>
                      <button onClick={() => saveDraft(recId)} disabled={isLoading}>
                        {isLoading ? "שומר טיוטה..." : "שמור טיוטה"}
                      </button>{" "}
                      <button
                        onClick={() => saveAndApprove(recId)}
                        disabled={isLoading}
                      >
                        {isLoading ? "מטמיע ושולח..." : "שמור ואשר"}
                      </button>{" "}
                      <button onClick={cancelEditing} disabled={isLoading}>
                        ביטול
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p><strong>שאלה:</strong> {cleanText(text)}</p>
                    {commandText && (
                      <p style={{ fontStyle: "italic", color: "#555" }}>
                        <strong>תשובה/המלצה:</strong> {cleanText(commandText)}</p>
                    )}
                    <button onClick={() => startEditing({ _id: recId, text, commandText, editedText: recommendations.find(r => (r._id === recId || r.id === recId))?.editedText, isEdited: recommendations.find(r => (r._id === recId || r.id === recId))?.isEdited })}>
                      ערוך
                    </button>{" "}
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
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <hr />

      <button
        onClick={() => setShowHistory((show) => !show)}
        style={{
          margin: "1rem 0",
          backgroundColor: "#7c43bd",
          color: "white",
          border: "none",
          borderRadius: "20px",
          padding: "8px 20px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        {showHistory ? "הסתר היסטוריית המלצות" : "ראה היסטוריית המלצות"}
      </button>

      {showHistory && (
        <>
          <h3>היסטוריית המלצות</h3>
          {history.length === 0 ? (
            <p>אין המלצות בעבר.</p>
          ) : (
            <ul>
              {history.map(({ _id, id, text, status, commandText }) => {
                const recId = _id || id;
                return (
                  <li
                    key={recId}
                    style={{
                      marginBottom: "1rem",
                      border: "1px solid #eee",
                      padding: "0.5rem",
                      opacity: 0.7,
                    }}
                  >
                    <p><strong>שאלה:</strong> {cleanText(text)}</p>
                    {commandText && (
                      <p style={{ fontStyle: "italic", color: "#555" }}>
                        <strong>תשובה/המלצה:</strong> {cleanText(commandText)}
                      </p>
                    )}
                    <p>סטטוס: {status === "approved" ? "מאושר" : "נדחה"}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default AiRecommendations;
