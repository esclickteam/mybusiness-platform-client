// src/pages/SearchBusinesses.jsx
import React, { useState, useEffect } from 'react';
import API from '@api';
import { Link } from 'react-router-dom';

const SearchBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await API.get('/api/business');
        setBusinesses(response.data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div>
      <h1>רשימת עסקים</h1>
      <div className="business-list">
        {businesses.map((business) => (
          <div key={business._id} className="business-item">
            <Link to={`/business/${business._id}`}>
              <h2>{business.name}</h2>
            </Link>
            <p>{business.description}</p>
            <p>טלפון: {business.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBusinesses;
