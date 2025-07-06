import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./AiPartnerTab.css";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

const AiPartnerTab = ({
  businessId,
  token,
  conversationId = null,
  appointmentId, // מזהה הפגישה הנבחר לשליחת תזכורת
  onNewRecommendation,
  businessName,
  businessType,
  languageTone,
  targetAudience,
  businessGoal,
}) => {
  const navigate = useNavigate();

  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [aiCommandHistory, setAiCommandHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [commandText, setCommandText] = useState("");

  const [reminderText, setReminderText] = useState("");
  const [sendingReminder, setSendingReminder] = useState(false);
  const [sendingReminderTomorrow, setSendingReminderTomorrow] = useState(false);

  const bottomRef = useRef(null);
  const notificationSound = useRef(null);

  const filterText = useCallback(
    (text) =>
      text
        .replace(/https:\/\/res\.cloudinary\.com\/[^\s]+/g, "")
        .replace(/\*+/g, "")
        .trim(),
    []
  );

  const filterValidUniqueRecommendations = useCallback((recs) => {
    const filtered = recs.filter(
      (r) => r._id && typeof r._id === "string" && r._id.length === 24
    );
    const map = new Map();
    filtered.forEach((r) => {
      if (!map.has(r._id)) map.set(r._id, r);
    });
    return Array.from(map.values());
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
        const valid = filterValidUniqueRecommendations(recs);
        const formatted = valid.map((r) => ({
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
    if (!showHistory) fetchRecommendations();
  }, [businessId, token, filterValidUniqueRecommendations, showHistory]);

  const fetchAiCommandHistory = useCallback(async () => {
    if (!businessId || !token) return;
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/ai-command-history/${businessId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch AI command history");
      const data = await res.json();
      setAiCommandHistory(data);
    } catch (err) {
      console.error("Error fetching AI command history:", err);
      setHistoryError(err.message);
    } finally {
      setLoadingHistory(false);
    }
  }, [businessId, token]);

  useEffect(() => {
    if (showHistory) fetchAiCommandHistory();
  }, [showHistory, fetchAiCommandHistory]);

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
      if (conversationId) s.emit("joinConversation", conversationId);
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

    return () => {
      if (s.connected) {
        if (conversationId) s.emit("leaveConversation", conversationId);
        s.disconnect();
      }
    };
  }, [businessId, token, conversationId, onNewRecommendation]);

  const sendAiCommand = async () => {
    if (!commandText.trim()) return;
    setLoading(true);
    setCommandResponse(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/ai-partner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId,
          prompt: commandText,
          profile: {
            name: businessName,
            type: businessType,
            tone: languageTone,
            audience: targetAudience,
            goal: businessGoal,
            conversationId,
          },
          messages: chat,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send command");

      setCommandResponse(data.answer);

      if (data.actionResult) {
        console.log("Action result:", data.actionResult);
      }
    } catch (err) {
      alert("שגיאה בשליחת פקודת AI: " + err.message);
    } finally {
      setLoading(false);
      setCommandText("");
    }
  };

  const approveSuggestion = useCallback(
    async ({ id, text }) => {
      setLoading(true);
      try {
        const filteredText = filterText(text);

        const url = `${import.meta.env.VITE_API_URL}/chat/send-approved`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ businessId, recommendationId: id, text: filteredText }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to approve");

        setSuggestions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "sent", text: filteredText } : s))
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
    [businessId, token, filterText]
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

  // פונקציה לשליחת תזכורת לפי appointmentId
  const sendReminder = async () => {
    if (!reminderText.trim()) return;
    if (!appointmentId) {
      alert("לא נבחרה פגישה לשליחת תזכורת.");
      return;
    }
    setSendingReminder(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reminder/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId,
          text: reminderText.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reminder");
      alert("התזכורת נשלחה בהצלחה!");
      setReminderText("");
    } catch (err) {
      alert("שגיאה בשליחת התזכורת: " + err.message);
    } finally {
      setSendingReminder(false);
    }
  };

  // פונקציה לשליחת תזכורת וואטסאפ לכל הלקוחות שיש להם תיאום מחר
  const sendWhatsAppReminder = (phone, clientName, date, time) => {
    if (!phone) {
      console.warn("מספר טלפון של הלקוח לא זמין");
      return;
    }
    let cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone.startsWith("972")) {
      if (cleanPhone.startsWith("0")) {
        cleanPhone = "972" + cleanPhone.substring(1);
      } else {
        cleanPhone = "972" + cleanPhone;
      }
    }

    const formattedDate = new Date(date).toLocaleDateString("he-IL", {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    const businessDisplayName = businessName || "העסק שלך";

    const message = `שלום ${clientName},\nזוהי תזכורת לפגישה שלך בתאריך ${formattedDate} בשעה ${time}.\nמחכים לך ב${businessDisplayName}.`;
    const encodedMessage = encodeURIComponent(message);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const url = isMobile
      ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;

    window.open(url, "_blank");
  };

  // פונקציה לשליחת תזכורת וואטסאפ לכל הלקוחות עם פגישות מחר
  const sendReminderToTomorrow = async () => {
    if (!reminderText.trim()) {
      alert("יש לכתוב טקסט תזכורת לשליחה לכל הלקוחות.");
      return;
    }
    setSendingReminderTomorrow(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/appointments/tomorrow`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch tomorrow appointments");
      const appointments = await res.json();

      if (!appointments.length) {
        alert("לא נמצאו תיאומים למחר.");
        setSendingReminderTomorrow(false);
        return;
      }

      appointments.forEach((appt) => {
        if (appt.clientPhone && appt.clientName && appt.date && appt.time) {
          sendWhatsAppReminder(appt.clientPhone, appt.clientName, appt.date, appt.time);
        }
      });

      alert(`נמצאו ${appointments.length} תיאומים למחר, הודעות וואטסאפ נפתחו לשליחה.`);
      setReminderText("");
    } catch (err) {
      alert("שגיאה בשליחת התזכורות: " + err.message);
    } finally {
      setSendingReminderTomorrow(false);
    }
  };

  return (
    <div className="ai-partner-container">
      <h2>🤖 שותף AI אישי לעסק</h2>

      <div style={{ margin: "1rem 0" }}>
        <button onClick={() => setShowHistory((prev) => !prev)}>
          {showHistory ? "הצג המלצות" : "הצג היסטוריית פקודות AI"}
        </button>
      </div>

      {showHistory ? (
        <div
          className="ai-command-history"
          style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ccc", padding: "1rem" }}
        >
          {/* כאן תוכל לממש הצגת היסטוריית הפקודות */}
        </div>
      ) : (
        <div className="center-textareas">
          <textarea
            className="uniform-textarea"
            rows={3}
            value={commandText}
            onChange={(e) => setCommandText(e.target.value)}
            placeholder="כתוב פקודה ל-AI, למשל: תאם תור ביום שני ב-10 בבוקר"
            disabled={loading}
          />
          <button onClick={sendAiCommand} disabled={loading || !commandText.trim()}>
            שלח ל-AI
          </button>

          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              maxWidth: "600px",
              width: "100%",
            }}
          >
            <h3>שלח תזכורת ללקוח</h3>
            <textarea
              className="uniform-textarea"
              rows={5}
              value={reminderText}
              onChange={(e) => setReminderText(e.target.value)}
              placeholder="כתוב כאן את טקסט התזכורת, למשל: תזכורת לפגישה ב-10/07/2025 בשעה 15:00"
              disabled={sendingReminder || sendingReminderTomorrow}
            />
            <button
              onClick={sendReminder}
              disabled={sendingReminder || !reminderText.trim()}
              style={{ marginTop: "0.5rem", padding: "0.5rem 1rem" }}
            >
              {sendingReminder ? "שולח..." : "שלח תזכורת לפגישה"}
            </button>
            <button
              onClick={sendReminderToTomorrow}
              disabled={sendingReminderTomorrow || !reminderText.trim()}
              style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", marginLeft: "1rem" }}
            >
              {sendingReminderTomorrow ? "שולח לכולם..." : "שלח תזכורת לכל הלקוחות למחר"}
            </button>
          </div>
        </div>
      )}

      {activeSuggestion && (
        <div className="modal-overlay" onClick={() => setActiveSuggestion(null)}>
          <div className="modal-content approve-recommendation-box" onClick={(e) => e.stopPropagation()}>
            <h4>הודעת AI חדשה</h4>

            {editing ? (
              <>
                <textarea
                  rows={6}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  disabled={loading}
                  className="uniform-textarea"
                />
                <div className="buttons-row">
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
                </div>
              </>
            ) : (
              <>
                {filterText(activeSuggestion.text)
                  .split("\n")
                  .map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                {activeSuggestion.status === "pending" ? (
                  <div className="buttons-row">
                    <button
                      onClick={() => {
                        approveSuggestion({
                          id: activeSuggestion.id,
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
                    <button disabled={loading} onClick={() => rejectSuggestion(activeSuggestion.id)}>
                      דחה
                    </button>
                  </div>
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
