import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./AiPartnerTab.css";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

const AiPartnerTab = ({ businessId, token, conversationId = null }) => {
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
  const bottomRef = useRef(null);

  // חיבור Socket.IO עם auth
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (!businessId || !token) {
      console.log("Missing businessId or token, skipping socket connection.");
      return;
    }

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

    s.on("newAiSuggestion", (suggestion) => {
      console.log("New AI suggestion received:", suggestion);
      setSuggestions((prev) => [...prev, suggestion]);
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(s);

    return () => {
      if (s.connected) s.disconnect();
    };
  }, [businessId, token]);

  // טעינת פרופיל העסק עם businessId ב-URL
  useEffect(() => {
    async function fetchProfile() {
      if (!businessId || !token) {
        console.log("Missing businessId or token, skipping fetch");
        return;
      }
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

  // שמירת פרופיל עם Authorization header
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

  // שינוי שדות פרופיל
  const handleProfileChange = (e) => {
    setBusinessProfile({ ...businessProfile, [e.target.name]: e.target.value });
  };

  // שליחת הודעה לקבלת המלצה
  const sendMessageForRecommendation = (text) => {
    if (!text.trim() || !socket || socket.disconnected) return;

    setChat((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/chat/from-client`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ businessId, clientId: "client123", message: text, businessProfile }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (!data.success) alert("שגיאה בשליחת הודעה לקבלת המלצה");
      })
      .catch((err) => {
        setLoading(false);
        alert("שגיאה ברשת: " + err.message);
      });
  };

  // אישור המלצה ושליחתה ללקוח
  const approveSuggestion = async (id) => {
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
    } catch (err) {
      setLoading(false);
      alert("שגיאה באישור ההמלצה: " + err.message);
    }
  };

  // דחיית המלצה
  const rejectSuggestion = (id) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  // גלילה אוטומטית לתחתית הצ'אט וההמלצות
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
                <div key={i} className={`bubble ${msg.sender}`}>
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
            <button onClick={() => sendMessageForRecommendation(input)} disabled={loading || !input.trim()}>
              שלח
            </button>
          </div>

          <div className="suggestions-list" style={{ marginTop: 20 }}>
            {suggestions.map(({ id, text, status }) => (
              <div key={id} style={{ marginBottom: 10, padding: 10, border: "1px solid #ccc" }}>
                <p>{text}</p>
                <p>סטטוס: {status || "ממתין"}</p>
                {status !== "sent" && (
                  <>
                    <button onClick={() => approveSuggestion(id)} disabled={loading}>
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
    </div>
  );
};

export default AiPartnerTab;
