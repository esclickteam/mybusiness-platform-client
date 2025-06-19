import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./AiPartnerTab.css";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
const SHORTEN_LENGTH = 200; // תווים להצגה מקוצרת

const AiPartnerTab = ({ businessId, token, conversationId = null, onNewRecommendation }) => {
  const navigate = useNavigate();

  const [dailyTip, setDailyTip] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const notificationSound = useRef(null);
  const [socket, setSocket] = useState(null);
  const [clientId, setClientId] = useState(null);

  const filterValidUniqueRecommendations = useCallback((recs) => {
    const filtered = recs.filter(
      (r) => r._id && typeof r._id === "string" && r._id.length === 24
    );
    const uniqueMap = new Map();
    filtered.forEach((r) => {
      if (!uniqueMap.has(r._id)) uniqueMap.set(r._id, r);
    });
    return Array.from(uniqueMap.values());
  }, []);

  useEffect(() => {
    async function fetchRecommendations() {
      if (!businessId || !token) return;
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiBaseUrl}/chat/recommendations/${businessId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load recommendations");
        const recs = await res.json();
        const validUniqueRecs = filterValidUniqueRecommendations(recs);
        const formatted = validUniqueRecs.map((r) => ({
          id: r._id,
          text: r.text,
          status: r.status,
          conversationId: r.conversationId || null,
          timestamp: r.createdAt || null,
          isEdited: r.isEdited || false,
          editedText: r.editedText || "",
        }));
        setSuggestions(formatted);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    }
    fetchRecommendations();
  }, [businessId, token, filterValidUniqueRecommendations]);

  useEffect(() => {
    async function fetchClientId() {
      if (!conversationId || !businessId || !token) return;
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL;
        const convRes = await fetch(`${apiBaseUrl}/conversations?businessId=${businessId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!convRes.ok) throw new Error("Failed to load conversations");
        const conversations = await convRes.json();
        const conv = conversations.find((c) => c.conversationId === conversationId);
        if (!conv) throw new Error("Conversation not found");
        const otherId = conv.participants.find((p) => p !== businessId);
        setClientId(otherId);
      } catch (err) {
        console.error("Error fetching client ID:", err);
      }
    }
    fetchClientId();
  }, [conversationId, businessId, token]);

  useEffect(() => {
    if (!businessId || !token) return;

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const s = io(SOCKET_URL, {
      auth: { token, businessId },
      transports: ["websocket"],
    });

    s.on("connect", () => {
      s.emit("joinRoom", businessId);
      if (conversationId) {
        s.emit("joinConversation", conversationId);
      }
    });

    s.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    s.on("newAiSuggestion", (suggestion) => {
      if (notificationSound.current) notificationSound.current.play();
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("הודעת AI חדשה", {
          body: suggestion.text || suggestion.recommendation,
          icon: "/logo192.png",
        });
      }
      setSuggestions((prev) => {
        if (prev.find((r) => r.id === (suggestion.id || suggestion.recommendationId))) return prev;
        if (typeof onNewRecommendation === "function") onNewRecommendation();
        return [
          ...prev,
          {
            id: suggestion.id || suggestion.recommendationId,
            text: suggestion.text || suggestion.recommendation,
            status: suggestion.status || "pending",
            conversationId: suggestion.conversationId,
            timestamp: suggestion.createdAt || new Date().toISOString(),
            isEdited: suggestion.isEdited || false,
            editedText: suggestion.editedText || "",
          },
        ];
      });
    });

    s.on("updateRecommendationStatus", ({ id, status }) => {
      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    });

    s.on("recommendationUpdated", (updated) => {
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === updated._id
            ? {
                ...s,
                text: updated.text,
                isEdited: updated.isEdited,
                editedText: updated.editedText,
                status: updated.status,
              }
            : s
        )
      );
    });

    s.on("newMessage", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    s.on("messageApproved", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(s);
    return () => {
      if (s.connected) {
        if (conversationId) s.emit("leaveConversation", conversationId);
        s.disconnect();
      }
    };
  }, [businessId, token, conversationId, onNewRecommendation]);

  const approveSuggestion = useCallback(
    async ({ id, conversationId, text }) => {
      setLoading(true);
      try {
        const url = `${import.meta.env.VITE_API_URL}/chat/send-approved`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ businessId, recommendationId: id, text }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to approve");

        if (conversationId && clientId) {
          await fetch(`${import.meta.env.VITE_API_URL}/conversations/${conversationId}/add-message`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              text,
              from: businessId,
              to: clientId,
              role: "business",
              timestamp: new Date().toISOString(),
              isRecommendation: true,
            }),
          });
        }

        setSuggestions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "sent", text } : s))
        );
        alert("ההמלצה אושרה ונשלחה ללקוח!");
        setActiveSuggestion(null);
      } catch (err) {
        console.error("Error approving suggestion:", err);
        alert("שגיאה באישור ההמלצה: " + err.message);
      } finally {
        setLoading(false);
      }
    },
    [businessId, clientId, token]
  );

  const rejectSuggestion = useCallback((id) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    setActiveSuggestion(null);
  }, []);

  const editRecommendation = useCallback(
    async ({ id, newText }) => {
      setLoading(true);
      try {
        const url = `${import.meta.env.VITE_API_URL}/chat/edit-recommendation`;
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recommendationId: id, newText }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update recommendation");

        setSuggestions((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, text: newText, isEdited: true, editedText: newText, status: "sent" } : s
          )
        );
        alert("ההמלצה עודכנה ונשלחה בהצלחה!");
        setActiveSuggestion(null);
        setEditing(false);
      } catch (err) {
        console.error("Error updating recommendation:", err);
        alert("שגיאה בעדכון ההמלצה: " + err.message);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, suggestions]);

  useEffect(() => {
    if (activeSuggestion) {
      setEditedText(activeSuggestion.text);
      setEditing(false);
    }
  }, [activeSuggestion]);

  return (
    <div className="ai-partner-container">
      <h2>🤖 שותף AI אישי לעסק</h2>
      <div className="partner-layout">
        <div className="chat-section">
          {dailyTip && <div className="daily-tip">💡 {dailyTip}</div>}

          <button
            onClick={() => setShowSuggestions((prev) => !prev)}
            className="toggle-suggestions-btn"
          >
            {showSuggestions ? "הסתר המלצות" : "הצג המלצות"}
          </button>

          {showSuggestions && (
            <div className="suggestions-list">
              {suggestions
                .slice()
                .sort((a, b) => {
                  if (a.timestamp && b.timestamp) {
                    return new Date(b.timestamp) - new Date(a.timestamp);
                  }
                  return 0;
                })
                .map((s) => {
                  const isLong = s.text.length > SHORTEN_LENGTH;
                  const shortText = isLong ? s.text.slice(0, SHORTEN_LENGTH) + "..." : s.text;

                  return (
                    <div key={s.id} className={`suggestion ${s.status}`}>
                      <p>{shortText}</p>
                      {isLong && (
                        <button
                          className="read-more-btn"
                          onClick={() => setActiveSuggestion(s)}
                        >
                          קרא עוד
                        </button>
                      )}
                      <small>
                        סטטוס: {s.status} |{" "}
                        {s.timestamp
                          ? new Date(s.timestamp).toLocaleString("he-IL", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "תאריך לא זמין"}
                        {s.isEdited && <span> (נערך)</span>}
                      </small>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {activeSuggestion && (
        <div className="modal-overlay" onClick={() => setActiveSuggestion(null)}>
          <div
            className="modal-content approve-recommendation-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h4>הודעת AI חדשה</h4>

            {editing ? (
              <>
                <textarea
                  rows={6}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  disabled={loading}
                />
                <button
                  onClick={() => {
                    editRecommendation({
                      id: activeSuggestion.id,
                      newText: editedText,
                    });
                  }}
                  disabled={loading || !editedText.trim()}
                >
                  אשר ושלח
                </button>
                <button
                  disabled={loading}
                  onClick={() => {
                    setEditing(false);
                    setEditedText(activeSuggestion.text);
                  }}
                >
                  ביטול
                </button>
              </>
            ) : (
              <>
                {activeSuggestion.text.split("\n").map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
                {activeSuggestion.status === "pending" ? (
                  <>
                    <button
                      onClick={() => {
                        approveSuggestion({
                          id: activeSuggestion.id,
                          conversationId: activeSuggestion.conversationId,
                          text: editedText.trim() || activeSuggestion.text,
                        });
                      }}
                      disabled={loading}
                    >
                      אשר ושלח מידית
                    </button>
                    <button disabled={loading} onClick={() => setEditing(true)}>
                      ערוך
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => rejectSuggestion(activeSuggestion.id)}
                    >
                      דחה
                    </button>
                  </>
                ) : (
                  <p>ההמלצה אושרה ונשלחה ללקוח.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <audio ref={notificationSound} src="/notification.mp3" preload="auto" />
      <div ref={bottomRef} />
    </div>
  );
};

export default AiPartnerTab;
