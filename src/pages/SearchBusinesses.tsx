import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select";
import { Helmet } from "react-helmet-async";

import API from "@api";
import BusinessCard from "../components/BusinessCard";
import BusinessCardSkeleton from "../components/BusinessCardSkeleton";
import BizuplyLoader from "../components/ui/BizuplyLoader";
import { useTranslation } from "react-i18next";
import { marketingPublicUrl, normalizeMarketingLocale } from "../lib/localePath.mjs";
import "../styles/publicStage.css";
import ALL_CATEGORIES from "../data/categories";
import { translateBusinessCategory } from "../i18n/businessCategoryLabels";
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
  const { t, i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
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
        label: translateBusinessCategory(category, t),
      })),
    [t]
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

  const searchCopy = {
    en: {
      title: "Find a business | BizUply",
      description: "Search businesses that published a profile. A result is not a recommendation or a partnership.",
      h1: "Find a business",
      found: "businesses found",
      clear: "Clear filters",
      profession: "Profession",
      namePlaceholder: "Business name",
      loading: "Loading businesses",
      empty: "No businesses found.",
      previous: "Previous",
      next: "Next",
    },
    he: {
      title: "מציאת עסק | BizUply",
      description: "חיפוש עסקים שפרסמו פרופיל. תוצאה אינה המלצה ואינה שותפות.",
      h1: "מציאת עסק",
      found: "עסקים נמצאו",
      clear: "ניקוי סינון",
      profession: "מקצוע",
      namePlaceholder: "שם העסק",
      loading: "טוען עסקים",
      empty: "לא נמצאו עסקים.",
      previous: "הקודם",
      next: "הבא",
    },
    es: {
      title: "Encontrar un negocio | BizUply",
      description: "Busque negocios que publicaron un perfil. Un resultado no es una recomendación ni una alianza.",
      h1: "Encontrar un negocio",
      found: "negocios encontrados",
      clear: "Quitar filtros",
      profession: "Profesión",
      namePlaceholder: "Nombre del negocio",
      loading: "Cargando negocios",
      empty: "No se encontraron negocios.",
      previous: "Anterior",
      next: "Siguiente",
    },
    "pt-BR": {
      title: "Encontrar um negócio | BizUply",
      description: "Pesquise negócios que publicaram um perfil. Um resultado não é uma recomendação nem uma parceria.",
      h1: "Encontrar um negócio",
      found: "negócios encontrados",
      clear: "Limpar filtros",
      profession: "Profissão",
      namePlaceholder: "Nome do negócio",
      loading: "Carregando negócios",
      empty: "Nenhum negócio encontrado.",
      previous: "Anterior",
      next: "Seguinte",
    },
    ar: {
      title: "العثور على عمل | BizUply",
      description: "ابحثوا عن أعمال نشرت ملفاً. النتيجة ليست توصية وليست شراكة.",
      h1: "العثور على عمل",
      found: "أعمال وُجدت",
      clear: "مسح التصفية",
      profession: "المهنة",
      namePlaceholder: "اسم العمل",
      loading: "جارٍ تحميل الأعمال",
      empty: "لم يُعثر على أعمال.",
      previous: "السابق",
      next: "التالي",
    },
  }[locale] || {
    title: "Find a business | BizUply",
    description: "Search businesses that published a profile. A result is not a recommendation or a partnership.",
    h1: "Find a business",
    found: "businesses found",
    clear: "Clear filters",
    profession: "Profession",
    namePlaceholder: "Business name",
    loading: "Loading businesses",
    empty: "No businesses found.",
    previous: "Previous",
    next: "Next",
  };
  const hasQuery = Boolean(name || cat || city || page > 1);
  const seoTitle = hasQuery
    ? `${[name, cat, city].filter(Boolean).join(" – ")} | ${searchCopy.title}`
    : searchCopy.title;

  return (
    <div className="co-search list-page" dir={i18n.language?.startsWith("he") || i18n.language?.startsWith("ar") ? "rtl" : "ltr"}>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={searchCopy.description} />
        <link rel="canonical" href={marketingPublicUrl("/search", locale)} />
        <meta name="robots" content={hasQuery ? "noindex, follow" : "index, follow"} />
      </Helmet>

      <header className="co-search-hero">
        <h1>{searchCopy.h1}</h1>
        <p>{searchCopy.description}</p>
      </header>

      <div className="business-list-container">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {searched && !loading && !searching && (
              <p className="mt-2 text-sm font-semibold text-slate-500">
                {filtered.length} {searchCopy.found}
              </p>
            )}
          </div>

          {(name || cat || city) && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              {searchCopy.clear}
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
              placeholder={searchCopy.profession}
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
              placeholder={searchCopy.namePlaceholder}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </div>
        </div>

        <div className="business-list">
          {loading || searching ? (
            <div className="col-span-full flex min-h-[50vh] items-center justify-center py-16">
              <BizuplyLoader size="xl" label={searchCopy.loading} />
            </div>
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
              {searchCopy.empty}
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
              {searchCopy.previous}
            </button>

            <span>
              {page} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={page === totalPages}
            >
              {searchCopy.next}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}