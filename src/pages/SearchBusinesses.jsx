// src/pages/SearchBusinesses.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '@api';
import BusinessCard from '../components/BusinessCard';
import './BusinessList.css';

const CATEGORIES = [
  "כל הקטגוריות",
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
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');
  const selectedCategory = searchParams.get('category') || "כל הקטגוריות";
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const scrollRef = useRef();

  // fetch businesses once
  useEffect(() => {
    API.get('/business')
      .then(res => setBusinesses(res.data.businesses || []))
      .catch(console.error);
  }, []);

  // apply filters & sort
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    let list = businesses.filter(b => {
      const matchesText =
        b.name?.toLowerCase().includes(term) ||
        b.category?.toLowerCase().includes(term) ||
        b.description?.toLowerCase().includes(term);
      const matchesCat =
        selectedCategory === "כל הקטגוריות" ||
        b.category === selectedCategory;
      return matchesText && matchesCat;
    });

    if (sortOption === 'alphabetical') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFiltered(list);
    setPage(1);
  }, [businesses, searchTerm, selectedCategory, sortOption]);

  // sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== "כל הקטגוריות") params.set('category', selectedCategory);
    if (sortOption !== 'newest') params.set('sort', sortOption);
    if (page > 1) params.set('page', page);
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCategory, sortOption, page]);

  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const scrollCategories = dir => {
    const amt = 200;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -amt : amt,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryClick = cat => {
    const params = new URLSearchParams(searchParams);
    if (cat === "כל הקטגוריות") {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  return (
    <div className="list-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

        <input
          className="search-input"
          type="text"
          placeholder="חפש לפי שם, קטגוריה או תיאור..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <div className="categories-scroll-wrapper">
          <button className="scroll-arrow" onClick={() => scrollCategories('left')}>&#8678;</button>
          <div className="categories-scroll" ref={scrollRef}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="scroll-arrow" onClick={() => scrollCategories('right')}>&#8680;</button>
        </div>

        <div className="sort-options">
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="business-list">
          {searchTerm === '' && selectedCategory === "כל הקטגוריות" ? (
            <p className="placeholder">🔍 בחר קטגוריה או חפש מונח כדי להציג עסקים.</p>
          ) : pageItems.length > 0 ? (
            pageItems.map(biz => <BusinessCard key={biz._id} business={biz} />)
          ) : (
            <p className="no-results">😕 לא נמצאו עסקים מתאימים.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
              הקודם
            </button>
            <span>{page} מתוך {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
              הבא
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
