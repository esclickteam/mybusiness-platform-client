import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import API from "@api";
import BusinessCard from "../components/BusinessCard";
import ALL_CATEGORIES from "../data/categories";
import { fetchCities } from "../data/cities"; // 👈 import the dynamic function
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

  const [cities, setCities]         = useState([]);   // 👈 cities from the API
  const [loadingCities, setLoadingCities] = useState(true);

  const categoryOptions = ALL_CATEGORIES.map(c => ({ value: c, label: c }));
  const cityOptions     = cities.map(c => ({ value: c, label: c })); // 👈 dynamic

  // Load cities from the API once
  useEffect(() => {
    const loadCities = async () => {
      setLoadingCities(true);
      const fetched = await fetchCities();
      setCities(fetched);

      // If there is a parameter in the URL – set it in the state if it actually exists
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

  // Fetch businesses
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

  // On any change of parameters in the URL – fetch businesses
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
    ? `${seoTitleParts.join(" - ")} | Businesses on Esclick`
    : "Business List | Esclick";

  return (
    <div className="list-page">
      <Helmet>
        <title>{seoTitle}</title>
        <meta
          name="description"
          content={
            seoTitleParts.length
              ? `Find businesses in the field of ${category ? category.label : ""} ${city ? "in the city of " + city.label : ""} on the Esclick platform.`
              : "Search for businesses by field and city on the Esclick platform."
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
        <h1>Business List</h1>

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
              placeholder="Field (e.g., Electrician)"
              isClearable
            />
          </div>

          <div className="dropdown-wrapper">
            <Select
              options={cityOptions}
              value={city}
              onChange={onCityChange}
              placeholder={loadingCities ? "Loading cities..." : "City (e.g., Tel Aviv)"}
              isClearable
              isDisabled={loadingCities}
            />
          </div>

          <button
            className="search-btn"
            onClick={() => fetchBusinesses(category && category.value, city && city.value)}
            disabled={loading}
          >
            <FaSearch /> {loading ? "Loading…" : "Search"}
          </button>
        </div>

        {loading ? (
          <p className="no-results">Loading results…</p>
        ) : businesses.length > 0 ? (
          <div className="business-list">
            {businesses.map(b => (
              <BusinessCard key={b._id} business={b} />
            ))}
          </div>
        ) : (
          <p className="no-results">No matching results</p>
        )}
      </div>
    </div>
  );
};

export default BusinessesList;
