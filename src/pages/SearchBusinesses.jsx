import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '@api';
import BusinessCard from '../components/BusinessCard';
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
  const [all, setAll]           = useState([]);
  const [filtered, setFiltered] = useState([]);

  const catParam  = searchParams.get('category') || '';
  const cityParam = searchParams.get('city')     || '';
  const [cat,  setCat]  = useState(catParam);
  const [city, setCity] = useState(cityParam);

  const [cities, setCities] = useState([]);

  const [openCat, setOpenCat]   = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const wrapperCatRef           = useRef(null);
  const wrapperCityRef          = useRef(null);

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // --- 1) טען עסקים + הפק ערי ייחודיות ---
  useEffect(() => {
    API.get('/business')
      .then(r => {
        const list = r.data.businesses || [];
        setAll(list);
        const uniqCities = Array.from(new Set(
          list.map(b => b.address?.city || '').filter(c => c)
        )).sort();
        setCities(['כל הערים', ...uniqCities]);
      })
      .catch(console.error);
  }, []);

  // --- 2) סינון על פי קטגוריה + עיר ---
  useEffect(() => {
    setFiltered(all.filter(b => {
      if (cat && cat !== 'כל הקטגוריות' && b.category !== cat) return false;
      if (city && city !== 'כל הערים'       && b.address?.city !== city) return false;
      return true;
    }));
    setPage(1);
  }, [all, cat, city]);

  // --- 3) סנכרון URL params ---
  useEffect(() => {
    const p = new URLSearchParams();
    if (cat)  p.set('category', cat);
    if (city) p.set('city', city);
    if (page > 1) p.set('page', page);
    setSearchParams(p, { replace: true });
  }, [cat, city, page]);

  // --- 4) סגירת dropdown בלחיצה מחוץ ---
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

  // --- Pagination ---
  const start      = (page - 1) * ITEMS_PER_PAGE;
  const pageItems  = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <div className="list-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

        {/* ----- סינון: קטגוריה + עיר ----- */}
        <div className="filters">
          {/* קטגוריה */}
          <div className="dropdown-wrapper" ref={wrapperCatRef}>
            <button
              className="filter-button"
              onClick={() => setOpenCat(o => !o)}
            >
              {cat || 'בחר קטגוריה'}
              <span className="chevron">▾</span>
            </button>
            {openCat && (
              <ul className="suggestions-list">
                {CATEGORIES.map((c, i) => (
                  <li key={i} onMouseDown={() => { setCat(c); setOpenCat(false); }}>
                    {c === 'כל הקטגוריות' ? <em>{c}</em> : c}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* עיר */}
          <div className="dropdown-wrapper" ref={wrapperCityRef}>
            <button
              className="filter-button"
              onClick={() => setOpenCity(o => !o)}
            >
              {city || 'עיר (לדוגמה: תל אביב)'}
              <span className="chevron">▾</span>
            </button>
            {openCity && (
              <ul className="suggestions-list">
                {cities.map((c, i) => (
                  <li key={i} onMouseDown={() => { setCity(c); setOpenCity(false); }}>
                    {c === 'כל הערים' ? <em>{c}</em> : c}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ----- תוצאות + pagination ----- */}
        <div className="business-list">
          {pageItems.length > 0 ? (
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
          )}
        </div>

        {totalPages > 1 && (
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
