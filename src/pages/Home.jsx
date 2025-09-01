import React, { useState } from "react";
import { Helmet } from "react-helmet";
import "../styles/Home.css";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  const navigateToSearch = () => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    navigate(`/businesses?${params.toString()}`);
  };

  return (
    <div className="home-container">
      <Helmet>
        <title>עסקליק – מצא עסקים לפי תחום ועיר | עסקליק</title>
        <meta
          name="description"
          content="פלטפורמה למציאת עסקים ושירותים לפי תחום ועיר. פתיחת דף עסקי, יצירת קשר, ותיאום שירות – הכל במקום אחד!"
        />
        <meta
          name="keywords"
          content="עסקים, חיפוש עסקים, שירותים בתל אביב, אינדקס עסקים, עסקליק, לקוחות, פרסום לעסקים"
        />
        <link rel="canonical" href="https://yourdomain.co.il/" />
      </Helmet>

      {/* === Header קבוע עם CTA === */}
      <header className="main-header">
        <div className="logo">עסקליק</div>
        <nav>
          <ul className="nav-links">
            <li><Link to="/about">קצת עלינו</Link></li>
            <li><Link to="/how-it-works">איך זה עובד</Link></li>
            <li><Link to="/faq">שאלות נפוצות</Link></li>
            <li><Link to="/contact">צור קשר</Link></li>
          </ul>
        </nav>
        <Link to="/business">
          <button className="button-primary header-cta">🚀 התחל בחינם</button>
        </Link>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <h1 className="main-title">
          עסקליק
          <br />
          <span className="main-subtitle-line">
            ניהול חכם לעסקים – יומן, לקוחות ו־AI במקום אחד
          </span>
        </h1>
        <p className="subtitle">
          יותר פניות, פחות בלגן – ניהול יומן, לקוחות ועמוד עסקי בפלטפורמה אחת.
        </p>
      </section>

      {/* Bookmark Cards */}
      <div className="cards-container">
        <div className="bookmark-card">
          <h3>בעלי עסקים 💼</h3>
          <p>הצטרפו לעסקליק ותקבלו פניות ישירות מלקוחות.</p>
          <Link to="/business">
            <button className="button-primary"> התחל עכשיו בחינם ל־14 יום</button>
          </Link>
        </div>

        <div className="bookmark-card">
          <h3>⚙️ איך זה עובד?</h3>
          <p>כל מה שצריך לדעת כדי להתחיל לעבוד עם עסקליק.</p>
          <Link to="/how-it-works">
            <button className="button-secondary">צפה בהסבר</button>
          </Link>
        </div>

        <div className="bookmark-card">
          <h3>💬 קצת עלינו</h3>
          <p>עסקליק מחברת בין אנשים לעסקים – בקלות וביעילות.</p>
          <Link to="/about">
            <button className="button-secondary">קרא עוד</button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <ul className="footer-links">
          <li><Link to="/about">📖 קצת עלינו</Link></li>
          <li><Link to="/how-it-works">⚙️ איך זה עובד</Link></li>
          <li><Link to="/business">✏️ הצטרפות עסקים</Link></li>
          <li><Link to="/faq">❓ שאלות נפוצות</Link></li>
          <li><Link to="/terms">📜 תקנון</Link></li>
          <li><Link to="/contact">📞 יצירת קשר</Link></li>
        </ul>
        <p>© כל הזכויות שמורות עסקליק</p>
      </footer>
    </div>
  );
}
