import React, { useState } from "react";
import { Helmet } from "react-helmet";
import "../styles/Home.css";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import ALL_CATEGORIES from "../data/categories";
import ALL_CITIES    from "../data/cities";

export default function Home() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [city, setCity]         = useState("");

  const categoryOptions = ALL_CATEGORIES.map(c => ({ value: c, label: c }));
  const cityOptions     = ALL_CITIES.map(c     => ({ value: c, label: c }));

  const navigateToSearch = () => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (city)     params.set("city", city);
    navigate(`/search?${params.toString()}`);
  };

  const renderIcon = (type) => {
    switch (type) {
      case "new_review": return "📝";
      case "new_customer": return "👤";
      case "new_business": return "🏪";
      default: return "ℹ️";
    }
  };

  return (
    <div className="home-container">
      <Helmet>
        <title>עסקליק – מצא עסקים לפי תחום ועיר | עסקליק</title>
        <meta name="description" content="פלטפורמה למציאת עסקים ושירותים לפי תחום ועיר. פתיחת דף עסקי, יצירת קשר, ותיאום שירות – הכל במקום אחד!" />
        <meta name="keywords" content="עסקים, חיפוש עסקים, שירותים בתל אביב, אינדקס עסקים, עסקליק, לקוחות, פרסום לעסקים" />
        <link rel="canonical" href="https://yourdomain.co.il/" />
      </Helmet>

      {/* Hero */}
      <section className="hero-section">
        <h1 className="main-title">
        עסקליק
        פלטפורמה חכמה לעסקים ולקוחות
        </h1>
        <p className="subtitle">
          חפשו עסקים, תאמו שירותים, פתחו עמוד עסקי – הכל במקום אחד, פשוט ויעיל.
        </p>
      </section>

      {/* Search */}
      <div className="search-section">
        <div className="dropdown-wrapper">
          <Select
            options={categoryOptions}
            value={categoryOptions.find(o => o.value===category) || null}
            onChange={opt => setCategory(opt?.value || "")}
            placeholder="תחום (לדוגמה: חשמלאי)"
            isClearable
            filterOption={({ label }, input) =>
              label.toLowerCase().includes(input.toLowerCase())
            }
            menuPlacement="bottom"
            menuPortalTarget={document.body}
          />
        </div>
        <div className="dropdown-wrapper">
          <Select
            options={cityOptions}
            value={cityOptions.find(o => o.value===city) || null}
            onChange={opt => setCity(opt?.value || "")}
            placeholder="עיר (לדוגמה: תל אביב)"
            isClearable
            filterOption={({ label }, input) =>
              label.toLowerCase().startsWith(input.toLowerCase())
            }
            menuPlacement="bottom"
            menuPortalTarget={document.body}
          />
        </div>
        <button className="search-button" onClick={navigateToSearch}>
          🔍 חפש
        </button>
      </div>

      {/* Bookmark Cards */}
      <div className="cards-container">
        <div className="bookmark-card">
          <h3>לקוחות 🔐</h3>
          <p>מצאו עסקים לפי תחום וצרו קשר בקליק!</p>
          <Link to="/search"><button>מעבר לחיפוש</button></Link>
        </div>
        <div className="bookmark-card">
          <h3>בעלי עסקים 💼</h3>
          <p>הצטרפו לעסקליק ותקבלו פניות ישירות מלקוחות.</p>
          <Link to="/business"><button>כניסה לעסקים</button></Link>
        </div>
        <div className="bookmark-card">
          <h3>⚙️ איך זה עובד?</h3>
          <p>כל מה שצריך לדעת כדי להתחיל, בין אם אתה לקוח או בעל עסק.</p>
          <Link to="/how-it-works"><button>למידע נוסף</button></Link>
        </div>
        <div className="bookmark-card">
          <h3>💬 קצת עלינו</h3>
          <p>עסקליק מחברת בין אנשים לעסקים – בקלות וביעילות.</p>
          <Link to="/about"><button>הכר את הפלטפורמה</button></Link>
        </div>
      </div>

      {/* Footer */}
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
        <p>© כל הזכויות שמורות עסקליק</p>
      </footer>
    </div>
  );
}
