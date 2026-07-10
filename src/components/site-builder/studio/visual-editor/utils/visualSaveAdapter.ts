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

const VISUAL_CONTENT_KEY = "__content";
const VISUAL_STYLE_KEY = "__styles";
const VISUAL_ANIMATION_KEY = "__animations";
const VISUAL_DELETED_KEY = "__deletedElements";
const VISUAL_FORM_KEY = "__formBuilderByElement";

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeSlug(value: unknown) {
  const clean = String(value || "").trim();

  if (!clean || clean === "/") return "";

  return clean.replace(/^\//, "").replace(/\/$/, "");
}

function cleanVisualValue(value: any, seen = new WeakSet<object>()): any {
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
      (win.Window && value instanceof win.Window)
    ) {
      return undefined;
    }
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => cleanVisualValue(item, seen))
      .filter((item) => item !== undefined);
  }

  if (typeof value === "object") {
    if (seen.has(value)) return undefined;

    seen.add(value);

    const blockedKeys = new Set([
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

    const output: Record<string, any> = {};

    Object.entries(value).forEach(([key, item]) => {
      if (!key) return;
      if (blockedKeys.has(key)) return;
      if (key.startsWith("__react")) return;
      if (key.startsWith("_react")) return;
      if (key.includes("Fiber") || key.includes("fiber")) return;

      const cleaned = cleanVisualValue(item, seen);

      if (cleaned !== undefined) {
        output[key] = cleaned;
      }
    });

    seen.delete(value);

    return output;
  }

  return undefined;
}

function removeTemporaryMediaUrlsFromContent(content: Record<string, any>) {
  const next: Record<string, any> = {};

  Object.entries(content || {}).forEach(([elementId, item]) => {
    if (!isPlainObject(item)) {
      next[elementId] = item;
      return;
    }

    const cleanItem = { ...item };

    const src = String(
      cleanItem.src || cleanItem.url || cleanItem.secureUrl || "",
    );

    const isTemporaryMedia =
      src.startsWith("data:image/") ||
      src.startsWith("data:video/") ||
      src.startsWith("blob:");

    if (isTemporaryMedia) {
      delete cleanItem.src;
      delete cleanItem.url;
      delete cleanItem.secureUrl;
    }

    next[elementId] = cleanItem;
  });

  return next;
}

function buildLeanTemplateData(data: Record<string, any>) {
  const cleanData = (cleanVisualValue(data || {}) || {}) as Record<string, any>;

  const content = isPlainObject(cleanData[VISUAL_CONTENT_KEY])
    ? cleanData[VISUAL_CONTENT_KEY]
    : {};

  const styles = isPlainObject(cleanData[VISUAL_STYLE_KEY])
    ? cleanData[VISUAL_STYLE_KEY]
    : {};

  const animations = isPlainObject(cleanData[VISUAL_ANIMATION_KEY])
    ? cleanData[VISUAL_ANIMATION_KEY]
    : {};

  const deleted = isPlainObject(cleanData[VISUAL_DELETED_KEY])
    ? cleanData[VISUAL_DELETED_KEY]
    : {};

  const forms = isPlainObject(cleanData[VISUAL_FORM_KEY])
    ? cleanData[VISUAL_FORM_KEY]
    : {};

  return {
    ...cleanData,

    [VISUAL_CONTENT_KEY]: removeTemporaryMediaUrlsFromContent(content),
    [VISUAL_STYLE_KEY]: styles,
    [VISUAL_ANIMATION_KEY]: animations,
    [VISUAL_DELETED_KEY]: deleted,
    [VISUAL_FORM_KEY]: forms,
  };
}

export function buildVisualSavePayload(input: VisualSaveAdapterInput) {
  const now = new Date().toISOString();

  const published = Boolean(input.published || input.status === "published");
  const status: "draft" | "published" = published ? "published" : "draft";

  const slug = normalizeSlug(input.slug);
  const snapshotPageId = String(input.snapshotPageId || "home");

  const templateData = buildLeanTemplateData({
    ...(input.data || {}),
    __activePageId: snapshotPageId,
    __siteSlug: slug,
    __publicUrl: String(input.publicUrl || ""),
    __siteDomain: String(input.siteDomain || ""),
  });

  return {
    templateKey: String(input.templateKey || ""),
    editorMode: "visual-react" as const,
    templateEditorMode: "visual-react" as const,

    /*
      חשוב:
      כן מחזירים גם data וגם templateData.
      חלק מהקוד הישן קורא data, וחלק מהקוד החדש קורא templateData.
      שניהם מצביעים לאותו מידע נקי.
    */
    data: templateData,
    templateData,

    updatedAt: now,
    published,
    status,

    slug,
    publicUrl: String(input.publicUrl || ""),
    siteDomain: String(input.siteDomain || ""),

    domain: slug
      ? {
          slug,
          published,
        }
      : undefined,

    /*
      ב־Visual React לא שולחים HTML מלא כדי לא לנפח payload.
    */
    htmlSnapshot: "",
    snapshotPageId,

    projectData: {
      editorMode: "visual-react",
      templateKey: String(input.templateKey || ""),
      updatedAt: now,
      activePageId: snapshotPageId,
      data: templateData,
      templateData,
    },

    visualEditorPayload: {
      editorMode: "visual-react",
      templateKey: String(input.templateKey || ""),
      updatedAt: now,
      activePageId: snapshotPageId,
      data: templateData,
      templateData,
    },
  };
}

export function readSavedVisualTemplateData(site: any): Record<string, any> {
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
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      return candidate as Record<string, any>;
    }
  }

  return {};
}

export function readSavedVisualTemplateKey(site: any): string {
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
    Boolean(site?.templateData) ||
    Boolean(site?.visualEditorPayload?.templateData)
  );
}