import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "@api";
import BusinessCard from "../components/BusinessCard";
import BusinessCardSkeleton from "../components/BusinessCardSkeleton";
import ALL_CATEGORIES from "../data/categories"; // ✅ ייבוא הקטגוריות
import { fetchCities } from "../data/cities"; // ✅ טעינת ערים (GeoDB API)
import CityAutocomplete from "@components/CityAutocomplete"; // ✅ כמו בעמוד עסק
import Select from "react-select"; // ✅ dropdown מקצועי לקטגוריות
import { Helmet } from "react-helmet";
import "./BusinessList.css";

const ITEMS_PER_PAGE = 9;

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
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(true);

  const [cat, setCat] = useState(searchParams.get("category") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  /* ✅ כל הקטגוריות */
  const categoryOptions = ALL_CATEGORIES.map((c) => ({
    value: c,
    label: c,
  }));

  /* -------------------- Load Businesses -------------------- */
  useEffect(() => {
    API.get("/business")
      .then((r) => {
        setAll(r.data.businesses || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  /* -------------------- Load Cities (with cache) -------------------- */
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

  /* -------------------- Sync URL params -------------------- */
  useEffect(() => {
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (city) params.set("city", city);
    if (page > 1) params.set("page", page);
    setSearchParams(params, { replace: true });
  }, [cat, city, page, setSearchParams]);

  /* -------------------- Search Handler -------------------- */
  const handleSearch = () => {
    setPage(1);
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
  };

  /* -------------------- Pagination -------------------- */
  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  /* -------------------- SEO -------------------- */
  const seoTitleParts = [];
  if (cat) seoTitleParts.push(cat);
  if (city) seoTitleParts.push(city);
  const seoTitle =
    seoTitleParts.length > 0
      ? `${seoTitleParts.join(" - ")} | Business Search - Bizuply`
      : "Business Search | Bizuply";

  const seoDescription =
    seoTitleParts.length > 0
      ? `Find businesses in the ${cat ? cat : ""} field ${
          city ? "in " + city : ""
        } on the Bizuply platform.`
      : "Search businesses by field and city on the Bizuply platform.";

  /* -------------------- UI -------------------- */
  return (
    <div className="list-page">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
      </Helmet>

      <div className="business-list-container">
        <h1>Business List</h1>

        {/* 🔍 Filters Section */}
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
          {/* 🏙️ City */}
          <div style={{ width: "250px" }}>
            <CityAutocomplete
              value={city}
              onChange={(val) => setCity(val)}
              placeholder="City (United States only)"
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

          {/* 🔎 Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "30px",
              padding: "10px 24px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            🔍 Search
          </button>
        </div>

        {/* 🧩 Results */}
        <div className="business-list">
          {loading
            ? Array(ITEMS_PER_PAGE)
                .fill()
                .map((_, i) => <BusinessCardSkeleton key={i} />)
            : !searched
            ? <p className="no-search">Click “Search” to see results</p>
            : pageItems.length > 0
            ? pageItems.map((b) => (
                <BusinessCard
                  key={b._id}
                  business={b}
                  onClick={() => navigate(`/business/${b._id}`)}
                />
              ))
            : <p className="no-results">No businesses found</p>}
        </div>

        {/* ⏩ Pagination */}
        {searched && totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
              Previous
            </button>
            <span>{page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
