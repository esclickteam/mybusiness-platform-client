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
  const [pendingRecommendation, setPendingRecommendation] = useState(null);
  const bottomRef = useRef(null);

  // יצירת החיבור ל- Socket עם auth
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (!businessId || !token) return;

    const s = io(SOCKET_URL, {
      auth: { token, businessId, role: "client" }, // תפקיד client - לשנות לפי צורך
      transports: ["websocket"],
    });

    s.on("connect", () => {
      console.log("Connected to socket with id:", s.id);
    });

    // מאזין להמלצות חדשות - כאן אפשר לראות המלצות שהעסק קיבל מהשרת
    s.on("newRecommendation", ({ recommendationId, message, recommendation }) => {
      setPendingRecommendation({ recommendationId, message, recommendation });
      setChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `הודעת לקוח: ${message}\nהמלצה AI: ${recommendation}`,
          recommendationId,
        },
      ]);
    });

    // הודעות מאושרות מהעסק (העסק אישר ושלח)
    s.on("approvedRecommendationMessage", (data) => {
      setChat((prev) => [
        ...prev,
        { sender: "business", text: `העסק אישר ושלח:\n${data.recommendation}` },
      ]);
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [businessId, token]);

  // טעינת פרופיל העסק והצ'אט ההיסטורי
  useEffect(() => {
    async function fetchProfileAndChat() {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL;
        const [profileRes, chatRes] = await Promise.all([
          fetch(`${apiBaseUrl}/business/profile`),
          fetch(`${apiBaseUrl}/partner-ai/chat-history`),
        ]);
        if (!profileRes.ok || !chatRes.ok) throw new Error("Failed to load");

        const profileData = await profileRes.json();
        const chatData = await chatRes.json();

        setBusinessProfile(profileData);
        setChat(chatData);

        if (profileData.goal) {
          setDailyTip(
            `"${profileData.goal}" מתקרב – אולי היום תשתף פוסט עם ערך לקהל שלך?`
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfileAndChat();
  }, []);

  const handleProfileChange = (e) => {
    setBusinessProfile({ ...businessProfile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiBaseUrl}/business/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

  // שליחת הודעה לקבלת המלצה דרך Socket
  const sendMessageForRecommendation = (text) => {
    if (!text.trim() || !socket) return;

    setChat((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    socket.emit(
      "clientSendMessageForRecommendation",
      { message: text, clientSocketId: socket.id, conversationId },
      (response) => {
        setLoading(false);
        if (!response.ok) {
          alert("שגיאה בשליחת הודעה לקבלת המלצה: " + response.error);
        }
      }
    );
  };

  // אישור המלצה ושליחתה ללקוח
  const handleApproveRecommendation = () => {
    if (!pendingRecommendation || !socket) return;

    socket.emit(
      "approveRecommendation",
      { recommendationId: pendingRecommendation.recommendationId },
      (response) => {
        if (response.ok) {
          setChat((prev) => [
            ...prev,
            { sender: "business", text: `העסק אישר ושלח:\n${pendingRecommendation.recommendation}` },
          ]);
          setPendingRecommendation(null);
        } else {
          alert("שגיאה בשליחת ההמלצה המאושרת: " + response.error);
        }
      }
    );
  };

  const handleRejectRecommendation = () => {
    setPendingRecommendation(null);
  };

  // לחיצה על שליחה
  const handleSendClick = () => {
    sendMessageForRecommendation(input);
  };

  // שליחה בלחיצה על Enter
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageForRecommendation(input);
    }
  };

  // גלילה לתחתית הצ'אט
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

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

          <div className="chat-box">
            {chat.map((msg, idx) => (
              <div key={idx} className={`bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="bubble ai">⌛ מחשב תשובה...</div>}
            <div ref={bottomRef} style={{ height: 1 }} />
          </div>

          {/* אזור אישור המלצה */}
          {pendingRecommendation && (
            <div className="approve-recommendation-box">
              <h4>המלצה מ-AI:</h4>
              <p>{pendingRecommendation.recommendation}</p>
              <button onClick={handleApproveRecommendation}>אשר ושלח</button>
              <button onClick={handleRejectRecommendation}>דחה</button>
            </div>
          )}

          <div className="chat-input">
            <textarea
              placeholder="כתבי כאן כל שאלה או בקשה..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
              rows={2}
            />
            <button onClick={handleSendClick} disabled={loading}>
              שליחה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiPartnerTab;
