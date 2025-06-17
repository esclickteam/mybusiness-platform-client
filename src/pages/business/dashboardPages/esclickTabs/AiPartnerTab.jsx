import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./AiPartnerTab.css";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

const AiPartnerTab = ({ businessId, token, conversationId = null }) => {
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
  const bottomRef = useRef(null);
  const notificationSound = useRef(null);

  // יצירת חיבור Socket.IO עם אימות
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (!businessId || !token) {
      console.log("Missing businessId or token, skipping socket connection.");
      return;
    }

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    notificationSound.current = new Audio("/notification.mp3");

    const s = io(SOCKET_URL, {
      auth: { token, businessId },
      transports: ["websocket"],
    });

    s.on("connect", () => {
      console.log("Socket connected:", s.id);
      s.emit("joinRoom", businessId);
    });

    s.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    // קבלת המלצות AI חדשות
    s.on("newRecommendation", (suggestion) => {
      console.log("New AI suggestion received:", suggestion);
      if (notificationSound.current) notificationSound.current.play();
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("הודעת AI חדשה", {
          body: suggestion.recommendation || suggestion.text,
          icon: "/logo192.png",
        });
      }

      setSuggestions([
        {
          id: suggestion.recommendationId,
          text: suggestion.recommendation,
          status: suggestion.status || "ממתין",
          conversationId: suggestion.conversationId,
          clientSocketId: suggestion.clientSocketId,
        },
      ]);
    });

    // קבלת הודעות חדשות לצ'אט
    s.on("newMessage", (msg) => {
      console.log("New chat message received:", msg);
      setChat((prev) => [...prev, msg]);
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(s);

    return () => {
      if (s.connected) s.disconnect();
    };
  }, [businessId, token]);

  // הצגת המודאל להתראה חכמה
  useEffect(() => {
    if (suggestions.length > 0) {
      setActiveSuggestion(suggestions[0]);
    }
  }, [suggestions]);

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
  const handleSaveProfile = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiBaseUrl}/business/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
    }
  };

  // טיפול בשינוי שדות בפרופיל העסק
  const handleProfileChange = (e) => {
    setBusinessProfile({ ...businessProfile, [e.target.name]: e.target.value });
  };

  // שליחת הודעה דרך socket
  const sendMessageForRecommendation = (text) => {
    if (!text || !text.trim() || !socket || socket.disconnected) return;

    const msg = {
      conversationId,
      from: socket.id,
      to: businessId,
      text,
      role: "client",
    };

    setChat((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    socket.emit("sendMessage", msg, (response) => {
      setLoading(false);
      if (!response.ok) {
        alert("שגיאה בשליחת הודעה: " + (response.error || "unknown error"));
      }
    });
  };

  // אישור ושליחת המלצה ללקוח + ניווט לצ'אט
  const approveSuggestion = async ({ id, conversationId, text }) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/send-approved`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ businessId, recommendationId: id }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) throw new Error(data.error || "Failed to approve");

      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "sent" } : s))
      );
      alert("ההמלצה אושרה ונשלחה ללקוח!");
      setActiveSuggestion(null);

      if (socket && !socket.disconnected) {
        const msg = {
          conversationId,
          from: socket.id,
          to: businessId, // במידה ויש מזהה של הלקוח, להחליף כאן
          text,
          role: "business",
        };
        socket.emit("sendMessage", msg, (response) => {
          if (!response.ok) {
            alert("שגיאה בשליחת ההודעה לצ'אט: " + (response.error || "unknown error"));
          } else {
            navigate(`/business/chat/${conversationId}`);
          }
        });
      } else {
        navigate(`/business/chat/${conversationId}`);
      }
    } catch (err) {
      setLoading(false);
      alert("שגיאה באישור ההמלצה: " + err.message);
    }
  };

  // דחיית המלצה
  const rejectSuggestion = (id) => {
    setSuggestions([]);
    setActiveSuggestion(null);
  };

  // גלילה אוטומטית לתחתית
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, suggestions]);

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
          <button onClick={handleSaveProfile} className="save-profile-button">
            💾 שמור פרופיל
          </button>
        </div>

        <div className="chat-section">
          {dailyTip && <div className="daily-tip">💡 {dailyTip}</div>}

          <div className="quick-buttons">
            {quickActions.map((text, idx) => (
              <button
                key={idx}
                className="quick-button"
                onClick={() => sendMessageForRecommendation(text)}
                disabled={loading}
              >
                {text}
              </button>
            ))}
          </div>

          <div className="chat-box" style={{ maxHeight: 300, overflowY: "auto" }}>
            {[...chat, ...suggestions.map((s) => ({ sender: "aiSuggestion", text: s.text, status: s.status, id: s.id }))].map(
              (msg, i) => (
                <div key={msg.id || i} className={`bubble ${msg.sender}`}>
                  {msg.text}
                  {msg.status && <span> ({msg.status})</span>}
                </div>
              )
            )}
            <div ref={bottomRef} />
          </div>

          <div>
            <textarea
              rows={2}
              value={input || ""}
              onChange={(e) => setInput(e.target.value ?? "")}
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

          <div className="suggestions-list" style={{ marginTop: 20 }}>
            {suggestions.map(({ id, text, status, conversationId }) => (
              <div key={id} style={{ marginBottom: 10, padding: 10, border: "1px solid #ccc" }}>
                <p>{text}</p>
                <p>סטטוס: {status || "ממתין"}</p>
                {status !== "sent" && (
                  <>
                    <button onClick={() => approveSuggestion({ id, conversationId, text })} disabled={loading}>
                      אשר ושלח
                    </button>
                    <button onClick={() => rejectSuggestion(id)} disabled={loading} style={{ marginLeft: 8 }}>
                      דחה
                    </button>
                  </>
                )}
                {status === "sent" && <span style={{ color: "green" }}>✅ נשלח ללקוח</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeSuggestion && (
        <div className="modal-overlay" onClick={() => setActiveSuggestion(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>הודעת AI חדשה</h3>
            <p>{activeSuggestion.text}</p>
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() =>
                  approveSuggestion({
                    id: activeSuggestion.id,
                    conversationId: activeSuggestion.conversationId,
                    text: activeSuggestion.text,
                  })
                }
                disabled={loading}
              >
                אשר ושלח
              </button>
              <button
                onClick={() => rejectSuggestion(activeSuggestion.id)}
                disabled={loading}
                style={{ marginLeft: 8 }}
              >
                דחה
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiPartnerTab;
