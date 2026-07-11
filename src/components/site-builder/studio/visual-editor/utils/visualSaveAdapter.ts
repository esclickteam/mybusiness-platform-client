import {
  FORM_BUILDER_BY_ELEMENT_KEY,
  VISUAL_ANIMATION_KEY,
  VISUAL_ATTRIBUTE_KEY,
  VISUAL_CONTENT_KEY,
  VISUAL_DELETED_KEY,
  VISUAL_HIDDEN_KEY,
  VISUAL_LAYOUT_KEY,
  VISUAL_LOCKED_KEY,
  VISUAL_RESPONSIVE_KEY,
  VISUAL_STYLE_KEY,
  normalizeVisualData,
  sanitizeVisualDataForPersistence,
} from "./visualData";

export type VisualSaveAdapterInput = {
  templateKey: string;
  data: Record<string, any>;
  slug?: string;
  published?: boolean;
  status?: "draft" | "published";
  publicUrl?: string;
  siteDomain?: string;
  htmlSnapshot?: string;
  snapshotPageId?: string;
};

const VISUAL_MAP_KEYS = [
  VISUAL_CONTENT_KEY,
  VISUAL_STYLE_KEY,
  VISUAL_ANIMATION_KEY,
  VISUAL_DELETED_KEY,
  VISUAL_LAYOUT_KEY,
  VISUAL_ATTRIBUTE_KEY,
  VISUAL_RESPONSIVE_KEY,
  VISUAL_LOCKED_KEY,
  VISUAL_HIDDEN_KEY,
  FORM_BUILDER_BY_ELEMENT_KEY,
] as const;

const BLOCKED_OBJECT_KEYS = new Set([
  "node",
  "element",
  "domNode",
  "root",
  "canvasElement",
  "canvasRef",
  "selectedElement",
  "hoveredElement",
  "lastClickedVisualNode",
  "editingNode",
  "ref",
  "current",
  "ownerDocument",
  "parentNode",
  "parentElement",
  "children",
  "childNodes",
  "firstChild",
  "lastChild",
  "nextSibling",
  "previousSibling",
  "__reactFiber",
  "__reactProps",
  "__reactInternalInstance",
  "_owner",
  "_store",
]);

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeSlug(value: unknown) {
  const clean = String(value || "").trim();

  if (!clean || clean === "/") return "";

  return clean.replace(/^\/+/, "").replace(/\/+$/, "");
}

function cleanSerializableValue(
  value: any,
  seen = new WeakSet<object>(),
): any {
  if (value === null) return null;

  const valueType = typeof value;

  if (
    valueType === "string" ||
    valueType === "number" ||
    valueType === "boolean"
  ) {
    return value;
  }

  if (
    valueType === "undefined" ||
    valueType === "function" ||
    valueType === "symbol" ||
    valueType === "bigint"
  ) {
    return undefined;
  }

  if (typeof window !== "undefined") {
    const win = window as any;

    if (
      (win.Node && value instanceof win.Node) ||
      (win.Element && value instanceof win.Element) ||
      (win.HTMLElement && value instanceof win.HTMLElement) ||
      (win.Document && value instanceof win.Document) ||
      (win.Window && value instanceof win.Window) ||
      (win.Event && value instanceof win.Event)
    ) {
      return undefined;
    }
  }

  if (typeof File !== "undefined" && value instanceof File) return undefined;
  if (typeof Blob !== "undefined" && value instanceof Blob) return undefined;

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => cleanSerializableValue(item, seen))
      .filter((item) => item !== undefined);
  }

  if (typeof value === "object") {
    if (seen.has(value)) return undefined;

    seen.add(value);

    const output: Record<string, any> = {};

    Object.entries(value).forEach(([key, item]) => {
      if (!key) return;
      if (BLOCKED_OBJECT_KEYS.has(key)) return;
      if (key.startsWith("__react")) return;
      if (key.startsWith("_react")) return;
      if (key.toLowerCase().includes("fiber")) return;

      const cleaned = cleanSerializableValue(item, seen);

      if (cleaned !== undefined) {
        output[key] = cleaned;
      }
    });

    seen.delete(value);

    return output;
  }

  return undefined;
}

function readPlainObject(
  source: Record<string, any>,
  key: string,
) {
  const value = source?.[key];

  return isPlainObject(value) ? value : {};
}

function normalizeVisualMaps(data: Record<string, any>) {
  const normalized = normalizeVisualData(data);

  const result: Record<string, any> = {
    ...normalized,
  };

  VISUAL_MAP_KEYS.forEach((key) => {
    result[key] = readPlainObject(normalized, key);
  });

  return result;
}

function buildLeanTemplateData(data: Record<string, any>) {
  const serializable =
    (cleanSerializableValue(data || {}) || {}) as Record<string, any>;

  const normalized = normalizeVisualMaps(serializable);
  const sanitized = sanitizeVisualDataForPersistence(normalized);

  return normalizeVisualMaps(sanitized);
}

export function buildVisualSavePayload(
  input: VisualSaveAdapterInput,
) {
  const now = new Date().toISOString();

  const published = Boolean(
    input.published || input.status === "published",
  );

  const status: "draft" | "published" = published
    ? "published"
    : "draft";

  const slug = normalizeSlug(input.slug);
  const snapshotPageId = String(
    input.snapshotPageId || "home",
  ).trim() || "home";

  const templateKey = String(input.templateKey || "")
    .trim()
    .toLowerCase();

  const publicUrl = String(input.publicUrl || "").trim();
  const siteDomain = String(input.siteDomain || "").trim();

  const templateData = buildLeanTemplateData({
    ...(input.data || {}),
    __activePageId: snapshotPageId,
    __siteSlug: slug,
    __publicUrl: publicUrl,
    __siteDomain: siteDomain,
  });

  const htmlSnapshot = String(input.htmlSnapshot || "");

  return {
    templateKey,
    editorMode: "visual-react" as const,
    templateEditorMode: "visual-react" as const,

    data: templateData,
    templateData,

    updatedAt: now,
    published,
    status,

    slug,
    publicUrl,
    siteDomain,

    domain: slug
      ? {
          slug,
          published,
        }
      : undefined,

    htmlSnapshot,
    snapshotPageId,

    projectData: {
      editorMode: "visual-react",
      templateKey,
      updatedAt: now,
      activePageId: snapshotPageId,
      data: templateData,
      templateData,
    },

    visualEditorPayload: {
      editorMode: "visual-react",
      templateKey,
      updatedAt: now,
      activePageId: snapshotPageId,
      data: templateData,
      templateData,
    },
  };
}

export function readSavedVisualTemplateData(
  site: any,
): Record<string, any> {
  const candidates = [
    site?.templateData,
    site?.data,

    site?.visualEditorPayload?.templateData,
    site?.visualEditorPayload?.data,

    site?.projectData?.templateData,
    site?.projectData?.data,

    site?.editor?.templateData,
    site?.editor?.data,
  ];

  for (const candidate of candidates) {
    if (isPlainObject(candidate)) {
      return normalizeVisualMaps(candidate);
    }
  }

  return normalizeVisualMaps({});
}

export function readSavedVisualTemplateKey(site: any) {
  return String(
    site?.templateKey ||
      site?.projectData?.templateKey ||
      site?.visualEditorPayload?.templateKey ||
      site?.editor?.templateKey ||
      "",
  )
    .trim()
    .toLowerCase();
}

export function isVisualReactSavedSite(site: any) {
  const mode = String(
    site?.templateEditorMode ||
      site?.editorMode ||
      site?.projectData?.editorMode ||
      site?.visualEditorPayload?.editorMode ||
      "",
  )
    .trim()
    .toLowerCase();

  return (
    mode === "visual-react" ||
    isPlainObject(site?.templateData) ||
    isPlainObject(site?.visualEditorPayload?.templateData) ||
    isPlainObject(site?.projectData?.templateData)
  );
}
