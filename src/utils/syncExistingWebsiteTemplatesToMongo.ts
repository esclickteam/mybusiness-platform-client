import {
  studioTemplateDefinitions,
  getStudioTemplateSeedById,
} from "../components/site-builder/studio/data/templates";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

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

function buildAuthHeaders(extraHeaders?: Record<string, string>) {
  const token = getStoredAuthToken();

  return {
    ...(extraHeaders || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
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

  const response = await fetch(`${API_BASE}/api/website-templates/bulk-upsert`, {
    method: "POST",
    credentials: "include",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    body: JSON.stringify({ templates }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to sync templates to Mongo");
  }

  return data;
}