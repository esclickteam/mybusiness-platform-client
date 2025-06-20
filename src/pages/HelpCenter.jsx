import React, { useState } from "react";
import "../styles/HelpCenter.css";

const categories = [
  { id: 1, icon: "🧾", title: "חיובים ותשלומים" },
  { id: 2, icon: "🧑‍💻", title: "ניהול חשבון" },
  { id: 3, icon: "📢", title: "פרסום ושיווק" },
  { id: 4, icon: "🔒", title: "פרטיות ואבטחה" },
  { id: 5, icon: "🛠️", title: "תקלות טכניות" },
  { id: 6, icon: "📱", title: "שימוש באפליקציה" },
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

const recommendedArticles = [
  "איך לעדכן פרטי תשלום?",
  "מה עושים אם החשבון נחסם?",
  "מדריך מהיר ליצירת קמפיין בפייסבוק",
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
        />
      </div>

      <section className="categories">
        <h2>קטגוריות עזרה</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <span className="category-icon" aria-label={cat.title}>
                {cat.icon}
              </span>
              <span className="category-title">{cat.title}</span>
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

      <section className="recommended-articles">
        <h2>מאמרים מומלצים</h2>
        <ul>
          {recommendedArticles.map((article, idx) => (
            <li key={idx}>{article}</li>
          ))}
        </ul>
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
