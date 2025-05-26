import React, { useState, useEffect } from "react";
import "./AiPartnerTab.css";

const AiPartnerTab = () => {
  const [businessProfile, setBusinessProfile] = useState(() => {
    const saved = localStorage.getItem("aiBusinessProfile");
    return saved ? JSON.parse(saved) : {
      name: "",
      type: "",
      tone: "",
      audience: "",
      goal: "",
    };
  });

  const [dailyTip, setDailyTip] = useState("");
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (businessProfile.name) {
      const mockTip = `"${businessProfile.goal}" מתקרב – אולי היום תשתף פוסט עם ערך לקהל שלך?`;
      setDailyTip(mockTip);
    }
  }, [businessProfile]);

  const handleProfileChange = (e) => {
    setBusinessProfile({ ...businessProfile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    localStorage.setItem("aiBusinessProfile", JSON.stringify(businessProfile));
    alert("✅ פרטי העסק נשמרו בהצלחה!");
  };

  const handleSend = async (customPrompt) => {
    const finalPrompt = customPrompt || input;
    if (!finalPrompt.trim()) return;

    const newChat = [...chat, { sender: "user", text: finalPrompt }];
    setChat(newChat);
    setInput("");
    setLoading(true);

    const apiBaseUrl = import.meta.env.VITE_API_URL;

    if (!BASE_URL) {
      console.error("Missing REACT_APP_API_URL environment variable");
      setChat((prev) => [...prev, { sender: "ai", text: "❌ שגיאה: כתובת ה-API לא מוגדרת." }]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/partner-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, profile: businessProfile }),
      });

      const data = await response.json();
      const aiReply = data.answer || "⚠️ לא התקבלה תשובה מהשרת.";
      setChat([...newChat, { sender: "ai", text: aiReply }]);
    } catch (error) {
      console.error("שגיאה בשליחת שאלה ל-AI:", error);
      setChat([...newChat, { sender: "ai", text: "❌ שגיאה בשליחה לשרת." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    "תנסח לי פוסט שיווקי", 
    "כתוב לי מייל ללקוחה לא מרוצה", 
    "תן לי רעיון למבצע", 
    "איך לשפר את השירות שלי השבוע"
  ];

  return (
    <div className="ai-partner-container">
      <h2>🤖 שותף AI אישי לעסק</h2>
      <div className="partner-layout">
        <div className="profile-section">
          <h4>📝 הגדרת העסק</h4>
          <input type="text" name="name" placeholder="שם העסק" value={businessProfile.name} onChange={handleProfileChange} />
          <input type="text" name="type" placeholder="סוג העסק (לדוג': חנות, קליניקה)" value={businessProfile.type} onChange={handleProfileChange} />
          <input type="text" name="tone" placeholder="סגנון כתיבה (רשמי / חברי וכו')" value={businessProfile.tone} onChange={handleProfileChange} />
          <input type="text" name="audience" placeholder="קהל היעד שלך" value={businessProfile.audience} onChange={handleProfileChange} />
          <input type="text" name="goal" placeholder="מה היעד העיקרי שלך כרגע?" value={businessProfile.goal} onChange={handleProfileChange} />
          <button onClick={handleSaveProfile} className="save-profile-button">💾 שמור פרופיל</button>
        </div>
        <div className="chat-section">
          {dailyTip && <div className="daily-tip">💡 {dailyTip}</div>}
          <div className="quick-buttons">
            {quickActions.map((text, index) => (
              <button key={index} className="quick-button" onClick={() => handleSend(text)}>{text}</button>
            ))}
          </div>
          <div className="chat-box">
            {chat.map((msg, i) => (
              <div key={i} className={`bubble ${msg.sender}`}>{msg.text}</div>
            ))}
            {loading && <div className="bubble ai">⌛ מחשב תשובה...</div>}
          </div>
          <div className="summary-button-wrapper">
            <button className="summary-button" onClick={() => handleSend("תן לי סיכום של השיחה הזו בבקשה")}>🧾 תן לי סיכום של השיחה</button>
          </div>
          <div className="chat-input">
            <input type="text" placeholder="כתבי כאן כל שאלה או בקשה..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} />
            <button onClick={() => handleSend()} disabled={loading}>שליחה</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiPartnerTab;
