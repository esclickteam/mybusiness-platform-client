// src/pages/BusinessesList.jsx
import React, { useEffect, useState } from "react";
import API from "@api";
import BusinessCard from "../components/BusinessCard";
import "./BusinessList.css";

const BusinessesList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  // מביא את כל העסקים או לפי פרמטרים
  const fetchBusinesses = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.city)     params.append("city", filters.city);

      const response = await API.get(`/business?${params.toString()}`);
      setBusinesses(response.data.businesses || []);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  // ברגע שהעמוד נטען, מושכים את כל העסקים
  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleSearch = () => {
    fetchBusinesses({ category, city });
  };

  return (
    <div className="list-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

        {/* שדות חיפוש */}
        <input
          className="search-input"
          type="text"
          placeholder="קטגוריה (למשל: איפור קבוע)"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        <input
          className="search-input"
          type="text"
          placeholder="עיר (למשל: קרית אתא)"
          value={city}
          onChange={e => setCity(e.target.value)}
        />

        <button
          className="search-btn"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "טוען…" : "חפש"}
        </button>

        {/* תוצאות */}
        {loading ? (
          <p className="no-results">טוען תוצאות…</p>
        ) : businesses.length > 0 ? (
          <div className="business-list">
            {businesses.map(b => (
              <BusinessCard key={b._id} business={b} />
            ))}
          </div>
        ) : (
          <p className="no-results">לחץ על חפש כדי לראות תוצאות</p>
        )}
      </div>
    </div>
  );
};

export default BusinessesList;
