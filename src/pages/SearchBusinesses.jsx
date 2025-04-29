// src/pages/SearchBusinesses.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '@api';
import BusinessCard from '../components/BusinessCard';
import './BusinessList.css';

const CATEGORIES = [
  "כל הקטגוריות",
  "אולם אירועים", "אינסטלטור", "איפור קבוע", "בית קפה", "בניית אתרים", "ברברשופ",
  // … שאר הקטגוריות …
];

const SORT_OPTIONS = [
  { value: "newest", label: "הכי חדש" },
  { value: "alphabetical", label: "לפי שם (א-ת)" },
];

const ITEMS_PER_PAGE = 9;

export default function SearchBusinesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses]         = useState([]);
  const [filtered, setFiltered]             = useState([]);
  const [searchTerm, setSearchTerm]         = useState(searchParams.get('search') || '');
  const [sortOption, setSortOption]         = useState(searchParams.get('sort')   || 'newest');
  const selectedCategory                    = searchParams.get('category')        || "כל הקטגוריות";
  const [page, setPage]                     = useState(Number(searchParams.get('page')) || 1);
  const [showCategories, setShowCategories] = useState(false);
  const scrollRef                           = useRef();

  // 1) fetch
  useEffect(() => {
    API.get('/business')
      .then(res => setBusinesses(res.data.businesses || []))
      .catch(console.error);
  }, []);

  // 2) filter + sort
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    let list = businesses.filter(b => {
      const textMatch =
        b.name?.toLowerCase().includes(term) ||
        b.category?.toLowerCase().includes(term) ||
        b.description?.toLowerCase().includes(term);
      const catMatch =
        selectedCategory === "כל הקטגוריות" ||
        b.category === selectedCategory;
      return textMatch && catMatch;
    });

    if (sortOption === 'alphabetical') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFiltered(list);
    setPage(1);
  }, [businesses, searchTerm, selectedCategory, sortOption]);

  // 3) sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm)                         params.set('search', searchTerm);
    if (selectedCategory !== "כל הקטגוריות") params.set('category', selectedCategory);
    if (sortOption !== 'newest')            params.set('sort', sortOption);
    if (page > 1)                           params.set('page', page);
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCategory, sortOption, page]);

  // pagination
  const startIdx   = (page - 1) * ITEMS_PER_PAGE;
  const pageItems  = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // scroll cats
  const scrollCategories = dir => {
    const amt = 200;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir==='left'? -amt: amt, behavior: 'smooth' });
    }
  };

  // category click
  const handleCategoryClick = cat => {
    const params = new URLSearchParams(searchParams);
    if (cat === "כל הקטגוריות") params.delete('category');
    else                         params.set('category', cat);
    setSearchParams(params);
  };

  return (
    <div className="list-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

        {/* 1) Search bar */}
        <input
          className="search-input"
          type="text"
          placeholder="חפש לפי שם, קטגוריה או תיאור..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onFocus={() => setShowCategories(true)}
        />

        {/* 2) Categories (shown only after focus on search) */}
        {showCategories && (
          <div className="categories-scroll-wrapper">
            <button className="scroll-arrow" onClick={() => scrollCategories('left')}>&#8678;</button>
            <div className="categories-scroll" ref={scrollRef}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory===cat?'active':''}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button className="scroll-arrow" onClick={() => scrollCategories('right')}>&#8680;</button>
          </div>
        )}

        {/* 3) Sort */}
        <div className="sort-options">
          <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* 4) Results grid */}
        <div className="business-list">
          {searchTerm === '' && !showCategories ? (
            <p className="placeholder">🔍 הקש חיפוש כדי להציג קטגוריות ותוצאות.</p>
          ) : pageItems.length > 0 ? (
            pageItems.map(biz => <BusinessCard key={biz._id} business={biz} />)
          ) : (
            <p className="no-results">😕 לא נמצאו עסקים מתאימים.</p>
          )}
        </div>

        {/* 5) Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setPage(p=>Math.max(p-1,1))} disabled={page===1}>הקודם</button>
            <span>{page} מתוך {totalPages}</span>
            <button onClick={() => setPage(p=>Math.min(p+1,totalPages))} disabled={page===totalPages}>הבא</button>
          </div>
        )}
      </div>
    </div>
  );
}
