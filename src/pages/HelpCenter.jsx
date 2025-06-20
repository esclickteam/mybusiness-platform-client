import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  // ייבוא ההקשר לקבלת המשתמש
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
    {
      id: 2,
      title: "שימוש נכון בצ'אט עם לקוחות",
      description: "טיפים לניהול שיחות צ'אט חכמות שיחזקו את הקשר עם הלקוחות שלך.",
      url: businessId ? `/business/${businessId}/dashboard/articles/chat-guide` : "/",
    },
    {
      id: 3,
      title: "דשבורד העסק",
      description: "לגלות איך הדשבורד נותן לך שליטה מלאה ונראות מלאה על העסק.",
      url: businessId ? `/business/${businessId}/dashboard/articles/dashboard-guide` : "/",
    },
    {
      id: 4,
      title: "יומן תיאום תורים / CRM",
      description: "ניהול תורים ולקוחות במקום אחד – פשוט ויעיל כמו שצריך.",
      url: businessId ? `/business/${businessId}/dashboard/articles/appointment-crm-guide` : "/",
    },
    {
      id: 5,
      title: "יועץ עסקליק ושותף AI",
      description: "הכירו את היועץ הדיגיטלי שישדרג את העסק עם בינה מלאכותית.",
      url: businessId ? `/business/${businessId}/dashboard/articles/ai-companion` : "/",
    },
    {
      id: 6,
      title: "שיתופי פעולה בין עסקים",
      description: "איך להרחיב את העסק דרך שיתופי פעולה מנצחים עם עסקים אחרים.",
      url: businessId ? `/business/${businessId}/dashboard/articles/business-collaboration` : "/",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    { question: "איך לערוך את פרופיל העסק שלי?", answer: 'עבור ללשונית "עריכת עמוד עסקי" בתפריט הצד.' },
    { question: "איך ליצור קשר עם לקוחות?", answer: 'השתמש בלשונית "הודעות מלקוחות" כדי לשלוח ולקבל הודעות.' },
    { question: "איך לנהל את ה-CRM?", answer: 'בקרו בלשונית "מערכת CRM" לניהול הלקוחות והפגישות שלכם.' },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.includes(searchTerm) || faq.answer.includes(searchTerm)
  );

  // --- סטייט ופעולות של בוט AI ---
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  async function sendMessage() {
    if (!chatInput.trim()) return;

    // הוספת הודעת המשתמש לצ'אט
    const userMessage = { sender: "user", text: chatInput };
    setChatMessages((msgs) => [...msgs, userMessage]);
    setChatInput("");

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: chatInput }),
      });
      const data = await response.json();

      const botMessage = {
        sender: "bot",
        text: data.answer || "סליחה, לא הצלחתי למצוא תשובה לשאלה זו.",
      };
      setChatMessages((msgs) => [...msgs, botMessage]);
    } catch {
      setChatMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "אירעה שגיאה, נסה שוב מאוחר יותר." },
      ]);
    }
  }

  return (
    <div className="help-center-container">
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
        <span className="search-icon" role="img" aria-label="חיפוש">🔍</span>
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

      {/* --- ממשק הבוט בצד שמאל למטה --- */}
      <section
        className="chatbot-section"
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          width: 300,
          maxHeight: 400,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: 8,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          zIndex: 1000,
        }}
      >
        <div
          className="chatbot-messages"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 10,
            fontSize: 14,
          }}
        >
          {chatMessages.length === 0 && (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              שלום! איך אפשר לעזור לך?
            </p>
          )}
          {chatMessages.map((msg, i) => (
            <p
              key={i}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                margin: "5px 0",
                backgroundColor: msg.sender === "user" ? "#dcf8c6" : "#eee",
                padding: "5px 10px",
                borderRadius: 12,
                maxWidth: "80%",
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.text}
            </p>
          ))}
        </div>
        <div
          className="chatbot-input"
          style={{ display: "flex", borderTop: "1px solid #ccc" }}
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="כתוב שאלה..."
            style={{
              flex: 1,
              border: "none",
              padding: 10,
              fontSize: 14,
              outline: "none",
            }}
            dir="rtl"
            aria-label="שאלת בוט AI"
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "0 15px",
              border: "none",
              backgroundColor: "#4caf50",
              color: "white",
              cursor: "pointer",
            }}
            aria-label="שלח שאלה לבוט AI"
          >
            ➤
          </button>
        </div>
      </section>
    </div>
  );
}
