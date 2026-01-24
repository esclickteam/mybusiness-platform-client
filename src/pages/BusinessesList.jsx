import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import API from "@api";
import BusinessCard from "../components/BusinessCard";
import ALL_CATEGORIES from "../data/categories";
import { fetchCities } from "../data/cities";
import { Helmet } from "react-helmet-async";
import "./BusinessList.css";

/* 🧠 Debounce */
const debounce = (fn, delay = 400) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

export default function BusinessesList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category") || "";
  const cityParam = searchParams.get("city") || "";

  const [businesses, setBusinesses] = useState([]);
  const [category, setCategory] = useState(null);
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  const categoryOptions = ALL_CATEGORIES.map(c => ({ value: c, label: c }));
  const cityOptions = cities.map(c => ({ value: c, label: c }));

  /* ================= Cities ================= */
  useEffect(() => {
    (async () => {
      setLoadingCities(true);
      const fetched = await fetchCities();
      setCities(fetched);

      if (categoryParam && ALL_CATEGORIES.includes(categoryParam)) {
        setCategory({ value: categoryParam, label: categoryParam });
      }
      if (cityParam && fetched.includes(cityParam)) {
        setCity({ value: cityParam, label: cityParam });
      }
      setLoadingCities(false);
    })();
  }, [categoryParam, cityParam]);

  /* ================= Fetch ================= */
  const fetchBusinesses = async (cat, city) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat) params.append("category", cat);
      if (city) params.append("city", city);

      const res = await API.get(`/business?${params.toString()}`);
      setBusinesses(res.data.businesses || []);
    } catch {
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce(fetchBusinesses),
    []
  );

  useEffect(() => {
    debouncedFetch(categoryParam, cityParam);
  }, [categoryParam, cityParam]);

  /* ================= Handlers ================= */
  const updateParam = (key, value) => {
    value ? searchParams.set(key, value) : searchParams.delete(key);
    setSearchParams(searchParams, { replace: true });
  };

  /* ================= SEO ================= */
  const seoTitle = [
    category?.label,
    city?.label,
  ].filter(Boolean).join(" · ") || "Businesses on Esklik";

  return (
    <div className="list-page">
      <Helmet>
        <title>{seoTitle}</title>
      </Helmet>

      {/* 🔍 Filters */}
      <div className="filters-sticky">
        <h1>Find a Business</h1>

        <div className="filters-row">
          <Select
            options={categoryOptions}
            value={category}
            onChange={opt => {
              setCategory(opt);
              updateParam("category", opt?.value);
            }}
            placeholder="Category"
            isClearable
          />

          <Select
            options={cityOptions}
            value={city}
            onChange={opt => {
              setCity(opt);
              updateParam("city", opt?.value);
            }}
            placeholder={loadingCities ? "Loading cities…" : "City"}
            isClearable
            isDisabled={loadingCities}
          />
        </div>
      </div>

      {/* 🧾 Results */}
      <div className="results-area">
        {loading ? (
          <div className="skeleton-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : businesses.length ? (
          <div className="business-list">
            {businesses.map(b => (
              <BusinessCard key={b._id} business={b} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No businesses found</h3>
            <p>Try changing the category or city</p>
          </div>
        )}
      </div>
    </div>
  );
}
