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

  const filteredCategories = faqCategories.filter(cat =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArticles = popularArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          aria-label="חיפוש קטגוריות ומאמרים"
          autoComplete="off"
        />
        <span className="search-icon" role="img" aria-label="חיפוש">🔍</span>
      </div>

      {searchTerm.trim() === "" ? (
        <>
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
              {faqCategories.map((category) => (
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
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="search-results">
          <h2>תוצאות חיפוש עבור "{searchTerm}"</h2>

          {filteredArticles.length > 0 ? (
            <div className="articles-grid">
              {filteredArticles.map(article => (
                <div key={article.id} className="article-card">
                  <p className="article-title">{article.title}</p>
                  <p className="article-description">{article.description}</p>
                  <Link to={article.url} className="more-info-button" aria-label={`מידע נוסף על ${article.title}`}>
                    מידע נוסף
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>לא נמצאו מאמרים התואמים את החיפוש.</p>
          )}

          {filteredCategories.length > 0 ? (
            <div className="categories-grid" style={{ marginTop: 20 }}>
              {filteredCategories.map(category => (
                <div
                  key={category.id}
                  className="category-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCategoryClick(category.path)}
                  onKeyPress={e => {
                    if (e.key === "Enter") handleCategoryClick(category.path);
                  }}
                  aria-label={`פתח שאלות נפוצות בקטגוריה ${category.title}`}
                >
                  {category.title}
                </div>
              ))}
            </div>
          ) : (
            <p>לא נמצאו קטגוריות התואמות את החיפוש.</p>
          )}
        </section>
      )}

      <section className="contact-us">
        <h2>צריכים עזרה נוספת?</h2>
        <div>
          <button
            type="button"
            onClick={() => navigate("/business-support")}
            className="support-button"
            aria-label="עבור לעמוד תמיכה לעסקים"
          >
            עבור לעמוד התמיכה לעסקים
          </button>
        </div>
      </section>

      <ChatBot chatOpen={chatOpen} setChatOpen={setChatOpen} />
    </div>
  );
}
