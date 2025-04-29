// src/pages/SearchBusinesses.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '@api';
import BusinessCard from '../components/BusinessCard';
import './BusinessList.css';

const CATEGORIES = [
  "אולם אירועים","אינסטלטור","איפור קבוע","בית קפה","בניית אתרים",
  "ברברשופ","גינון / הדברה","גלריה / חנות אומנות","חנויות טבע / בריאות",
  "חנות בגדים","חשמלאי","טכנאי מזגנים","טכנאי מחשבים","טכנאי סלולר",
  "יוגה / פילאטיס","יועץ מס / רואה חשבון","כתיבת תוכן / קופירייטינג","מאמן אישי / עסקי",
  "מאמן כושר","מדיה / פרסום","מדריך טיולים","מומחה שיווק דיגיטלי","מורה למוזיקה / אומנות",
  "מורה פרטי","מזון / אוכל ביתי","מטפל/ת הוליסטי","מטפלת רגשית / NLP","מכון יופי",
  "מניקור-פדיקור","מסגר","מסעדה","מספרה","מעצב גרפי","מעצב פנים",
  "מציל / מדריך שחייה","מרצה / מנטור","משפחתון / צהרון / גן","מתווך נדל״ן",
  "נגר","נהג / שליחויות","עורך דין","עיצוב גבות","פסיכולוג / יועץ",
  "צלם / סטודיו צילום","קוסמטיקאית","קייטרינג","רפואה משלימה","שיפוצניק",
  "שירותים לקהילה / עמותות","תזונאית / דיאטנית"
];

const ITEMS_PER_PAGE = 9;

export default function SearchBusinesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [all, setAll]     = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [q, setQ]         = useState(searchParams.get('search') || '');
  const cat               = searchParams.get('category') || '';
  const [page, setPage]   = useState(Number(searchParams.get('page')) || 1);
  const [openCats, setOpenCats] = useState(false);
  const wrapperRef        = useRef(null);

  // fetch כל העסקים
  useEffect(() => {
    API.get('/business')
      .then(r => setAll(r.data.businesses || []))
      .catch(console.error);
  }, []);

  // filter לפי q ו־cat
  useEffect(() => {
    const term = q.toLowerCase();
    const list = all.filter(b => {
      const m1 = b.name?.toLowerCase().includes(term)
              || b.description?.toLowerCase().includes(term);
      const m2 = !cat || b.category === cat;
      return m1 && m2;
    });
    setFiltered(list);
    setPage(1);
  }, [all, q, cat]);

  // sync URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (q)   p.set('search', q);
    if (cat) p.set('category', cat);
    if (page>1) p.set('page', page);
    setSearchParams(p, { replace:true });
  }, [q, cat, page]);

  // סגירה בקלק חיצוני
  useEffect(() => {
    const onDown = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenCats(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const pickCat = c => {
    setSearchParams(ps => {
      const p = new URLSearchParams(ps);
      if (c) p.set('category', c);
      else   p.delete('category');
      return p;
    });
    setOpenCats(false);
    // clear search if you like: setQ('');
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
            onFocus={() => setOpenCats(true)}
          />
          {openCats && !q && (
            <ul className="suggestions-list">
              <li onMouseDown={()=>pickCat('')}>
                <em>כל הקטגוריות</em>
              </li>
              {CATEGORIES.map(c =>
                <li key={c} onMouseDown={()=>pickCat(c)}>
                  {c}
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="business-list">
          {!openCats && !q && !cat ? (
            <p className="placeholder">
              🔍 הקש בחיפוש כדי להציג קטגוריות ותוצאות.
            </p>
          ) : pageItems.length>0 ? (
            pageItems.map(b=> <BusinessCard key={b._id} business={b}/> )
          ) : (
            <p className="no-results">😕 לא נמצאו עסקים מתאימים.</p>
          )}
        </div>

        {totalPages>1 && (
          <div className="pagination">
            <button onClick={()=>setPage(p=>Math.max(p-1,1))} disabled={page===1}>
              הקודם
            </button>
            <span>{page} מתוך {totalPages}</span>
            <button onClick={()=>setPage(p=>Math.min(p+1,totalPages))} disabled={page===totalPages}>
              הבא
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
