// src/pages/ProfileEdit.jsx
import React, { useState, useEffect, useRef } from 'react';
import ALL_CITIES from '../data/cities';
import './BusinessList.css'; // reuses the dropdown CSS

export default function ProfileEdit() {
  const [city, setCity] = useState('');
  const [openCity, setOpenCity] = useState(false);
  const wrapperCityRef = useRef(null);

  // סגירת dropdown בלחיצה מחוץ
  useEffect(() => {
    const handler = e => {
      if (wrapperCityRef.current && !wrapperCityRef.current.contains(e.target)) {
        setOpenCity(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="profile-page">
      <form>
        <label htmlFor="city-input">עיר:</label>
        <div className="dropdown-wrapper" ref={wrapperCityRef}>
          <input
            id="city-input"
            type="text"
            className="filter-input"
            placeholder="עיר (לדוגמה: תל אביב)"
            value={city}
            onFocus={() => setOpenCity(true)}
            onChange={e => { setCity(e.target.value); setOpenCity(true); }}
          />
          {openCity && (
            <ul className="suggestions-list">
              {ALL_CITIES
                .filter(c =>
                  city === '' || c.toLowerCase().includes(city.trim().toLowerCase())
                )
                .map((c, i) => (
                  <li key={i} onClick={() => { setCity(c); setOpenCity(false); }}>
                    {c === 'כל הערים' ? <em>{c}</em> : c}
                  </li>
                ))
              }
              {ALL_CITIES.filter(c =>
                city === '' || c.toLowerCase().includes(city.trim().toLowerCase())
              ).length === 0 && (
                <li className="no-match">אין ערים מתאימות</li>
              )}
            </ul>
          )}
        </div>
        {/* שדות נוספים של עמוד העריכה */}
        <button type="submit">שמירה</button>
      </form>
    </div>
  );
}
