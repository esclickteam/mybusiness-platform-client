// src/pages/SearchBusinesses.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '@api';
import BusinessCard from '../components/BusinessCard';
import './BusinessList.css';

const CATEGORIES = [
  'כל הקטגוריות',
  'אולם אירועים',
  'אינסטלטור',
  'איפור קבוע',
  'בניית אתרים',
  'בית קפה',
  'ברברשופ',
  'גינון / הדברה',
  'גלריה / חנות אומנות',
  'חנויות טבע / בריאות',
  'חנות בגדים',
  'חשמלאי',
  'טכנאי מחשבים',
  'טכנאי מזגנים',
  'טכנאי סלולר',
  'יועץ מס / רואה חשבון',
  'יוגה / פילאטיס',
  'קייטרינג',
  'כתיבת תוכן / קופירייטינג',
  'מאמן אישי / עסקי',
  'מאמן כושר',
  'מטפלת רגשית / NLP',
  'מטפל/ת הוליסטי',
  'מדיה / פרסום',
  'מדריך טיולים',
  'מומחה שיווק דיגיטלי',
  'מורה למוזיקה / אומנות',
  'מורה פרטי',
  'משפחתון / צהרון / גן',
  'מתווך נדל"ן',
  'נהג / שליחויות',
  'נגר',
  'עורך דין',
  'עיצוב גבות',
  'פסיכולוג / יועץ',
  'קוסמטיקאית',
  'רפואה משלימה',
  'שיפוצניק',
  'מוסך',
  'עורך דין משפחה'
];

const ITEMS_PER_PAGE = 9;

function normalizeCity(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0591-\u05C7]/g, '')
    .replace(/[-'" ]+/g, '')
    .trim()
    .toLowerCase();
}

export default function SearchBusinesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [all, setAll] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searched, setSearched] = useState(false);

  // קטגוריה
  const catParam = searchParams.get('category') || '';
  const [cat, setCat] = useState(catParam);
  const [openCat, setOpenCat] = useState(false);
  const wrapperCatRef = useRef(null);

  // עיר
  const cityParam = searchParams.get('city') || '';
  const [city, setCity] = useState(cityParam);
  const [cities, setCities] = useState(['כל הערים']);
  const [openCity, setOpenCity] = useState(false);
  const wrapperCityRef = useRef(null);

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // טען כל העסקים ובנה רשימת ערים דינמית
  useEffect(() => {
    API.get('/business')
      .then(r => {
        const list = r.data.businesses || [];
        setAll(list);

        const dynamicCities = Array.from(
          new Set(
            list.map(b => b.address?.city?.trim() || '').filter(c => c)
          )
        ).sort((a, b) => a.localeCompare(b, 'he'));
        setCities(['כל הערים', ...dynamicCities]);
      })
      .catch(console.error);
  }, []);

  // סגור dropdowns בלחיצה מחוץ
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

  // עדכן פרמטרים ב-URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (cat) p.set('category', cat);
    if (city) p.set('city', city);
    if (page > 1) p.set('page', page);
    setSearchParams(p, { replace: true });
  }, [cat, city, page]);

  // חיפוש
  const handleSearch = () => {
    const normCity = normalizeCity(city);
    const res = all.filter(b => {
      if (cat && cat !== 'כל הקטגוריות' && b.category !== cat) return false;
      if (
        normCity &&
        city !== 'כל הערים' &&
        normalizeCity(b.address?.city || '') !== normCity
      ) {
        return false;
      }
      return true;
    });
    setFiltered(res);
    setPage(1);
    setSearched(true);
  };

  // פאג'ינציה
  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <div className="list-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

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
                  <li
                    key={i}
                    onClick={() => {
                      setCat(c);
                      setOpenCat(false);
                    }}
                  >
                    {c === 'כל הקטגוריות' ? <em>{c}</em> : c}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* עיר */}
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
            {openCity && city.trim().length > 0 && (
              <ul className="suggestions-list">
                {cities
                  .filter(c =>
                    normalizeCity(c).includes(normalizeCity(city))
                  )
                  .map((c, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setCity(c);
                        setOpenCity(false);
                      }}
                    >
                      {c === 'כל הערים' ? <em>{c}</em> : c}
                    </li>
                  ))}
                {cities.filter(c =>
                    normalizeCity(c).includes(normalizeCity(city))
                  ).length === 0 && (
                  <li className="no-match">אין ערים מתאימות</li>
                )}
              </ul>
            )}
          </div>

          {/* חפש */}
          <button className="filter-button search-btn" onClick={handleSearch}>
            חפש
          </button>
        </div>

        <div className="business-list">
          {!searched && (
            <p className="no-search">לחץ על “חפש” כדי לראות תוצאות</p>
          )}
          {searched &&
            (pageItems.length > 0 ? (
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
            ))}
        </div>

        {searched && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              הקודם
            </button>
            <span>
              {page} מתוך {totalPages}
            </span>
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
