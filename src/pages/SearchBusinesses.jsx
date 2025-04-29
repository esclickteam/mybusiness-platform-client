// src/pages/SearchBusinesses.jsx
import React, { useState, useEffect } from 'react';
import API from '@api';
import BusinessCard from '../components/BusinessCard';
import './BusinessList.css';

const SearchBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await API.get('/business');
        setBusinesses(response.data.businesses || []); // ← חשוב! לקחת רק את המערך
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div className="list-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>
        <div className="business-list">
          {businesses.length > 0 ? (
            businesses.map((business) => (
              <BusinessCard
                key={business._id}
                business={business}
              />
            ))
          ) : (
            <p>לא נמצאו עסקים להצגה.</p> // הודעה יפה כשאין
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBusinesses;
