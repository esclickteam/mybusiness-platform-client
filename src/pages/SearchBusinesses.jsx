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

/* ================= Config ================= */
const ITEMS_PER_PAGE = 9;
const DEBOUNCE_DELAY = 600;

/* ================= Helpers ================= */
function normalize(str) {
  return str
    ?.normalize("NFD")
    ?.replace(/[\u0591-\u05C7]/g, "")
    ?.replace(/[-'" ]+/g, "")
    ?.trim()
    ?.toLowerCase();
}

function getBusinessName(b) {
  return (
    b.name ||
    b.businessName ||
    b.title ||
    b.displayName ||
    b.ownerName ||
    ""
  );
}


/* ================= Component ================= */
export default function SearchBusinesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  /* ===== Raw Data ===== */
  const [all, setAll] = useState([]);

  /* ===== Results ===== */
  const [filtered, setFiltered] = useState([]);

  /* ===== UI ===== */
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  /* ===== Filters ===== */
  const [name, setName] = useState(searchParams.get("name") || "");
  const [cat, setCat] = useState(searchParams.get("category") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  /* ===== Cities ===== */
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  const categoryOptions = ALL_CATEGORIES.map(c => ({
    value: c,
    label: c,
  }));

  /* ================= Load Businesses (once) ================= */
  useEffect(() => {
    let mounted = true;

    API.get("/business")
      .then(res => {
        if (!mounted) return;
        const businesses = Array.isArray(res.data)
          ? res.data
          : res.data?.businesses || [];
        setAll(businesses);
      })
      .catch(err => console.error("❌ Failed loading businesses", err))
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  /* ================= Load Cities (cached) ================= */
  useEffect(() => {
    (async () => {
      try {
        const cache = localStorage.getItem("allCities");
        if (cache) {
          setCities(JSON.parse(cache));
          return;
        }

        const fetched = await fetchCities();
        setCities(fetched);
        localStorage.setItem("allCities", JSON.stringify(fetched));
      } catch (e) {
        console.error("❌ Failed loading cities", e);
      } finally {
        setLoadingCities(false);
      }
    })();
  }, []);

  /* ================= Sync URL ================= */
  useEffect(() => {
    const params = new URLSearchParams();

    if (name) params.set("name", name);
    if (cat) params.set("category", cat);
    if (city) params.set("city", city);
    if (page > 1) params.set("page", page);

    setSearchParams(params, { replace: true });
  }, [name, cat, city, page, setSearchParams]);

  /* ================= Search Logic ================= */
  const handleSearch = useCallback(() => {
    if (!Array.isArray(all) || all.length === 0) {
      setFiltered([]);
      setSearched(true);
      setSearching(false);
      setPage(1);
      return;
    }

    setSearching(true);

    const normName = normalize(name);
    const normCat = normalize(cat);
    const normCity = normalize(city);

    const result = all.filter(b => {
      if (normName && !normalize(getBusinessName(b)).includes(normName))
  return false;

      if (normCat && !normalize(b.category).includes(normCat)) return false;
      if (normCity && !normalize(b.address?.city || "").startsWith(normCity))
        return false;
      return true;
    });

    setFiltered(result);
    setSearched(true);
    setPage(1);

    setTimeout(() => setSearching(false), 300);
  }, [all, name, cat, city]);

  /* ================= Debounced Search ================= */
  useEffect(() => {
    if (loading) return;

    const t = setTimeout(handleSearch, DEBOUNCE_DELAY);
    return () => clearTimeout(t);
  }, [name, cat, city, handleSearch, loading]);

  /* ================= Pagination ================= */
  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  /* ================= SEO ================= */
  const seoTitle =
    name || cat || city
      ? `${name || ""}${name && (cat || city) ? " – " : ""}${cat || ""}${
          cat && city ? " – " : ""
        }${city || ""} | Search | Bizuply`
      : "Business Search | Bizuply";

  /* ================= Render ================= */
  return (
    <div className="list-page">
      <Helmet>
        <title>{seoTitle}</title>
      </Helmet>

      <div className="business-list-container">
        <h1>Find Businesses</h1>

        {/* ===== Filters ===== */}
<div className="filters-wrapper">
  {/* Profession */}
  <div className="filter-item">
    <Select
      options={categoryOptions}
      value={categoryOptions.find(o => o.value === cat) || null}
      onChange={(opt) => setCat(opt ? opt.value : "")}
      placeholder="Profession (e.g., Electrician)"
      isClearable
    />
  </div>

  {/* City */}
  <div className="filter-item">
    <CityAutocomplete
      value={city}
      onChange={setCity}
      placeholder="City (United States)"
      disabled={loadingCities}
    />
  </div>

  {/* Business name */}
  <div className="filter-item">
    <input
      type="text"
      className="text-search"
      placeholder="Business name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  </div>
</div>

        

        {/* ===== Results ===== */}
        <div className="business-list">
          {loading || searching ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <BusinessCardSkeleton key={i} />
            ))
          ) : pageItems.length ? (
            pageItems.map(b => (
              <BusinessCard
                key={b._id}
                business={b}
                onClick={() => navigate(`/business/${b._id}`)}
              />
            ))
          ) : (
            <p className="no-results">
              No businesses found
              {name && ` matching "${name}"`}
              {city && ` in ${city}`}
              {cat && ` for ${cat.toLowerCase()}`}.
            </p>
          )}
        </div>

        {/* ===== Pagination ===== */}
        {searched && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
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
