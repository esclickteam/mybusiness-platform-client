import React, { useState } from "react";
import "../styles/HelpCenter.css";

const popularArticles = [
  { id: 1, title: "בניית עמוד עסקי" },
  { id: 2, title: "שימוש נכון בצ'אט עם לקוחות" },
  { id: 3, title: "דשבורד העסק" },
  { id: 4, title: "יומן תיאום תורים / CRM" },
  { id: 5, title: "יועץ עסקליק ושותף AI" },
  { id: 6, title: "שיתופי פעולה בין עסקים" },
];

const faqs = [
  {
    question: "איך לערוך את פרופיל העסק שלי?",
    answer: 'עבור ללשונית "עריכת עמוד עסקי" בתפריט הצד.',
  },
  {
    question: "איך ליצור קשר עם לקוחות?",
    answer: 'השתמש בלשונית "הודעות מלקוחות" כדי לשלוח ולקבל הודעות.',
  },
  {
    question: "איך לנהל את ה-CRM?",
    answer: 'בקרו בלשונית "מערכת CRM" לניהול הלקוחות והפגישות שלכם.',
  },
];

export default function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.includes(searchTerm) || faq.answer.includes(searchTerm)
  );

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
        <span className="search-icon" role="img" aria-label="חיפוש">
          🔍
        </span>
      </div>

      <section className="popular-articles">
        <h2>מאמרים פופולריים</h2>
        <div className="articles-grid">
          {popularArticles.map((article) => (
            <div key={article.id} className="article-card">
              <p>{article.title}</p>
              <button
                onClick={() =>
                  alert(`מעבר למאמר: "${article.title}" (כאן ניתן לקשר לעמוד המלא)`)
                }
              >
                מידע נוסף
              </button>
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
  );
}
