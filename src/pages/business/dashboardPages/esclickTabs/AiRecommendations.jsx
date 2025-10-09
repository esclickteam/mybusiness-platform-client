import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const RECOMMEND_LIMIT = 60; // סף למניעת אישור

const AiRecommendations = ({ businessId, token, onTokenExpired }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [approvedCount, setApprovedCount] = useState(0);
  const [canApprove, setCanApprove] = useState(true);
  const socketRef = useRef(null);

  // מנקה markdown מסמלים מיותרים
  const cleanText = (text) => (text || "").replace(/(\*\*|#|\*)/g, "").trim();

  // טוען המלצות ונתוני אישורים בהתחלה ובכל שינוי של עסק/טוקן
  useEffect(() => {
    if (!businessId || !token) return;
    setError(null);

    // טען המלצות AI
    fetch(`/api/chat/recommendations?businessId=${businessId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load recommendations");
        return res.json();
      })
      .then((data) => setRecommendations(data))
      .catch((err) => setError("שגיאה בטעינת ההמלצות: " + err.message));

    // טען ספירת אישורים קיימים
    fetch(`/api/business/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const count = data.business?.monthlyQuestionCount || 0;

        setApprovedCount(count);
        setCanApprove(count < RECOMMEND_LIMIT);
      })
      .catch(() => {
        setApprovedCount(0);
        setCanApprove(true);
      });
  }, [businessId, token]);

  // התחברות לסוקט לעדכונים בזמן אמת
  useEffect(() => {
    if (!businessId || !token) return;
    const socket = io(SOCKET_URL, {
      auth: { token, businessId },
      transports: ["websocket"],
      autoConnect: false,
      reconnection: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinRoom", `business-${businessId}`);
      socket.emit("joinRoom", `dashboard-${businessId}`);
    });
    socket.on("connect_error", (err) => {
      if (err.message.includes("401") && typeof onTokenExpired === "function") {
        onTokenExpired();
      } else {
        setError("שגיאה בקשר לשרת, נסה מחדש מאוחר יותר.");
      }
    });

    socket.on("newAiSuggestion", (rec) => {
      setRecommendations((prev) => {
        const idx = prev.findIndex((r) => r._id === rec._id || r.id === rec._id);
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
    });

    socket.on("messageApproved", ({ recommendationId }) => {
      setRecommendations((prev) =>
        prev.map((r) =>
          r._id === recommendationId || r.id === recommendationId
            ? { ...r, status: "approved" }
            : r
        )
      );
      setApprovedCount((c) => {
        const next = c + 1;
        setCanApprove(next < RECOMMEND_LIMIT);
        return next;
      });
      setLoadingIds((ids) => {
        const next = new Set(ids);
        next.delete(recommendationId);
        return next;
      });
    });

    socket.on("recommendationRejected", ({ recommendationId }) => {
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
    });

    socket.connect();
    return () => socket.disconnect();
  }, [businessId, token, onTokenExpired]);

  // אישור המלצה
  const approveRecommendation = async (id) => {
    if (!canApprove) {
      setError("הגעת למכסת האישור החודשית, לא ניתן לאשר המלצות נוספות.");
      return;
    }
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
      setApprovedCount((c) => {
        const next = c + 1;
        setCanApprove(next < RECOMMEND_LIMIT);
        return next;
      });
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

  // דחיית המלצה
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

  // התחלת עריכה
  const startEditing = (rec) => {
    const recId = rec._id || rec.id;
    setEditingId(recId);
    setEditText(cleanText(rec.isEdited ? rec.editedText : rec.commandText || ""));
  };
  // ביטול עריכה
  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };
  // שמירת טיוטה
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
          r._id === id || r.id === id ? { ...r, isEdited: true, editedText: newText } : r
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
  // שמירה ואישור משולב
  const saveAndApprove = async (id) => {
    if (!canApprove) {
      setError("הגעת למכסת האישור החודשית, לא ניתן לאשר המלצות נוספות.");
      return;
    }
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
  const history = recommendations.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">המלצות AI ממתינות לאישור</h3>
      {error && <p className="text-red-600">{error}</p>}

      {!canApprove && (
        <p className="text-red-600 font-bold">
          הגעת למכסת אישורים! אפשר לצפות בלבד, לא לאשר המלצות נוספות
        </p>
      )}

      {pending.length === 0 ? (
        <p>אין המלצות חדשות.</p>
      ) : (
        <ul className="space-y-4">
          {pending.map((r) => {
            const recId = r._id || r.id;
            const isLoading = loadingIds.has(recId);
            const isEditing = editingId === recId;

            return (
              <li key={recId} className="border p-4 rounded-lg">
                {isEditing ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) =>
                        setEditText(e.target.value.replace(/(\*\*|#|\*)/g, ""))
                      }
                      rows={6}
                      className="w-full border rounded p-2"
                      disabled={!canApprove}
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => saveDraft(recId)}
                        disabled={isLoading || !canApprove}
                        className="px-4 py-1 rounded shadow bg-gray-200 disabled:opacity-50"
                      >
                        שמור טיוטה
                      </button>
                      <button
                        onClick={() => saveAndApprove(recId)}
                        disabled={isLoading || !canApprove}
                        className="px-4 py-1 rounded shadow bg-purple-600 text-white disabled:opacity-50"
                      >
                        שמור ואשר
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={isLoading}
                        className="px-4 py-1 rounded shadow bg-gray-200 disabled:opacity-50"
                      >
                        ביטול
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p><strong>שאלה:</strong> {cleanText(r.text)}</p>
                    {r.commandText && (
                      <p className="italic text-gray-600">
                        <strong>תשובה:</strong> {cleanText(r.commandText)}
                      </p>
                    )}
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => startEditing(r)}
                        disabled={!canApprove}
                        className="px-4 py-1 rounded shadow bg-gray-200 disabled:opacity-50"
                      >
                        ערוך
                      </button>
                      <button
                        onClick={() => approveRecommendation(recId)}
                        disabled={isLoading || !canApprove}
                        className="px-4 py-1 rounded shadow bg-purple-600 text-white disabled:opacity-50"
                      >
                        {isLoading ? "…" : "אשר ושלח"}
                      </button>
                      <button
                        onClick={() => rejectRecommendation(recId)}
                        disabled={isLoading}
                        className="px-4 py-1 rounded shadow bg-gray-200 disabled:opacity-50"
                      >
                        {isLoading ? "…" : "דחה"}
                      </button>
                    </div>
                  </>
                )}

                {!canApprove && !isEditing && (
                  <p className="text-red-500 mt-2 text-sm">
                    הגבלת אישור הושגה. אפשר להמשיך לקבל המלצות אך לא לאשר.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <hr />

      <button
        onClick={() => setShowHistory((s) => !s)}
        className="px-6 py-2 bg-purple-600 text-white rounded-2xl shadow"
      >
        {showHistory ? "הסתר היסטוריית המלצות" : "ראה היסטוריית המלצות"}
      </button>

      {showHistory && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">היסטוריית המלצות</h3>
          {history.length === 0 ? (
            <p>אין המלצות בעבר.</p>
          ) : (
            <ul className="space-y-2">
              {history.map((r) => {
                const recId = r._id || r.id;
                return (
                  <li key={recId} className="border p-3 rounded opacity-70">
                    <p><strong>שאלה:</strong> {cleanText(r.text)}</p>
                    {r.commandText && (
                      <p className="italic text-gray-600">
                        <strong>תשובה:</strong> {cleanText(r.commandText)}
                      </p>
                    )}
                    <p>סטטוס: {r.status === "approved" ? "מאושר" : "נדחה"}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AiRecommendations;
