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

const PROTECTED_TEMPLATE_KEYS = new Set([
  "nav",
  "stats",
  "services",
  "service",
  "process",
  "pricing",
  "plans",
  "testimonials",
  "reviews",
  "faq",
  "gallery",
  "items",
  "features",
  "trustPills",
  "pages",
  "sections",
  "products",
  "team",
]);

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

function isEmbeddedMediaString(value: unknown) {
  if (typeof value !== "string") return false;

  const clean = value.trim();

  return (
    clean.startsWith("data:image/") ||
    clean.startsWith("data:video/") ||
    clean.startsWith("data:audio/") ||
    clean.startsWith("blob:") ||
    clean.includes(";base64,")
  );
}

function isRemoteUrl(value: unknown) {
  if (typeof value !== "string") return false;

  const clean = value.trim().toLowerCase();

  return clean.startsWith("https://") || clean.startsWith("http://");
}

function isCloudinaryUrl(value: unknown) {
  if (typeof value !== "string") return false;

  const clean = value.trim().toLowerCase();

  return (
    clean.startsWith("https://res.cloudinary.com/") ||
    clean.startsWith("http://res.cloudinary.com/") ||
    clean.includes(".cloudinary.com/")
  );
}

function isVideoUrl(value: unknown) {
  if (typeof value !== "string") return false;

  const clean = value.trim().toLowerCase().split("?")[0].split("#")[0];

  return (
    clean.includes("/video/upload/") ||
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m4v") ||
    clean.endsWith(".ogv")
  );
}

function getBestPermanentMediaSrc(item: any) {
  if (!isPlainObject(item)) return "";

  const candidates = [
    item.secureUrl,
    item.secure_url,
    item.url,
    item.src,
    item.originalUrl,
    item.poster,
  ];

  const cloudinary = candidates.find((candidate) => isCloudinaryUrl(candidate));
  if (typeof cloudinary === "string") return cloudinary.trim();

  const remote = candidates.find((candidate) => isRemoteUrl(candidate));
  if (typeof remote === "string") return remote.trim();

  return "";
}

function normalizeMediaType(item: any, src: string) {
  const fromItem = String(
    item?.mediaType || item?.resourceType || item?.resource_type || "",
  )
    .trim()
    .toLowerCase();

  if (fromItem === "video") return "video";
  if (fromItem === "image") return "image";
  if (isVideoUrl(src)) return "video";

  return "image";
}

function removeTemporaryMediaUrlsFromContent(content: Record<string, any>) {
  const next: Record<string, any> = {};

  Object.entries(content || {}).forEach(([elementId, item]) => {
    if (!isPlainObject(item)) {
      next[elementId] = item;
      return;
    }

    const cleanItem = { ...item };
    const permanentSrc = getBestPermanentMediaSrc(cleanItem);

    const mediaKeys = [
      "src",
      "url",
      "secureUrl",
      "secure_url",
      "originalUrl",
      "poster",
      "previewUrl",
      "preview",
      "blobUrl",
      "dataUrl",
      "base64",
      "file",
    ];

    mediaKeys.forEach((key) => {
      const value = cleanItem[key];

      if (isEmbeddedMediaString(value)) {
        delete cleanItem[key];
      }
    });

    if (permanentSrc) {
      const mediaType = normalizeMediaType(cleanItem, permanentSrc);

      cleanItem.src = permanentSrc;
      cleanItem.url = permanentSrc;
      cleanItem.secureUrl = permanentSrc;
      cleanItem.mediaType = mediaType;
      cleanItem.resourceType = mediaType;
    } else {
      const currentSrc = String(
        cleanItem.secureUrl ||
          cleanItem.secure_url ||
          cleanItem.url ||
          cleanItem.src ||
          "",
      ).trim();

      if (isEmbeddedMediaString(currentSrc)) {
        delete cleanItem.src;
        delete cleanItem.url;
        delete cleanItem.secureUrl;
        delete cleanItem.secure_url;
        delete cleanItem.originalUrl;
        delete cleanItem.poster;
      }
    }

    next[elementId] = cleanItem;
  });

  return next;
}

function removeEmbeddedMediaDeep(value: any, seen = new WeakSet<object>()): any {
  if (typeof value === "string") {
    return isEmbeddedMediaString(value) ? undefined : value;
  }

  if (value === null) return null;

  const valueType = typeof value;

  if (valueType === "number" || valueType === "boolean") return value;

  if (
    valueType === "undefined" ||
    valueType === "function" ||
    valueType === "symbol" ||
    valueType === "bigint"
  ) {
    return undefined;
  }

  if (typeof File !== "undefined" && value instanceof File) return undefined;
  if (typeof Blob !== "undefined" && value instanceof Blob) return undefined;

  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) {
    return value
      .map((item) => removeEmbeddedMediaDeep(item, seen))
      .filter((item) => item !== undefined);
  }

  if (typeof value === "object") {
    if (seen.has(value)) return undefined;

    seen.add(value);

    const output: Record<string, any> = {};

    Object.entries(value).forEach(([key, item]) => {
      const isLikelyPreviewKey = [
        "blob",
        "blobUrl",
        "dataUrl",
        "base64",
        "file",
        "previewFile",
        "localFile",
      ].includes(key);

      if (isLikelyPreviewKey && !isRemoteUrl(item)) return;

      const cleaned = removeEmbeddedMediaDeep(item, seen);

      if (cleaned !== undefined) {
        output[key] = cleaned;
      }
    });

    seen.delete(value);

    return output;
  }

  return undefined;
}

function splitPath(path: string) {
  return String(path || "")
    .trim()
    .replace(/^\.+/, "")
    .replace(/\.+$/, "")
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);
}

function canWriteTemplatePath(root: Record<string, any>, path: string) {
  const parts = splitPath(path);

  if (!parts.length) return false;

  const first = parts[0];

  if (PROTECTED_TEMPLATE_KEYS.has(first) && parts.length === 1) {
    return false;
  }

  let current: any = root;

  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];

    if (!isPlainObject(current)) return false;

    const nextValue = current[part];

    if (Array.isArray(nextValue)) return false;

    if (nextValue === undefined || nextValue === null) {
      current[part] = {};
    } else if (!isPlainObject(nextValue)) {
      return false;
    }

    current = current[part];
  }

  const last = parts[parts.length - 1];
  const existingValue = current?.[last];

  if (Array.isArray(existingValue)) return false;
  if (isPlainObject(existingValue)) return false;

  return true;
}

function setTemplatePathValue(
  root: Record<string, any>,
  path: string,
  value: any,
) {
  if (!canWriteTemplatePath(root, path)) return false;

  const parts = splitPath(path);
  let current: Record<string, any> = root;

  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];

    if (!isPlainObject(current[part])) {
      current[part] = {};
    }

    current = current[part];
  }

  current[parts[parts.length - 1]] = value;

  return true;
}

function collectMediaSyncPaths(elementId: string, item: Record<string, any>) {
  const paths = new Set<string>();

  const candidates = [
    elementId,
    item.field,
    item.dataField,
    item.imageField,
    item.imagePath,
    item.path,
    item.templatePath,
    item.key,
  ];

  candidates.forEach((candidate) => {
    const clean = String(candidate || "").trim();

    if (!clean) return;
    if (clean.startsWith("__")) return;
    if (clean.includes(" ")) return;
    if (clean.includes("[")) return;

    const parts = splitPath(clean);

    if (!parts.length) return;

    const first = parts[0];

    if (PROTECTED_TEMPLATE_KEYS.has(first) && parts.length === 1) {
      return;
    }

    /*
      השדות האמיתיים בתבניות הם בדרך כלל hero.image / project.image / about.image.
      אם זה רק image/img/video/media/src בלי parent — לא כותבים לשורש כדי לא לדרוס דברים.
    */
    if (
      parts.length === 1 &&
      ["image", "img", "video", "media", "src", "url", "secureUrl"].includes(
        parts[0],
      )
    ) {
      return;
    }

    paths.add(parts.join("."));
  });

  return Array.from(paths);
}

function syncVisualContentMediaToTemplateFields(data: Record<string, any>) {
  const content = isPlainObject(data[VISUAL_CONTENT_KEY])
    ? data[VISUAL_CONTENT_KEY]
    : {};

  let next = data;
  let didClone = false;

  function ensureClone() {
    if (!didClone) {
      next = { ...next };
      didClone = true;
    }

    return next;
  }

  Object.entries(content).forEach(([elementId, item]) => {
    if (!isPlainObject(item)) return;

    const src = getBestPermanentMediaSrc(item);
    if (!src) return;

    const mediaType = normalizeMediaType(item, src);
    const paths = collectMediaSyncPaths(elementId, item);

    if (!paths.length) return;

    const workingRoot = ensureClone();

    paths.forEach((path) => {
      const wrote = setTemplatePathValue(workingRoot, path, src);

      if (!wrote) {
        return;
      }

      const mediaTypePath = `${path}MediaType`;
      const resourceTypePath = `${path}ResourceType`;

      setTemplatePathValue(workingRoot, mediaTypePath, mediaType);
      setTemplatePathValue(workingRoot, resourceTypePath, mediaType);
    });
  });

  return next;
}

function buildLeanTemplateData(data: Record<string, any>) {
  const cleanData = (removeEmbeddedMediaDeep(cleanVisualValue(data || {}) || {}) || {}) as Record<string, any>;

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

  const withCleanVisualKeys = {
    ...cleanData,

    [VISUAL_CONTENT_KEY]: removeTemporaryMediaUrlsFromContent(content),
    [VISUAL_STYLE_KEY]: styles,
    [VISUAL_ANIMATION_KEY]: animations,
    [VISUAL_DELETED_KEY]: deleted,
    [VISUAL_FORM_KEY]: forms,
  };

  return syncVisualContentMediaToTemplateFields(withCleanVisualKeys);
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
