import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState("");
  const [userCity, setUserCity] = useState("");

  const trendingSearches = [
    "מישהו חיפש עכשיו: חשמלאי בתל אביב",
    "עסק חדש: קוסמטיקאית בראשון לציון",
    "מישהו בדיוק הזמין אינסטלטור!"
  ];

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(async (position) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
        );
        const data = await res.json();
        const city =
          data?.address?.city ||
          data?.address?.town ||
          data?.address?.village ||
          "";
        setUserCity(city);
      } catch (err) {
        console.error("שגיאה בקבלת מיקום:", err);
      }
    });
  }, []);

  const navigateToSearch = () => {
    const url = `/search?category=${encodeURIComponent(searchTerm)}&city=${encodeURIComponent(city)}`;
    navigate(url);
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="main-title">עסקליק – הפלטפורמה החכמה שמחברת בין לקוחות לעסקים.</h1>
        <p className="subtitle">
          חפשו עסקים, תאמו שירותים, פתחו עמוד עסקי – הכל במקום אחד, פשוט ויעיל.
        </p>
        {userCity && (
          <p className="location-hint">🎯 הצג עסקים בסביבת <strong>{userCity}</strong></p>
        )}
      </section>

      {/* 🔍 שורת חיפוש */}
      <div className="search-section">
        <input
          type="text"
          placeholder="תחום (לדוגמה: חשמלאי)"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="עיר (לדוגמה: תל אביב)"
          className="search-input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="search-button" onClick={navigateToSearch}>🔍 חפש</button>
      </div>

      <div className="quick-jobs-button-wrapper">
        <Link to="/quick-jobs">
          <button className="quick-jobs-button">⚡ לוח עבודות מהירות</button>
        </Link>
      </div>

      {/* 📌 כרטיסיות סימניה */}
      <div className="cards-container">
        <div className="bookmark-card">
          <h3>לקוחות 🔐</h3>
          <p>מצאו עסקים לפי תחום וצרו קשר בקליק!</p>
          <Link to="/search">
            <button>מעבר לחיפוש</button>
          </Link>
        </div>
        <div className="bookmark-card">
          <h3>בעלי עסקים 💼</h3>
          <p>הצטרפו לעסקליק ותקבלו פניות ישירות מלקוחות.</p>
          <Link to="/business">
            <button>כניסה לעסקים</button>
          </Link>
        </div>
        <div className="bookmark-card">
          <h3>⚙️ איך זה עובד?</h3>
          <p>כל מה שצריך לדעת כדי להתחיל, בין אם אתה לקוח או בעל עסק.</p>
          <Link to="/how-it-works">
            <button>למידע נוסף</button>
          </Link>
        </div>
        <div className="bookmark-card">
          <h3>💬 קצת עלינו</h3>
          <p>עסקליק מחברת בין אנשים לעסקים – בקלות, ביעילות ובקליק אחד.</p>
          <Link to="/about">
            <button>הכר את הפלטפורמה</button>
          </Link>
        </div>
      </div>

      {/* 📈 חיפושים חמים */}
      <div className="trending-box">
        <h4>📈 מה קורה עכשיו בעסקליק?</h4>
        <ul>
          {trendingSearches.map((item, i) => (
            <li key={i}>🔹 {item}</li>
          ))}
        </ul>
      </div>

      {/* 🧭 תחתית */}
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
