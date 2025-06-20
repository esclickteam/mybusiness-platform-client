import React, { useState, useRef, useEffect } from "react";
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

  // פונקציה לניקוי טקסט (למשל הסרת כוכביות)
  function cleanText(text) {
    return text.replace(/\*\*/g, "");
  }

  // --- סטייט ופעולות של בוט AI ---
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  async function sendMessage() {
    if (!chatInput.trim()) return;

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
        text: cleanText(data.answer || "סליחה, לא הצלחתי למצוא תשובה לשאלה זו."),
        source: data.source || "עסקליק AI",
      };
      setChatMessages((msgs) => [...msgs, botMessage]);
    } catch {
      setChatMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "אירעה שגיאה, נסה שוב מאוחר יותר.", source: "מערכת" },
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
          width: 350,
          maxHeight: 500,
          backgroundColor: "#fff",
          borderRadius: 14,
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          zIndex: 10000,
          overflow: "hidden",
        }}
      >
        <header
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "12px 20px",
            fontWeight: "700",
            fontSize: 18,
            letterSpacing: "0.5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            userSelect: "none",
          }}
        >
          יועץ עסקליק AI
        </header>

        <div
          className="chatbot-messages"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 20,
            backgroundColor: "#f6f8fa",
            fontSize: 15,
            lineHeight: 1.5,
            color: "#333",
          }}
        >
          {chatMessages.length === 0 && (
            <p
              style={{
                color: "#888",
                fontStyle: "italic",
                textAlign: "center",
                marginTop: 50,
                userSelect: "none",
              }}
            >
              שלום! איך אפשר לעזור לך?
            </p>
          )}
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  backgroundColor: msg.sender === "user" ? "#daf5d4" : "#e8eaed",
                  color: "#222",
                  padding: "12px 18px",
                  borderRadius: 25,
                  borderBottomRightRadius: msg.sender === "user" ? 0 : 25,
                  borderBottomLeftRadius: msg.sender === "user" ? 25 : 0,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  whiteSpace: "pre-line",
                  fontWeight: msg.sender === "bot" ? "500" : "400",
                  fontSize: 15,
                }}
                title={msg.source ? `מקור התשובה: ${msg.source}` : ""}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div
          className="chatbot-input"
          style={{
            borderTop: "1px solid #ddd",
            padding: "12px 15px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="כתוב שאלה..."
            style={{
              flex: 1,
              border: "1.5px solid #ccc",
              borderRadius: 25,
              padding: "10px 18px",
              fontSize: 15,
              outline: "none",
              direction: "rtl",
              transition: "border-color 0.3s ease",
            }}
            aria-label="שאלת בוט AI"
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
          <button
            onClick={sendMessage}
            style={{
              marginLeft: 12,
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "50%",
              width: 42,
              height: 42,
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 3px 8px rgba(0,123,255,0.6)",
              transition: "background-color 0.3s ease",
            }}
            aria-label="שלח שאלה לבוט AI"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
          >
            &#9658;
          </button>
        </div>
      </section>
    </div>
  );
}
