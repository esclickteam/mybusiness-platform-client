// src/pages/SearchBusinesses.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '@api';
import BusinessCard from '../components/BusinessCard';
import './BusinessList.css';

const CATEGORIES = [
  "אולם אירועים", "אינסטלטור", "איפור קבוע", "בית קפה", /* … שאר הקטגוריות … */
];

const ITEMS_PER_PAGE = 9;

export default function SearchBusinesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const selectedCategory            = searchParams.get('category') || '';
  const [page, setPage]             = useState(Number(searchParams.get('page')) || 1);
  const [openCats, setOpenCats]     = useState(false);
  const wrapperRef                  = useRef(null);

  // 1) Fetch
  useEffect(() => {
    API.get('/business')
      .then(r => setBusinesses(r.data.businesses || []))
      .catch(console.error);
  }, []);

  // 2) Filter only (no sort)
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const list = businesses.filter(b => {
      const textMatch =
        b.name?.toLowerCase().includes(term) ||
        b.description?.toLowerCase().includes(term);
      const catMatch = !selectedCategory || b.category === selectedCategory;
      return textMatch && catMatch;
    });
    setFiltered(list);
    setPage(1);
  }, [businesses, searchTerm, selectedCategory]);

  // 3) Sync URL (only search, category, page)
  useEffect(() => {
    const p = new URLSearchParams();
    if (searchTerm)       p.set('search', searchTerm);
    if (selectedCategory) p.set('category', selectedCategory);
    if (page > 1)         p.set('page', page);
    setSearchParams(p, { replace: true });
  }, [searchTerm, selectedCategory, page]);

  // 4) Close dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenCats(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 5) Pagination
  const startIdx   = (page - 1) * ITEMS_PER_PAGE;
  const pageItems  = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // 6) Pick category
  const pickCat = cat => {
    setSearchParams(params => {
      const p = new URLSearchParams(params);
      if (cat) p.set('category', cat);
      else     p.delete('category');
      return p;
    });
    setOpenCats(false);
    setSearchTerm('');
  };

  return (
    <div className="list-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

        {/* search + dropdown */}
        <div className="search-wrapper" ref={wrapperRef}>
          <input
            className="search-input"
            type="text"
            placeholder="חפש לפי שם או תיאור..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={() => setOpenCats(true)}
          />

          {openCats && !searchTerm && (
            <ul className="suggestions-list">
              {/* ריק = כל הקטגוריות */}
              <li onMouseDown={() => pickCat('')}><em>כל הקטגוריות</em></li>
              {CATEGORIES.map(cat => (
                <li key={cat} onMouseDown={() => pickCat(cat)}>
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* results */}
        <div className="business-list">
          {!openCats && searchTerm === '' && !selectedCategory ? (
            <p className="placeholder">🔍 הקש כדי להציג קטגוריות או חפש מונח.</p>
          ) : pageItems.length > 0 ? (
            pageItems.map(b => <BusinessCard key={b._id} business={b} />)
          ) : (
            <p className="no-results">😕 לא נמצאו עסקים מתאימים.</p>
          )}
        </div>

        {/* pagination */}
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
