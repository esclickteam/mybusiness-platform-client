import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import API from "@api";
import BusinessCard from "../components/BusinessCard";
import ALL_CATEGORIES from "../data/categories";
import { fetchCities } from "../data/cities"; // 👈 יבוא הפונקציה הדינמית
import { FaSearch } from "react-icons/fa";
import { Helmet } from "react-helmet";
import "./BusinessList.css";

const BusinessesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const cityParam     = searchParams.get("city")     || "";

  const [businesses, setBusinesses] = useState([]);
  const [category, setCategory]     = useState(null);
  const [city, setCity]             = useState(null);
  const [loading, setLoading]       = useState(false);

  const [cities, setCities]         = useState([]);   // 👈 ערים מה-API
  const [loadingCities, setLoadingCities] = useState(true);

  const categoryOptions = ALL_CATEGORIES.map(c => ({ value: c, label: c }));
  const cityOptions     = cities.map(c => ({ value: c, label: c })); // 👈 דינמי

  // טען ערים מה־API פעם אחת
  useEffect(() => {
    const loadCities = async () => {
      setLoadingCities(true);
      const fetched = await fetchCities();
      setCities(fetched);

      // אם יש פרמטר ב־URL – שים אותו ב־state אם הוא קיים באמת
      if (categoryParam && ALL_CATEGORIES.includes(categoryParam)) {
        setCategory({ value: categoryParam, label: categoryParam });
      }
      if (cityParam && fetched.includes(cityParam)) {
        setCity({ value: cityParam, label: cityParam });
      }
      setLoadingCities(false);
    };
    loadCities();
  }, [categoryParam, cityParam]);

  // קריאה לעסקים
  const fetchBusinesses = async (cat, city) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat)  params.append("category", cat);
      if (city) params.append("city", city);
      const response = await API.get(`/business?${params.toString()}`);
      setBusinesses(response.data.businesses || []);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  // בכל שינוי פרמטרים ב־URL – שלוף עסקים
  useEffect(() => {
    fetchBusinesses(categoryParam, cityParam);
  }, [categoryParam, cityParam]);

  const onCategoryChange = opt => {
    setCategory(opt);
    if (opt) searchParams.set("category", opt.value);
    else     searchParams.delete("category");
    setSearchParams(searchParams, { replace: true });
  };

  const onCityChange = opt => {
    setCity(opt);
    if (opt) searchParams.set("city", opt.value);
    else     searchParams.delete("city");
    setSearchParams(searchParams, { replace: true });
  };

  const seoTitleParts = [];
  if (category) seoTitleParts.push(category.label);
  if (city)     seoTitleParts.push(city.label);
  const seoTitle = seoTitleParts.length
    ? `${seoTitleParts.join(" - ")} | עסקים בעסקליק`
    : "רשימת עסקים | עסקליק";

  return (
    <div className="list-page">
      <Helmet>
        <title>{seoTitle}</title>
        <meta
          name="description"
          content={
            seoTitleParts.length
              ? `מצא עסקים בתחום ${category ? category.label : ""} ${city ? "בעיר " + city.label : ""} בפלטפורמת עסקליק.`
              : "חפש עסקים לפי תחום ועיר בפלטפורמת עסקליק."
          }
        />
        <link
          rel="canonical"
          href={`https://yourdomain.co.il/businesses${
            category ? `?category=${category.value}` : ""
          }${city ? `&city=${city.value}` : ""}`}
        />
      </Helmet>

      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

        {(category || city) && (
          <div className="filter-chips">
            {category && (
              <div className="chip">
                <span>{category.label}</span>
                <button onClick={() => onCategoryChange(null)}>×</button>
              </div>
            )}
            {city && (
              <div className="chip">
                <span>{city.label}</span>
                <button onClick={() => onCityChange(null)}>×</button>
              </div>
            )}
          </div>
        )}

        <div className="filters-wrapper">
          <div className="dropdown-wrapper">
            <Select
              options={categoryOptions}
              value={category}
              onChange={onCategoryChange}
              placeholder="תחום (לדוגמה: חשמלאי)"
              isClearable
            />
          </div>

          <div className="dropdown-wrapper">
            <Select
              options={cityOptions}
              value={city}
              onChange={onCityChange}
              placeholder={loadingCities ? "טוען ערים..." : "עיר (לדוגמה: תל אביב)"}
              isClearable
              isDisabled={loadingCities}
            />
          </div>

          <button
            className="search-btn"
            onClick={() => fetchBusinesses(category && category.value, city && city.value)}
            disabled={loading}
          >
            <FaSearch /> {loading ? "טוען…" : "חפש"}
          </button>
        </div>

        {loading ? (
          <p className="no-results">טוען תוצאות…</p>
        ) : businesses.length > 0 ? (
          <div className="business-list">
            {businesses.map(b => (
              <BusinessCard key={b._id} business={b} />
            ))}
          </div>
        ) : (
          <p className="no-results">אין תוצאות מתאימות</p>
        )}
      </div>
    </div>
  );
};

export default BusinessesList;
