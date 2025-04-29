// src/pages/SearchBusinesses.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '@api';
import BusinessCard from '../components/BusinessCard';
import './BusinessList.css';

const CATEGORIES = [
  "אולם אירועים", "אינסטלטור", "איפור קבוע", "בית קפה", "בניית אתרים", "ברברשופ",
  "גינון / הדברה", "גלריה / חנות אומנות", "חנויות טבע / בריאות", "חנות בגדים", "חשמלאי",
  "טכנאי מזגנים", "טכנאי מחשבים", "טכנאי סלולר", "יוגה / פילאטיס", "יועץ מס / רואה חשבון",
  "כתיבת תוכן / קופירייטינג", "מאמן אישי / עסקי", "מאמן כושר", "מדיה / פרסום", "מדריך טיולים",
  "מומחה שיווק דיגיטלי", "מורה למוזיקה / אומנות", "מורה פרטי", "מזון / אוכל ביתי", "מטפל/ת הוליסטי",
  "מטפלת רגשית / NLP", "מכון יופי", "מניקור-פדיקור", "מסגר", "מסעדה", "מספרה",
  "מעצב גרפי", "מעצב פנים", "מציל / מדריך שחייה", "מרצה / מנטור", "משפחתון / צהרון / גן",
  "מתווך נדל״ן", "נגר", "נהג / שליחויות", "עורך דין", "עיצוב גבות", "פסיכולוג / יועץ",
  "צלם / סטודיו צילום", "קוסמטיקאית", "קייטרינג", "רפואה משלימה", "שיפוצניק",
  "שירותים לקהילה / עמותות", "תזונאית / דיאטנית"
];

const SORT_OPTIONS = [
  { value: "newest", label: "הכי חדש" },
  { value: "alphabetical", label: "לפי שם (א-ת)" },
];

const ITEMS_PER_PAGE = 9;

export default function SearchBusinesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort')   || 'newest');
  const selectedCategory            = searchParams.get('category')        || '';
  const [page, setPage]             = useState(Number(searchParams.get('page')) || 1);
  const [openCats, setOpenCats]     = useState(false);
  const wrapperRef                  = useRef(null);

  // Fetch
  useEffect(() => {
    API.get('/business').then(r => setBusinesses(r.data.businesses || [])).catch(console.error);
  }, []);

  // Filter + sort
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    let list = businesses.filter(b => {
      const textMatch = (
        b.name?.toLowerCase().includes(term) ||
        b.description?.toLowerCase().includes(term)
      );
      const catMatch = selectedCategory === '' || b.category === selectedCategory;
      return textMatch && catMatch;
    });
    if (sortOption === 'alphabetical') {
      list.sort((a,b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setFiltered(list);
    setPage(1);
  }, [businesses, searchTerm, selectedCategory, sortOption]);

  // Sync URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (searchTerm)       p.set('search', searchTerm);
    if (selectedCategory) p.set('category', selectedCategory);
    if (sortOption!=='newest') p.set('sort', sortOption);
    if (page>1)           p.set('page', page);
    setSearchParams(p, { replace: true });
  }, [searchTerm, selectedCategory, sortOption, page]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenCats(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Pagination
  const startIdx  = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const totalPages= Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // Select category
  const pickCat = cat => {
    setSearchParams(params => {
      const p = new URLSearchParams(params);
      if (cat) p.set('category', cat);
      else     p.delete('category');
      return p;
    });
    setOpenCats(false);
    setSearchTerm(''); // optional: clear search
  };

  return (
    <div className="list-page">
      <div className="business-list-container">

        <h1>רשימת עסקים</h1>

        <div className="search-wrapper" ref={wrapperRef}>
          <input
            className="search-input"
            type="text"
            placeholder="חפש לפי שם, קטגוריה או תיאור..."
            value={searchTerm}
            onChange={e=>setSearchTerm(e.target.value)}
            onFocus={()=>setOpenCats(true)}
          />
          <select
            className="sort-select"
            value={sortOption}
            onChange={e=>setSortOption(e.target.value)}
          >
            {SORT_OPTIONS.map(o=>(
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {openCats && !searchTerm && (
            <ul className="suggestions-list">
              {['', ...CATEGORIES].map((cat,i)=>(
                <li key={i} onMouseDown={()=>pickCat(cat)}>
                  {cat || <em>כל הקטגוריות</em>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="business-list">
          { !openCats && searchTerm==='' && selectedCategory==='' ? (
            <p className="placeholder">🔍 הקש בחיפוש כדי להציג קטגוריות ותוצאות.</p>
          ) : pageItems.length>0 ? (
            pageItems.map(b=> <BusinessCard key={b._id} business={b}/>)
          ) : (
            <p className="no-results">😕 לא נמצאו עסקים מתאימים.</p>
          )}
        </div>

        {totalPages>1 && (
          <div className="pagination">
            <button onClick={()=>setPage(p=>Math.max(p-1,1))}
                    disabled={page===1}>הקודם</button>
            <span>{page} מתוך {totalPages}</span>
            <button onClick={()=>setPage(p=>Math.min(p+1,totalPages))}
                    disabled={page===totalPages}>הבא</button>
          </div>
        )}

      </div>
    </div>
  );
}
