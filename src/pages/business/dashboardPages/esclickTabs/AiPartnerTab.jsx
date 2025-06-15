import React, { useState, useEffect } from "react";
import "./AiPartnerTab.css";

const AiPartnerTab = () => {
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

  const apiBaseUrl = import.meta.env.VITE_API_URL;
  if (!apiBaseUrl) {
    throw new Error("Missing VITE_API_URL environment variable");
  }

  // טען פרופיל עסק + שיחות מהשרת בהתחלה
  useEffect(() => {
    const fetchProfileAndChat = async () => {
      try {
        const [profileRes, chatRes] = await Promise.all([
          fetch(`${apiBaseUrl}/business/profile`),
          fetch(`${apiBaseUrl}/partner-ai/chat-history`)
        ]);
        if (!profileRes.ok || !chatRes.ok) throw new Error("Failed to fetch data");

        const profileData = await profileRes.json();
        const chatData = await chatRes.json();

        setBusinessProfile(profileData);
        setChat(chatData);

        if (profileData.goal) {
          setDailyTip(`"${profileData.goal}" מתקרב – אולי היום תשתף פוסט עם ערך לקהל שלך?`);
        }
      } catch (err) {
        console.error("Error loading profile or chat:", err);
      }
    };

    fetchProfileAndChat();
  }, [apiBaseUrl]);

  // שמירת פרופיל העסק בשרת
  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/business/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(businessProfile),
      });
      if (!res.ok) throw new Error("Failed to save profile");

      alert("✅ פרטי העסק נשמרו בהצלחה!");
      const data = await res.json();
      if (data.goal) {
        setDailyTip(`"${data.goal}" מתקרב – אולי היום תשתף פוסט עם ערך לקהל שלך?`);
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("❌ שגיאה בשמירת פרטי העסק");
    }
  };

  // ביצוע פעולה לפי ה-action שמוחזר מהשרת
  const executeAction = async (action) => {
    if (!action || !action.type) return;

    try {
      switch (action.type) {
        case "schedule_appointment":
          await fetch(`${apiBaseUrl}/crm/appointments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(action.data),
          });
          alert("התור נקבע בהצלחה!");
          break;

        case "send_chat_message":
          await fetch(`${apiBaseUrl}/chat/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(action.data),
          });
          break;

        case "create_collab_alert":
          await fetch(`${apiBaseUrl}/collabs/alerts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(action.data),
          });
          break;

        case "send_reminder":
          await fetch(`${apiBaseUrl}/notifications/reminders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(action.data),
          });
          alert("התזכורת נשלחה בהצלחה!");
          break;

        default:
          console.warn("פעולה לא מוכרת:", action.type);
      }
    } catch (err) {
      console.error("Error executing action:", err);
      alert("❌ שגיאה בביצוע פעולה מהשרת");
    }
  };

  // שליחת הודעה לשרת, וקליטת תשובה עם פעולה אפשרית
  const handleSend = async (customPrompt) => {
    const finalPrompt = customPrompt || input;
    if (!finalPrompt.trim()) return;

    const newChat = [...chat, { sender: "user", text: finalPrompt }];
    setChat(newChat);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/partner-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, profile: businessProfile }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const aiReply = data.answer || "⚠️ לא התקבלה תשובה מהשרת.";

      // הוספת תשובת AI לשיחה
      setChat((prev) => [...prev, { sender: "ai", text: aiReply }]);

      // ביצוע פעולה אם קיימת
      if (data.action) {
        await executeAction(data.action);
      }
    } catch (error) {
      console.error("שגיאה בשליחת שאלה ל-AI:", error);
      setChat((prev) => [...prev, { sender: "ai", text: "❌ שגיאה בשליחה לשרת." }]);
    } finally {
      setLoading(false);
    }
  };

  // שינוי בפרופיל העסק (עדכון סטייט)
  const handleProfileChange = (e) => {
    setBusinessProfile({ ...businessProfile, [e.target.name]: e.target.value });
  };

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
            {quickActions.map((text, index) => (
              <button
                key={index}
                className="quick-button"
                onClick={() => handleSend(text)}
              >
                {text}
              </button>
            ))}
          </div>
          <div className="chat-box">
            {chat.map((msg, i) => (
              <div key={i} className={`bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="bubble ai">⌛ מחשב תשובה...</div>}
          </div>
          <div className="summary-button-wrapper">
            <button
              className="summary-button"
              onClick={() => handleSend("תן לי סיכום של השיחה הזו בבקשה")}
            >
              🧾 תן לי סיכום של השיחה
            </button>
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="כתבי כאן כל שאלה או בקשה..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <button onClick={() => handleSend()} disabled={loading}>
              שליחה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiPartnerTab;
