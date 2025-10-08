```javascript
// src/pages/ProfileEdit.jsx
import React, { useState, useEffect, useRef } from 'react';
import { fetchCities } from '../data/cities'; // 👈 Using the dynamic function
import './BusinessList.css'; // reuses the dropdown CSS

export default function ProfileEdit() {
  const [city, setCity] = useState('');
  const [openCity, setOpenCity] = useState(false);
  const [cities, setCities] = useState([]);       // 👈 Dynamic cities
  const [loadingCities, setLoadingCities] = useState(true);
  const wrapperCityRef = useRef(null);

  // Loading cities from the API
  useEffect(() => {
    const loadCities = async () => {
      setLoadingCities(true);
      const fetched = await fetchCities();
      setCities(fetched);
      setLoadingCities(false);
    };
    loadCities();
  }, []);

  // Closing dropdown on outside click
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
        <label htmlFor="city-input">City:</label>
        <div className="dropdown-wrapper" ref={wrapperCityRef}>
          <input
            id="city-input"
            type="text"
            className="filter-input"
            placeholder={loadingCities ? "Loading cities..." : "City (e.g., Tel Aviv)"}
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
                <li className="no-match">No matching cities</li>
              )}
            </ul>
          )}
        </div>
        {/* Additional fields for the edit page */}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
```