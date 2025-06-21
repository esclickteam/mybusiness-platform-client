import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChatBot from "../components/ChatBot";
import "../styles/HelpCenter.css";

export default function HelpCenter() {
  const { user } = useAuth();
  const businessId = user?.businessId;
  const navigate = useNavigate();

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

  // רשימת הכרטיסיות (קטגוריות) עם הנתיבים שייקשרו אליהם - תואם לנתיבי ה-FAQ בקוד ה-Routes
  const faqCategories = [
    { id: 1, title: "פרופיל העסק", path: businessId ? `/business/${businessId}/dashboard/faq/profile` : "/" },
    { id: 2, title: "דשבורד", path: businessId ? `/business/${businessId}/dashboard/faq/dashboard` : "/" },
    { id: 3, title: "הודעות מלקוחות", path: businessId ? `/business/${businessId}/dashboard/faq/customer-messages` : "/" },
    { id: 4, title: "שיתופי פעולה", path: businessId ? `/business/${businessId}/dashboard/faq/collaborations` : "/" },
    { id: 5, title: "CRM", path: businessId ? `/business/${businessId}/dashboard/faq/crm` : "/" },
    { id: 6, title: "יועץ עסקליק", path: businessId ? `/business/${businessId}/dashboard/faq/eskelik-advisor` : "/" },
    { id: 7, title: "תוכנית שותפים", path: businessId ? `/business/${businessId}/dashboard/faq/affiliate-program` : "/" },
    { id: 8, title: "טיפול בתקלות ושגיאות", path: businessId ? `/business/${businessId}/dashboard/faq/troubleshooting` : "/" },
    { id: 9, title: "תמיכה טכנית", path: businessId ? `/business/${businessId}/dashboard/faq/technical-support` : "/" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  // סינון הכרטיסיות לפי חיפוש (כולל תמיכה בכתיבה קטנה/גדולה)
  const filteredCategories = faqCategories.filter(cat =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ניתוב לדף הכרטיסיה בלחיצה
  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <div className="help-center-container">
      <h1>👋 ברוכים הבאים למרכז העזרה של עסקליק</h1>
      <p>כאן תוכלו למצוא תשובות, מדריכים וכלים לניהול העסק הדיגיטלי שלכם.</p>

      <div className="search-bar">
        <input
          type="text"
          placeholder='חפשו קטגוריה כמו "דשבורד", "CRM", "פרופיל העסק"'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          dir="rtl"
          aria-label="חיפוש קטגוריות"
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

      <section className="faq-categories">
        <h2>בחר קטגוריה לשאלות נפוצות</h2>
        <div className="categories-grid">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                className="category-card"
                role="button"
                tabIndex={0}
                onClick={() => handleCategoryClick(category.path)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleCategoryClick(category.path);
                }}
                aria-label={`פתח שאלות נפוצות בקטגוריה ${category.title}`}
              >
                {category.title}
              </div>
            ))
          ) : (
            <p>לא נמצאו קטגוריות התואמות את "{searchTerm}"</p>
          )}
        </div>
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

      <ChatBot chatOpen={chatOpen} setChatOpen={setChatOpen} />
    </div>
  );
}
