import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '@api';
import BusinessCard from '../components/BusinessCard';
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

  // selectors
  const catParam = searchParams.get('category') || '';
  const [cat, setCat] = useState(catParam);
  const cityParam = searchParams.get('city') || '';
  const [city, setCity] = useState(cityParam);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // fetch data
  useEffect(() => {
    API.get('/business')
      .then(r => setAll(r.data.businesses || []))
      .catch(console.error);
  }, []);

  // sync URL params
  useEffect(() => {
    const p = new URLSearchParams();
    if (cat) p.set('category', cat);
    if (city) p.set('city', city);
    if (page > 1) p.set('page', page);
    setSearchParams(p, { replace: true });
  }, [cat, city, page, setSearchParams]);

  // handle search
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

  // pagination
  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <div className="list-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

        <div className="filters-wrapper">
          {/* Search button */}
          <button className="search-btn" onClick={handleSearch}>
            <span>חפש</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="search-btn__icon" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>

          {/* City selector */}
          <div className="select-wrapper">
            <select value={city} onChange={e => setCity(e.target.value)}>
              <option value="" disabled>עיר (לדוגמא: תל אביב)</option>
              {ALL_CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" className="select-icon" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>

          {/* Category selector */}
          <div className="select-wrapper">
            <select value={cat} onChange={e => setCat(e.target.value)}>
              <option value="" disabled>תחום (לדוגמא: חשמלאי)</option>
              {ALL_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" className="select-icon" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>

        <div className="business-list">
          {!searched && <p className="no-search">לחץ על חפש כדי לראות תוצאות</p>}
          {searched && (
            pageItems.length > 0 ? (
              pageItems.map(b => (
                <BusinessCard
                  key={b._id}
                  business={b}
                  onClick={() => navigate(`/business/${b._id}`)}
                />
              ))
            ) : (
              <p className="no-results">לא נמצאו עסקים</p>
            )
          )}
        </div>

        {searched && totalPages > 1 && (
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
