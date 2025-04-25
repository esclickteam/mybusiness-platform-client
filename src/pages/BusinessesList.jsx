// src/pages/BusinessesList.jsx
import React, { useEffect, useState } from "react";
import API from "@api";
import BusinessProfileCard from '../components/BusinessProfileCard';

const BusinessesList = () => {
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
        {businesses.map(business => (
          <BusinessProfileCard key={business._id} business={business} />
        ))}
      </div>
    </div>
  );
};

export default BusinessesList;
