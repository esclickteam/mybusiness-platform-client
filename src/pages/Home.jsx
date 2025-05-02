import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import ALL_CATEGORIES from "../data/categories";
import ALL_CITIES from "../data/cities";

export default function Home() {
  const navigate = useNavigate();

  // state
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [userCity, setUserCity] = useState("");
  const [updates, setUpdates] = useState([]); // עדכונים מ־WebSocket

  // build options for React-Select
  const categoryOptions = ALL_CATEGORIES.map((c) => ({ value: c, label: c }));
  const cityOptions = ALL_CITIES.map((c) => ({ value: c, label: c }));

  // detect user's city via geolocation
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          const detected =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            "";
          setUserCity(detected);
        } catch (err) {
          console.error("שגיאה בקבלת מיקום:", err);
        }
      },
      (err) => console.warn("Geolocation error:", err),
      { timeout: 10000 }
    );
  }, []);

  // WebSocket connection for live updates
  useEffect(() => {
    const socket = new WebSocket("wss://api.esclick.co.il");

    socket.onmessage = function (event) {
      const { message } = JSON.parse(event.data);
      console.log("התקבל עדכון:", message);
      setUpdates((prev) => [
        ...prev,
        { message, time: new Date().toLocaleTimeString() },
      ]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  // navigate to search results
  const navigateToSearch = () => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="home-container">
      {/* Hero */}
      <section className="hero-section">
        <h1 className="main-title">
          עסקליק – הפלטפורמה החכמה שמחברת בין לקוחות לעסקים.
        </h1>
        <p className="subtitle">
          חפשו עסקים, תאמו שירותים, פתחו עמוד עסקי – הכל במקום אחד, פשוט
          ויעיל.
        </p>
        {userCity && (
          <p className="location-hint">
            🎯 הצג עסקים בסביבת <strong>{userCity}</strong>
          </p>
        )}
      </section>

      {/* Search */}
      <div className="search-section">
        <div className="dropdown-wrapper">
          <Select
            options={categoryOptions}
            value={categoryOptions.find((o) => o.value === category) || null}
            onChange={(opt) => setCategory(opt?.value || "")}
            placeholder="תחום (לדוגמה: חשמלאי)"
            isClearable
            openMenuOnInput
            openMenuOnClick={false}
            openMenuOnFocus={false}
            filterOption={({ label }, input) =>
              label.toLowerCase().includes(input.toLowerCase())
            }
            noOptionsMessage={() =>
              category ? "אין קטגוריות מתאימות" : null
            }
            menuPlacement="bottom"
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </div>

        <div className="dropdown-wrapper">
          <Select
            options={cityOptions}
            value={cityOptions.find((o) => o.value === city) || null}
            onChange={(opt) => setCity(opt?.value || "")}
            placeholder="עיר (לדוגמה: תל אביב)"
            isClearable
            openMenuOnInput
            openMenuOnClick={false}
            openMenuOnFocus={false}
            filterOption={({ label }, input) =>
              label.toLowerCase().startsWith(input.toLowerCase())
            }
            noOptionsMessage={() => (city ? "אין ערים מתאימות" : null)}
            menuPlacement="bottom"
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </div>

        <button className="search-button" onClick={navigateToSearch}>
          🔍 חפש
        </button>
      </div>

      {/* Quick Jobs */}
      <div className="quick-jobs-button-wrapper">
        <Link to="/quick-jobs">
          <button className="quick-jobs-button">
            ⚡ לוח עבודות מהירות
          </button>
        </Link>
      </div>

      {/* Bookmark Cards */}
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
          <p>
            כל מה שצריך לדעת כדי להתחיל, בין אם אתה לקוח או בעל עסק.
          </p>
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

      {/* Trending / Live Updates */}
      <div className="trending-box">
  <h4>📈 מה קורה עכשיו בעסקליק?</h4>
  <ul>
    {updates.length === 0 ? (
      <li className="no-updates">אין עדכונים כרגע</li>
    ) : (
      updates.map((upd, i) => (
        <li key={i} className="update-item">
          🔹 {upd.message} <span className="time">({upd.time})</span>
        </li>
      ))
    )}
  </ul>
</div>


      {/* Footer */}
      <footer className="footer">
        <ul className="footer-links">
          <li>
            <Link to="/search">📋 חיפוש עסקים</Link>
          </li>
          <li>
            <Link to="/about">📖 קצת עלינו</Link>
          </li>
          <li>
            <Link to="/how-it-works">⚙️ איך זה עובד</Link>
          </li>
          <li>
            <Link to="/business">💼 בעלי עסקים</Link>
          </li>
          <li>
            <Link to="/join">✏️ הצטרפות עסקים</Link>
          </li>
          <li>
            <Link to="/faq">❓ שאלות נפוצות</Link>
          </li>
          <li>
            <Link to="/terms">📜 תקנון</Link>
          </li>
          <li>
            <Link to="/contact">📞 יצירת קשר</Link>
          </li>
        </ul>
        <p className="copyright">
          כל הזכויות שמורות © עסקליק
        </p>
      </footer>
    </div>
  );
}
