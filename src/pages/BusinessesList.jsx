// src/pages/BusinessesList.jsx
import React, { useEffect, useState } from "react";
import API from "@api";
import BusinessCard from '../components/BusinessCard';
import './BusinessList.css';
import './BusinessProfilePage.css';  // לטעינת רקע גרדיאנט

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
    <div className="profile-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>
        <div className="business-list">
          {businesses.map(business => (
            <BusinessCard key={business._id} business={business} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessesList;
