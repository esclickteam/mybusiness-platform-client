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

/* ================= Component ================= */

export default function SearchBusinesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  /* ===== Data ===== */
  const [all, setAll] = useState([]);
  const [filtered, setFiltered] = useState([]);

  /* ===== UI States ===== */
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  /* ===== Filters ===== */
  const [cat, setCat] = useState(searchParams.get("category") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  /* ===== Cities ===== */
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  const categoryOptions = ALL_CATEGORIES.map((c) => ({
    value: c,
    label: c,
  }));

  /* ================= Load Businesses (ONCE) ================= */

  useEffect(() => {
    let mounted = true;

    API.get("/business")
      .then((res) => {
        if (!mounted) return;

        // ✅ תומך גם במבנה { businesses: [] } וגם במערך ישיר []
        const businesses = Array.isArray(res.data)
          ? res.data
          : res.data?.businesses || [];

        setAll(businesses);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed loading businesses:", err);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  /* ================= Load Cities (cached) ================= */

  useEffect(() => {
    const loadCities = async () => {
      try {
        const cache = localStorage.getItem("allCities");
        if (cache) {
          setCities(JSON.parse(cache));
          setLoadingCities(false);
          return;
        }

        const fetched = await fetchCities();
        setCities(fetched);
        localStorage.setItem("allCities", JSON.stringify(fetched));
      } catch (e) {
        console.error("❌ Failed loading cities:", e);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, []);

  /* ================= Sync URL with Filters ================= */

  useEffect(() => {
    const params = new URLSearchParams();

    if (cat) params.set("category", cat);
    if (city) params.set("city", city);
    if (page > 1) params.set("page", page);

    setSearchParams(params, { replace: true });
  }, [cat, city, page, setSearchParams]);

  /* ================= Search Logic ================= */

  const handleSearch = useCallback(() => {
    // ✅ אם אין עסקים נטענו (ריק/שגיאה) – לא להיתקע
    if (!Array.isArray(all) || all.length === 0) {
      setFiltered([]);
      setSearched(true);
      setSearching(false);
      setPage(1);
      return;
    }

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
    setPage(1); // 🔧 תמיד לחזור לעמוד 1 אחרי חיפוש

    setTimeout(() => setSearching(false), 300);
  }, [all, cat, city]);

  /* ================= Debounced Search (Single source of truth) ================= */
  // ✅ ביטלנו את Initial Search הנפרד כדי לא להפעיל handleSearch פעמיים
  useEffect(() => {
    if (loading) return;

    const timeout = setTimeout(() => {
      handleSearch();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeout);
  }, [cat, city, handleSearch, loading]);

  /* ================= Pagination ================= */

  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  /* ================= SEO ================= */

  const seoTitle =
    cat || city
      ? `${cat || ""}${cat && city ? " – " : ""}${city || ""} | Search | Bizuply`
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
          {/* City */}
          <div style={{ width: "250px" }}>
            <CityAutocomplete
              value={city}
              onChange={(val) => setCity(val)}
              placeholder="City (United States)"
              disabled={loadingCities}
            />
          </div>

          {/* Category */}
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

        {/* ===== Results ===== */}
        <div className="business-list">
          {loading || searching ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <BusinessCardSkeleton key={i} />
            ))
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
              No businesses found
              {city && ` in ${city}`}
              {cat && ` for ${cat.toLowerCase()}`}.
            </p>
          )}
        </div>

        {/* ===== Pagination ===== */}
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
