import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '@api';
import BusinessCard from '../components/BusinessCard';
import ALL_CITIES from '../data/cities';
import './BusinessList.css';

const CATEGORIES = [
  "כל הקטגוריות","אולם אירועים","אינסטלטור","איפור קבוע","בניית אתרים",
  "בית קפה","ברברשופ","גינון / הדברה","גלריה / חנות אומנות",
  "חנויות טבע / בריאות","חנות בגדים","חשמלאי","טכנאי מחשבים",
  "טכנאי מזגנים","טכנאי סלולר","יועץ מס / רואה חשבון","יוגה / פילאטיס",
  "קייטרינג","כתיבת תוכן / קופירייטינג","מאמן אישי / עסקי","מאמן כושר",
  "מטפלת רגשית / NLP","מטפל/ת הוליסטי","מדיה / פרסום","מדריך טיולים",
  "מומחה שיווק דיגיטלי","מורה למוזיקה / אומנות","מורה פרטי",
  "משפחתון / צהרון / גן","מתווך נדל״ן","נהג / שליחויות","נגר",
  "עורך דין","עיצוב גבות","פסיכולוג / יועץ","קוסמטיקאית",
  "רפואה משלימה","שיפוצניק","מוסך","עורך דין משפחה"
];

const ITEMS_PER_PAGE = 9;

export default function SearchBusinesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // --- State ראשי ---
  const [all,      setAll]      = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searched, setSearched] = useState(false);

  const catParam  = searchParams.get('category') || '';
  const [cat,  setCat]  = useState(catParam);
  const [openCat, setOpenCat] = useState(false);
  const wrapperCatRef = useRef(null);

  const cityParam = searchParams.get('city') || '';
  const [city, setCity] = useState(cityParam);
  const [cities, setCities] = useState([]);
  const [openCity, setOpenCity] = useState(false);
  const wrapperCityRef = useRef(null);

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // 1) אתחל את הערים מתוך ALL_CITIES (סטטי) ואז טען עסקים
  useEffect(() => {
    setCities(['כל הערים', ...ALL_CITIES]);

    API.get('/business')
      .then(r => {
        const list = r.data.businesses || [];
        setAll(list);
      })
      .catch(console.error);
  }, []);

  // 2) סנכרון פרמטרים ל־URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (cat)  p.set('category', cat);
    if (city) p.set('city', city);
    if (page > 1) p.set('page', page);
    setSearchParams(p, { replace: true });
  }, [cat, city, page]);

  // 3) סגור dropdown בלחיצה מחוץ
  useEffect(() => {
    const handler = e => {
      if (wrapperCatRef.current && !wrapperCatRef.current.contains(e.target)) {
        setOpenCat(false);
      }
      if (wrapperCityRef.current && !wrapperCityRef.current.contains(e.target)) {
        setOpenCity(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 4) חיפוש וסינון
  const handleSearch = () => {
    const res = all.filter(b => {
      if (cat && cat !== 'כל הקטגוריות' && b.category !== cat)      return false;
      if (city && city !== 'כל הערים'       && b.address?.city !== city) return false;
      return true;
    });
    setFiltered(res);
    setPage(1);
    setSearched(true);
  };

  // 5) Pagination
  const start      = (page - 1) * ITEMS_PER_PAGE;
  const pageItems  = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <div className="list-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

        {/* ----- סינון: קטגוריה, עיר + כפתור חפש ----- */}
        <div className="filters">
          {/* קטגוריה */}
          <div className="dropdown-wrapper" ref={wrapperCatRef}>
            <button
              className="filter-button"
              onClick={() => setOpenCat(o => !o)}
            >
              {cat || 'בחר קטגוריה'} <span className="chevron">▾</span>
            </button>
            {openCat && (
              <ul className="suggestions-list">
                {CATEGORIES.map((c, i) => (
                  <li key={i} onMouseDown={() => {
                    setCat(c);
                    setOpenCat(false);
                  }}>
                    {c === 'כל הקטגוריות' ? <em>{c}</em> : c}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* עיר – input עם autocomplete */}
          <div className="dropdown-wrapper" ref={wrapperCityRef}>
            <input
              type="text"
              className="filter-input"
              placeholder="עיר (לדוגמה: תל אביב)"
              value={city}
              onFocus={() => setOpenCity(true)}
              onChange={e => {
                setCity(e.target.value);
                setOpenCity(true);
              }}
            />
            {openCity && (
              <ul className="suggestions-list">
                {cities
                  .filter(c =>
                    city === '' ||
                    c.toLowerCase().includes(city.trim().toLowerCase())
                  )
                  .map((c, i) => (
                    <li key={i} onMouseDown={() => {
                      setCity(c);
                      setOpenCity(false);
                    }}>
                      {c === 'כל הערים' ? <em>{c}</em> : c}
                    </li>
                  ))
                }
                {cities.filter(c =>
                  city === '' ||
                  c.toLowerCase().includes(city.trim().toLowerCase())
                ).length === 0 && (
                  <li className="no-match">אין ערים מתאימות</li>
                )}
              </ul>
            )}
          </div>

          {/* כפתור חפש */}
          <button
            type="button"
            className="filter-button search-btn"
            onClick={handleSearch}
          >
            חפש
          </button>
        </div>

        {/* ----- תוצאות + pagination ----- */}
        <div className="business-list">
          {!searched && (
            <p className="no-search">לחץ על “חפש” כדי לראות תוצאות</p>
          )}

          {searched && (
            pageItems.length > 0 ? (
              pageItems.map(b => (
                <BusinessCard
                  key={b._id}
                  business={b}
                  onClick={() => navigate(`/business/${b._id}`)}
                />
              ))
            ) : (
              <p className="no-results">
                😕 לא נמצאו עסקים בקטגוריה “{cat || '–'}” ובעיר “{city || '–'}”.
              </p>
            )
          )}
        </div>

        {searched && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              הקודם
            </button>
            <span>{page} מתוך {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              הבא
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
