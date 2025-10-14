import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "@api";
import BusinessCard from "../components/BusinessCard";
import BusinessCardSkeleton from "../components/BusinessCardSkeleton";
import ALL_CATEGORIES from "../data/categories";
import { fetchCities } from "../data/cities";
import CityAutocomplete from "@components/CityAutocomplete";
import Select from "react-select";
import { Helmet } from "react-helmet-async";
import "./BusinessList.css";

const ITEMS_PER_PAGE = 9;
const DEBOUNCE_DELAY = 600; // 0.6 שניות

function normalize(str) {
  return str
    ?.normalize("NFD")
    ?.replace(/[\u0591-\u05C7]/g, "")
    ?.replace(/[-'" ]+/g, "")
    ?.trim()
    ?.toLowerCase();
}

export default function SearchBusinesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [all, setAll] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const [cat, setCat] = useState(searchParams.get("category") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const categoryOptions = ALL_CATEGORIES.map((c) => ({ value: c, label: c }));

  /* Load all businesses */
  useEffect(() => {
    API.get("/business")
      .then((r) => {
        setAll(r.data.businesses || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  /* Load cities (with cache) */
  useEffect(() => {
    const loadCities = async () => {
      const cache = localStorage.getItem("allCities");
      if (cache) {
        setCities(JSON.parse(cache));
        setLoadingCities(false);
        return;
      }
      const fetched = await fetchCities();
      setCities(fetched);
      setLoadingCities(false);
      localStorage.setItem("allCities", JSON.stringify(fetched));
    };
    loadCities();
  }, []);

  /* Update URL when filters change */
  useEffect(() => {
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (city) params.set("city", city);
    if (page > 1) params.set("page", page);
    setSearchParams(params, { replace: true });
  }, [cat, city, page, setSearchParams]);

  /* Debounced Auto-Search */
  const handleSearch = useCallback(() => {
    if (!all.length) return;
    setSearching(true);
    const normCat = normalize(cat);
    const normCity = normalize(city);
    const result = all.filter((b) => {
      if (normCat && !normalize(b.category).includes(normCat)) return false;
      if (normCity && !normalize(b.address?.city || "").startsWith(normCity))
        return false;
      return true;
    });
    setFiltered(result);
    setSearched(true);
    setTimeout(() => setSearching(false), 300);
  }, [all, cat, city]);

  useEffect(() => {
    const timeout = setTimeout(() => handleSearch(), DEBOUNCE_DELAY);
    return () => clearTimeout(timeout);
  }, [cat, city, handleSearch]);

  /* Pagination */
  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  /* SEO meta */
  const seoTitle =
    cat || city
      ? `${cat || ""}${cat && city ? " – " : ""}${city || ""} | Search | Bizuply`
      : "Business Search | Bizuply";

  return (
    <div className="list-page">
      <Helmet>
        <title>{seoTitle}</title>
      </Helmet>

      <div className="business-list-container">
        <h1>Find Businesses</h1>

        {/* 🔍 Filters */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          {/* 🏙 City */}
          <div style={{ width: "250px" }}>
            <CityAutocomplete
              value={city}
              onChange={(val) => setCity(val)}
              placeholder="City (United States)"
              disabled={loadingCities}
            />
          </div>

          {/* 💼 Category */}
          <div style={{ width: "250px" }}>
            <Select
              options={categoryOptions}
              value={categoryOptions.find((o) => o.value === cat) || null}
              onChange={(opt) => setCat(opt ? opt.value : "")}
              placeholder="Profession (e.g., Electrician)"
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "10px",
                  borderColor: "#a855f7",
                  boxShadow: "none",
                  ":hover": { borderColor: "#6a11cb" },
                }),
              }}
            />
          </div>
        </div>

        {/* 🧩 Results */}
        <div className="business-list">
          {loading || searching ? (
            Array(ITEMS_PER_PAGE)
              .fill()
              .map((_, i) => <BusinessCardSkeleton key={i} />)
          ) : !searched ? (
            <p className="no-search">Start typing to see results 👇</p>
          ) : pageItems.length > 0 ? (
            pageItems.map((b) => (
              <BusinessCard
                key={b._id}
                business={b}
                onClick={() => navigate(`/business/${b._id}`)}
              />
            ))
          ) : (
            <p className="no-results">
              No businesses found {city && `in ${city}`}{" "}
              {cat && `for ${cat.toLowerCase()}`} yet.
            </p>
          )}
        </div>

        {/* ⏩ Pagination */}
        {searched && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
