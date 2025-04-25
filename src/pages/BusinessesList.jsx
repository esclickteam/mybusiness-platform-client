// src/pages/BusinessesList.jsx
import React, { useEffect, useState } from 'react';
import API from '@api';  // אם יש לך API שהגדרת קודם

const BusinessesList = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await API.get('/api/business');  // פנייה לשרת לשם שליפת כל העסקים
        setBusinesses(response.data); // שמירה ב-state
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, []);

  if (businesses.length === 0) return <div>אין עסקים זמינים להציג</div>;

  return (
    <div className="businesses-list">
      <h1>רשימת העסקים</h1>
      <ul>
        {businesses.map((business) => (
          <li key={business._id}>
            <h2>{business.name}</h2>
            <p>{business.description}</p>
            <p>טלפון: {business.phone}</p>
            <a href={`/business/${business._id}`}>לפרופיל העסק</a> {/* קישור לפרופיל של כל עסק */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusinessesList;
