import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./AiPartnerTab.css";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

const AiPartnerTab = ({ businessId, token, conversationId = null, onNewRecommendation }) => {
  const navigate = useNavigate();

  const [businessProfile, setBusinessProfile] = useState({
    name: "",
    type: "",
    tone: "",
    audience: "",
    goal: "",
  });
  const [dailyTip, setDailyTip] = useState("");
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const bottomRef = useRef(null);
  const notificationSound = useRef(null);
  const [socket, setSocket] = useState(null);
  const [clientId, setClientId] = useState(null);

  // פילטר המלצות תקינות ויחודיות
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

  // טעינת המלצות מהשרת
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
        }));
        setSuggestions(formatted);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    }
    fetchRecommendations();
  }, [businessId, token, filterValidUniqueRecommendations]);

  // טעינת clientId לפי conversationId
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

  // התחברות ל-Socket.IO והאזנה לאירועים
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
      console.log("Socket connected:", s.id);
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
          },
        ];
      });
    });

    s.on("updateRecommendationStatus", ({ recommendationId, status }) => {
      setSuggestions((prev) =>
        prev.map((s) => (s.id === recommendationId ? { ...s, status } : s))
      );
    });

    s.on("newMessage", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    s.on("messageApproved", (msg) => {
      console.log("Recommendation approved, new chat message:", msg);
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

  // טעינת פרופיל העסק
  useEffect(() => {
    async function fetchProfile() {
      if (!businessId || !token) return;
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiBaseUrl}/business/${businessId}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const profileData = await res.json();
        setBusinessProfile(profileData);
        if (profileData.goal) {
          setDailyTip(`"${profileData.goal}" מתקרב – אולי היום תשתף פוסט עם ערך לקהל שלך?`);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }
    fetchProfile();
  }, [businessId, token]);

  // שמירת פרופיל העסק
  const handleSaveProfile = useCallback(async () => {
    setLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiBaseUrl}/business/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(businessProfile),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      const data = await res.json();
      alert("✅ פרטי העסק נשמרו בהצלחה!");
      if (data.goal) {
        setDailyTip(`"${data.goal}" מתקרב – אולי היום תשתף פוסט עם ערך לקהל שלך?`);
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("❌ שגיאה בשמירת פרטי העסק");
    } finally {
      setLoading(false);
    }
  }, [businessProfile, token]);

  // שינוי בפרטי פרופיל
  const handleProfileChange = useCallback((e) => {
    setBusinessProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  // שליחת הודעה (טקסט מהלקוח לעסק)
  const sendMessageForRecommendation = useCallback(
    (text) => {
      if (!text.trim() || !socket || socket.disconnected || !clientId) return;
      const msg = {
        conversationId,
        from: clientId,
        to: businessId,
        text,
        role: "client",
        timestamp: new Date().toISOString(),
      };
      setChat((prev) => [...prev, msg]);
      setInput("");
      setLoading(true);
      socket.emit("sendMessage", msg, (response) => {
        setLoading(false);
        if (!response.ok) {
          alert("שגיאה בשליחת הודעה: " + (response.error || "unknown error"));
        }
      });
    },
    [socket, conversationId, clientId, businessId]
  );

  // אישור המלצה - עם Socket.IO במקום fetch
  const approveSuggestion = useCallback(
    ({ id, conversationId, text }) => {
      if (!socket || !conversationId || !clientId) return;
      setLoading(true);

      socket.emit(
        "approveRecommendation",
        { businessId, recommendationId: id, conversationId, text, clientId },
        (response) => {
          setLoading(false);
          if (response.error) {
            alert("שגיאה באישור ההמלצה: " + response.error);
            return;
          }

          setSuggestions((prev) =>
            prev.map((s) =>
              s.id === id ? { ...s, status: "sent", text } : s
            )
          );

          if (response.message) {
              setChat(prev => [...prev, response.message]);

          }

          alert("ההמלצה אושרה ונשלחה ללקוח!");
          setActiveSuggestion(null);
        }
      );
    },
    [socket, businessId, clientId]
  );

  // דחיית המלצה
  const rejectSuggestion = useCallback((id) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    setActiveSuggestion(null);
  }, []);

  // גלילה לתחתית הצ'אט כשמתווספות הודעות או המלצות
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, suggestions]);

  // טעינת טקסט לעריכה בהמלצה פעילה
  useEffect(() => {
    if (activeSuggestion) {
      setEditedText(activeSuggestion.text);
      setEditing(false);
    }
  }, [activeSuggestion]);

  const quickActions = [
    "תנסח לי פוסט שיווקי",
    "כתוב לי מייל ללקוחה לא מרוצה",
    "תן לי רעיון למבצע",
    "איך לשפר את השירות שלי השבוע",
  ];

  return (
    <div className="ai-partner-container">
      <h2>🤖 שותף AI אישי לעסק</h2>
      <div className="partner-layout">
        <div className="profile-section">
          <h4>📝 הגדרת העסק</h4>
          <input
            type="text"
            name="name"
            placeholder="שם העסק"
            value={businessProfile.name}
            onChange={handleProfileChange}
          />
          <input
            type="text"
            name="type"
            placeholder="סוג העסק (לדוג': חנות, קליניקה)"
            value={businessProfile.type}
            onChange={handleProfileChange}
          />
          <input
            type="text"
            name="tone"
            placeholder="סגנון כתיבה (רשמי / חברי וכו')"
            value={businessProfile.tone}
            onChange={handleProfileChange}
          />
          <input
            type="text"
            name="audience"
            placeholder="קהל היעד שלך"
            value={businessProfile.audience}
            onChange={handleProfileChange}
          />
          <input
            type="text"
            name="goal"
            placeholder="מה היעד העיקרי שלך כרגע?"
            value={businessProfile.goal}
            onChange={handleProfileChange}
          />
          <button onClick={handleSaveProfile} disabled={loading}>
            💾 שמור פרופיל
          </button>
        </div>

        <div className="chat-section">
          {dailyTip && <div className="daily-tip">💡 {dailyTip}</div>}

          <div className="quick-buttons">
            {quickActions.map((text, idx) => (
              <button
                key={idx}
                onClick={() => sendMessageForRecommendation(text)}
                disabled={loading}
              >
                {text}
              </button>
            ))}
          </div>

          <div className="chat-input">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessageForRecommendation(input);
                }
              }}
              placeholder="הקלד הודעה או בקשה..."
              disabled={loading}
            />
            <button
              onClick={() => sendMessageForRecommendation(input)}
              disabled={loading || !input.trim()}
            >
              שלח
            </button>
          </div>

          <div className="suggestions-list">
            {suggestions.map((s) => (
              <div
                key={s.id}
                className={`suggestion ${s.status}`}
                onClick={() => setActiveSuggestion(s)}
              >
                <p>{s.text}</p>
                <small>סטטוס: {s.status}</small>
              </div>
            ))}
          </div>
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
                    approveSuggestion({
                      id: activeSuggestion.id,
                      conversationId: activeSuggestion.conversationId,
                      text: editedText,
                      clientId, 
                      businessId 


                    });
                    setEditing(false);
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
                      onClick={() =>
                        approveSuggestion({
                          id: activeSuggestion.id,
                          conversationId: activeSuggestion.conversationId,
                          text: activeSuggestion.text,
                          clientId,
                          
                        })
                      }
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
