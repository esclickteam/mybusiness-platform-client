// src/pages/ProfileEdit.jsx
import React, { useState, useEffect, useRef } from 'react';
import { fetchCities } from '../data/cities'; // 👈 שימוש בפונקציה הדינמית
import './BusinessList.css'; // reuses the dropdown CSS

export default function ProfileEdit() {
  const [city, setCity] = useState('');
  const [openCity, setOpenCity] = useState(false);
  const [cities, setCities] = useState([]);       // 👈 ערים דינמיות
  const [loadingCities, setLoadingCities] = useState(true);
  const wrapperCityRef = useRef(null);

  // טעינת ערים מה־API
  useEffect(() => {
    const loadCities = async () => {
      setLoadingCities(true);
      const fetched = await fetchCities();
      setCities(fetched);
      setLoadingCities(false);
    };
    loadCities();
  }, []);

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

  const filteredCities = cities.filter(c =>
    city === '' || c.toLowerCase().includes(city.trim().toLowerCase())
  );

  return (
    <div className="profile-page">
      <form>
        <label htmlFor="city-input">עיר:</label>
        <div className="dropdown-wrapper" ref={wrapperCityRef}>
          <input
            id="city-input"
            type="text"
            className="filter-input"
            placeholder={loadingCities ? "טוען ערים..." : "עיר (לדוגמה: תל אביב)"}
            value={city}
            onFocus={() => setOpenCity(true)}
            onChange={e => { setCity(e.target.value); setOpenCity(true); }}
            disabled={loadingCities}
          />
          {openCity && !loadingCities && (
            <ul className="suggestions-list">
              {filteredCities.length > 0 ? (
                filteredCities.map((c, i) => (
                  <li
                    key={i}
                    onClick={() => { setCity(c); setOpenCity(false); }}
                  >
                    {c}
                  </li>
                ))
              ) : (
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
