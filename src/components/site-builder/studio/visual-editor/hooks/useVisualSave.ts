import { useCallback, useEffect, useMemo, useState } from "react";

import type { StudioTemplateRenderer } from "../../data/templates/templateEditorTypes";
import { buildVisualSavePayload } from "../utils/visualSaveAdapter";
import { buildVisualSaveDataFromDom } from "../utils/visualDomApply";

type VisualSavePayload = ReturnType<typeof buildVisualSavePayload>;

type UseVisualSaveOptions = {
  renderer: StudioTemplateRenderer;
  canvasRef: React.RefObject<HTMLElement | null>;
  data: Record<string, any>;
  dataRef?: { current: Record<string, any> | null | undefined };
  slug?: string;
  publicUrl?: string;
  siteDomain?: string;
  activePageId?: string;
  onSave?: (payload: VisualSavePayload) => void | Promise<void>;
  onDataSnapshot?: (data: Record<string, any>) => void;
};

const VISUAL_CONTENT_KEY = "__content";
const VISUAL_STYLE_KEY = "__styles";
const VISUAL_ANIMATION_KEY = "__animations";
const VISUAL_DELETED_KEY = "__deletedElements";
const VISUAL_FORM_KEY = "__formBuilderByElement";

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function readPlainObject(
  source: Record<string, any> | undefined | null,
  key: string,
) {
  const value = source?.[key];

  return isPlainObject(value) ? value : {};
}

function isBrowserDomValue(value: any) {
  if (typeof window === "undefined" || !value) return false;

  const win = window as any;

  return Boolean(
    (win.Node && value instanceof win.Node) ||
      (win.Element && value instanceof win.Element) ||
      (win.HTMLElement && value instanceof win.HTMLElement) ||
      (win.Document && value instanceof win.Document) ||
      (win.Window && value instanceof win.Window),
  );
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

  if (isBrowserDomValue(value)) {
    return undefined;
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
      "__reactFiber",
      "__reactProps",
      "__reactInternalInstance",
      "_owner",
      "_store",
    ]);

    const output: Record<string, any> = {};

    Object.entries(value).forEach(([key, item]) => {
      if (blockedKeys.has(key)) return;
      if (key.startsWith("__react")) return;
      if (key.startsWith("_react")) return;

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

function isCloudinaryUrl(value: unknown) {
  if (typeof value !== "string") return false;

  const clean = value.trim().toLowerCase();

  return (
    clean.startsWith("https://res.cloudinary.com/") ||
    clean.startsWith("http://res.cloudinary.com/") ||
    clean.includes(".cloudinary.com/")
  );
}

function isRemoteMediaUrl(value: unknown) {
  if (typeof value !== "string") return false;

  const clean = value.trim().toLowerCase();

  return clean.startsWith("https://") || clean.startsWith("http://");
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

  const remote = candidates.find((candidate) => isRemoteMediaUrl(candidate));
  if (typeof remote === "string") return remote.trim();

  return "";
}


function getMediaTypeFromContentItem(item: any, src: string) {
  const explicit = String(
    item?.mediaType || item?.resourceType || item?.resource_type || "",
  )
    .trim()
    .toLowerCase();

  if (explicit === "video" || explicit === "image" || explicit === "raw") {
    return explicit;
  }

  const mimeType = String(item?.mimeType || item?.mime_type || "")
    .trim()
    .toLowerCase();

  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "image";

  const cleanSrc = String(src || "")
    .trim()
    .toLowerCase()
    .split("?")[0]
    .split("#")[0];

  if (
    cleanSrc.includes("/video/upload/") ||
    cleanSrc.endsWith(".mp4") ||
    cleanSrc.endsWith(".webm") ||
    cleanSrc.endsWith(".mov") ||
    cleanSrc.endsWith(".m4v") ||
    cleanSrc.endsWith(".ogv")
  ) {
    return "video";
  }

  return "image";
}

function cloneForVisualWrite(value: any): any {
  if (Array.isArray(value)) return value.map((item) => cloneForVisualWrite(item));

  if (isPlainObject(value)) {
    return Object.entries(value).reduce<Record<string, any>>((acc, [key, item]) => {
      acc[key] = cloneForVisualWrite(item);
      return acc;
    }, {});
  }

  return value;
}

function parsePathPart(part: string): string | number {
  const clean = String(part || "").trim();

  if (/^\d+$/.test(clean)) return Number(clean);

  return clean;
}

function writeNestedVisualValue(
  source: Record<string, any>,
  path: string,
  value: any,
) {
  const parts = String(path || "")
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean)
    .map(parsePathPart);

  if (!parts.length) return source;

  const next: Record<string, any> = { ...(source || {}) };
  let cursor: any = next;

  parts.forEach((part, index) => {
    const isLast = index === parts.length - 1;

    if (isLast) {
      cursor[part] = value;
      return;
    }

    const nextPart = parts[index + 1];
    const currentValue = cursor[part];

    if (Array.isArray(currentValue)) {
      cursor[part] = currentValue.map((item) => cloneForVisualWrite(item));
    } else if (isPlainObject(currentValue)) {
      cursor[part] = { ...currentValue };
    } else {
      cursor[part] = typeof nextPart === "number" ? [] : {};
    }

    cursor = cursor[part];
  });

  return next;
}

function pathExists(source: Record<string, any>, path: string) {
  const parts = String(path || "")
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean)
    .map(parsePathPart);

  if (!parts.length) return false;

  let cursor: any = source;

  for (const part of parts) {
    if (cursor == null || typeof cursor !== "object") return false;
    if (!(part in cursor)) return false;
    cursor = cursor[part];
  }

  return true;
}

function getValueAtPath(source: Record<string, any>, path: string) {
  const parts = String(path || "")
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean)
    .map(parsePathPart);

  let cursor: any = source;

  for (const part of parts) {
    if (cursor == null || typeof cursor !== "object") return undefined;
    cursor = cursor[part];
  }

  return cursor;
}

function canReplaceTemplateMediaValue(value: any) {
  return (
    value === undefined ||
    value === null ||
    typeof value === "string" ||
    typeof value === "number"
  );
}

function extractTemplateMediaPath(elementId: string) {
  const cleanId = String(elementId || "").trim();
  if (!cleanId) return "";

  const parts = cleanId.split(".").filter(Boolean);

  if (parts.length >= 2) {
    const mediaPartIndex = parts.findIndex((part) =>
      [
        "image",
        "video",
        "media",
        "poster",
        "logo",
        "backgroundImage",
        "background",
        "thumbnail",
      ].includes(part),
    );

    if (mediaPartIndex >= 1) {
      return parts.slice(0, mediaPartIndex + 1).join(".");
    }
  }

  if (
    /image|video|media|poster|logo|background|thumbnail/i.test(cleanId) &&
    !cleanId.startsWith("__")
  ) {
    return cleanId;
  }

  return "";
}

function syncVisualContentMediaToTemplateFields(data: Record<string, any>) {
  const content = isPlainObject(data?.[VISUAL_CONTENT_KEY])
    ? (data[VISUAL_CONTENT_KEY] as Record<string, any>)
    : {};

  let nextData = data || {};

  Object.entries(content).forEach(([elementId, item]) => {
    if (!isPlainObject(item)) return;

    const src = getBestPermanentMediaSrc(item);
    if (!src || isEmbeddedMediaString(src)) return;

    const templatePath = extractTemplateMediaPath(elementId);
    if (!templatePath) return;

    if (templatePath.includes(".")) {
      const existingValue = getValueAtPath(nextData, templatePath);

      if (pathExists(nextData, templatePath) && !canReplaceTemplateMediaValue(existingValue)) {
        console.warn("[BizUply Visual Save] blocked media path overwrite", {
          elementId,
          templatePath,
          existingType: Array.isArray(existingValue) ? "array" : typeof existingValue,
          src,
        });
        return;
      }

      nextData = writeNestedVisualValue(nextData, templatePath, src);

      const mediaType = getMediaTypeFromContentItem(item, src);
      const mediaTypePath = `${templatePath}MediaType`;
      if (!pathExists(nextData, mediaTypePath) || canReplaceTemplateMediaValue(getValueAtPath(nextData, mediaTypePath))) {
        nextData = writeNestedVisualValue(nextData, mediaTypePath, mediaType);
      }

      return;
    }

    if (Object.prototype.hasOwnProperty.call(nextData, templatePath)) {
      const existingValue = nextData[templatePath];

      if (!canReplaceTemplateMediaValue(existingValue)) {
        console.warn("[BizUply Visual Save] blocked direct template key overwrite", {
          elementId,
          templatePath,
          existingType: Array.isArray(existingValue) ? "array" : typeof existingValue,
          src,
        });
        return;
      }
    }

    nextData = {
      ...nextData,
      [templatePath]: src,
      [`${templatePath}MediaType`]: getMediaTypeFromContentItem(item, src),
    };
  });

  return nextData;
}

function removeEmbeddedMediaFromContent(content: Record<string, any>) {
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

    /*
      אם יש Cloudinary/remote URL אמיתי — משחזרים אותו לכל השדות החשובים.
      ככה גם אחרי שמירה ורענון נטען רק URL קטן, לא הסרטון עצמו.
    */
    if (permanentSrc) {
      cleanItem.src = permanentSrc;
      cleanItem.url = permanentSrc;
      cleanItem.secureUrl = permanentSrc;
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

  if (
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

  if (typeof File !== "undefined" && value instanceof File) {
    return undefined;
  }

  if (typeof Blob !== "undefined" && value instanceof Blob) {
    return undefined;
  }

  if (isBrowserDomValue(value)) {
    return undefined;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

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
      /*
        שמות שדות שמחזיקים preview זמני בדרך כלל.
        אם הערך הוא Cloudinary/https, לא מוחקים אותו.
      */
      const isLikelyPreviewKey = [
        "blob",
        "blobUrl",
        "dataUrl",
        "base64",
        "file",
        "previewFile",
        "localFile",
      ].includes(key);

      if (isLikelyPreviewKey && !isRemoteMediaUrl(item)) {
        return;
      }

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

function findEmbeddedMediaPaths(
  value: any,
  prefix = "payload",
  results: string[] = [],
  seen = new WeakSet<object>(),
) {
  if (results.length >= 20) return results;

  if (typeof value === "string") {
    if (isEmbeddedMediaString(value)) {
      results.push(prefix);
    }

    return results;
  }

  if (!value || typeof value !== "object") return results;

  if (seen.has(value)) return results;
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      findEmbeddedMediaPaths(item, `${prefix}[${index}]`, results, seen);
    });

    seen.delete(value);
    return results;
  }

  Object.entries(value).forEach(([key, item]) => {
    findEmbeddedMediaPaths(item, `${prefix}.${key}`, results, seen);
  });

  seen.delete(value);

  return results;
}

function assertNoEmbeddedMedia(label: string, payload: unknown) {
  const paths = findEmbeddedMediaPaths(payload);

  if (!paths.length) return;

  console.error("[BizUply Visual Save] blocked embedded media in payload", {
    label,
    paths,
  });

  throw new Error(
    "המדיה לא נשמרה נכון. הסרטון/תמונה חייבים להישמר כ־Cloudinary URL ולא כ־blob/base64.",
  );
}

function buildLeanVisualData(data: Record<string, any>) {
  const cleanData = (removeEmbeddedMediaDeep(cleanVisualValue(data || {}) || {}) || {}) as Record<string, any>;

  const content = isPlainObject(cleanData[VISUAL_CONTENT_KEY])
    ? cleanData[VISUAL_CONTENT_KEY]
    : {};

  const cleanedContent = removeEmbeddedMediaFromContent(content);

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

  const leanData = {
    ...cleanData,

    [VISUAL_CONTENT_KEY]: cleanedContent,
    [VISUAL_STYLE_KEY]: styles,
    [VISUAL_ANIMATION_KEY]: animations,
    [VISUAL_DELETED_KEY]: deleted,
    [VISUAL_FORM_KEY]: forms,
  };

  /*
    קריטי לפרסום:
    העורך שומר מדיה ב־__content, אבל האתר המפורסם מרנדר מתוך
    שדות התבנית האמיתיים כמו hero.image / project.image.
    לכן לפני שמירה/פרסום מסנכרנים Cloudinary URL גם לשדות האלה.
  */
  return syncVisualContentMediaToTemplateFields(leanData);
}


function getMediaSrc(item: any) {
  if (!isPlainObject(item)) return "";

  return String(
    item.secureUrl ||
      item.secure_url ||
      item.url ||
      item.src ||
      item.originalUrl ||
      "",
  ).trim();
}

function isMediaContentItem(item: any) {
  if (!isPlainObject(item)) return false;

  const src = getMediaSrc(item).toLowerCase();

  const mediaType = String(
    item.mediaType || item.resourceType || item.resource_type || "",
  ).toLowerCase();

  return Boolean(
    src ||
      mediaType === "image" ||
      mediaType === "video" ||
      item.publicId ||
      item.public_id ||
      item.mediaAssetId,
  );
}

function mergeVisualContentPreferState(
  stateContent: Record<string, any>,
  domContent: Record<string, any>,
) {
  /*
    טקסט, קישורים ושאר תוכן רגיל:
    ה-DOM הוא המקור העדכני ביותר בזמן שמירה/פרסום,
    ולכן הוא חייב להיכתב אחרי ה-state.

    מדיה:
    ממשיכים לתת עדיפות ל-Cloudinary/remote URL שכבר נשמר ב-state,
    כדי ש-blob/base64 זמני מה-DOM לא ידרוס כתובת קבועה.
  */
  const merged: Record<string, any> = {
    ...(stateContent || {}),
    ...(domContent || {}),
  };

  const allElementIds = new Set([
    ...Object.keys(stateContent || {}),
    ...Object.keys(domContent || {}),
  ]);

  allElementIds.forEach((elementId) => {
    const stateItem = stateContent?.[elementId];
    const domItem = domContent?.[elementId];

    if (!isPlainObject(stateItem) && !isPlainObject(domItem)) {
      merged[elementId] =
        domItem !== undefined
          ? domItem
          : stateItem;
      return;
    }

    if (!isPlainObject(stateItem)) {
      merged[elementId] = domItem;
      return;
    }

    if (!isPlainObject(domItem)) {
      merged[elementId] = stateItem;
      return;
    }

    const stateIsMedia = isMediaContentItem(stateItem);
    const domIsMedia = isMediaContentItem(domItem);

    if (stateIsMedia || domIsMedia) {
      const statePermanentSrc = getBestPermanentMediaSrc(stateItem);
      const domPermanentSrc = getBestPermanentMediaSrc(domItem);
      const stateSrc = getMediaSrc(stateItem);
      const domSrc = getMediaSrc(domItem);

      /*
        עדיפות מוחלטת ל-Cloudinary/remote URL.
        לא נותנים ל-blob/base64 מה-DOM לדרוס URL שכבר עלה ל-Cloudinary.
      */
      const finalSrc =
        statePermanentSrc ||
        domPermanentSrc ||
        (!isEmbeddedMediaString(stateSrc) ? stateSrc : "") ||
        (!isEmbeddedMediaString(domSrc) ? domSrc : "");

      const mergedItem: Record<string, any> = {
        ...domItem,
        ...stateItem,
        mediaType:
          stateItem.mediaType ||
          stateItem.resourceType ||
          stateItem.resource_type ||
          domItem.mediaType ||
          domItem.resourceType ||
          domItem.resource_type ||
          "image",
        resourceType:
          stateItem.resourceType ||
          stateItem.resource_type ||
          stateItem.mediaType ||
          domItem.resourceType ||
          domItem.resource_type ||
          domItem.mediaType ||
          "image",
      };

      if (finalSrc) {
        mergedItem.src = finalSrc;
        mergedItem.url = finalSrc;
        mergedItem.secureUrl = finalSrc;
      } else {
        delete mergedItem.src;
        delete mergedItem.url;
        delete mergedItem.secureUrl;
        delete mergedItem.secure_url;
        delete mergedItem.originalUrl;
        delete mergedItem.poster;
      }

      merged[elementId] = removeEmbeddedMediaDeep(mergedItem) || {};
      return;
    }

    /*
      בטקסט ובשאר האלמנטים ה-DOM חייב להיות אחרון,
      כדי שהערך שרואים כרגע בעורך הוא זה שיישמר ויפורסם.
    */
    merged[elementId] = {
      ...stateItem,
      ...domItem,
    };
  });

  return merged;
}

function mergeVisualSnapshotData({
  currentData,
  domSnapshotData,
}: {
  currentData: Record<string, any>;
  domSnapshotData: Record<string, any>;
}) {
  const previousContent = readPlainObject(currentData, VISUAL_CONTENT_KEY);
  const previousStyles = readPlainObject(currentData, VISUAL_STYLE_KEY);
  const previousAnimations = readPlainObject(currentData, VISUAL_ANIMATION_KEY);
  const previousDeleted = readPlainObject(currentData, VISUAL_DELETED_KEY);
  const previousForms = readPlainObject(currentData, VISUAL_FORM_KEY);

  const domContent = readPlainObject(domSnapshotData, VISUAL_CONTENT_KEY);
  const domStyles = readPlainObject(domSnapshotData, VISUAL_STYLE_KEY);
  const domAnimations = readPlainObject(domSnapshotData, VISUAL_ANIMATION_KEY);
  const domDeleted = readPlainObject(domSnapshotData, VISUAL_DELETED_KEY);
  const domForms = readPlainObject(domSnapshotData, VISUAL_FORM_KEY);

  return {
    ...(currentData || {}),
    ...(domSnapshotData || {}),

    [VISUAL_CONTENT_KEY]: mergeVisualContentPreferState(
      previousContent,
      domContent,
    ),

    [VISUAL_STYLE_KEY]: {
      ...previousStyles,
      ...domStyles,
    },

    [VISUAL_ANIMATION_KEY]: {
      ...previousAnimations,
      ...domAnimations,
    },

    [VISUAL_DELETED_KEY]: {
      ...previousDeleted,
      ...domDeleted,
    },

    [VISUAL_FORM_KEY]: {
      ...previousForms,
      ...domForms,
    },
  };
}

function getPayloadData(payload: VisualSavePayload) {
  const anyPayload = payload as any;

  return (
    (isPlainObject(anyPayload.data) && anyPayload.data) ||
    (isPlainObject(anyPayload.templateData) && anyPayload.templateData) ||
    {}
  );
}

function logPayloadSize(label: string, payload: unknown) {
  try {
    const body = JSON.stringify(payload);
    const mb = body.length / 1024 / 1024;

    console.log(
      `[BizUply Visual Save] ${label} payload size: ${mb.toFixed(2)}MB`,
      {
        bytes: body.length,
      },
    );
  } catch (error) {
    console.warn(
      `[BizUply Visual Save] ${label} payload stringify failed`,
      error,
    );
  }
}

function logSnapshotData(label: string, payload: Record<string, any>) {
  try {
    const content = readPlainObject(payload, VISUAL_CONTENT_KEY);
    const styles = readPlainObject(payload, VISUAL_STYLE_KEY);
    const animations = readPlainObject(payload, VISUAL_ANIMATION_KEY);
    const deleted = readPlainObject(payload, VISUAL_DELETED_KEY);
    const forms = readPlainObject(payload, VISUAL_FORM_KEY);

    console.log(`[BizUply Visual Save] ${label}`, {
      dataKeys: Object.keys(payload || {}),

      contentKeysCount: Object.keys(content).length,
      contentKeys: Object.keys(content),

      styleKeysCount: Object.keys(styles).length,
      styleKeys: Object.keys(styles),

      animationKeysCount: Object.keys(animations).length,
      animationKeys: Object.keys(animations),

      deletedKeysCount: Object.keys(deleted).length,
      deletedKeys: Object.keys(deleted),

      formKeysCount: Object.keys(forms).length,
      formKeys: Object.keys(forms),
    });
  } catch {
    // noop
  }
}

export function useVisualSave({
  renderer,
  canvasRef,
  data,
  dataRef,
  slug,
  publicUrl,
  siteDomain,
  activePageId = "home",
  onSave,
  onDataSnapshot,
}: UseVisualSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string>("");
  const [saveError, setSaveError] = useState<string>("");

  useEffect(() => {
    if (dataRef) {
      dataRef.current = data || {};
    }
  }, [data, dataRef]);

  const buildSnapshotData = useCallback(() => {
    const root = canvasRef.current;

    const currentData = (dataRef?.current || data || {}) as Record<string, any>;

    const domSnapshotRaw = (buildVisualSaveDataFromDom(
      root,
      currentData,
    ) || {}) as Record<string, any>;

    const mergedData = mergeVisualSnapshotData({
      currentData,
      domSnapshotData: domSnapshotRaw,
    });

    const mergedRecord = mergedData as Record<string, any>;

    const nextData = buildLeanVisualData({
      ...mergedRecord,
      __activePageId: activePageId || "home",
      __siteSlug: slug || String(mergedRecord.__siteSlug || ""),
      __publicUrl: publicUrl || String(mergedRecord.__publicUrl || ""),
      __siteDomain: siteDomain || String(mergedRecord.__siteDomain || ""),
    });

    logSnapshotData("snapshot current data", currentData || {});
    logSnapshotData("snapshot dom data", domSnapshotRaw);
    logSnapshotData("snapshot final data", nextData);

    onDataSnapshot?.(nextData);

    return nextData;
  }, [
    activePageId,
    canvasRef,
    data,
    dataRef,
    onDataSnapshot,
    publicUrl,
    siteDomain,
    slug,
  ]);

  const saveDraft = useCallback(async () => {
    if (!onSave) {
      const message = "[BizUply Visual Save] missing onSave handler";
      console.error(message);
      setSaveError(message);
      throw new Error(message);
    }

    setIsSaving(true);
    setSaveError("");

    try {
      const snapshotData = buildSnapshotData();

      const payload = buildVisualSavePayload({
        templateKey: renderer.key,
        data: snapshotData,
        slug,
        publicUrl,
        siteDomain,
        published: false,
        status: "draft",
        htmlSnapshot: "",
        snapshotPageId: activePageId,
      });

      const payloadData = getPayloadData(payload);

      assertNoEmbeddedMedia("draft", payload);
      logPayloadSize("draft", payload);

      console.log("[BizUply Visual Save] draft payload", {
        templateKey: (payload as any).templateKey,
        status: (payload as any).status,
        published: (payload as any).published,
        slug: (payload as any).slug,
        publicUrl: (payload as any).publicUrl,
        siteDomain: (payload as any).siteDomain,
        snapshotPageId: (payload as any).snapshotPageId,
        dataKeys: Object.keys(payloadData),
        contentKeys: Object.keys(
          isPlainObject(payloadData[VISUAL_CONTENT_KEY])
            ? payloadData[VISUAL_CONTENT_KEY]
            : {},
        ),
      });

      await onSave(payload);

      setLastSavedAt(new Date().toISOString());

      return payload;
    } catch (error) {
      const message = error instanceof Error ? error.message : "שמירה נכשלה";
      setSaveError(message);
      console.error("[BizUply Visual Save] draft failed", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [
    activePageId,
    buildSnapshotData,
    onSave,
    publicUrl,
    renderer.key,
    siteDomain,
    slug,
  ]);

  const publish = useCallback(async () => {
    if (!onSave) {
      const message = "[BizUply Visual Save] missing onSave handler";
      console.error(message);
      setSaveError(message);
      throw new Error(message);
    }

    setIsSaving(true);
    setSaveError("");

    try {
      const snapshotData = buildSnapshotData();

      const payload = buildVisualSavePayload({
        templateKey: renderer.key,
        data: snapshotData,
        slug,
        publicUrl,
        siteDomain,
        published: true,
        status: "published",
        htmlSnapshot: "",
        snapshotPageId: activePageId,
      });

      const payloadData = getPayloadData(payload);

      assertNoEmbeddedMedia("publish", payload);
      logPayloadSize("publish", payload);

      console.log("[BizUply Visual Save] publish payload", {
        templateKey: (payload as any).templateKey,
        status: (payload as any).status,
        published: (payload as any).published,
        slug: (payload as any).slug,
        publicUrl: (payload as any).publicUrl,
        siteDomain: (payload as any).siteDomain,
        snapshotPageId: (payload as any).snapshotPageId,
        dataKeys: Object.keys(payloadData),
        contentKeys: Object.keys(
          isPlainObject(payloadData[VISUAL_CONTENT_KEY])
            ? payloadData[VISUAL_CONTENT_KEY]
            : {},
        ),
      });

      await onSave(payload);

      setLastSavedAt(new Date().toISOString());

      return payload;
    } catch (error) {
      const message = error instanceof Error ? error.message : "פרסום נכשל";
      setSaveError(message);
      console.error("[BizUply Visual Save] publish failed", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [
    activePageId,
    buildSnapshotData,
    onSave,
    publicUrl,
    renderer.key,
    siteDomain,
    slug,
  ]);

  return useMemo(
    () => ({
      isSaving,
      lastSavedAt,
      saveError,
      buildSnapshotData,
      saveDraft,
      publish,
    }),
    [isSaving, lastSavedAt, saveError, buildSnapshotData, saveDraft, publish],
  );
}