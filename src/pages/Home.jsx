import React from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      {/* תפריט עליון */}
      <header className="navbar">
        <div className="logo">עסקליק</div>
        <div className="hamburger">☰</div>
      </header>

      {/* אזור עליון - כותרת וחיפוש */}
      <section className="hero-section">
        <h1 className="main-title">עסקליק – הפלטפורמה החכמה שמחברת בין לקוחות לעסקים.</h1>
        <p className="subtitle">
          חפשו עסקים, תאמו שירותים, פתחו עמוד עסקי – הכל במקום אחד, פשוט ויעיל.
        </p>

        <div className="search-section">
          <input
            type="text"
            placeholder="מה אתה מחפש?..."
            className="search-input"
          />
          <button className="search-button">🔍 חפש</button>
        </div>
      </section>

      {/* כרטיסיות מידע */}
      <section className="cards-section">
        <div className="card card-business">
          <h3>💼 בעלי עסקים</h3>
          <p>הצטרפו לעסקליק, פתחו עמוד עסקי והתחילו לקבל פניות מלקוחות.</p>
          <Link to="/business">
            <button className="action-button">כניסה לעסקים</button>
          </Link>
        </div>
        <div className="card card-customers">
          <h3>🛍️ לקוחות</h3>
          <p>מצאו עסקים לפי תחום ואזור, תאמו תורים או שלחו הודעה בצ'אט.</p>
          <Link to="/search">
            <button className="action-button">למעבר לחיפוש</button>
          </Link>
        </div>
        <div className="card card-how">
          <h3>⚙️ איך זה עובד?</h3>
          <p>כל מה שצריך לדעת כדי להתחיל, בין אם אתה לקוח או בעל עסק.</p>
          <Link to="/how-it-works">
            <button className="action-button">למידע נוסף</button>
          </Link>
        </div>
        <div className="card card-about">
          <h3>💬 קצת עלינו</h3>
          <p>עסקליק מחברת בין אנשים לעסקים – בקלות, ביעילות ובקליק אחד.</p>
          <Link to="/about">
            <button className="action-button">הכר את הפלטפורמה</button>
          </Link>
        </div>
      </section>

      {/* תחתית הדף */}
      <footer className="footer">
        <ul className="footer-links">
          <li><Link to="/search">📋 חיפוש עסקים</Link></li>
          <li><Link to="/about">📖 קצת עלינו</Link></li>
          <li><Link to="/how-it-works">⚙️ איך זה עובד</Link></li>
          <li><Link to="/business">💼 בעלי עסקים</Link></li>
          <li><Link to="/join">✏️ הצטרפות עסקים</Link></li>
          <li><Link to="/faq">❓ שאלות נפוצות</Link></li>
          <li><Link to="/terms">📜 תקנון</Link></li>
          <li><Link to="/contact">📞 יצירת קשר</Link></li>
        </ul>
        <p className="copyright">כל הזכויות שמורות © עסקליק</p>
      </footer>
    </div>
  );
}

export default Home;
