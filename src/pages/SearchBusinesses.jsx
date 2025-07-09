import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '@api';
import BusinessCard from '../components/BusinessCard';
import BusinessCardSkeleton from '../components/BusinessCardSkeleton';
import ALL_CATEGORIES from '../data/categories';
import ALL_CITIES from '../data/cities';
import { Helmet } from 'react-helmet';
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

  useEffect(() => {
    API.get('/business')
      .then(r => {
        setAll(r.data.businesses || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handler = e => {
      if (wrapperCatRef.current && !wrapperCatRef.current.contains(e.target)) setOpenCat(false);
      if (wrapperCityRef.current && !wrapperCityRef.current.contains(e.target)) setOpenCity(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    if (city) params.set('city', city);
    if (page > 1) params.set('page', page);
    setSearchParams(params, { replace: true });
  }, [cat, city, page, setSearchParams]);

  const handleSearch = () => {
    const normCat = normalize(cat);
    const normCity = normalize(city);
    const result = all.filter(b => {
      if (normCat && normalize(b.category) !== normCat) return false;
      if (normCity && !normalize(b.address?.city || '').startsWith(normCity)) return false;
      return true;
    });
    setFiltered(result);
    setPage(1);
    setSearched(true);
  };

  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const catSuggestions = cat.trim()
    ? ALL_CATEGORIES.filter(c => normalize(c).includes(normalize(cat)))
    : [];
  const citySuggestions = city.trim()
    ? ALL_CITIES.filter(c => normalize(c).startsWith(normalize(city)))
    : [];

  // SEO דינמי
  const seoTitleParts = [];
  if (cat) seoTitleParts.push(cat);
  if (city) seoTitleParts.push(city);
  const seoTitle =
    seoTitleParts.length > 0
      ? `${seoTitleParts.join(" - ")} | חיפוש עסקים - עסקליק`
      : "חיפוש עסקים | עסקליק";

  const seoDescription =
    seoTitleParts.length > 0
      ? `מצא עסקים בתחום ${cat ? cat : ""} ${city ? "בעיר " + city : ""} בפלטפורמת עסקליק. חיפוש נוח, דירוגים אמיתיים, וקבלת פניות מהירות.`
      : "חפש עסקים לפי תחום ועיר בפלטפורמת עסקליק. קבל פניות, קרא חוות דעת ותאם שירות בקלות.";

  return (
    <div className="list-page">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta
          name="keywords"
          content={`עסקים, חיפוש עסקים, ${cat ? cat + "," : ""} ${
            city ? city + "," : ""
          } עסקליק, לקוחות, שירותים`}
        />
        <link
          rel="canonical"
          href={`https://yourdomain.co.il/search?category=${encodeURIComponent(cat)}&city=${encodeURIComponent(city)}${page > 1 ? `&page=${page}` : ''}`}
        />
      </Helmet>

      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

        {(cat || city) && (
          <div className="filter-chips">
            {cat && (
              <div className="chip">
                <span>{cat}</span>
                <button onClick={() => { setCat(''); setSearched(false); }}>×</button>
              </div>
            )}
            {city && (
              <div className="chip">
                <span>{city}</span>
                <button onClick={() => { setCity(''); setSearched(false); }}>×</button>
              </div>
            )}
          </div>
        )}

        <div className="filters-wrapper">
          <div className="dropdown-wrapper input-clearable" ref={wrapperCatRef}>
            <input
              type="text"
              className="filter-input"
              placeholder="תחום (לדוגמא: חשמלאי)"
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

          <div className="dropdown-wrapper input-clearable" ref={wrapperCityRef}>
            <input
              type="text"
              className="filter-input"
              placeholder="עיר (לדוגמא: תל אביב)"
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

          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            <span>חפש</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="search-btn__icon"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        <div className="business-list">
          {loading
            ? Array(ITEMS_PER_PAGE).fill().map((_, i) => <BusinessCardSkeleton key={i} />)
            : !searched
              ? <p className="no-search">לחץ על חפש כדי לראות תוצאות</p>
              : pageItems.length > 0
                ? pageItems.map(b => (
                    <BusinessCard
                      key={b._id}
                      business={b}
                      onClick={() => navigate(`/business/${b._id}`)}
                    />
                  ))
                : <p className="no-results">לא נמצאו עסקים</p>
          }
        </div>

        {searched && totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>
              הקודם
            </button>
            <span>{page} מתוך {totalPages}</span>
            <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
              הבא
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
