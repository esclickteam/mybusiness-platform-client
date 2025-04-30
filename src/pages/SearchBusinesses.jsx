// src/pages/SearchBusinesses.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '@api';
import BusinessCard from '../components/BusinessCard';
import BusinessCardSkeleton from '../components/BusinessCardSkeleton';
import ALL_CATEGORIES from '../data/categories';
import ALL_CITIES from '../data/cities';
import './BusinessList.css';

const ITEMS_PER_PAGE = 9;

function normalize(str) {
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
  const [loading, setLoading] = useState(true);

  // Category autocomplete
  const catParam = searchParams.get('category') || '';
  const [cat, setCat] = useState(catParam);
  const [openCat, setOpenCat] = useState(false);
  const wrapperCatRef = useRef(null);

  // City autocomplete
  const cityParam = searchParams.get('city') || '';
  const [city, setCity] = useState(cityParam);
  const [openCity, setOpenCity] = useState(false);
  const wrapperCityRef = useRef(null);

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Fetch businesses
  useEffect(() => {
    API.get('/business')
      .then(r => {
        setAll(r.data.businesses || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = e => {
      if (wrapperCatRef.current && !wrapperCatRef.current.contains(e.target)) setOpenCat(false);
      if (wrapperCityRef.current && !wrapperCityRef.current.contains(e.target)) setOpenCity(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Sync URL params
  useEffect(() => {
    const p = new URLSearchParams();
    if (cat) p.set('category', cat);
    if (city) p.set('city', city);
    if (page > 1) p.set('page', page);
    setSearchParams(p, { replace: true });
  }, [cat, city, page, setSearchParams]);

  // Search handler
  const handleSearch = () => {
    const normCat = normalize(cat);
    const normCity = normalize(city);
    const res = all.filter(b => {
      if (normCat && normalize(b.category) !== normCat) return false;
      if (normCity && !normalize(b.address?.city || '').startsWith(normCity)) return false;
      return true;
    });
    setFiltered(res);
    setPage(1);
    setSearched(true);
  };

  // Pagination
  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // Suggestions
  const catSuggestions = cat.trim()
    ? ALL_CATEGORIES.filter(c => normalize(c).includes(normalize(cat)))
    : [];
  const citySuggestions = city.trim()
    ? ALL_CITIES.filter(c => normalize(c).startsWith(normalize(city)))
    : [];

  return (
    <div className="list-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

        <div className="filters-wrapper">
          {/* Category autocomplete */}
          <div className="dropdown-wrapper" ref={wrapperCatRef}>
            <input
              type="text"
              className="filter-input"
              placeholder="הקלד קטגוריה"
              value={cat}
              onFocus={() => setOpenCat(true)}
              onChange={e => { setCat(e.target.value); setOpenCat(true); }}
              disabled={loading}
            />
            {openCat && catSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {catSuggestions.map((c, i) => (
                  <li key={i} onClick={() => { setCat(c); setOpenCat(false); }}>{c}</li>
                ))}
              </ul>
            )}
          </div>

          {/* City autocomplete */}
          <div className="dropdown-wrapper" ref={wrapperCityRef}>
            <input
              type="text"
              className="filter-input"
              placeholder="הקלד עיר"
              value={city}
              onFocus={() => setOpenCity(true)}
              onChange={e => { setCity(e.target.value); setOpenCity(true); }}
              disabled={loading}
            />
            {openCity && citySuggestions.length > 0 && (
              <ul className="suggestions-list">
                {citySuggestions.map((c, i) => (
                  <li key={i} onClick={() => { setCity(c); setOpenCity(false); }}>{c}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Search button */}
          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            חפש
          </button>
        </div>

        {/* Results */}
        <div className="business-list">
          {loading
            ? Array(ITEMS_PER_PAGE).fill().map((_, i) => <BusinessCardSkeleton key={i} />)
            : !searched
              ? <p className="no-search">לחץ על חפש כדי לראות תוצאות</p>
              : (pageItems.length > 0
                  ? pageItems.map(b => (
                      <BusinessCard
                        key={b._id}
                        business={b}
                        onClick={() => navigate(`/business/${b._id}`)}
                      />
                    ))
                  : <p className="no-results">לא נמצאו עסקים</p>
                )
          }
        </div>

        {/* Pagination */}
        {!loading && searched && totalPages > 1 && (
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
