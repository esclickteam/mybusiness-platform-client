import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";

import WebsiteStudioPage from "../components/site-builder/studio/WebsiteStudioPage";

import type { SiteSavePayload } from "../components/site-builder/studio/types";
import type {
  ReadyBlockType,
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../components/site-builder/studio/data/readyWebsiteTypes";

type BusinessMiniSiteBuilderProps = {
  businessId?: string;
};

type WebsiteStudioPageWithTemplateProps = {
  businessId: string;
  initialSlug: string;
  onSave: (payload: SiteSavePayload) => Promise<void>;
  initialTemplateId?: string;
  initialTemplateSeed?: ReadyWebsiteTemplateSeed;
  forceTemplateLoad?: boolean;
};

type MongoWebsiteTemplateBlock = {
  id?: string;
  type?: string;
  variant?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  description?: string;
  image?: string;
  images?: string[];
  items?: any[];
  order?: number;
  isVisible?: boolean;
};

type MongoWebsiteTemplate = {
  _id?: string;
  key: string;
  rendererKey?: string;
  renderMode?: "registry" | "blocks";
  editorMode?: "renderer" | "blocks";
  name: string;
  category?: string;
  categoryLabel?: string;
  description?: string;
  niche?: string;
  layout?: string;
  image?: string;
  thumbnailUrl?: string;
  previewImageUrl?: string;
  palette?: Partial<ReadyWebsitePalette>;
  blocks?: MongoWebsiteTemplateBlock[];
  heroTitle?: string;
  heroSubtitle?: string;
};

const StudioPage =
  WebsiteStudioPage as React.ComponentType<WebsiteStudioPageWithTemplateProps>;

const RAW_API_BASE =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";

const API_BASE = RAW_API_BASE.replace(/\/api\/?$/, "").replace(/\/$/, "");

const allowedReadyBlockTypes: ReadyBlockType[] = [
  "header",
  "hero",
  "trust",
  "about",
  "services",
  "pricing",
  "booking",
  "gallery",
  "store",
  "testimonials",
  "reviews",
  "faq",
  "contact",
  "team",
  "process",
  "lead",
  "menu",
  "offers",
  "programs",
  "results",
  "listings",
  "map",
  "packages",
  "clients",
  "course",
  "collection",
  "areas",
  "emergency",
  "projects",
  "benefits",
  "story",
  "doctor",
  "artist",
  "club",
  "footer",
];

function safeParseSavedSite(raw: string | null): Partial<SiteSavePayload> | null {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Partial<SiteSavePayload>;
  } catch {
    return null;
  }
}

function normalizeTemplateId(value: string | null | undefined) {
  const cleanValue = String(value || "").trim();

  if (!cleanValue) return "";

  return cleanValue.toLowerCase();
}

function normalizeRenderMode(value: unknown): "registry" | "blocks" {
  return value === "blocks" ? "blocks" : "registry";
}

function normalizeEditorMode(value: unknown): "renderer" | "blocks" {
  return value === "blocks" ? "blocks" : "renderer";
}

function getStoredAuthToken() {
  if (typeof window === "undefined") return "";

  const keys = [
    "token",
    "authToken",
    "accessToken",
    "jwt",
    "bizuplyToken",
    "businessToken",
  ];

  for (const key of keys) {
    const value = window.localStorage.getItem(key);
    if (value) return value;
  }

  return "";
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredAuthToken();

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Request failed");
  }

  return data as T;
}

function createSafeTemplatePalette(
  palette?: Partial<ReadyWebsitePalette>
): ReadyWebsitePalette {
  return {
    primary: palette?.primary || "#111827",
    secondary: palette?.secondary || "#4B5563",
    accent: palette?.accent || "#2563EB",
    background: palette?.background || "#FFFFFF",
    surface: palette?.surface || "#F9FAFB",
    text: palette?.text || "#111827",
    muted: palette?.muted || "#6B7280",
    dark: palette?.dark || "#020617",
  };
}

function normalizeReadyBlockType(value: string | undefined): ReadyBlockType {
  const clean = String(value || "").trim();

  if (allowedReadyBlockTypes.includes(clean as ReadyBlockType)) {
    return clean as ReadyBlockType;
  }

  return "hero";
}

function normalizeStringItems(items: any[] | undefined): string[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (typeof item === "string") return item;

      if (item?.title && item?.text) {
        return `${item.title} - ${item.text}`;
      }

      if (item?.title && item?.description) {
        return `${item.title} - ${item.description}`;
      }

      if (item?.title) return String(item.title);
      if (item?.text) return String(item.text);
      if (item?.description) return String(item.description);

      return String(item || "");
    })
    .filter(Boolean);
}

function normalizeTemplateBlocks(
  blocks: MongoWebsiteTemplateBlock[] | undefined
): ReadyWebsiteBlock[] {
  if (!Array.isArray(blocks)) return [];

  return blocks
    .filter((block) => block && block.isVisible !== false)
    .map((block, index) => {
      const type = normalizeReadyBlockType(block.type);

      return {
        id: block.id || `${type}-${index + 1}`,
        type,
        variant: block.variant || "default",
        title: block.title || block.description || "",
        subtitle: block.subtitle || "",
        text: block.text || block.description || "",
        image: block.image || block.images?.[0] || "",
        items: normalizeStringItems(block.items),
      };
    });
}

async function fetchWebsiteTemplateByKey(templateKey: string) {
  const cleanKey = normalizeTemplateId(templateKey);

  if (!cleanKey) {
    throw new Error("לא נמצא מזהה תבנית");
  }

  const data = await apiRequest<{
    success: boolean;
    template?: MongoWebsiteTemplate;
    message?: string;
  }>(`/api/website-templates/${encodeURIComponent(cleanKey)}`, {
    method: "GET",
  });

  if (!data?.success || !data?.template) {
    throw new Error(data?.message || "שגיאה בטעינת התבנית ממונגו");
  }

  return data.template;
}

function mongoTemplateToSeed(
  template: MongoWebsiteTemplate
): ReadyWebsiteTemplateSeed {
  const originalBlocks = Array.isArray(template.blocks) ? template.blocks : [];
  const blocks = normalizeTemplateBlocks(originalBlocks);

  const heroBlock = originalBlocks.find((block) => block?.type === "hero");

  const image =
    template.image ||
    template.previewImageUrl ||
    template.thumbnailUrl ||
    heroBlock?.image ||
    heroBlock?.images?.[0] ||
    "";

  const category = template.category || "business";
  const key = normalizeTemplateId(template.key);
  const rendererKey = normalizeTemplateId(template.rendererKey || template.key);

  return {
    id: key,
    key,
    rendererKey: rendererKey || key,
    renderMode: normalizeRenderMode(template.renderMode),
    editorMode: normalizeEditorMode(template.editorMode),

    name: template.name || key,
    category,
    description: template.description || "",
    niche: template.niche || category,
    layout: template.layout || "full",
    image,

    heroTitle:
      template.heroTitle ||
      heroBlock?.title ||
      template.name ||
      "אתר עסקי מוכן",

    heroSubtitle:
      template.heroSubtitle ||
      heroBlock?.subtitle ||
      template.description ||
      "תבנית אתר מוכנה לעריכה מלאה.",

    palette: createSafeTemplatePalette(template.palette),
    blocks,
  } as ReadyWebsiteTemplateSeed;
}

function saveSelectedTemplateToLocalStorage(
  templateId: string,
  seed: ReadyWebsiteTemplateSeed
) {
  if (typeof window === "undefined") return;

  const cleanTemplateId = normalizeTemplateId(templateId || seed.id);

  if (!cleanTemplateId) return;

  const safeSeed = {
    ...seed,
    id: normalizeTemplateId(seed.id || cleanTemplateId),
    key: normalizeTemplateId((seed as any).key || cleanTemplateId),
    rendererKey: normalizeTemplateId(
      (seed as any).rendererKey || (seed as any).key || seed.id || cleanTemplateId
    ),
    renderMode: normalizeRenderMode((seed as any).renderMode),
    editorMode: normalizeEditorMode((seed as any).editorMode),
  };

  window.localStorage.setItem("bizuply-selected-template-key", cleanTemplateId);
  window.localStorage.setItem("bizuply-selected-template-id", cleanTemplateId);
  window.localStorage.setItem(
    "bizuply-selected-template-data",
    JSON.stringify(safeSeed)
  );

  console.log("[BIZUPLY TEMPLATE] saved selected template seed", {
    templateId: cleanTemplateId,
    key: (safeSeed as any).key,
    rendererKey: (safeSeed as any).rendererKey,
    renderMode: (safeSeed as any).renderMode,
    editorMode: (safeSeed as any).editorMode,
    blocksCount: Array.isArray(safeSeed.blocks) ? safeSeed.blocks.length : 0,
  });
}

export default function BusinessMiniSiteBuilder({
  businessId: businessIdFromProps,
}: BusinessMiniSiteBuilderProps = {}) {
  const params = useParams<{ businessId: string }>();
  const businessId = businessIdFromProps || params.businessId || "";

  const [searchParams] = useSearchParams();

  const [templateSeed, setTemplateSeed] =
    useState<ReadyWebsiteTemplateSeed | undefined>(undefined);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateError, setTemplateError] = useState("");

  const storageKey = useMemo(() => {
    return `bizuply-mini-site-${businessId || "demo"}`;
  }, [businessId]);

  const templateIdFromUrl = useMemo(() => {
    return (
      normalizeTemplateId(searchParams.get("template")) ||
      normalizeTemplateId(searchParams.get("templateKey")) ||
      normalizeTemplateId(searchParams.get("templateId"))
    );
  }, [searchParams]);

  const templateIdFromStorage = useMemo(() => {
    if (typeof window === "undefined") return "";

    return (
      normalizeTemplateId(
        localStorage.getItem("bizuply-selected-template-key")
      ) ||
      normalizeTemplateId(localStorage.getItem("bizuply-selected-template-id"))
    );
  }, []);

  const selectedTemplateId = useMemo(() => {
    return templateIdFromUrl || templateIdFromStorage;
  }, [templateIdFromUrl, templateIdFromStorage]);

  const shouldForceTemplateLoad = useMemo(() => {
    return Boolean(selectedTemplateId && templateSeed);
  }, [selectedTemplateId, templateSeed]);

  const initialSlug = useMemo(() => {
    if (!businessId) return "your-business";

    if (templateSeed?.id && templateIdFromUrl) {
      return templateSeed.id;
    }

    const saved = safeParseSavedSite(localStorage.getItem(storageKey));

    return typeof saved?.slug === "string" && saved.slug.trim()
      ? saved.slug
      : "your-business";
  }, [businessId, templateSeed, templateIdFromUrl, storageKey]);

  useEffect(() => {
    if (!selectedTemplateId) {
      setTemplateSeed(undefined);
      setTemplateError("");
      setTemplateLoading(false);
      return;
    }

    let alive = true;

    async function loadTemplateFromMongo() {
      try {
        setTemplateLoading(true);
        setTemplateError("");

        const mongoTemplate = await fetchWebsiteTemplateByKey(selectedTemplateId);
        const seed = mongoTemplateToSeed(mongoTemplate);

        if (!alive) return;

        setTemplateSeed(seed);
        saveSelectedTemplateToLocalStorage(selectedTemplateId, seed);
      } catch (error: any) {
        console.error("LOAD TEMPLATE FROM MONGO ERROR:", error);

        if (!alive) return;

        setTemplateSeed(undefined);
        setTemplateError(error?.message || "שגיאה בטעינת התבנית");
      } finally {
        if (alive) {
          setTemplateLoading(false);
        }
      }
    }

    loadTemplateFromMongo();

    return () => {
      alive = false;
    };
  }, [selectedTemplateId]);

  const handleSave = async (payload: SiteSavePayload) => {
    if (!businessId) {
      console.error("[BIZUPLY PUBLIC SAVE ERROR] Missing businessId", payload);
      alert("לא נמצא מזהה עסק. אי אפשר לשמור את האתר.");
      return;
    }

    const finalSlug = payload.slug || initialSlug || "your-business";
    const finalPublished = Boolean(payload.published);
    const htmlLength = String(payload.html || "").length;
    const cssLength = String(payload.css || "").length;
    const pagesCount = Array.isArray(payload.pages) ? payload.pages.length : 0;
    const pagesDebug = Array.isArray(payload.pages)
      ? payload.pages.map((page: any) => ({
          id: page?.id,
          title: page?.title,
          isHome: page?.isHome,
          htmlLength: String(page?.html || "").length,
          cssLength: String(page?.css || "").length,
        }))
      : [];

    const safePayload: SiteSavePayload & {
      businessId: string;
      templateId?: string;
      templateKey?: string;
      templateName?: string;
    } = {
      ...payload,
      businessId,
      templateId: selectedTemplateId || undefined,
      templateKey: selectedTemplateId || undefined,
      templateName: templateSeed?.name,
      slug: finalSlug,
      published: finalPublished,
      html: payload.html || "",
      css: payload.css || "",
      pages: Array.isArray(payload.pages) ? payload.pages : [],
      activePageId: payload.activePageId || "home",
      projectData: payload.projectData || {},
      updatedAt: payload.updatedAt || new Date().toISOString(),
      status: payload.status || (finalPublished ? "published" : "draft"),
      domain: {
        slug: payload.domain?.slug || finalSlug,
        published: Boolean(payload.domain?.published ?? finalPublished),
        customDomain: payload.domain?.customDomain,
      },
      seo: payload.seo || {
        title: templateSeed?.name
          ? `${templateSeed.name} | האתר שלי`
          : "האתר שלי",
        description:
          templateSeed?.description || "אתר עסקי מקצועי שנבנה עם Bizuply",
      },
      brand: payload.brand || {
        businessName: "העסק שלי",
      },
    };

    try {
      console.groupCollapsed("[BIZUPLY PUBLIC SAVE] start");
      console.log("[BIZUPLY PUBLIC SAVE] businessId:", businessId);
      console.log("[BIZUPLY PUBLIC SAVE] selectedTemplateId:", selectedTemplateId);
      console.log("[BIZUPLY PUBLIC SAVE] published:", finalPublished);
      console.log("[BIZUPLY PUBLIC SAVE] status:", safePayload.status);
      console.log("[BIZUPLY PUBLIC SAVE] slug:", finalSlug);
      console.log("[BIZUPLY PUBLIC SAVE] htmlLength:", htmlLength);
      console.log("[BIZUPLY PUBLIC SAVE] cssLength:", cssLength);
      console.log("[BIZUPLY PUBLIC SAVE] pagesCount:", pagesCount);
      console.table(pagesDebug);
      console.log("[BIZUPLY PUBLIC SAVE] payload:", safePayload);
      console.groupEnd();

      if (finalPublished && htmlLength === 0 && !pagesDebug.some((page) => page.htmlLength > 0)) {
        console.error("[BIZUPLY PUBLIC SAVE ERROR] Trying to publish empty HTML/pages", {
          htmlLength,
          pagesDebug,
          payload: safePayload,
        });

        alert("האתר לא פורסם כי לא נוצר HTML לפרסום. שלחי לי את הקונסול.");
        return;
      }

      localStorage.setItem(storageKey, JSON.stringify(safePayload));

      if (selectedTemplateId && templateSeed) {
        saveSelectedTemplateToLocalStorage(selectedTemplateId, templateSeed);
      }

      const data = await apiRequest<{
        success: boolean;
        message?: string;
        error?: string;
        url?: string;
        site?: any;
      }>("/api/site-builder/site", {
        method: "PUT",
        body: JSON.stringify(safePayload),
      });

      console.groupCollapsed("[BIZUPLY PUBLIC SAVE] server response");
      console.log("[BIZUPLY PUBLIC SAVE] success:", data?.success);
      console.log("[BIZUPLY PUBLIC SAVE] url:", data?.url);
      console.log("[BIZUPLY PUBLIC SAVE] server htmlLength:", String(data?.site?.html || "").length);
      console.log("[BIZUPLY PUBLIC SAVE] server cssLength:", String(data?.site?.css || "").length);
      console.log(
        "[BIZUPLY PUBLIC SAVE] server pages:",
        Array.isArray(data?.site?.pages)
          ? data.site.pages.map((page: any) => ({
              id: page?.id,
              title: page?.title,
              isHome: page?.isHome,
              htmlLength: String(page?.html || "").length,
              cssLength: String(page?.css || "").length,
            }))
          : [],
      );
      console.log("[BIZUPLY PUBLIC SAVE] full response:", data);
      console.groupEnd();

      if (!data?.success) {
        throw new Error(data?.message || data?.error || "Failed to save mini site");
      }

      if (data?.site) {
        localStorage.setItem(storageKey, JSON.stringify(data.site));
      }
    } catch (error) {
      console.error("[BIZUPLY PUBLIC SAVE ERROR]", error);
      alert("אירעה שגיאה בשמירת האתר. פתחי Console ושלחי לי את השגיאה.");
    }
  };

  if (!businessId) {
    return <Navigate to="/business/dashboard" replace />;
  }

  if (templateLoading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-white px-4"
      >
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-7 text-center shadow-xl">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />

          <p className="text-base font-black text-slate-950">
            טוען את התבנית לעורך...
          </p>

          <p className="mt-2 text-sm font-bold text-slate-400">
            {selectedTemplateId}
          </p>
        </div>
      </div>
    );
  }

  if (templateError) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-white px-4"
      >
        <div className="max-w-lg rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-black text-red-700">
            לא הצלחנו לפתוח את התבנית
          </h1>

          <p className="mt-3 text-sm font-bold leading-7 text-red-600">
            {templateError}
          </p>

          <p className="mt-3 text-xs font-bold text-red-400">
            Template: {selectedTemplateId || "לא נמצא"}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white"
          >
            נסי שוב
          </button>
        </div>
      </div>
    );
  }

  if (selectedTemplateId && !templateSeed) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-white px-4"
      >
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-7 text-center shadow-xl">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />

          <p className="text-base font-black text-slate-950">
            מכין את התבנית לעורך...
          </p>

          <p className="mt-2 text-sm font-bold text-slate-400">
            {selectedTemplateId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <StudioPage
      businessId={businessId}
      initialSlug={initialSlug}
      initialTemplateId={selectedTemplateId || undefined}
      initialTemplateSeed={templateSeed}
      forceTemplateLoad={shouldForceTemplateLoad}
      onSave={handleSave}
    />
  );
}