// src/pages/SearchBusinesses.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '@api';
import BusinessCard from '../components/BusinessCard';
import './BusinessList.css';

const CATEGORIES = [
  'כל הקטגוריות',
  'אולם אירועים',
  'אינסטלטור',
  /* ... */
];
const ITEMS_PER_PAGE = 9;

function normalizeCity(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0591-\u05C7]/g, '')
    .replace(/[-'" ]+/g, '')
    .trim()
    .toLowerCase();
}

// Hebrew letters A-T for filtering
const HEBREW_LETTERS = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת'];

export default function SearchBusinesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [all, setAll] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searched, setSearched] = useState(false);

  // category
  const catParam = searchParams.get('category') || '';
  const [cat, setCat] = useState(catParam);
  const [openCat, setOpenCat] = useState(false);
  const wrapperCatRef = useRef(null);

  // city & dynamic list
  const cityParam = searchParams.get('city') || '';
  const [city, setCity] = useState(cityParam);
  const [cities, setCities] = useState([]);
  const [openCity, setOpenCity] = useState(false);
  const wrapperCityRef = useRef(null);

  // filter by letter
  const [filterLetter, setFilterLetter] = useState('');

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // load businesses and extract cities
  useEffect(() => {
    API.get('/business')
      .then(r => {
        const list = r.data.businesses || [];
        setAll(list);
        const dynamicCities = Array.from(
          new Set(
            list.map(b => b.address?.city?.trim() || '').filter(c => c)
          )
        ).sort((a,b) => a.localeCompare(b,'he'));
        setCities(dynamicCities);
      })
      .catch(console.error);
  }, []);

  // close dropdowns
  useEffect(() => {
    const handler = e => {
      if (wrapperCatRef.current && !wrapperCatRef.current.contains(e.target)) setOpenCat(false);
      if (wrapperCityRef.current && !wrapperCityRef.current.contains(e.target)) setOpenCity(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // update URL params
  useEffect(() => {
    const p = new URLSearchParams();
    if (cat) p.set('category', cat);
    if (city) p.set('city', city);
    if (page > 1) p.set('page', page);
    setSearchParams(p, { replace: true });
  }, [cat, city, page]);

  // search
  const handleSearch = () => {
    const normCity = normalizeCity(city);
    const res = all.filter(b => {
      if (cat && cat !== 'כל הקטגוריות' && b.category !== cat) return false;
      if (filterLetter) {
        // starts with selected letter
        return normalizeCity(b.address?.city || '').startsWith(normalizeCity(filterLetter));
      }
      if (normCity) {
        return normalizeCity(b.address?.city || '') === normCity;
      }
      return true;
    });
    setFiltered(res);
    setPage(1);
    setSearched(true);
  };

  // pagination
  const start = (page-1)*ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start+ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length/ITEMS_PER_PAGE);

  return (
    <div className="list-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

        <div className="filters">
          {/* category dropdown */}
          <div className="dropdown-wrapper" ref={wrapperCatRef}>
            <button className="filter-button" onClick={()=>setOpenCat(o=>!o)}>
              {cat||'בחר קטגוריה'} <span className="chevron">▾</span>
            </button>
            {openCat && (
              <ul className="suggestions-list">
                {CATEGORIES.map((c,i)=>(
                  <li key={i} onClick={()=>{setCat(c);setOpenCat(false)}}>{c}</li>
                ))}
              </ul>
            )}
          </div>

          {/* letter filter */}
          <div className="letter-filter">
            {HEBREW_LETTERS.map(letter => (
              <button
                key={letter}
                className={filterLetter===letter?'active-letter':''}
                onClick={()=>{ setFilterLetter(letter); setCity(''); setOpenCity(false); }}
              >{letter}</button>
            ))}
            <button className={!filterLetter?'active-letter':''} onClick={()=>setFilterLetter('')}>הכל</button>
          </div>

          {/* city input/autocomplete */}
          <div className="dropdown-wrapper" ref={wrapperCityRef}>
            <input
              type="text"
              className="filter-input"
              placeholder="הקלד עיר לחיפוש"
              value={city}
              onFocus={()=>{setOpenCity(true); setFilterLetter('');}}
              onChange={e=>{ setCity(e.target.value); setFilterLetter(''); setOpenCity(true); }}
              disabled={Boolean(filterLetter)}
            />
            {openCity && city.trim().length>0 && (
              <ul className="suggestions-list">
                {cities
                  .filter(c=>normalizeCity(c).includes(normalizeCity(city)))
                  .map((c,i)=>(<li key={i} onClick={()=>{setCity(c);setOpenCity(false)}}>{c}</li>))}
              </ul>
            )}
          </div>

          <button className="filter-button search-btn" onClick={handleSearch}>חפש</button>
        </div>

        <div className="business-list">
          {!searched && <p className="no-search">לחץ על חפש כדי לראות תוצאות</p>}
          {searched && (pageItems.length>0 ? (
            pageItems.map(b=>(<BusinessCard key={b._id} business={b} onClick={()=>navigate(`/business/${b._id}`)}/>))
          ):(<p className="no-results">לא נמצאו עסקים</p>))}
        </div>

        {searched && totalPages>1 && (
          <div className="pagination">
            <button onClick={()=>setPage(p=>Math.max(p-1,1))} disabled={page===1}>הקודם</button>
            <span>{page} מתוך {totalPages}</span>
            <button onClick={()=>setPage(p=>Math.min(p+1,totalPages))} disabled={page===totalPages}>הבא</button>
          </div>
        )}
      </div>
    </div>
  );
}
