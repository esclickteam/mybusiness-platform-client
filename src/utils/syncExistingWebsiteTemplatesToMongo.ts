import {
  studioTemplateDefinitions,
  getStudioTemplateSeedById,
} from "../components/site-builder/studio/data/templates";

const RAW_API_BASE =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";

const API_BASE = RAW_API_BASE.replace(/\/api\/?$/, "").replace(/\/$/, "");

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
      "תבנית אתר",

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
      "אתר עסקי מוכן",

    heroSubtitle:
      seed?.heroSubtitle ||
      template.description ||
      seed?.description ||
      "תבנית אתר מוכנה לעריכה מלאה.",

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

export async function syncExistingWebsiteTemplatesToMongo() {
  const templates = studioTemplateDefinitions.map((template, index) =>
    normalizeTemplateForMongo(template, index)
  );

  return apiRequest<{
    success: boolean;
    message: string;
    count: number;
    templates: any[];
  }>("/api/website-templates/bulk-upsert", {
    method: "POST",
    body: JSON.stringify({ templates }),
  });
}