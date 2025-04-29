// src/pages/SearchBusinesses.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '@api';
import './BusinessList.css';

const CATEGORIES = [
  "כל הקטגוריות","אולם אירועים","אינסטלטור","איפור קבוע","בניית אתרים","בית קפה",
  "ברברשופ","גינון / הדברה","גלריה / חנות אומנות","חנויות טבע / בריאות","חנות בגדים",
  "חשמלאי","טכנאי מחשבים","טכנאי מזגנים","טכנאי סלולר","יועץ מס / רואה חשבון",
  "יוגה / פילאטיס","קייטרינג","כתיבת תוכן / קופירייטינג","מאמן אישי / עסקי","מאמן כושר",
  "מטפלת רגשית / NLP","מטפל/ת הוליסטי","מדיה / פרסום","מדריך טיולים","מומחה שיווק דיגיטלי",
  "מורה למוזיקה / אומנות","מורה פרטי","משפחתון / צהרון / גן","מתווך נדל״ן","נהג / שליחויות",
  "נגר","עורך דין","עיצוב גבות","פסיכולוג / יועץ","קוסמטיקאית","רפואה משלימה","שיפוצניק",
  "מוסך","עורך דין משפחה"
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

  // Fetch
  useEffect(() => {
    API.get('/business').then(r => setAll(r.data.businesses || []));
  }, []);

  // Filter
  useEffect(() => {
    const term = q.toLowerCase();
    const list = all.filter(b =>
      (b.name?.toLowerCase().includes(term) ||
       b.description?.toLowerCase().includes(term)) &&
      (!cat || b.category === cat)
    );
    setFiltered(list);
    setPage(1);
  }, [all, q, cat]);

  // Sync URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (q)   p.set('search', q);
    if (cat) p.set('category', cat);
    if (page>1) p.set('page', page);
    setSearchParams(p, { replace: true });
  }, [q, cat, page]);

  // Close on outside click
  useEffect(() => {
    const h = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Pagination
  const start      = (page - 1) * ITEMS_PER_PAGE;
  const pageItems  = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // Pick category
  const pickCat = c => {
    setSearchParams(ps => {
      const p = new URLSearchParams(ps);
      if (c) p.set('category', c);
      else   p.delete('category');
      return p;
    });
    setOpen(false);
    setQ('');
  };

  // Pick business suggestion
  const pickBiz = bizId => {
    setOpen(false);
    navigate(`/business/${bizId}`);
  };

  return (
    <div className="list-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

        <div className="search-wrapper" ref={wrapperRef}>
          <input
            className="search-input"
            type="text"
            placeholder="חפש שם או תיאור..."
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={() => setOpen(true)}
          />

          {open && !q && (
            <ul className="suggestions-list">
              {CATEGORIES.map((c, i) => (
                <li
                  key={i}
                  onMouseDown={() => pickCat(c === "כל הקטגוריות" ? "" : c)}
                >
                  {c === "כל הקטגוריות" ? <em>{c}</em> : c}
                </li>
              ))}
            </ul>
          )}

          {open && q && (
            <ul className="suggestions-list">
              {filtered.slice(0, 5).map(b => (
                <li
                  key={b._id}
                  onMouseDown={() => pickBiz(b._id)}
                >
                  {b.name}
                </li>
              ))}
              {filtered.length === 0 && (
                <li><em>לא נמצאו תוצאות</em></li>
              )}
            </ul>
          )}
        </div>

        {!open && (
          <>
            <div className="business-list">
              {(!q && !cat) ? (
                <p className="placeholder">
                  🔍 הקש בחיפוש כדי להציג קטגוריות ותוצאות.
                </p>
              ) : pageItems.length > 0 ? (
                pageItems.map(b => (
                  <div 
                    key={b._id}
                    onClick={() => navigate(`/business/${b._id}`)}
                  >
                    <h3>{b.name}</h3>
                    <p>{b.category}</p>
                  </div>
                ))
              ) : (
                <p className="no-results">😕 לא נמצאו עסקים מתאימים.</p>
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
          </>
        )}
      </div>
    </div>
  );
}
