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
          <BusinessCard
            key={business._id}
            business={business}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchBusinesses;
