// src/pages/BusinessesList.jsx
import React, { useEffect, useState } from "react";
import API from "@api"; // או אם אתה משתמש ב-fetch
import { Link } from "react-router-dom";

const BusinessesList = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await API.get("/api/business"); // שליפת כל העסקים
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
      <div>
        {businesses.map((business) => (
          <div key={business._id}>
            <h2>{business.name}</h2>
            <p>{business.description}</p>
            <Link to={`/business/${business._id}`}>ראה את פרופיל העסק</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessesList;
