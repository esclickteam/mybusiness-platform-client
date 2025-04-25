// src/pages/BusinessProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '@api';

const BusinessProfilePage = () => {
  const { businessId } = useParams(); // מקבלים את ה-businessId מה-URL
  const [businessData, setBusinessData] = useState(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await API.get(`/business/${businessId}`);
        setBusinessData(response.data); // שומרים את המידע של העסק במצב
      } catch (error) {
        console.error('Error fetching business data:', error);
      }
    };

    fetchBusinessData();
  }, [businessId]);

  if (!businessData) return <div>טוען...</div>;

  return (
    <div className="business-profile">
      <h1>{businessData.name}</h1>
      <p>{businessData.description}</p>
      <p>טלפון: {businessData.phone}</p>
      {/* תוכל להוסיף עוד פרטים על העסק */}
    </div>
  );
};

export default BusinessProfilePage;
