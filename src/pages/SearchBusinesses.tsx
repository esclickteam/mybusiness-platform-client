import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select";
import { Helmet } from "react-helmet-async";

import API from "@api";
import BusinessCard from "../components/BusinessCard";
import BusinessCardSkeleton from "../components/BusinessCardSkeleton";
import ALL_CATEGORIES from "../data/categories";
import { fetchCities } from "../data/cities";
import CityAutocomplete from "@components/CityAutocomplete";

import "./BusinessList.css";

const ITEMS_PER_PAGE = 9;
const DEBOUNCE_DELAY = 600;

type BusinessAddress = {
  city?: string;
};

type Business = {
  _id: string;
  name?: string;
  businessName?: string;
  title?: string;
  displayName?: string;
  ownerName?: string;
  category?: string;
  address?: BusinessAddress;
  [key: string]: unknown;
};

type CategoryOption = {
  value: string;
  label: string;
};

type SearchBusinessesProps = {
  resetSearchFilters?: () => void;
};

function normalize(str?: string) {
  return str
    ?.normalize("NFD")
    ?.replace(/[\u0591-\u05C7]/g, "")
    ?.replace(/[-'" ]+/g, "")
    ?.trim()
    ?.toLowerCase();
}

function getBusinessName(business: Business) {
  return (
    business.name ||
    business.businessName ||
    business.title ||
    business.displayName ||
    business.ownerName ||
    ""
  );
}

export default function SearchBusinesses({
  resetSearchFilters,
}: SearchBusinessesProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [all, setAll] = useState<Business[]>([]);
  const [filtered, setFiltered] = useState<Business[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [searching, setSearching] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);

  const [name, setName] = useState<string>(searchParams.get("name") || "");
  const [cat, setCat] = useState<string>(searchParams.get("category") || "");
  const [city, setCity] = useState<string>(searchParams.get("city") || "");
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );

  const [, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState<boolean>(true);

  const categoryOptions: CategoryOption[] = useMemo(
    () =>
      ALL_CATEGORIES.map((category: string) => ({
        value: category,
        label: category,
      })),
    []
  );

  const clearFilters = useCallback(() => {
    setName("");
    setCat("");
    setCity("");
    setPage(1);
    setSearched(false);
    setFiltered(all);
    resetSearchFilters?.();
  }, [all, resetSearchFilters]);

  useEffect(() => {
    let mounted = true;

    API.get("/business")
      .then((res) => {
        if (!mounted) return;

        const businesses: Business[] = Array.isArray(res.data)
          ? res.data
          : res.data?.businesses || [];

        setAll(businesses);
        setFiltered(businesses);
      })
      .catch((err) => {
        console.error("❌ Failed loading businesses", err);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadCities() {
      try {
        const cache = localStorage.getItem("allCities");

        if (cache) {
          const parsedCities = JSON.parse(cache) as string[];

          if (mounted) {
            setCities(parsedCities);
          }

          return;
        }

        const fetched = await fetchCities();

        if (!mounted) return;

        setCities(fetched);
        localStorage.setItem("allCities", JSON.stringify(fetched));
      } catch (err) {
        console.error("❌ Failed loading cities", err);
      } finally {
        if (mounted) {
          setLoadingCities(false);
        }
      }
    }

    loadCities();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (name) params.set("name", name);
    if (cat) params.set("category", cat);
    if (city) params.set("city", city);
    if (page > 1) params.set("page", String(page));

    setSearchParams(params, { replace: true });
  }, [name, cat, city, page, setSearchParams]);

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

    const result = all.filter((business) => {
      if (
        normName &&
        !normalize(getBusinessName(business))?.includes(normName)
      ) {
        return false;
      }

      if (normCat && !normalize(business.category || "")?.includes(normCat)) {
        return false;
      }

      if (
        normCity &&
        !normalize(business.address?.city || "")?.startsWith(normCity)
      ) {
        return false;
      }

      return true;
    });

    setFiltered(result);
    setSearched(true);
    setPage(1);

    window.setTimeout(() => {
      setSearching(false);
    }, 300);
  }, [all, name, cat, city]);

  useEffect(() => {
    if (loading) return;

    const timeout = window.setTimeout(handleSearch, DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [name, cat, city, handleSearch, loading]);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const seoTitle =
    name || cat || city
      ? `${name || ""}${name && (cat || city) ? " – " : ""}${cat || ""}${
          cat && city ? " – " : ""
        }${city || ""} | Search | Bizuply`
      : "Business Search | Bizuply";

  return (
    <div className="list-page">
      <Helmet>
        <title>{seoTitle}</title>
      </Helmet>

      <div className="business-list-container">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1>Find Businesses</h1>

            {searched && !loading && !searching && (
              <p className="mt-2 text-sm font-semibold text-slate-500">
                {filtered.length} businesses found
              </p>
            )}
          </div>

          {(name || cat || city) && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="filters-wrapper">
          <div className="filter-item">
            <Select<CategoryOption, false>
              options={categoryOptions}
              value={
                categoryOptions.find((option) => option.value === cat) || null
              }
              onChange={(option) => setCat(option ? option.value : "")}
              placeholder="Profession (e.g., Electrician)"
              isClearable
            />
          </div>

          <div className="filter-item">
            <CityAutocomplete
              value={city}
              onChange={setCity}
              disabled={loadingCities}
            />
          </div>

          <div className="filter-item">
            <input
              type="text"
              className="text-search"
              placeholder="Business name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </div>
        </div>

        <div className="business-list">
          {loading || searching ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <BusinessCardSkeleton key={index} />
            ))
          ) : pageItems.length ? (
            pageItems.map((business) => (
              <BusinessCard
                key={business._id}
                business={business}
                onClick={() => navigate(`/business/${business._id}`)}
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

        {searched && totalPages > 1 && (
          <div className="pagination">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>

            <span>
              {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages))
              }
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