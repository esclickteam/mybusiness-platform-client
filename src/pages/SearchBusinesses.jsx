// src/pages/SearchBusinesses.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '@api';
import BusinessCard from '../components/BusinessCard';
import './BusinessList.css';

const CATEGORIES = [
  "כל הקטגוריות",
  "אולם אירועים",
  "אינסטלטור",
  "איפור קבוע",
  "בניית אתרים",
  "בית קפה",
  "ברברשופ",
  "גינון / הדברה",
  "גלריה / חנות אומנות",
  "חנויות טבע / בריאות",
  "חנות בגדים",
  "חשמלאי",
  "טכנאי מחשבים",
  "טכנאי מזגנים",
  "טכנאי סלולר",
  "יועץ מס / רואה חשבון",
  "יוגה / פילאטיס",
  "קייטרינג",
  "כתיבת תוכן / קופירייטינג",
  "מאמן אישי / עסקי",
  "מאמן כושר",
  "מטפלת רגשית / NLP",
  "מטפל/ת הוליסטי",
  "מדיה / פרסום",
  "מדריך טיולים",
  "מומחה שיווק דיגיטלי",
  "מורה למוזיקה / אומנות",
  "מורה פרטי",
  "משפחתון / צהרון / גן",
  "מתווך נדל״ן",
  "נהג / שליחויות",
  "נגר",
  "עורך דין",
  "עיצוב גבות",
  "פסיכולוג / יועץ",
  "קוסמטיקאית",
  "רפואה משלימה",
  "שיפוצניק",
  "מוסך",
  "עורך דין משפחה"
];

const ITEMS_PER_PAGE = 9;

export default function SearchBusinesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [all, setAll]           = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [q, setQ]               = useState(searchParams.get('search') || '');
  const cat                     = searchParams.get('category') || '';
  const [page, setPage]         = useState(Number(searchParams.get('page')) || 1);
  const [open, setOpen]         = useState(false);
  const wrapperRef              = useRef(null);

  // 1) Load all businesses once
  useEffect(() => {
    API.get('/business')
      .then(r => setAll(r.data.businesses || []))
      .catch(console.error);
  }, []);

  // 2) Filter businesses for the results area
  useEffect(() => {
    const term = cat; // filter only by category
    setFiltered(
      all.filter(b =>
        !term || b.category === term
      )
    );
    setPage(1);
  }, [all, cat]);

  // 3) Sync URL params
  useEffect(() => {
    const p = new URLSearchParams();
    if (cat) p.set('category', cat);
    if (page > 1) p.set('page', page);
    setSearchParams(p, { replace: true });
  }, [cat, page]);

  // 4) Close dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Pagination logic
  const start      = (page - 1) * ITEMS_PER_PAGE;
  const pageItems  = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // When user picks a category
  const pickCat = c => {
    setOpen(false);
    setQ('');
    setSearchParams(ps => {
      const p = new URLSearchParams(ps);
      if (c === 'כל הקטגוריות') p.delete('category');
      else p.set('category', c);
      return p;
    });
  };

  return (
    <div className="list-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

        {/* Search input + dropdown of categories */}
        <div className="search-wrapper" ref={wrapperRef}>
          <input
            className="search-input"
            type="text"
            placeholder="חפש קטגוריה..."
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={() => setOpen(true)}
          />

          {/* Always show matching categories */}
          {open && (
            <ul className="suggestions-list">
              {CATEGORIES
                .filter(c =>
                  c === 'כל הקטגוריות' ||
                  c.toLowerCase().includes(q.trim().toLowerCase())
                )
                .map((c, idx) => (
                  <li key={idx} onMouseDown={() => pickCat(c)}>
                    {c === 'כל הקטגוריות' ? <em>{c}</em> : c}
                  </li>
                ))
              }
            </ul>
          )}
        </div>

        {/* Results & pagination (hidden while dropdown open) */}
        {!open && (
          <>
            <div className="business-list">
              {(!cat) ? (
                <p className="placeholder">
                  🔍 בחר קטגוריה כדי לראות עסקים תואמים.
                </p>
              ) : pageItems.length > 0 ? (
                pageItems.map(b => (
                  <BusinessCard
                    key={b._id}
                    business={b}
                    onClick={() => navigate(`/business/${b._id}`)}
                  />
                ))
              ) : (
                <p className="no-results">😕 לא נמצאו עסקים בקטגוריה זו.</p>
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
          </>
        )}
      </div>
    </div>
  );
}
