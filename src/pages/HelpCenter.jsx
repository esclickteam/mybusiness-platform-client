import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/HelpCenter.css";

export default function HelpCenter() {
  const { user } = useAuth();
  const businessId = user?.businessId;

  const popularArticles = [
    {
      id: 1,
      title: "בניית עמוד עסקי",
      description: "צעד אחר צעד לבניית עמוד עסקי מושך שימשוך אליך לקוחות חדשים.",
      url: businessId ? `/business/${businessId}/dashboard/articles/build-business-page` : "/",
    },
    // ... שאר המאמרים
  ];

  const faqs = [
    { question: "איך לערוך את פרופיל העסק שלי?", answer: 'עבור ללשונית "עריכת עמוד עסקי" בתפריט הצד.' },
    { question: "איך ליצור קשר עם לקוחות?", answer: 'השתמש בלשונית "הודעות מלקוחות" כדי לשלוח ולקבל הודעות.' },
    { question: "איך לנהל את ה-CRM?", answer: 'בקרו בלשונית "מערכת CRM" לניהול הלקוחות והפגישות שלכם.' },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "שלום! איך אפשר לעזור לך?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  // פונקציה לטיפול בשליחת הודעה של המשתמש
  async function handleSendMessage() {
    if (!userInput.trim()) return;

    const userMessage = { from: "user", text: userInput };
    setChatMessages((msgs) => [...msgs, userMessage]);
    setUserInput("");
    setLoading(true);

    // חיפוש תשובה מתוך ה-FAQs לפי השאלה
    const foundFaq = faqs.find(
      (faq) =>
        faq.question.includes(userInput.trim()) ||
        faq.answer.includes(userInput.trim())
    );

    if (foundFaq) {
      // אם נמצא תשובה ב-FAQs
      setChatMessages((msgs) => [
        ...msgs,
        { from: "bot", text: foundFaq.answer },
      ]);
      setLoading(false);
    } else {
      // אם לא נמצא תשובה, שולחים ל-API של OpenAI (הנחה שהנתיב קיים בשרת)
      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userInput }),
        });
        const data = await response.json();
        setChatMessages((msgs) => [
          ...msgs,
          { from: "bot", text: data.answer || "סליחה, לא הצלחתי להבין." },
        ]);
      } catch (error) {
        setChatMessages((msgs) => [
          ...msgs,
          { from: "bot", text: "אירעה שגיאה, נסה שוב מאוחר יותר." },
        ]);
      }
      setLoading(false);
    }
  }

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.includes(searchTerm) || faq.answer.includes(searchTerm)
  );

  return (
    <div className="help-center-container" style={{ display: "flex", position: "relative" }}>
      <div style={{ flex: 1, paddingRight: 20 }}>
        <h1>👋 ברוכים הבאים למרכז העזרה של עסקליק</h1>
        <p>כאן תוכלו למצוא תשובות, מדריכים וכלים לניהול העסק הדיגיטלי שלכם.</p>

        <div className="search-bar">
          <input
            type="text"
            placeholder='חפשו נושאים כמו "חיוב", "הגדרות חשבון", "פרסום"'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            dir="rtl"
            aria-label="חיפוש מרכז עזרה"
          />
          <span className="search-icon" role="img" aria-label="חיפוש">
            🔍
          </span>
        </div>

        <section className="popular-articles">
          <h2>מאמרים פופולריים</h2>
          <div className="articles-grid">
            {popularArticles.map((article) => (
              <div key={article.id} className="article-card">
                <p className="article-title">{article.title}</p>
                <p className="article-description">{article.description}</p>
                <Link
                  to={article.url}
                  className="more-info-button"
                  aria-label={`מידע נוסף על ${article.title}`}
                >
                  מידע נוסף
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="faqs">
          <h2>שאלות נפוצות</h2>
          {filteredFaqs.length > 0 ? (
            <ul>
              {filteredFaqs.map((faq, idx) => (
                <li key={idx}>
                  <strong>{faq.question}</strong> — {faq.answer}
                </li>
              ))}
            </ul>
          ) : (
            <p>לא נמצאו תוצאות עבור "{searchTerm}"</p>
          )}
        </section>

        <section className="contact-us">
          <h2>צריכים עזרה נוספת?</h2>
          <p>
            ניתן לפנות אלינו באמצעות האימייל:{" "}
            <a href="mailto:support@yourdomain.com">support@yourdomain.com</a>
          </p>
          <p>
            או להתקשר למספר הטלפון:{" "}
            <a href="tel:+97212345678">+972-1-2345678</a>
          </p>
        </section>
      </div>

      {/* Chat Bot בצד שמאל */}
      <div
        style={{
          width: 320,
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 10,
          backgroundColor: "#fff",
          position: "fixed",
          bottom: 20,
          left: 20,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: 10, textAlign: "center" }}>
          בוט עזרה חכמה 🤖
          <button
            onClick={() => setChatOpen((o) => !o)}
            style={{ float: "left", cursor: "pointer", border: "none", background: "none", fontSize: 18 }}
            aria-label="סגור/פתח צאט"
          >
            {chatOpen ? "❌" : "💬"}
          </button>
        </div>
        {chatOpen && (
          <>
            <div
              style={{
                height: 300,
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: 4,
                padding: 10,
                marginBottom: 10,
                backgroundColor: "#fafafa",
                fontSize: 14,
              }}
            >
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: msg.from === "bot" ? "left" : "right",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: 16,
                      backgroundColor: msg.from === "bot" ? "#e1f0ff" : "#4caf50",
                      color: msg.from === "bot" ? "#000" : "#fff",
                      maxWidth: "80%",
                      wordWrap: "break-word",
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex" }}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="כתוב שאלה או בקשה..."
                style={{ flex: 1, padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading}
                style={{ marginLeft: 6, padding: "6px 12px", borderRadius: 4, backgroundColor: "#4caf50", color: "white", border: "none" }}
                aria-label="שלח הודעה"
              >
                {loading ? "..." : "שלח"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
