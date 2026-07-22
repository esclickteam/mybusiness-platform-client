import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Eye,
  GraduationCap,
  HeartPulse,
  Home,
  LayoutTemplate,
  Paintbrush,
  Search,
  ShoppingBag,
  Sparkles,
  Utensils,
  Wand2,
  Wrench,
} from "lucide-react";

import {
  studioTemplateDefinitions,
  getStudioTemplateSeedById,
} from "../components/site-builder/studio/data/templates";

import DomainSearch from "../components/website/DomainSearch";
import { createMySite } from "../api/mySitesApi";
import TemplateCardPreview, {
  canRenderTemplatePreview,
} from "../components/website/TemplateCardPreview";
import { prefetchTemplatePreviewKeys } from "../utils/templatePreviewScheduler";
import { getStudioTemplateRendererKeys } from "../components/site-builder/studio/data/templates/templateRendererRegistry";
import { useLocaleDir } from "../hooks/useLocaleDir";

type WebsiteTemplateBlock = {
  id: string;
  type: string;
  variant?: string;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  text?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  image?: string;
  imageAlt?: string;
  images?: string[];
  items?: any[];
  settings?: Record<string, any>;
  styles?: Record<string, any>;
  order?: number;
  isVisible?: boolean;
};

type WebsiteTemplate = {
  _id?: string;
  key: string;
  name: string;
  category: string;
  categoryLabel?: string;
  description?: string;
  niche?: string;
  layout?: string;
  image?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  badge?: string;
  thumbnailUrl?: string;
  previewImageUrl?: string;
  tags?: string[];
  order?: number;

  palette?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    text?: string;
    muted?: string;
    dark?: string;
    border?: string;
  };

  fonts?: {
    heading?: string;
    body?: string;
  };

  layoutSettings?: {
    direction?: "rtl" | "ltr";
    radius?: "none" | "soft" | "rounded" | "pill";
    style?: string;
    maxWidth?: string;
    spacing?: "compact" | "normal" | "spacious";
  };

  blocks?: WebsiteTemplateBlock[];
};

type TemplateCategoryId =
  | "all"
  | "landing"
  | "business"
  | "real-estate"
  | "portfolio"
  | "store"
  | "food"
  | "medical"
  | "education"
  | "beauty"
  | "service";

type TemplateCategory = {
  id: TemplateCategoryId;
  icon: React.ElementType;
};

const RAW_API_BASE =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";

const API_BASE = RAW_API_BASE.replace(/\/api\/?$/, "").replace(/\/$/, "");

const templateCategoryDefs: TemplateCategory[] = [
  { id: "all", icon: Paintbrush },
  { id: "landing", icon: Home },
  { id: "business", icon: BriefcaseBusiness },
  { id: "real-estate", icon: Building2 },
  { id: "portfolio", icon: LayoutTemplate },
  { id: "store", icon: ShoppingBag },
  { id: "food", icon: Utensils },
  { id: "medical", icon: HeartPulse },
  { id: "education", icon: GraduationCap },
  { id: "beauty", icon: Sparkles },
  { id: "service", icon: Wrench },
];

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Request failed");
  }

  return data as T;
}

function normalizeText(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

function getTemplateCategoryId(template: WebsiteTemplate): TemplateCategoryId {
  const rawCategory = normalizeText(template.category);
  const rawLabel = normalizeText(template.categoryLabel);

  if (
    rawCategory === "landing" ||
    rawLabel.includes("דפי נחיתה") ||
    rawLabel.includes("landing")
  ) {
    return "landing";
  }

  if (
    rawCategory === "business" ||
    rawLabel.includes("עסקים") ||
    rawLabel.includes("שירותים") ||
    rawLabel.includes("business")
  ) {
    return "business";
  }

  if (
    rawCategory === "real-estate" ||
    rawCategory === "real_estate" ||
    rawCategory === "realestate" ||
    rawCategory.includes("real estate") ||
    rawLabel.includes("נדל") ||
    rawLabel.includes("real estate")
  ) {
    return "real-estate";
  }

  if (
    rawCategory === "portfolio" ||
    rawLabel.includes("פורטפוליו") ||
    rawLabel.includes("סוכנות") ||
    rawLabel.includes("portfolio")
  ) {
    return "portfolio";
  }

  if (
    rawCategory === "store" ||
    rawCategory === "ecommerce" ||
    rawCategory === "e-commerce" ||
    rawLabel.includes("חנויות") ||
    rawLabel.includes("מסחר") ||
    rawLabel.includes("store") ||
    rawLabel.includes("commerce")
  ) {
    return "store";
  }

  if (
    rawCategory === "food" ||
    rawLabel.includes("אוכל") ||
    rawLabel.includes("מסעד") ||
    rawLabel.includes("food")
  ) {
    return "food";
  }

  if (
    rawCategory === "medical" ||
    rawLabel.includes("רפואה") ||
    rawLabel.includes("בריאות") ||
    rawLabel.includes("medical") ||
    rawLabel.includes("health")
  ) {
    return "medical";
  }

  if (
    rawCategory === "education" ||
    rawLabel.includes("חינוך") ||
    rawLabel.includes("קורס") ||
    rawLabel.includes("education")
  ) {
    return "education";
  }

  if (
    rawCategory === "beauty" ||
    rawLabel.includes("יופי") ||
    rawLabel.includes("טיפוח") ||
    rawLabel.includes("beauty")
  ) {
    return "beauty";
  }

  if (
    rawCategory === "service" ||
    rawLabel.includes("שירותים לבית") ||
    rawLabel.includes("לבית") ||
    rawLabel.includes("home service")
  ) {
    return "service";
  }

  return "business";
}

function getTemplateSearchText(template: WebsiteTemplate) {
  return [
    template.name,
    template.description,
    template.category,
    template.categoryLabel,
    template.key,
    ...(template.tags || []),
  ]
    .join(" ")
    .toLowerCase();
}

function mapDefinitionToGalleryTemplate(
  definition: any,
  index: number
): WebsiteTemplate {
  const seed = (definition?.seed ||
    getStudioTemplateSeedById(definition?.id || definition?.key) ||
    {}) as any;

  const image =
    seed.image ||
    definition?.previewImage ||
    definition?.image ||
    "";

  const badge =
    definition?.badge ||
    (definition?.priceLabel === "Premium" ? "Premium" : "") ||
    "";

  return {
    key: String(definition?.id || definition?.key || "").toLowerCase(),
    name: definition?.name || definition?.id || "Website template",
    category: definition?.category || seed.category || "business",
    categoryLabel:
      definition?.categoryLabel || seed.categoryLabel || definition?.category,
    description: definition?.description || seed.description || "",
    niche: seed.niche,
    layout: seed.layout,
    image,
    heroTitle: seed.heroTitle || definition?.name,
    heroSubtitle: seed.heroSubtitle || definition?.description,
    isNew: badge === "חדש" || badge === "NEW",
    badge,
    thumbnailUrl: image,
    previewImageUrl: image,
    palette: seed.palette,
    order: index + 1,
  };
}

/**
 * Merge the templates coming from Mongo with the in-app studio template
 * definitions, so every locally-registered template shows up in the gallery
 * even if it hasn't been synced to Mongo yet. Server data (edited names,
 * uploaded images, etc.) takes precedence when it exists and is not empty.
 */
function mergeWithLocalTemplates(
  serverTemplates: WebsiteTemplate[]
): WebsiteTemplate[] {
  const byKey = new Map<string, WebsiteTemplate>();

  studioTemplateDefinitions.forEach((definition, index) => {
    const key = normalizeText(
      (definition as any)?.id || (definition as any)?.key
    );
    if (!key) return;
    byKey.set(key, mapDefinitionToGalleryTemplate(definition, index));
  });

  serverTemplates.forEach((template) => {
    const key = normalizeText(template.key || template._id);

    if (!key) return;

    const existing = byKey.get(key);

    if (!existing) {
      byKey.set(key, template);
      return;
    }

    const overrides: Record<string, any> = {};
    Object.entries(template).forEach(([field, value]) => {
      if (value === null || value === undefined || value === "") return;
      overrides[field] = value;
    });

    byKey.set(key, { ...existing, ...overrides });
  });

  return Array.from(byKey.values());
}

async function fetchWebsiteTemplates() {
  try {
    const data = await apiRequest<{
      success: boolean;
      count: number;
      templates: WebsiteTemplate[];
    }>("/api/website-templates");

    const serverTemplates =
      data?.success && Array.isArray(data.templates) ? data.templates : [];

    return mergeWithLocalTemplates(serverTemplates);
  } catch (err) {
    // Even if the server list fails, still show the locally-registered
    // studio templates so the gallery is never empty.
    console.error("Load website templates from server failed:", err);
    return mergeWithLocalTemplates([]);
  }
}

function normalizeTemplateForMongo(template: any, index: number) {
  const seed = getStudioTemplateSeedById(template.id);

  const image =
    seed?.image ||
    template.image ||
    template.previewImage ||
    template.previewImageUrl ||
    template.thumbnailUrl ||
    template.thumbnailImage ||
    "";

  return {
    key: template.id || seed?.id,
    id: template.id || seed?.id,

    name: template.name || seed?.name || template.id,

    category: template.category || seed?.category || "business",

    categoryLabel:
      template.categoryLabel ||
      template.category ||
      seed?.category ||
      "Website template",

    description: template.description || seed?.description || "",

    niche: seed?.niche || template.category || "business",

    layout: seed?.layout || "full",

    image,

    thumbnailUrl: image,

    previewImageUrl: image,

    heroTitle:
      seed?.heroTitle ||
      template.heroTitle ||
      template.name ||
      t("websiteTemplates.defaultHeroTitle"),

    heroSubtitle:
      seed?.heroSubtitle ||
      template.description ||
      seed?.description ||
      t("websiteTemplates.defaultHeroSubtitle"),

    palette: seed?.palette || {
      primary: "#111827",
      secondary: "#4B5563",
      accent: "#2563EB",
      background: "#FFFFFF",
      surface: "#F9FAFB",
      text: "#111827",
      muted: "#6B7280",
      dark: "#020617",
    },

    blocks: seed?.blocks || [],

    tags: [
      template.category,
      template.categoryLabel,
      template.author,
      seed?.niche,
    ].filter(Boolean),

    isActive: true,

    isNew: Boolean(template.badge === "NEW" || template.isNew),

    isFeatured: Boolean(template.isFeatured),

    badge: template.badge || "",

    status: "active",

    order: Number(template.order || index + 1),
  };
}

async function syncExistingWebsiteTemplatesToMongo() {
  const templates = studioTemplateDefinitions.map((template, index) =>
    normalizeTemplateForMongo(template, index)
  );

  const data = await apiRequest<{
    success: boolean;
    message: string;
    count: number;
    templates: WebsiteTemplate[];
  }>("/api/website-templates/bulk-upsert", {
    method: "POST",
    body: JSON.stringify({ templates }),
  });

  if (!data?.success) {
    throw new Error(data?.message || "Failed to sync templates to Mongo");
  }

  return data;
}

export default function WebsiteTemplatesPage() {
  const navigate = useNavigate();
  const { businessId } = useParams<{ businessId: string }>();
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();

  const templateCategories = useMemo(
    () =>
      templateCategoryDefs.map((category) => ({
        ...category,
        label: t(`websiteTemplates.categories.${category.id}`),
      })),
    [t]
  );

  const [templates, setTemplates] = useState<WebsiteTemplate[]>([]);
  const [activeCategory, setActiveCategory] =
    useState<TemplateCategoryId>("all");
  const [search, setSearch] = useState<string>("");
  const [sortValue, setSortValue] = useState<"newest" | "name">("newest");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [syncingTemplates, setSyncingTemplates] = useState(false);
  const [activeWebsiteView, setActiveWebsiteView] = useState<
    "domains" | "templates"
  >("domains");

  const basePath = businessId ? `/business/${businessId}` : "/business";

  async function loadTemplates() {
    try {
      setLoading(true);
      setError("");

      const data = await fetchWebsiteTemplates();

      setTemplates(data);
    } catch (err: any) {
      console.error("Load website templates error:", err);
      setError(err?.message || t("websiteTemplates.alerts.loadFailed"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchWebsiteTemplates();

        if (!isMounted) return;

        setTemplates(data);
      } catch (err: any) {
        console.error("Load website templates error:", err);

        if (!isMounted) return;

        setError(err?.message || t("websiteTemplates.alerts.loadFailed"));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<TemplateCategoryId, number> = {
      all: templates.length,
      landing: 0,
      business: 0,
      "real-estate": 0,
      portfolio: 0,
      store: 0,
      food: 0,
      medical: 0,
      education: 0,
      beauty: 0,
      service: 0,
    };

    templates.forEach((template) => {
      const categoryId = getTemplateCategoryId(template);
      counts[categoryId] += 1;
    });

    return counts;
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const query = search.trim().toLowerCase();

    const categoryTemplates =
      activeCategory === "all"
        ? templates
        : templates.filter(
            (template) => getTemplateCategoryId(template) === activeCategory
          );

    const searchedTemplates = categoryTemplates.filter((template) => {
      if (!query) return true;

      return getTemplateSearchText(template).includes(query);
    });

    if (sortValue === "name") {
      return [...searchedTemplates].sort((a, b) =>
        a.name.localeCompare(b.name, i18n.language || "en")
      );
    }

    return [...searchedTemplates].sort((a, b) => {
      const orderA = Number(a.order || 0);
      const orderB = Number(b.order || 0);

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return String(b._id || b.key).localeCompare(String(a._id || a.key));
    });
  }, [activeCategory, search, sortValue, templates, i18n.language]);

  // Webflow-style: start batch-loading ALL template previews as soon as the
  // gallery opens — do not wait for the user to scroll each card into view.
  useEffect(() => {
    if (activeWebsiteView !== "templates") return;

    const keys = [
      ...filteredTemplates.map((template) => template.key),
      ...getStudioTemplateRendererKeys(),
    ];

    prefetchTemplatePreviewKeys(keys);
  }, [activeWebsiteView, filteredTemplates]);

  const activeCategoryLabel =
    activeCategory === "all"
      ? t("websiteTemplates.allTemplatesTitle")
      : templateCategories.find((category) => category.id === activeCategory)
          ?.label || t("websiteTemplates.templatesTitle");

  async function handleEditTemplate(templateKey: string) {
  const selectedTemplate = templates.find(
    (template) =>
      String(template.key) === String(templateKey) ||
      String(template._id || "") === String(templateKey)
  );

  if (!selectedTemplate) {
    alert(t("websiteTemplates.alerts.templateNotFound"));
    return;
  }

  const cleanTemplateKey = String(selectedTemplate.key || templateKey)
    .trim()
    .toLowerCase();

  const localSeed = getStudioTemplateSeedById(cleanTemplateKey);
  const localSeedAny = (localSeed || {}) as any;

  const templateForEditor = {
    ...localSeedAny,
    ...selectedTemplate,

    id: cleanTemplateKey,
    key: cleanTemplateKey,
    rendererKey: cleanTemplateKey,

    renderMode: "registry",
    editorMode: "renderer",

    name: selectedTemplate.name || localSeed?.name || cleanTemplateKey,
    category: selectedTemplate.category || localSeed?.category || "business",
    description: selectedTemplate.description || localSeed?.description || "",

    heroTitle:
      localSeedAny.heroTitle ||
      selectedTemplate.heroTitle ||
      selectedTemplate.name ||
      t("websiteTemplates.defaultHeroTitle"),

    heroSubtitle:
      localSeedAny.heroSubtitle ||
      selectedTemplate.heroSubtitle ||
      selectedTemplate.description ||
      localSeed?.description ||
      t("websiteTemplates.defaultHeroSubtitle"),

    palette: localSeed?.palette || selectedTemplate.palette || {},

    fonts:
      localSeedAny.fonts ||
      selectedTemplate.fonts ||
      {},

    layoutSettings:
      localSeedAny.layoutSettings ||
      selectedTemplate.layoutSettings ||
      {},

    blocks: Array.isArray(localSeed?.blocks)
      ? localSeed.blocks
      : Array.isArray(selectedTemplate.blocks)
        ? selectedTemplate.blocks
        : [],
  };

  localStorage.setItem("bizuply-selected-template-key", cleanTemplateKey);
  localStorage.setItem("bizuply-selected-template-id", cleanTemplateKey);
  localStorage.setItem(
    "bizuply-selected-template-data",
    JSON.stringify(templateForEditor)
  );

  try {
    if (!businessId) {
      throw new Error(t("websiteTemplates.alerts.missingBusinessId"));
    }

    const site = await createMySite({
      businessId,
      name: selectedTemplate.name || localSeed?.name || t("websiteTemplates.defaultSiteName"),
      templateKey: cleanTemplateKey,
      templateName: selectedTemplate.name || localSeed?.name || cleanTemplateKey,
    });

    if (site?._id) {
      navigate(
        `${basePath}/dashboard/website/sites/${site._id}/edit?template=${encodeURIComponent(cleanTemplateKey)}`
      );
      return;
    }
  } catch (err: any) {
    console.error("Create site from template failed:", err);
    // fallback לזרימה הישנה אם יצירת האתר נכשלה
  }

  navigate(`${basePath}/dashboard/website/templates/${cleanTemplateKey}/edit`);
}

  function handlePreviewTemplate(templateKey: string) {
    const cleanTemplateKey = String(templateKey || "").trim().toLowerCase();

    navigate(`${basePath}/dashboard/website/templates/${cleanTemplateKey}/preview`);
  }

  function handleRetry() {
    loadTemplates();
  }

  async function handleSyncTemplatesToMongo() {
    try {
      setSyncingTemplates(true);

      const result = await syncExistingWebsiteTemplatesToMongo();

      alert(t("websiteTemplates.alerts.syncedCount", { count: result.count }));

      await loadTemplates();
    } catch (err: any) {
      console.error("SYNC TEMPLATES TO MONGO ERROR:", err);
      alert(err?.message || t("websiteTemplates.alerts.syncFailed"));
    } finally {
      setSyncingTemplates(false);
    }
  }

  return (
    <main
      dir={dir}
      className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_28%)] text-start text-[#111827]"
    >
      <section className="border-b border-slate-200/80 bg-white/95 px-5 py-6 backdrop-blur lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white px-6 py-7 shadow-[0_22px_70px_rgba(15,23,42,0.08)] lg:px-9">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.13),transparent_56%),radial-gradient(circle_at_top_left,rgba(37,99,235,0.10),transparent_52%)]" />

            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700">
                  <Sparkles className="h-4 w-4" />
                  {t("websiteTemplates.badge")}
                </div>

                <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950 md:text-4xl">
                  {t("websiteTemplates.title")}
                </h1>

                <p className="mt-3 text-sm font-semibold leading-7 text-slate-500 md:text-base">
                  {t("websiteTemplates.subtitle")}
                </p>
              </div>

              <div className="grid w-full max-w-[620px] grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setActiveWebsiteView("domains")}
                  className={[
                    "group flex min-h-[104px] items-center gap-4 rounded-[24px] border p-4 text-start transition duration-200",
                    activeWebsiteView === "domains"
                      ? "border-violet-300 bg-gradient-to-br from-violet-50 to-blue-50 text-violet-800 shadow-[0_16px_42px_rgba(124,58,237,0.14)]"
                      : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition",
                      activeWebsiteView === "domains"
                        ? "bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-200"
                        : "bg-slate-100 text-slate-500 group-hover:bg-violet-50 group-hover:text-violet-600",
                    ].join(" ")}
                  >
                    <Search className="h-5 w-5" />
                  </span>

                  <span>
                    <span className="block text-base font-black">
                      {t("websiteTemplates.domainSearch.title")}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-slate-400">
                      {t("websiteTemplates.domainSearch.subtitle")}
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveWebsiteView("templates")}
                  className={[
                    "group flex min-h-[104px] items-center gap-4 rounded-[24px] border p-4 text-start transition duration-200",
                    activeWebsiteView === "templates"
                      ? "border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-800 shadow-[0_16px_42px_rgba(37,99,235,0.14)]"
                      : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition",
                      activeWebsiteView === "templates"
                        ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200"
                        : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600",
                    ].join(" ")}
                  >
                    <LayoutTemplate className="h-5 w-5" />
                  </span>

                  <span>
                    <span className="block text-base font-black">
                      {t("websiteTemplates.templatePick.title")}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-slate-400">
                      {t("websiteTemplates.templatePick.subtitle")}
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {activeWebsiteView === "domains" ? (
        <section className="px-5 py-8 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-[1500px]">
            <DomainSearch />
          </div>
        </section>
      ) : (
      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="hidden w-[310px] shrink-0 border-e border-[#e5e7eb] bg-white lg:block">
          <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto px-7 py-8">
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
              <h2 className="text-lg font-black tracking-[-0.03em] text-[#111827]">
                {t("websiteTemplates.categoriesTitle")}
              </h2>

              <label className="relative mt-4 block">
                <Search className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t("websiteTemplates.searchPlaceholder")}
                  className="
                    h-11 w-full rounded-xl border border-[#e5e7eb] bg-white
                    pe-11 ps-4 text-sm font-medium outline-none transition
                    placeholder:text-[#9ca3af] focus:border-[#2563eb]
                    focus:ring-4 focus:ring-[#2563eb]/10
                  "
                />
              </label>

              <div className="mt-5 border-t border-[#e5e7eb] pt-4">
                <nav className="space-y-1">
                  {templateCategories.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.id;
                    const count = categoryCounts[category.id] || 0;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setActiveCategory(category.id)}
                        className={[
                          "flex w-full items-center justify-between rounded-xl px-3 py-3 text-start text-[15px] transition active:scale-[0.98]",
                          isActive
                            ? "bg-[#eef4ff] font-bold text-[#2563eb]"
                            : "text-[#374151] hover:bg-[#f9fafb]",
                        ].join(" ")}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{category.label}</span>
                        </span>

                        <span className="me-3 shrink-0 text-xs text-[#9ca3af]">
                          {count.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1 bg-white">
          <div className="border-b border-[#e5e7eb] bg-white px-6 py-8 lg:px-10">
            <div className="mx-auto max-w-[1500px]">
              <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#2563eb]">
                <span>{t("websiteTemplates.breadcrumbTemplates")}</span>
                <span className="text-[#9ca3af]">›</span>
                <span>{t("websiteTemplates.breadcrumbCategories")}</span>
                <span className="text-[#9ca3af]">›</span>
                <span className="text-[#6b7280]">{activeCategoryLabel}</span>
              </div>

              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <h1 className="text-[34px] font-black tracking-[-0.045em] text-[#111827] md:text-[42px]">
                    {activeCategoryLabel}
                  </h1>

                  <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#6b7280]">
                    {t("websiteTemplates.galleryIntro")}
                  </p>

                  <button
                    type="button"
                    onClick={handleSyncTemplatesToMongo}
                    disabled={syncingTemplates}
                    className="
                      mt-5 inline-flex items-center justify-center rounded-xl
                      bg-black px-5 py-3 text-sm font-bold text-white
                      transition hover:bg-slate-800 disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {syncingTemplates
                      ? t("websiteTemplates.syncing")
                      : t("websiteTemplates.syncButton")}
                  </button>

                  <p className="mt-2 text-xs font-bold text-[#9ca3af]">
                    {t("websiteTemplates.syncHint")}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="relative block w-full sm:w-[330px] lg:hidden">
                    <Search className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />

                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder={t("websiteTemplates.searchPlaceholder")}
                      className="
                        h-11 w-full rounded-xl border border-[#d1d5db] bg-white
                        pe-11 ps-4 text-sm outline-none transition
                        placeholder:text-[#9ca3af] focus:border-[#2563eb]
                      "
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setSortValue((current) =>
                        current === "newest" ? "name" : "newest"
                      )
                    }
                    className="
                      inline-flex h-11 items-center justify-between gap-7 rounded-xl
                      border border-[#d1d5db] bg-white px-4 text-sm font-medium
                      text-[#111827] transition hover:bg-[#f9fafb] active:scale-[0.98]
                    "
                  >
                    {sortValue === "newest" ? t("websiteTemplates.sortNewest") : t("websiteTemplates.sortName")}
                    <ChevronDown className="h-4 w-4 text-[#6b7280]" />
                  </button>
                </div>
              </div>

              <div className="mt-7 flex gap-2 overflow-x-auto pb-1">
                {templateCategories.slice(0, 8).map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={[
                      "h-11 shrink-0 rounded-xl border px-5 text-sm font-bold transition active:scale-[0.98]",
                      activeCategory === category.id
                        ? "border-[#2563eb] bg-white text-[#2563eb] ring-2 ring-[#2563eb]/10"
                        : "border-[#e5e7eb] bg-[#f8fafc] text-[#111827] hover:bg-white",
                    ].join(" ")}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-8 lg:px-10">
            <div className="mx-auto max-w-[1500px]">
              {loading ? (
                <>
                  <p className="mb-7 text-sm font-medium text-[#9ca3af]">
                    {t("websiteTemplates.loading")}
                  </p>

                  <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="aspect-[4/3] rounded-xl bg-[#f3f4f6]" />
                        <div className="mt-4 h-5 w-2/3 rounded bg-[#f3f4f6]" />
                        <div className="mt-2 h-4 w-1/2 rounded bg-[#f3f4f6]" />
                      </div>
                    ))}
                  </div>
                </>
              ) : error ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-red-500 shadow-sm">
                    <Search className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-xl font-black text-red-700">
                    {t("websiteTemplates.loadFailedTitle")}
                  </h3>

                  <p className="mt-2 text-sm text-red-600">{error}</p>

                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-6 rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
                  >
                    {t("websiteTemplates.retry")}
                  </button>
                </div>
              ) : (
                <>
                  <p className="mb-7 text-sm font-medium text-[#9ca3af]">
                    {t("websiteTemplates.templatesCount", { count: filteredTemplates.length.toLocaleString() })}
                  </p>

                  {filteredTemplates.length > 0 ? (
                    <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                      {filteredTemplates.map((template, index) => {
                        const displayCategory =
                          template.categoryLabel ||
                          template.category ||
                          t("websiteTemplates.templateFallback");

                        const badge =
                          template.badge ||
                          (template.isNew ? "NEW" : "") ||
                          (template.isFeatured ? t("websiteTemplates.featuredBadge") : "");

                        return (
                          <article key={template.key} className="group">
                            <div
                              className="
                                relative block w-full overflow-hidden rounded-xl
                                border border-[#e5e7eb] bg-[#f3f4f6]
                                shadow-sm transition duration-300
                                group-hover:-translate-y-1 group-hover:border-[#d1d5db]
                                group-hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]
                              "
                            >
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() =>
                                  handlePreviewTemplate(template.key)
                                }
                                onKeyDown={(event) => {
                                  if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                  ) {
                                    event.preventDefault();
                                    handlePreviewTemplate(template.key);
                                  }
                                }}
                                className="block w-full cursor-pointer text-start"
                                aria-label={t("websiteTemplates.previewAria", { name: template.name })}
                              >
                                <div className="aspect-[4/3] overflow-hidden bg-[#f3f4f6]">
                                  {canRenderTemplatePreview(template.key) ? (
                                    <div className="h-full w-full transition duration-500 group-hover:scale-[1.02]">
                                      <TemplateCardPreview
                                        templateKey={template.key}
                                        title={template.name}
                                        eager={index < 4}
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[#f9fafb]">
                                      <LayoutTemplate className="h-10 w-10 text-[#9ca3af]" />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {badge && (
                                <div className="absolute end-3 top-3 rounded-md border border-[#bfdbfe] bg-[#dbeafe] px-2.5 py-1 text-xs font-bold text-[#2563eb]">
                                  ✦ {badge}
                                </div>
                              )}

                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
                                <div className="pointer-events-auto flex flex-col gap-3 sm:flex-row">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handlePreviewTemplate(template.key)
                                    }
                                    className="
                                      inline-flex h-11 items-center justify-center gap-2
                                      rounded-lg bg-white px-5 text-sm font-black
                                      text-[#111827] shadow-lg transition
                                      hover:-translate-y-0.5 hover:bg-[#f8fafc]
                                      active:scale-[0.98]
                                    "
                                  >
                                    <Eye className="h-4 w-4" />
                                    {t("websiteTemplates.preview")}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditTemplate(template.key)
                                    }
                                    className="
                                      inline-flex h-11 items-center justify-center gap-2
                                      rounded-lg bg-[#111827] px-5 text-sm font-black
                                      text-white shadow-lg transition hover:-translate-y-0.5
                                      hover:bg-black active:scale-[0.98]
                                    "
                                  >
                                    <Wand2 className="h-4 w-4" />
                                    {t("websiteTemplates.editTemplate")}
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white">
                                    <BadgeCheck className="h-4 w-4" />
                                  </div>

                                  <div className="min-w-0">
                                    <h3 className="truncate text-[17px] font-black tracking-[-0.02em] text-[#111827]">
                                      {template.name}
                                    </h3>

                                    <p className="truncate text-sm text-[#6b7280]">
                                      {displayCategory}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex shrink-0 gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handlePreviewTemplate(template.key)
                                  }
                                  className="
                                    rounded-lg border border-[#d1d5db] bg-white
                                    px-3 py-2 text-xs font-bold text-[#111827]
                                    transition hover:border-[#111827] hover:bg-[#111827]
                                    hover:text-white active:scale-[0.98]
                                  "
                                >
                                  {t("websiteTemplates.preview")}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditTemplate(template.key)
                                  }
                                  className="
                                    rounded-lg border border-[#111827] bg-[#111827]
                                    px-3 py-2 text-xs font-bold text-white
                                    transition hover:bg-black active:scale-[0.98]
                                  "
                                >
                                  {t("websiteTemplates.edit")}
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-[#e5e7eb] bg-[#f9fafb] p-12 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#6b7280] shadow-sm">
                        <Search className="h-6 w-6" />
                      </div>

                      <h3 className="mt-5 text-xl font-black text-[#111827]">
                        {t("websiteTemplates.emptyTitle")}
                      </h3>

                      <p className="mt-2 text-sm text-[#6b7280]">
                        {t("websiteTemplates.emptyText")}
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setActiveCategory("all");
                        }}
                        className="mt-6 rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
                      >
                        {t("websiteTemplates.showAll")}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
                    </div>
        </section>
      </div>
      )}
    </main>
  );
}