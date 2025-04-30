import React, { useEffect, useState } from "react";
import Select from "react-select";
import API from "@api";
import BusinessCard from "../components/BusinessCard";
import ALL_CATEGORIES from "../data/categories";
import ALL_CITIES     from "../data/cities";
import { ReactComponent as SearchIcon } from "../assets/icons/search.svg"; // תחליפו בנתיב שלכם
import "./BusinessList.css";

const BusinessesList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [category, setCategory]     = useState(null);
  const [city, setCity]             = useState(null);
  const [loading, setLoading]       = useState(false);

  const categoryOptions = ALL_CATEGORIES.map(c => ({ value: c, label: c }));
  const cityOptions     = ALL_CITIES    .map(c => ({ value: c, label: c }));

  const fetchBusinesses = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.city)     params.append("city", filters.city);

      const response = await API.get(`/business?${params.toString()}`);
      setBusinesses(response.data.businesses || []);
    } catch (err) {
      console.error(err);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleSearch = () => {
    fetchBusinesses({
      category: category?.value,
      city:     city?.value,
    });
  };

  return (
    <div className="list-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

        {/* 1. Filter Chips */}
        {(category || city) && (
          <div className="filter-chips">
            {category && (
              <div className="chip">
                <span>{category.label}</span>
                <button onClick={() => setCategory(null)}>×</button>
              </div>
            )}
            {city && (
              <div className="chip">
                <span>{city.label}</span>
                <button onClick={() => setCity(null)}>×</button>
              </div>
            )}
          </div>
        )}

        {/* 2. שורת החיפוש */}
        <div className="filters-wrapper">
          {/* כפתור חיפוש ראשון לפי RTL */}
          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            <SearchIcon className="search-btn__icon" />
            {loading ? "טוען…" : "חפש"}
          </button>

          {/* dropdown עיר */}
          <div className="dropdown-wrapper">
            <Select
              options={cityOptions}
              value={city}
              onChange={setCity}
              placeholder="עיר (לדוגמה: תל אביב)"
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* dropdown תחום */}
          <div className="dropdown-wrapper">
            <Select
              options={categoryOptions}
              value={category}
              onChange={setCategory}
              placeholder="תחום (לדוגמה: חשמלאי)"
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        {/* 3. תוצאות */}
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
