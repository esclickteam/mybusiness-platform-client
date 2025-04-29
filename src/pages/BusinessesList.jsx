import React, { useEffect, useState } from "react";
import API from "@api";
import BusinessCard from "../components/BusinessCard";
import "./BusinessList.css";

const BusinessesList = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await API.get("/business");
        setBusinesses(response.data.businesses || []); // ← תיקון כאן
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
          {businesses.map((b) => (
            <BusinessCard key={b._id} business={b} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessesList;
