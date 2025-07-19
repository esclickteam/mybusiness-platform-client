import React, { useEffect, useState } from "react";
import Select from "react-select";
import API from "@api";
import BusinessCard from "../components/BusinessCard";
import ALL_CATEGORIES from "../data/categories";
import ALL_CITIES from "../data/cities";
import { FaSearch } from "react-icons/fa";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import "./BusinessList.css";

const BusinessesList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState([]);
  const [category, setCategory] = useState(null);
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const categoryOptions = ALL_CATEGORIES.map((c) => ({ value: c, label: c }));
  const cityOptions = ALL_CITIES.map((c) => ({ value: c, label: c }));

  const fetchBusinesses = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.city) params.append("city", filters.city);

      const response = await API.get(`/business?${params.toString()}`);
      setBusinesses(response.data.businesses || []);
    } catch (err) {
      console.error("שגיאה בקבלת עסקים:", err);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  // שלב ראשון: אתחול הסטייטים מה-URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const categoryParam = query.get("category");
    const cityParam = query.get("city");

    if (categoryParam) {
      const catOption = categoryOptions.find((o) => o.value === categoryParam);
      setCategory(catOption || null);
    }
    if (cityParam) {
      const cityOption = cityOptions.find((o) => o.value === cityParam);
      setCity(cityOption || null);
    }
    setInitialized(true); // סמן שהאתחול בוצע
  }, [location.search]);

  // שלב שני: חיפוש רק אחרי שהסטייטים מאותחלים
  useEffect(() => {
    if (!initialized) return; // לא להפעיל חיפוש לפני האתחול

    fetchBusinesses({
      category: category ? category.value : null,
      city: city ? city.value : null,
    });

    // עדכון ה-URL בהתאם
    const params = new URLSearchParams();
    if (category) params.set("category", category.value);
    if (city) params.set("city", city.value);
    navigate({ search: params.toString() }, { replace: true });
  }, [category, city, initialized, navigate]);

  const handleSearch = () => {
    // הכפתור יכול להשאר כדי לאפשר חיפוש ידני,
    // אבל בפועל החיפוש מתבצע אוטומטית ב-useEffect
  };

  const seoTitleParts = [];
  if (category) seoTitleParts.push(category.label);
  if (city) seoTitleParts.push(city.label);
  const seoTitle =
    seoTitleParts.length > 0
      ? `${seoTitleParts.join(" - ")} | עסקים בעסקליק`
      : "רשימת עסקים | עסקליק";

  const seoDescription =
    seoTitleParts.length > 0
      ? `מצא עסקים בתחום ${category ? category.label : ""} ${
          city ? "בעיר " + city.label : ""
        } בפלטפורמת עסקליק. חיפוש נוח, דירוגים אמיתיים, וקבלת פניות מהירות.`
      : "חפש עסקים לפי תחום ועיר בפלטפורמת עסקליק. קבל פניות, קרא חוות דעת ותאם שירות בקלות.";

  return (
    <div className="list-page">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta
          name="keywords"
          content={`עסקים, חיפוש עסקים, ${
            category ? category.label + "," : ""
          } ${city ? city.label + "," : ""} עסקליק, לקוחות, שירותים`}
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

        <div className="filters-wrapper">
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

          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            <FaSearch className="search-btn__icon" />
            {loading ? "טוען…" : "חפש"}
          </button>
        </div>

        {loading ? (
          <p className="no-results">טוען תוצאות…</p>
        ) : businesses.length > 0 ? (
          <div className="business-list">
            {businesses.map((b) => (
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
