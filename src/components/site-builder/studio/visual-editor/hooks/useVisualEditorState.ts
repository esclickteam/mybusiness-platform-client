import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AnimationPresetValue, StylePatch } from "../../types";
import type { StudioTemplateRenderer } from "../../data/templates/templateEditorTypes";

import {
  VISUAL_ANIMATION_KEY,
  VISUAL_ATTRIBUTE_KEY,
  VISUAL_CONTENT_KEY,
  VISUAL_DELETED_KEY,
  VISUAL_HIDDEN_KEY,
  VISUAL_INSERTED_ELEMENTS_KEY,
  VISUAL_INSERTED_SECTIONS_KEY,
  VISUAL_LAYOUT_KEY,
  VISUAL_LOCKED_KEY,
  VISUAL_RESPONSIVE_KEY,
  VISUAL_STYLE_KEY,
  markVisualElementDeleted,
  normalizeVisualData,
  readVisualAnimations,
  readVisualAttributes,
  readVisualContent,
  readVisualDeleted,
  readVisualHidden,
  readVisualInsertedElements,
  readVisualInsertedSections,
  readVisualLayout,
  readVisualLocked,
  readVisualResponsive,
  readVisualStyles,
  removeVisualAnimationItem,
  removeVisualAttributesItem,
  removeVisualInsertedElement,
  removeVisualInsertedSection,
  removeVisualLayoutItem,
  removeVisualResponsiveItem,
  removeVisualStyleItem,
  restoreVisualElement,
  setVisualElementHidden,
  setVisualElementLocked,
  writeVisualAnimationItem,
  writeVisualAttributesItem,
  writeVisualInsertedElement,
  writeVisualInsertedSection,
  writeVisualContentItem,
  writeVisualLayoutItem,
  writeVisualResponsiveItem,
  writeVisualStyleItem,
  type VisualInsertedElement,
  type VisualInsertedElementType,
  type VisualLayoutItem,
} from "../utils/visualData";

import { buildVisualRuntimeCss } from "../utils/visualCssRuntime";
import { applyAllVisualDataToDom } from "../utils/visualDomApply";
import { useVisualHistory } from "./useVisualHistory";
import { useVisualSelection } from "./useVisualSelection";
import { useVisualKeyboardShortcuts } from "./useVisualKeyboardShortcuts";
import { useVisualSave } from "./useVisualSave";
import type {
  VisualMediaModalApplyPayload,
  VisualMediaModalMode,
} from "../components/VisualMediaModal";
import type { PexelsMediaItem } from "../library/pexelsMediaService";
import { ELEMENT_LIBRARY } from "../library/elementLibrary";
import type { VisualLibraryNodeTemplate } from "../library/visualLibraryTypes";
import {
  buildMediaEditFilter,
  getNodeMediaAlt,
  getNodeMediaSrc,
  type VisualMediaEditValues,
} from "../utils/visualMediaUtils";

export type VisualDeviceMode = "desktop" | "tablet" | "mobile";

type DefaultInsertedElementPayload = {
  item: VisualInsertedElement;
  content: Record<string, any>;
  style: StylePatch;
  layout: VisualLayoutItem;
};

type UseVisualEditorStateOptions = {
  renderer: StudioTemplateRenderer;
  businessId?: string;
  initialData?: Record<string, any>;
  slug?: string;
  publicUrl?: string;
  siteDomain?: string;
  activePageId?: string;
  onSave?: (payload: any) => void | Promise<void>;
};

function hasOwn(target: Record<string, any>, key: string) {
  return Object.prototype.hasOwnProperty.call(target, key);
}


function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMediaLikeKey(key: string) {
  const clean = String(key || "").toLowerCase();

  return /image|img|photo|picture|media|video|poster|cover|banner|background|bg|logo|avatar|thumb|thumbnail|src|url/.test(
    clean,
  );
}

function getNestedValue(source: Record<string, any>, path: string) {
  const parts = path
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) return undefined;

  let cursor: any = source;

  for (const part of parts) {
    if (cursor == null) return undefined;
    cursor = cursor[part];
  }

  return cursor;
}

function writeNestedValuePreserveArrays(
  source: Record<string, any>,
  path: string,
  value: any,
) {
  const parts = path
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) return source;

  const cloneContainer = (currentValue: any, nextPart?: string) => {
    if (Array.isArray(currentValue)) return [...currentValue];

    if (isRecord(currentValue)) return { ...currentValue };

    if (nextPart && /^\d+$/.test(nextPart)) return [];

    return {};
  };

  const next: Record<string, any> = { ...source };
  let cursor: any = next;

  parts.slice(0, -1).forEach((part, index) => {
    const nextPart = parts[index + 1];
    const currentValue = cursor[part];

    cursor[part] = cloneContainer(currentValue, nextPart);
    cursor = cursor[part];
  });

  cursor[parts[parts.length - 1]] = value;

  return next;
}

function isNumericPathKey(key: string) {
  return /^\d+$/.test(String(key || "").trim());
}

function canReplaceTemplateMediaValue(key: string, currentValue: any) {
  if (typeof currentValue === "string") return true;
  if (currentValue === null || typeof currentValue === "undefined") {
    return isMediaLikeKey(key) || isNumericPathKey(key);
  }

  if (isRecord(currentValue)) {
    if (!isMediaLikeKey(key) && !isNumericPathKey(key)) return false;

    return Boolean(
      typeof currentValue.url === "string" ||
        typeof currentValue.src === "string" ||
        typeof currentValue.secureUrl === "string" ||
        typeof currentValue.secure_url === "string" ||
        Object.keys(currentValue).length === 0,
    );
  }

  /*
    אסור להחליף מערכים/אובייקטים שלמים בכתובת מדיה.
    זה בדיוק מה שגורם לשגיאות כמו:
    services.map is not a function
  */
  if (Array.isArray(currentValue)) return false;

  return isMediaLikeKey(key) || isNumericPathKey(key);
}

function collectMediaTargetIds(
  primaryId: string,
  selectedElement: any,
  node?: HTMLElement | null,
) {
  const ids = new Set<string>();

  const add = (value: string) => {
    const clean = String(value || "").trim();
    if (clean) ids.add(clean);
  };

  add(primaryId);

  add(String(selectedElement?.id || "").trim());

  if (node instanceof HTMLElement) {
    add(node.getAttribute("data-visual-edit-id") || "");
    add(
      node.getAttribute("data-image-field") ||
        node.getAttribute("data-field") ||
        "",
    );
    add(node.getAttribute("data-visual-image-field") || "");
    add(node.getAttribute("data-media-field") || "");
  }

  return Array.from(ids);
}

function writeNestedValue(
  source: Record<string, any>,
  path: string,
  value: any,
) {
  const parts = path
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) return source;

  const next: Record<string, any> = { ...source };
  let cursor: Record<string, any> = next;

  parts.slice(0, -1).forEach((part) => {
    const currentValue = cursor[part];

    cursor[part] =
      currentValue &&
      typeof currentValue === "object" &&
      !Array.isArray(currentValue)
        ? { ...currentValue }
        : {};

    cursor = cursor[part];
  });

  cursor[parts[parts.length - 1]] = value;

  return next;
}

function syncTemplateTextValue(
  source: Record<string, any>,
  elementId: string,
  value: string,
) {
  if (!elementId) return source;

  let next = source;

  if (elementId.includes(".")) {
    next = writeNestedValue(next, elementId, value);
  }

  if (!elementId.includes(".") || hasOwn(next, elementId)) {
    next = {
      ...next,
      [elementId]: value,
    };
  }

  return next;
}


const RAW_API_BASE =
  ((import.meta as any).env?.VITE_API_URL ||
    (import.meta as any).env?.VITE_API_BASE_URL ||
    "") as string;

const API_BASE = RAW_API_BASE.replace(/\/api\/?$/, "").replace(/\/$/, "");

function getToken() {
  if (typeof window === "undefined") return "";

  return window.localStorage.getItem("token") || "";
}

function buildJsonHeaders(extraHeaders?: Record<string, string>) {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders || {}),
  };
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      ...buildJsonHeaders(),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Request failed");
  }

  return data as T;
}

function getCloudinaryMediaType(resourceType: unknown, mimeType?: string) {
  const cleanResourceType = String(resourceType || "").toLowerCase();
  const cleanMimeType = String(mimeType || "").toLowerCase();

  if (cleanResourceType === "video" || cleanMimeType.startsWith("video/")) {
    return "video";
  }

  return "image";
}

type CloudinarySignUploadResponse = {
  ok?: boolean;
  success?: boolean;
  cloudName?: string;
  apiKey?: string;
  timestamp?: number | string;
  signature?: string;
  folder?: string;
  uploadUrl?: string;
  params?: Record<string, any>;
  message?: string;
  error?: string;
};

type CloudinaryUploadResult = {
  secure_url?: string;
  url?: string;
  public_id?: string;
  resource_type?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  duration?: number;
  folder?: string;
  error?: {
    message?: string;
  };
  message?: string;
};

type SavedMediaAssetResponse = {
  ok?: boolean;
  success?: boolean;
  mediaAssetId?: string | null;
  url?: string;
  secureUrl?: string;
  publicId?: string;
  resourceType?: string;
  mediaType?: string;
  message?: string;
  error?: string;
};

async function uploadVisualMediaToCloudinary({
  file,
  businessId,
}: {
  file: File;
  businessId?: string;
}) {
  const signData = await apiRequest<CloudinarySignUploadResponse>(
    "/api/media/sign-upload",
    {
      method: "POST",
      body: JSON.stringify({
        businessId,
      }),
    },
  );

  if (!signData?.ok && !signData?.success) {
    throw new Error(signData?.message || signData?.error || "יצירת חתימת העלאה נכשלה");
  }

  if (!signData.apiKey || !signData.timestamp || !signData.signature || !signData.uploadUrl) {
    throw new Error("חסרים פרטי חתימה להעלאה ל־Cloudinary");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", String(signData.apiKey));
  formData.append("timestamp", String(signData.timestamp));
  formData.append("signature", String(signData.signature));

  if (signData.folder) {
    formData.append("folder", String(signData.folder));
  }

  formData.append("use_filename", "true");
  formData.append("unique_filename", "true");
  formData.append("overwrite", "false");

  const cloudinaryResponse = await fetch(String(signData.uploadUrl), {
    method: "POST",
    body: formData,
  });

  const cloudinaryResult =
    (await cloudinaryResponse.json().catch(() => null)) as CloudinaryUploadResult | null;

  if (!cloudinaryResponse.ok || !cloudinaryResult?.secure_url) {
    throw new Error(
      cloudinaryResult?.error?.message ||
        cloudinaryResult?.message ||
        "העלאה ל־Cloudinary נכשלה",
    );
  }

  const resourceType = String(cloudinaryResult.resource_type || "image");
  const mediaType = getCloudinaryMediaType(resourceType, file.type);
  const secureUrl = String(cloudinaryResult.secure_url || cloudinaryResult.url || "");
  const publicId = String(cloudinaryResult.public_id || "");

  let savedAsset: SavedMediaAssetResponse | null = null;

  try {
    savedAsset = await apiRequest<SavedMediaAssetResponse>("/api/media/asset", {
      method: "POST",
      body: JSON.stringify({
        businessId,
        secureUrl,
        url: secureUrl,
        publicId,
        public_id: publicId,
        resourceType,
        resource_type: resourceType,
        mediaType,
        format: cloudinaryResult.format || "",
        bytes: Number(cloudinaryResult.bytes || file.size || 0),
        width: Number(cloudinaryResult.width || 0),
        height: Number(cloudinaryResult.height || 0),
        duration: Number(cloudinaryResult.duration || 0),
        folder: signData.folder || cloudinaryResult.folder || "",
        originalName: file.name,
        mimeType: file.type,
        source: "website-editor",
        cloudinary: {
          public_id: publicId,
          secure_url: secureUrl,
          resource_type: resourceType,
          format: cloudinaryResult.format || "",
          bytes: Number(cloudinaryResult.bytes || file.size || 0),
          width: Number(cloudinaryResult.width || 0),
          height: Number(cloudinaryResult.height || 0),
          duration: Number(cloudinaryResult.duration || 0),
          folder: signData.folder || cloudinaryResult.folder || "",
        },
      }),
    });
  } catch (error) {
    console.warn("[BizUply Visual Media] media asset save failed", error);
  }

  return {
    src: secureUrl,
    url: secureUrl,
    secureUrl,
    publicId: savedAsset?.publicId || publicId,
    public_id: savedAsset?.publicId || publicId,
    resourceType: savedAsset?.resourceType || resourceType,
    resource_type: savedAsset?.resourceType || resourceType,
    mediaType: savedAsset?.mediaType || mediaType,
    format: cloudinaryResult.format || "",
    bytes: Number(cloudinaryResult.bytes || file.size || 0),
    width: Number(cloudinaryResult.width || 0),
    height: Number(cloudinaryResult.height || 0),
    duration: Number(cloudinaryResult.duration || 0),
    folder: signData.folder || cloudinaryResult.folder || "",
    originalName: file.name,
    mimeType: file.type,
    mediaAssetId: savedAsset?.mediaAssetId || null,
  };
}

function getVisualMediaSrcFromPayload(payload: Record<string, any>) {
  return String(
    payload.secureUrl ||
      payload.secure_url ||
      payload.url ||
      payload.src ||
      payload.originalUrl ||
      "",
  ).trim();
}

function getVisualMediaTypeFromPayload(payload: Record<string, any>) {
  const explicitType = String(
    payload.mediaType ||
      payload.resourceType ||
      payload.resource_type ||
      "",
  )
    .trim()
    .toLowerCase();

  if (explicitType === "video" || explicitType === "image" || explicitType === "raw") {
    return explicitType;
  }

  const mimeType = String(payload.mimeType || payload.mime_type || "")
    .trim()
    .toLowerCase();

  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "image";

  const src = getVisualMediaSrcFromPayload(payload).toLowerCase();

  if (
    src.includes("/video/upload/") ||
    src.endsWith(".mp4") ||
    src.endsWith(".webm") ||
    src.endsWith(".mov") ||
    src.endsWith(".m4v") ||
    src.endsWith(".ogv")
  ) {
    return "video";
  }

  return "image";
}

function syncTemplateMediaValue(
  source: Record<string, any>,
  elementId: string,
  payload: Record<string, any>,
) {
  if (!elementId) return source;

  const src = getVisualMediaSrcFromPayload(payload);
  if (!src) return source;

  let next = source;

  /*
    חשוב מאוד:
    לא מחליפים מערכים/אובייקטים שלמים ב-URL.
    אם elementId בטעות הוא services / gallery / pricing וכו׳,
    החלפה ישירה תהרוס את ה-data ותגרום לשגיאות כמו:
    services.map is not a function
  */
  if (hasOwn(next, elementId)) {
    const currentValue = next[elementId];

    if (canReplaceTemplateMediaValue(elementId, currentValue)) {
      next = {
        ...next,
        [elementId]: src,
      };
    } else {
      console.warn("[BizUply Visual Media] skipped direct template media sync", {
        elementId,
        reason: "existing template value is object/array, not media string",
        currentType: Array.isArray(currentValue) ? "array" : typeof currentValue,
      });
    }
  }

  /*
    אם elementId הוא path כמו hero.image או gallery.0.image,
    מעדכנים רק אם היעד הוא string/ריק עם key מדיה.
    לא יוצרים/דורסים מבנים עסקיים שלא קשורים למדיה.
  */
  if (elementId.includes(".")) {
    const parts = elementId
      .split(".")
      .map((part) => part.trim())
      .filter(Boolean);

    const lastKey = parts[parts.length - 1] || "";
    const currentNestedValue = getNestedValue(next, elementId);

    if (canReplaceTemplateMediaValue(lastKey, currentNestedValue)) {
      const nextValue =
        isRecord(currentNestedValue) && isMediaLikeKey(lastKey)
          ? {
              ...currentNestedValue,
              src,
              url: src,
              secureUrl: src,
              secure_url: src,
            }
          : src;

      next = writeNestedValuePreserveArrays(next, elementId, nextValue);
    } else {
      console.warn("[BizUply Visual Media] skipped nested template media sync", {
        elementId,
        lastKey,
        reason: "nested template value is object/array, not media string",
        currentType: Array.isArray(currentNestedValue)
          ? "array"
          : typeof currentNestedValue,
      });
    }
  }

  return next;
}

function getVisualContentItemForLog(data: Record<string, any>, elementId: string) {
  const content = data?.[VISUAL_CONTENT_KEY];

  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return undefined;
  }

  return (content as Record<string, any>)[elementId];
}


function getSelectedDomNode(selectedElement: any) {
  const node =
    selectedElement?.node ||
    selectedElement?.domNode ||
    selectedElement?.element ||
    null;

  return node instanceof HTMLElement ? node : null;
}

function getCanonicalSelectedElementId(
  explicitElementId: string | undefined,
  selectedElement: any,
) {
  const explicit = String(explicitElementId || "").trim();
  if (explicit) return explicit;

  const node = getSelectedDomNode(selectedElement);
  const directNodeId = String(
    node?.getAttribute("data-visual-edit-id") || "",
  ).trim();

  return directNodeId || String(selectedElement?.id || "").trim();
}

function findVisualNodeById(
  root: HTMLElement | null,
  elementId: string,
) {
  if (!root || !elementId) return null;

  const safeId =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(elementId)
      : elementId.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  return root.querySelector<HTMLElement>(
    `[data-visual-edit-id="${safeId}"]`,
  );
}

function getActualMediaNode(node: HTMLElement | null) {
  if (!node) return null;

  const proxy = node.closest<HTMLElement>(
    "[data-bizuply-editor-media-preview='true'][data-bizuply-preview-for]",
  );

  if (proxy) {
    const targetId = String(
      proxy.getAttribute("data-bizuply-preview-for") || "",
    ).trim();

    const canvas = proxy.closest<HTMLElement>(
      "[data-visual-template-canvas='true']",
    );

    if (canvas && targetId) {
      const safeId =
        typeof CSS !== "undefined" && typeof CSS.escape === "function"
          ? CSS.escape(targetId)
          : targetId.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

      const original = canvas.querySelector<HTMLElement>(
        `[data-visual-edit-id="${safeId}"]:not([data-bizuply-editor-media-preview="true"])`,
      );

      if (original) return original;
    }
  }

  if (
    node instanceof HTMLImageElement ||
    node instanceof HTMLVideoElement ||
    node instanceof HTMLSourceElement
  ) {
    return node instanceof HTMLSourceElement &&
      node.parentElement instanceof HTMLVideoElement
      ? node.parentElement
      : node;
  }

  return node.querySelector<HTMLElement>(
    "img, video, source, [data-bizuply-editor-media-preview='true']",
  );
}


function createVisualCustomId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function getClosestVisualSectionNode(
  root: HTMLElement | null,
  node: HTMLElement | null,
) {
  if (!root) return null;

  const sectionSelector = [
    '[data-visual-inserted-section="true"]',
    "[data-section-kind]",
    "[data-template-section-id]",
    "[data-studio-section-id]",
    "section",
    "header",
    "footer",
    "main",
    "article",
    "form",
  ].join(",");

  const section = node?.closest<HTMLElement>(sectionSelector);

  if (section && root.contains(section)) {
    return section;
  }

  return (
    root.querySelector<HTMLElement>("[data-section-kind]") ||
    root.querySelector<HTMLElement>("section") ||
    root.querySelector<HTMLElement>("main") ||
    root
  );
}

function getDirectVisualId(node: HTMLElement | null) {
  return String(
    node?.getAttribute("data-visual-edit-id") ||
      node?.getAttribute("data-template-section-id") ||
      node?.getAttribute("data-studio-section-id") ||
      node?.id ||
      "",
  ).trim();
}

function getDefaultInsertedElementPayload(
  type: VisualInsertedElementType,
  parentId: string,
  sectionId: string,
): DefaultInsertedElementPayload {
  const id = createVisualCustomId(`custom-${type}`);
  const now = new Date().toISOString();

  const base = {
    id,
    type,
    parentId,
    sectionId,
    createdAt: now,
    updatedAt: now,
  };

  if (type === "text") {
    return {
      item: {
        ...base,
        label: "טקסט חדש",
        tagName: "div",
      },
      content: {
        text: "טקסט חדש",
      },
      style: {
        color: "#111827",
        fontSize: "32px",
        fontWeight: "800",
        lineHeight: "1.2",
        textAlign: "right",
      },
      layout: {
        position: "absolute",
        x: 40,
        y: 40,
        translateX: 40,
        translateY: 40,
        width: "260px",
        minHeight: "48px",
        zIndex: 20,
        freePosition: true,
      },
    };
  }

  if (type === "button") {
    return {
      item: {
        ...base,
        label: "כפתור חדש",
        tagName: "button",
      },
      content: {
        text: "כפתור חדש",
        href: "#",
        target: "_self",
      },
      style: {
        color: "#ffffff",
        backgroundColor: "#7c3aed",
        fontSize: "16px",
        fontWeight: "800",
        borderRadius: "999px",
        padding: "12px 24px",
        border: "0",
      },
      layout: {
        position: "absolute",
        x: 40,
        y: 120,
        translateX: 40,
        translateY: 120,
        width: "170px",
        height: "52px",
        zIndex: 21,
        freePosition: true,
      },
    };
  }

  if (type === "image" || type === "video") {
    const isVideo = type === "video";

    return {
      item: {
        ...base,
        label: isVideo ? "סרטון חדש" : "תמונה חדשה",
        tagName: isVideo ? "video" : "img",
      },
      content: {
        src: "",
        mediaType: type,
        resourceType: type,
        autoplay: isVideo,
        muted: isVideo,
        loop: isVideo,
        controls: false,
        playsInline: true,
        preload: isVideo ? "metadata" : undefined,
      },
      style: {
        display: "block",
        borderRadius: "20px",
        /*
          וידאו מתנהג כמו תמונה: object-fit "cover" כברירת מחדל,
          כך אין הבדל התנהגות בין השניים בזמן גרירה ו-resize.
        */
        objectFit: "cover",
        objectPosition: "center",
        backgroundColor: isVideo ? "#000000" : "#e2e8f0",
        overflow: "hidden",
      },
      layout: {
        position: "absolute",
        x: 40,
        y: 40,
        translateX: 40,
        translateY: 40,
        width: isVideo ? "480px" : "360px",
        height: isVideo ? "270px" : "240px",
        minWidth: "48px",
        minHeight: "48px",
        zIndex: 10,
        freePosition: true,
      },
    };
  }

  if (type === "divider") {
    return {
      item: {
        ...base,
        label: "קו מפריד",
        tagName: "div",
      },
      content: {},
      style: {
        backgroundColor: "#111827",
        borderRadius: "999px",
      },
      layout: {
        position: "absolute",
        x: 40,
        y: 200,
        translateX: 40,
        translateY: 200,
        width: "280px",
        height: "2px",
        zIndex: 15,
        freePosition: true,
      },
    };
  }

  return {
    item: {
      ...base,
      label: "קופסה חדשה",
      tagName: "div",
    },
    content: {},
    style: {
      backgroundColor: "rgba(255,255,255,0.9)",
      borderRadius: "24px",
      border: "1px solid rgba(15,23,42,0.12)",
      boxShadow: "0 18px 50px rgba(15,23,42,0.14)",
    },
    layout: {
      position: "absolute",
      x: 40,
      y: 40,
      translateX: 40,
      translateY: 40,
      width: "320px",
      height: "220px",
      zIndex: 5,
      freePosition: true,
    },
  };
}

function buildInitialDataSignature(value: Record<string, any> | undefined) {
  try {
    return JSON.stringify(normalizeVisualData(value || {}));
  } catch {
    return String(Date.now());
  }
}

export function useVisualEditorState({
  renderer,
  businessId,
  initialData = {},
  slug,
  publicUrl,
  siteDomain,
  activePageId = "home",
  onSave,
}: UseVisualEditorStateOptions) {
  const canvasRef = useRef<HTMLElement | null>(null);

  /*
    העלאות מדיה מתבצעות ברקע, אבל שמירה/פרסום ממתינים להן.
    כך התמונה או הסרטון מוצגים מיד עם blob מקומי,
    ובשרת נשמרת רק כתובת Cloudinary אמיתית.
  */
  const pendingMediaUploadsRef = useRef<Map<string, Promise<void>>>(new Map());
  const previewObjectUrlsRef = useRef<Map<string, string>>(new Map());
  const uploadSequenceRef = useRef<Map<string, number>>(new Map());

  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaModal, setMediaModal] = useState<{
    open: boolean;
    elementId: string;
    elementLabel: string;
    mode: VisualMediaModalMode;
    target: "media" | "background";
    currentSrc: string;
    currentAlt: string;
    mediaType: "image" | "video" | string;
  }>({
    open: false,
    elementId: "",
    elementLabel: "מדיה",
    mode: "change",
    target: "media",
    currentSrc: "",
    currentAlt: "",
    mediaType: "image",
  });

  const [deviceMode, setDeviceMode] = useState<VisualDeviceMode>("desktop");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isInlineEditing, setIsInlineEditing] = useState(false);

  const initialDataSignature = useMemo(
    () => buildInitialDataSignature(initialData),
    [initialData],
  );

  const history = useVisualHistory<Record<string, any>>(
    normalizeVisualData(initialData || {}),
  );
  const data = history.value;
  const dataRef = useRef<Record<string, any>>(
    normalizeVisualData(data || initialData || {}),
  );
  const lastHydratedInitialDataSignatureRef = useRef(initialDataSignature);

  useEffect(() => {
    dataRef.current = data || {};
  }, [data]);

  useEffect(() => {
    return () => {
      previewObjectUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // noop
        }
      });

      previewObjectUrlsRef.current.clear();
      pendingMediaUploadsRef.current.clear();
      uploadSequenceRef.current.clear();
    };
  }, []);

  const styles = useMemo(() => readVisualStyles(data), [data]);
  const animations = useMemo(() => readVisualAnimations(data), [data]);
  const content = useMemo(() => readVisualContent(data), [data]);
  const deleted = useMemo(() => readVisualDeleted(data), [data]);
  const layout = useMemo(() => readVisualLayout(data), [data]);
  const attributes = useMemo(() => readVisualAttributes(data), [data]);
  const responsive = useMemo(() => readVisualResponsive(data), [data]);
  const locked = useMemo(() => readVisualLocked(data), [data]);
  const hidden = useMemo(() => readVisualHidden(data), [data]);
  const insertedElements = useMemo(
    () => readVisualInsertedElements(data),
    [data],
  );
  const insertedSections = useMemo(
    () => readVisualInsertedSections(data),
    [data],
  );

  const selection = useVisualSelection({
    canvasRef,
    enabled: !isPreviewMode,
  });

  const setData = useCallback(
    (
      nextData:
        | Record<string, any>
        | ((current: Record<string, any>) => Record<string, any>),
    ) => {
      const previous = dataRef.current || {};
      const resolvedData =
        typeof nextData === "function" ? nextData(previous) : nextData;

      const safeData = resolvedData || {};

      /*
        חשוב:
        מעדכנים ref סינכרונית לפני React render.
        ככה saveDraft קורא את התמונה/וידאו/טקסט החדשים גם אם לחצו שמירה מיד אחרי העלאה.
      */
      dataRef.current = safeData;
      history.setValue(safeData);
    },
    [history],
  );

  const replaceData = useCallback(
    (
      nextData:
        | Record<string, any>
        | ((current: Record<string, any>) => Record<string, any>),
    ) => {
      const previous = dataRef.current || {};
      const resolvedData =
        typeof nextData === "function" ? nextData(previous) : nextData;

      const safeData = resolvedData || {};

      dataRef.current = safeData;
      history.replaceValue(safeData);
    },
    [history],
  );

  useEffect(() => {
    if (
      initialDataSignature ===
      lastHydratedInitialDataSignatureRef.current
    ) {
      return;
    }

    const nextInitialData = normalizeVisualData(initialData || {});

    lastHydratedInitialDataSignatureRef.current =
      initialDataSignature;

    dataRef.current = nextInitialData;
    history.replaceValue(nextInitialData);

    selection.clearSelection();
    setIsInlineEditing(false);

    window.requestAnimationFrame(() => {
      applyAllVisualDataToDom(canvasRef.current, nextInitialData);
    });
  }, [
    initialData,
    initialDataSignature,
    history,
    selection,
  ]);

  const updateContent = useCallback(
    (elementId: string, patch: Record<string, any>) => {
      if (!elementId) return false;

      setData((current) => writeVisualContentItem(current, elementId, patch));

      return true;
    },
    [setData],
  );

  const updateText = useCallback(
    (elementId: string, value: string) => {
      if (!elementId) return false;

      const text = String(value ?? "");

      /*
        קריטי:
        ID ויזואלי אינו בהכרח נתיב בתוך ServoraData.
        לכן שומרים רק ב-__content ולא משנים hero/header/nav וכו'.
      */
      setData((current) =>
        writeVisualContentItem(current || {}, elementId, {
          text,
        }),
      );

      return true;
    },
    [setData],
  );

  const updateVisualContent = useCallback(
    (elementId: string, patch: Record<string, any>) => {
      return updateContent(elementId, patch);
    },
    [updateContent],
  );

  const setVisualContent = updateVisualContent;

  const updateInlineText = useCallback(
    (elementId: string, value: string) => {
      return updateText(elementId, value);
    },
    [updateText],
  );

  const updateElementText = updateInlineText;
  const updateElementContent = updateInlineText;

  const startInlineTextEdit = useCallback((elementId: string) => {
    if (!elementId) return false;

    /*
      חשוב:
      לא קוראים כאן ל-selection.selectByElementId(elementId).
      אצלך הבחירה הנכונה נעשית לפי ה-DOM node שנלחץ בפועל מתוך VisualEditorCanvas.
      selectByElementId מחפש לפי ID ולעיתים מחזיר/מחפש ID שלא קיים ב-DOM,
      וזה מה ששבר את הטולבר ואת עריכת הטקסט.
    */

    setIsInlineEditing(true);

    return true;
  }, []);

  const finishInlineTextEdit = useCallback(() => {
    setIsInlineEditing(false);
    return true;
  }, []);

  const updateImage = useCallback(
    (
      elementId: string,
      payload: {
        src?: string;
        url?: string;
        secureUrl?: string;
        secure_url?: string;
        originalUrl?: string;
        alt?: string;
        mediaType?: "image" | "video" | "raw" | string;
        resourceType?: "image" | "video" | "raw" | string;
        resource_type?: "image" | "video" | "raw" | string;
        publicId?: string;
        public_id?: string;
        mediaAssetId?: string | null;
        mimeType?: string;
        mime_type?: string;
        originalName?: string;
        format?: string;
        bytes?: number;
        width?: number;
        height?: number;
        duration?: number;
        folder?: string;
      },
    ) => {
      const selectedId = String(selection.selectedElement?.id || "").trim();
      const primaryId = String(elementId || selectedId || "").trim();

      if (!primaryId) {
        console.warn("[BizUply Visual Media] updateImage missing elementId", {
          payload,
          selectedElementId: selectedId,
          selectedElementType: selection.selectedElement?.type,
        });

        return false;
      }

      const src = getVisualMediaSrcFromPayload(payload as Record<string, any>);

      if (!src) {
        console.warn("[BizUply Visual Media] updateImage missing src", {
          elementId: primaryId,
          payload,
          selectedElementId: selectedId,
          selectedElementType: selection.selectedElement?.type,
        });

        return false;
      }

      const mediaType = getVisualMediaTypeFromPayload(
        payload as Record<string, any>,
      );

      const finalPatch = {
        ...payload,
        src,
        url: payload.url || payload.secureUrl || payload.secure_url || src,
        secureUrl: payload.secureUrl || payload.secure_url || payload.url || src,
        secure_url: payload.secure_url || payload.secureUrl || payload.url || src,
        mediaType,
        resourceType: payload.resourceType || payload.resource_type || mediaType,
        resource_type: payload.resource_type || payload.resourceType || mediaType,
        publicId: payload.publicId || payload.public_id || "",
        public_id: payload.public_id || payload.publicId || "",
      };

      /*
        חשוב:
        לפעמים הכפתור מקבל ID של wrapper ולפעמים ID של האלמנט הפנימי.
        לכן כותבים גם ל-elementId שנשלח וגם ל-selectedElement.id אם הוא שונה.
        כך התמונה החדשה לא נשמרת תחת ID לא נכון.
      */
      const targetIds = collectMediaTargetIds(
        primaryId,
        selection.selectedElement,
        getSelectedDomNode(selection.selectedElement),
      );

      console.log("[BizUply Visual Media] updateImage start", {
        primaryId,
        targetIds,
        src,
        mediaType,
        selectedElementId: selectedId,
        selectedElementType: selection.selectedElement?.type,
        contentBeforeById: targetIds.reduce<Record<string, any>>((acc, id) => {
          acc[id] = getVisualContentItemForLog(dataRef.current || {}, id);
          return acc;
        }, {}),
        payload: finalPatch,
      });

      setData((current) => {
        let nextData = current || {};

        targetIds.forEach((targetId) => {
          nextData = writeVisualContentItem(nextData, targetId, finalPatch);
          nextData = syncTemplateMediaValue(nextData, targetId, finalPatch);

          if (mediaType === "video") {
            /*
              וידאו מקבל את אותה התנהגות כמו תמונה: object-fit "cover"
              כברירת מחדל, אך אם המשתמש כבר בחר object-fit שמור עבור
              האלמנט הזה — מכבדים אותו ולא דורסים אותו.
            */
            const savedObjectFit = String(
              (readVisualStyles(nextData)[targetId] as StylePatch | undefined)
                ?.objectFit || "",
            ).trim();

            nextData = writeVisualStyleItem(nextData, targetId, {
              objectFit: savedObjectFit || "cover",
              objectPosition: "center",
              display: "block",
              overflow: "hidden",
            } as StylePatch);

            const sourceWidth = Number(payload.width || 0);
            const sourceHeight = Number(payload.height || 0);
            const currentLayout =
              readVisualLayout(nextData)[targetId] || {};

            const currentWidth = String(currentLayout.width || "");
            const currentHeight = String(currentLayout.height || "");

            const stillDefaultVideoSize =
              (!currentWidth && !currentHeight) ||
              (currentWidth === "480px" &&
                currentHeight === "270px") ||
              (currentWidth === "320px" &&
                currentHeight === "220px");

            if (
              stillDefaultVideoSize &&
              sourceWidth > 0 &&
              sourceHeight > 0
            ) {
              const maxWidth = 560;
              const maxHeight = 420;
              const scale = Math.min(
                1,
                maxWidth / sourceWidth,
                maxHeight / sourceHeight,
              );

              const nextWidth = Math.max(
                160,
                Math.round(sourceWidth * scale),
              );
              const nextHeight = Math.max(
                90,
                Math.round(sourceHeight * scale),
              );

              nextData = writeVisualLayoutItem(
                nextData,
                targetId,
                {
                  ...currentLayout,
                  width: `${nextWidth}px`,
                  height: `${nextHeight}px`,
                  minWidth: "48px",
                  minHeight: "48px",
                  freePosition: true,
                },
              );
            }
          }
        });

        console.log("[BizUply Visual Media] updateImage wrote content", {
          primaryId,
          targetIds,
          contentItemsById: targetIds.reduce<Record<string, any>>((acc, id) => {
            acc[id] = getVisualContentItemForLog(nextData, id);
            return acc;
          }, {}),
          contentKeys: Object.keys(
            ((nextData?.[VISUAL_CONTENT_KEY] || {}) as Record<string, any>),
          ),
          directTemplateValuesById: targetIds.reduce<Record<string, any>>(
            (acc, id) => {
              acc[id] = Object.prototype.hasOwnProperty.call(nextData, id)
                ? nextData[id]
                : undefined;
              return acc;
            },
            {},
          ),
        });

        /*
          dataRef מתעדכן בתוך אותו tick.
          כך תצוגת המדיה מקבלת מיד את ה-blob/URL החדש ולא snapshot ישן.
        */
        dataRef.current = nextData;

        return nextData;
      });

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const latestData = dataRef.current || {};

          console.log("[BizUply Visual Media] updateImage apply to dom", {
            primaryId,
            targetIds,
            contentItemsById: targetIds.reduce<Record<string, any>>((acc, id) => {
              acc[id] = getVisualContentItemForLog(latestData, id);
              return acc;
            }, {}),
            src,
            mediaType,
          });

          applyAllVisualDataToDom(canvasRef.current, latestData);
          selection.refreshSelectedElement?.();
        });
      });

      return true;
    },
    [
      canvasRef,
      dataRef,
      selection.selectedElement?.id,
      selection.selectedElement?.type,
      selection.refreshSelectedElement,
      setData,
    ],
  );

  const resolveMediaPickerTarget = useCallback(
    (
      elementId: string,
      options?: {
        target?: "media" | "background";
      },
    ) => {
      const applyAsBackground = options?.target === "background";
      const requestedId = String(
        elementId || selection.selectedElement?.id || "",
      ).trim();

      const selectedNode = getSelectedDomNode(selection.selectedElement);
      const liveRequestedNode = findVisualNodeById(
        canvasRef.current,
        requestedId,
      );
      const connectedSelectedNode =
        selectedNode && canvasRef.current?.contains(selectedNode)
          ? selectedNode
          : null;
      const requestedNode = liveRequestedNode || connectedSelectedNode;
      const mediaNode = applyAsBackground
        ? null
        : getActualMediaNode(requestedNode);
      const selectedMedia = mediaNode
        ? selection.selectNode(mediaNode, {
            keepPreviousOnMissing: true,
          })
        : null;
      const cleanElementId = String(
        applyAsBackground
          ? requestedId
          : selectedMedia?.id ||
              mediaNode?.getAttribute("data-visual-edit-id") ||
              requestedId,
      ).trim();

      return {
        applyAsBackground,
        cleanElementId,
        node: mediaNode || requestedNode,
      };
    },
    [canvasRef, selection],
  );

  const processSelectedMediaFile = useCallback(
    (
      cleanElementId: string,
      file: File,
      applyAsBackground = false,
    ) => {
      if (!cleanElementId || !file) return false;

      const localMediaType = file.type.startsWith("video/")
        ? "video"
        : "image";

      const previousContent = readVisualContent(dataRef.current || {});
      const previousContentItem = previousContent[cleanElementId];
      const previousPreviewUrl =
        previewObjectUrlsRef.current.get(cleanElementId);
      const previewUrl = URL.createObjectURL(file);

      if (previousPreviewUrl && previousPreviewUrl !== previewUrl) {
        window.setTimeout(() => {
          try {
            URL.revokeObjectURL(previousPreviewUrl);
          } catch {
            // noop
          }
        }, 2500);
      }

      previewObjectUrlsRef.current.set(cleanElementId, previewUrl);

      const nextSequence =
        (uploadSequenceRef.current.get(cleanElementId) || 0) + 1;

      uploadSequenceRef.current.set(cleanElementId, nextSequence);

      updateImage(cleanElementId, {
        src: previewUrl,
        url: previewUrl,
        secureUrl: previewUrl,
        mediaType: localMediaType,
        resourceType: localMediaType,
        mimeType: file.type,
        originalName: file.name,
        alt: file.name,
        bytes: file.size,
        uploadState: "uploading",
        target: applyAsBackground ? "background" : "media",
        background: applyAsBackground,
        applyAsBackground,
        autoplay: localMediaType === "video",
        muted: localMediaType === "video",
        loop: localMediaType === "video",
        controls: false,
        preload: localMediaType === "video" ? "auto" : undefined,
      } as any);

      const uploadPromise = (async () => {
        try {
          const uploaded = await uploadVisualMediaToCloudinary({
            file,
            businessId,
          });

          if (
            uploadSequenceRef.current.get(cleanElementId) !== nextSequence
          ) {
            return;
          }

          updateImage(cleanElementId, {
            src: uploaded.secureUrl || uploaded.src,
            url: uploaded.secureUrl || uploaded.src,
            secureUrl: uploaded.secureUrl || uploaded.src,
            mediaType: uploaded.mediaType,
            resourceType: uploaded.resourceType,
            resource_type: uploaded.resource_type,
            publicId: uploaded.publicId,
            public_id: uploaded.public_id,
            mediaAssetId: uploaded.mediaAssetId,
            alt: uploaded.originalName || file.name,
            mimeType: uploaded.mimeType || file.type,
            originalName: uploaded.originalName || file.name,
            format: uploaded.format,
            bytes: uploaded.bytes,
            width: uploaded.width,
            height: uploaded.height,
            duration: uploaded.duration,
            folder: uploaded.folder,
            uploadState: "uploaded",
            target: applyAsBackground ? "background" : "media",
            background: applyAsBackground,
            applyAsBackground,
            autoplay: uploaded.mediaType === "video",
            muted: uploaded.mediaType === "video",
            loop: uploaded.mediaType === "video",
            controls: false,
            preload: uploaded.mediaType === "video" ? "auto" : undefined,
          } as any);

          window.setTimeout(() => {
            applyAllVisualDataToDom(
              canvasRef.current,
              dataRef.current || {},
            );
          }, 0);
        } catch (error) {
          console.error("[BizUply Visual Media] upload failed", error);

          if (
            uploadSequenceRef.current.get(cleanElementId) === nextSequence
          ) {
            setData((current) => {
              const currentContent = readVisualContent(current || {});
              const nextContent = { ...currentContent };

              if (previousContentItem) {
                nextContent[cleanElementId] = previousContentItem;
              } else {
                delete nextContent[cleanElementId];
              }

              const restoredData = {
                ...(current || {}),
                [VISUAL_CONTENT_KEY]: nextContent,
              };

              dataRef.current = restoredData;
              return restoredData;
            });

            window.setTimeout(() => {
              applyAllVisualDataToDom(
                canvasRef.current,
                dataRef.current || {},
              );
            }, 0);

            const message =
              error instanceof Error
                ? error.message
                : "העלאת המדיה נכשלה";

            window.alert(message);
          }
        } finally {
          const currentPreviewUrl =
            previewObjectUrlsRef.current.get(cleanElementId);

          if (currentPreviewUrl === previewUrl) {
            previewObjectUrlsRef.current.delete(cleanElementId);

            window.setTimeout(() => {
              const latestItem = readVisualContent(
                dataRef.current || {},
              )[cleanElementId] as Record<string, any> | undefined;

              const latestSrc = String(
                latestItem?.src ||
                  latestItem?.secureUrl ||
                  latestItem?.url ||
                  "",
              );

              if (latestSrc !== previewUrl) {
                try {
                  URL.revokeObjectURL(previewUrl);
                } catch {
                  // noop
                }
              }
            }, 2500);
          }
        }
      })();

      pendingMediaUploadsRef.current.set(cleanElementId, uploadPromise);
      setIsUploadingMedia(true);

      void uploadPromise.finally(() => {
        const registeredPromise =
          pendingMediaUploadsRef.current.get(cleanElementId);

        if (registeredPromise === uploadPromise) {
          pendingMediaUploadsRef.current.delete(cleanElementId);
        }

        setIsUploadingMedia(pendingMediaUploadsRef.current.size > 0);
      });

      return true;
    },
    [businessId, canvasRef, setData, updateImage],
  );

  const closeMediaModal = useCallback(() => {
    setMediaModal((current) => ({
      ...current,
      open: false,
    }));
  }, []);

  const openMediaModal = useCallback(
    (
      elementId: string,
      mode: VisualMediaModalMode = "change",
      options?: {
        target?: "media" | "background";
      },
    ) => {
      const target = resolveMediaPickerTarget(elementId, options);

      if (!target.cleanElementId) {
        console.warn("[BizUply Visual Media] openMediaModal missing elementId", {
          elementId,
          mode,
          options,
        });

        return false;
      }

      const contentItem = readVisualContent(dataRef.current || {})[
        target.cleanElementId
      ] as Record<string, any> | undefined;

      const currentSrc = String(
        contentItem?.src ||
          contentItem?.secureUrl ||
          contentItem?.url ||
          getNodeMediaSrc(target.node) ||
          "",
      ).trim();

      const currentAlt = String(
        contentItem?.alt || getNodeMediaAlt(target.node) || "",
      ).trim();

      const mediaType = getVisualMediaTypeFromPayload({
        mediaType:
          contentItem?.mediaType ||
          contentItem?.resourceType ||
          target.node?.getAttribute("data-visual-media-type"),
        src: currentSrc,
      });

      setMediaModal({
        open: true,
        elementId: target.cleanElementId,
        elementLabel:
          target.node?.getAttribute("data-visual-edit-label") ||
          target.node?.getAttribute("alt") ||
          "מדיה",
        mode,
        target: options?.target === "background" ? "background" : "media",
        currentSrc,
        currentAlt,
        mediaType,
      });

      return true;
    },
    [resolveMediaPickerTarget],
  );

  const applyMediaFromModal = useCallback(
    (payload: VisualMediaModalApplyPayload) => {
      const elementId = String(mediaModal.elementId || "").trim();

      if (!elementId || !payload?.src) return false;

      const applyAsBackground = mediaModal.target === "background";
      const mediaType = getVisualMediaTypeFromPayload(
        payload as Record<string, any>,
      );

      return updateImage(elementId, {
        src: payload.src,
        url: payload.src,
        secureUrl: payload.src,
        alt: payload.alt || mediaModal.currentAlt || mediaModal.elementLabel,
        mediaType,
        resourceType: mediaType,
        target: applyAsBackground ? "background" : "media",
        background: applyAsBackground,
        applyAsBackground,
        autoplay: mediaType === "video",
        muted: mediaType === "video",
        loop: mediaType === "video",
        controls: false,
        preload: mediaType === "video" ? "auto" : undefined,
      } as any);
    },
    [mediaModal, updateImage],
  );


  const openMediaPicker = useCallback(
    async (
      elementId: string,
      options?: {
        target?: "media" | "background";
      },
    ) => openMediaModal(elementId, "change", options),
    [openMediaModal],
  );

  const waitForPendingMediaUploads = useCallback(async () => {
    while (pendingMediaUploadsRef.current.size > 0) {
      const pending = Array.from(
        pendingMediaUploadsRef.current.values(),
      );

      await Promise.allSettled(pending);
    }
  }, []);

  const updateLink = useCallback(
    (
      elementId: string,
      payload: {
        href?: string;
        target?: "_self" | "_blank" | string;
        rel?: string;
      },
    ) => {
      if (!elementId) return false;

      return updateContent(elementId, {
        href: payload.href || "",
        target: payload.target || "_self",
        rel:
          payload.rel ||
          (payload.target === "_blank" ? "noopener noreferrer" : ""),
      });
    },
    [updateContent],
  );

  const applyStyle = useCallback(
    (elementId: string, style: StylePatch) => {
      if (!elementId) return false;

      setData((current) => writeVisualStyleItem(current, elementId, style));

      /*
        הטולבר צריך לקבל מיד את הצבע/פונט/גרדיאנט האמיתי לאחר שינוי.
        מחילים את ה-style על ה-DOM ואז מרעננים את selectedElement ואת
        computedStyle שלו, בלי לחכות לקליק נוסף.
      */
      window.requestAnimationFrame(() => {
        const latestData = dataRef.current || {};

        applyAllVisualDataToDom(canvasRef.current, latestData);
        selection.refreshSelectedElement?.();
      });

      return true;
    },
    [canvasRef, dataRef, selection, setData],
  );

  const applyMediaEditValues = useCallback(
    (values: VisualMediaEditValues) => {
      const elementId = String(mediaModal.elementId || "").trim();

      if (!elementId) return false;

      return applyStyle(elementId, {
        filter: buildMediaEditFilter(values),
      } as StylePatch);
    },
    [applyStyle, mediaModal.elementId],
  );

  const resetMediaEditValues = useCallback(() => {
    const elementId = String(mediaModal.elementId || "").trim();

    if (!elementId) return false;

    return applyStyle(elementId, {
      filter: "none",
    } as StylePatch);
  }, [applyStyle, mediaModal.elementId]);

  const uploadMediaFileFromModal = useCallback(
    async (file: File) => {
      const elementId = String(mediaModal.elementId || "").trim();

      if (!elementId) return false;

      return processSelectedMediaFile(
        elementId,
        file,
        mediaModal.target === "background",
      );
    },
    [mediaModal.elementId, mediaModal.target, processSelectedMediaFile],
  );

  const resetStyle = useCallback(
    (elementId: string) => {
      if (!elementId) return false;

      setData((current) => {
        const currentStyles = readVisualStyles(current);
        const nextStyles = { ...currentStyles };
        delete nextStyles[elementId];

        return {
          ...current,
          [VISUAL_STYLE_KEY]: nextStyles,
        };
      });

      return true;
    },
    [setData],
  );

  const setAnimation = useCallback(
    (elementId: string, animation: AnimationPresetValue | string) => {
      if (!elementId) return false;

      setData((current) =>
        writeVisualAnimationItem(current, elementId, animation),
      );

      return true;
    },
    [setData],
  );

  const clearAnimation = useCallback(
    (elementId: string) => {
      if (!elementId) return false;

      setData((current) => {
        const currentAnimations = readVisualAnimations(current);
        const nextAnimations = { ...currentAnimations };
        delete nextAnimations[elementId];

        return {
          ...current,
          [VISUAL_ANIMATION_KEY]: nextAnimations,
        };
      });

      return true;
    },
    [setData],
  );

  const applyLayout = useCallback(
    (elementId: string, patch: Record<string, any>) => {
      if (!elementId) return false;
      setData((current) => writeVisualLayoutItem(current || {}, elementId, patch));
      return true;
    },
    [setData],
  );

  const updateLayout = applyLayout;

  const updateAttributes = useCallback(
    (elementId: string, patch: Record<string, any>) => {
      if (!elementId) return false;
      setData((current) =>
        writeVisualAttributesItem(current || {}, elementId, patch),
      );
      return true;
    },
    [setData],
  );

  const applyResponsive = useCallback(
    (elementId: string, device: VisualDeviceMode, patch: Record<string, any>) => {
      if (!elementId) return false;
      setData((current) =>
        writeVisualResponsiveItem(current || {}, elementId, device, patch),
      );
      return true;
    },
    [setData],
  );

  const setElementLocked = useCallback(
    (elementId: string, value: boolean) => {
      if (!elementId) return false;
      setData((current) => setVisualElementLocked(current || {}, elementId, value));
      return true;
    },
    [setData],
  );

  const toggleElementLocked = useCallback(
    (elementId?: string) => {
      const id = elementId || selection.selectedElement?.id || "";
      if (!id) return false;
      return setElementLocked(id, !Boolean(locked[id]));
    },
    [locked, selection.selectedElement?.id, setElementLocked],
  );

  const setElementHidden = useCallback(
    (elementId: string, value: boolean) => {
      if (!elementId) return false;
      setData((current) => setVisualElementHidden(current || {}, elementId, value));
      return true;
    },
    [setData],
  );

  const toggleElementHidden = useCallback(
    (elementId?: string) => {
      const id = elementId || selection.selectedElement?.id || "";
      if (!id) return false;
      return setElementHidden(id, !Boolean(hidden[id]));
    },
    [hidden, selection.selectedElement?.id, setElementHidden],
  );


  const addElement = useCallback(
    async (
      type: VisualInsertedElementType,
      options?: {
        parentId?: string;
        sectionId?: string;
        openMediaPicker?: boolean;
      },
    ) => {
      const root = canvasRef.current;
      if (!root) return "";

      const selectedNode = getSelectedDomNode(
        selection.selectedElement,
      );

      const sectionNode = getClosestVisualSectionNode(
        root,
        selectedNode,
      );

      const sectionId =
        String(options?.sectionId || "").trim() ||
        getDirectVisualId(sectionNode) ||
        "visual-root";

      const parentId =
        String(options?.parentId || "").trim() ||
        sectionId;

      const payload = getDefaultInsertedElementPayload(
        type,
        parentId,
        sectionId,
      );

      setData((current) => {
        let next = writeVisualInsertedElement(
          current || {},
          payload.item,
        );

        next = writeVisualContentItem(
          next,
          payload.item.id,
          payload.content,
        );

        next = writeVisualStyleItem(
          next,
          payload.item.id,
          payload.style as StylePatch,
        );

        next = writeVisualLayoutItem(
          next,
          payload.item.id,
          payload.layout,
        );

        dataRef.current = next;
        return next;
      });

      window.requestAnimationFrame(() => {
        applyAllVisualDataToDom(
          canvasRef.current,
          dataRef.current || {},
        );

        window.requestAnimationFrame(() => {
          selection.selectByElementId(payload.item.id, {
            keepPreviousOnMissing: true,
          });
        });
      });

      if (
        options?.openMediaPicker &&
        (type === "image" || type === "video")
      ) {
        window.setTimeout(() => {
          void openMediaPicker(payload.item.id);
        }, 80);
      }

      return payload.item.id;
    },
    [
      canvasRef,
      openMediaPicker,
      selection,
      setData,
    ],
  );

  const addLibraryMedia = useCallback(
    async (item: PexelsMediaItem) => {
      const src = String(item?.src || "").trim();

      if (!src) {
        console.warn(
          "[BizUply Pexels] addLibraryMedia missing src",
          item,
        );

        return "";
      }

      const mediaType =
        item.mediaType === "video" ? "video" : "image";

      const elementId = await addElement(mediaType);

      if (!elementId) {
        return "";
      }

      updateImage(
        elementId,
        {
          src,
          url: src,
          secureUrl: src,
          originalUrl: src,
          alt: item.alt || item.title || "Pexels media",
          mediaType,
          resourceType: mediaType,
          resource_type: mediaType,
          width: item.width,
          height: item.height,
          provider: "pexels",
          libraryItemId: item.id,
          thumbnail: item.thumbnail,
          sourceUrl: item.sourceUrl || "",
          creator: item.creator || "",
          creatorUrl: item.creatorUrl || "",
          attribution: item.attribution || "",
          license: item.license,
          uploadState: "remote",
          autoplay: mediaType === "video",
          muted: mediaType === "video",
          loop: mediaType === "video",
          controls: false,
          playsInline: true,
          preload: mediaType === "video" ? "metadata" : undefined,
        } as any,
      );

      /*
        אין צורך בהחלת סגנון וידאו נפרד כאן:
        updateImage כבר מגדיר לווידאו object-fit "cover" (כמו תמונה),
        תוך כיבוד ערך שמור. החלה כפולה גרמה ל-re-apply מיותר ולניצנוץ.
      */

      return elementId;
    },
    [addElement, updateImage],
  );

  const addText = useCallback(
    () => addElement("text"),
    [addElement],
  );

  const addButton = useCallback(
    () => addElement("button"),
    [addElement],
  );

  const addImage = useCallback(
    () =>
      addElement("image", {
        openMediaPicker: true,
      }),
    [addElement],
  );

  const addVideo = useCallback(
    () =>
      addElement("video", {
        openMediaPicker: true,
      }),
    [addElement],
  );

  const addBox = useCallback(
    () => addElement("box"),
    [addElement],
  );

  const addDivider = useCallback(
    () => addElement("divider"),
    [addElement],
  );

  const addSection = useCallback(
    (
      placement: "before" | "after" | "append" = "after",
      anchorElementId?: string,
    ) => {
      const root = canvasRef.current;
      if (!root) return "";

      const selectedNode = getSelectedDomNode(
        selection.selectedElement,
      );

      const sectionNode = getClosestVisualSectionNode(
        root,
        selectedNode,
      );

      const anchorId =
        String(anchorElementId || "").trim() ||
        getDirectVisualId(sectionNode);

      const id = createVisualCustomId("custom-section");

      setData((current) => {
        let next = writeVisualInsertedSection(
          current || {},
          {
            id,
            anchorId,
            placement,
            label: "סקשן חדש",
            createdAt: new Date().toISOString(),
          },
        );

        next = writeVisualStyleItem(next, id, {
          backgroundColor: "#ffffff",
          padding: "64px 32px",
        } as StylePatch);

        next = writeVisualLayoutItem(next, id, {
          position: "relative",
          width: "100%",
          minHeight: "320px",
          zIndex: 1,
        });

        dataRef.current = next;
        return next;
      });

      window.requestAnimationFrame(() => {
        applyAllVisualDataToDom(
          canvasRef.current,
          dataRef.current || {},
        );

        window.requestAnimationFrame(() => {
          selection.selectByElementId(id, {
            keepPreviousOnMissing: true,
          });
        });
      });

      return id;
    },
    [
      canvasRef,
      selection,
      setData,
    ],
  );

  const getLayerItems = useCallback(() => {
    const root = canvasRef.current;
    if (!root) return [];

    return Array.from(
      root.querySelectorAll<HTMLElement>(
        "[data-visual-edit-id]",
      ),
    )
      .filter(
        (node) =>
          !node.closest(
            "[data-editor-only], [data-bizuply-editor-only]",
          ),
      )
      .map((node) => {
        const id = String(
          node.getAttribute("data-visual-edit-id") || "",
        ).trim();

        const computed = window.getComputedStyle(node);
        const zIndex = Number.parseInt(computed.zIndex, 10);

        return {
          id,
          label:
            node.getAttribute("data-visual-edit-label") ||
            node.getAttribute("data-section-title") ||
            node.tagName.toLowerCase(),
          type:
            node.getAttribute("data-visual-edit-type") ||
            node.getAttribute("data-visual-type") ||
            node.tagName.toLowerCase(),
          zIndex: Number.isFinite(zIndex) ? zIndex : 0,
          hidden: Boolean(hidden[id]),
          locked: Boolean(locked[id]),
          inserted:
            node.getAttribute("data-visual-inserted") ===
            "true",
        };
      })
      .filter((item) => item.id)
      .sort((a, b) => b.zIndex - a.zIndex);
  }, [hidden, locked]);

  const bringToFront = useCallback(
    (elementId?: string) => {
      const id =
        String(
          elementId ||
            selection.selectedElement?.id ||
            "",
        ).trim();

      if (!id) return false;

      const maxZ = Math.max(
        0,
        ...Object.values(readVisualLayout(dataRef.current || {})).map(
          (item) => Number(item?.zIndex || 0),
        ),
        ...Object.values(readVisualStyles(dataRef.current || {})).map(
          (item) => Number(
            (item as Record<string, any>)?.zIndex || 0,
          ),
        ),
      );

      applyLayout(id, {
        position: "absolute",
        zIndex: maxZ + 1,
        freePosition: true,
      });

      return true;
    },
    [applyLayout, selection.selectedElement?.id],
  );

  const sendToBack = useCallback(
    (elementId?: string) => {
      const id =
        String(
          elementId ||
            selection.selectedElement?.id ||
            "",
        ).trim();

      if (!id) return false;

      const minZ = Math.min(
        0,
        ...Object.values(readVisualLayout(dataRef.current || {})).map(
          (item) => Number(item?.zIndex || 0),
        ),
      );

      applyLayout(id, {
        position: "absolute",
        zIndex: minZ - 1,
        freePosition: true,
      });

      return true;
    },
    [applyLayout, selection.selectedElement?.id],
  );

  const togglePreviewMode = useCallback(() => {
    setIsInlineEditing(false);
    setIsPreviewMode((current) => !current);
  }, []);

  const openBackgroundMediaPicker = useCallback(
    (elementId: string) =>
      openMediaPicker(elementId, {
        target: "background",
      }),
    [openMediaPicker],
  );

  const previewAnimation = useCallback(
    (elementId?: string) => {
      const id = elementId || selection.selectedElement?.id || "";
      if (!id) return false;
      const node = findVisualNodeById(canvasRef.current, id);
      if (!node) return false;
      node.getAnimations().forEach((animation) => {
        try {
          animation.cancel();
          animation.play();
        } catch {
          // noop
        }
      });
      return true;
    },
    [selection.selectedElement?.id],
  );

  const deleteElement = useCallback(
    (elementId?: string) => {
      const selectedElement = selection.selectedElement as any;
      const id = getCanonicalSelectedElementId(elementId, selectedElement);

      if (!id) return false;

      /*
        המחיקה נרשמת ב-state כ-__deletedElements[id] = true.
        useVisualSave שולח את המפה הזאת לשרת, והשרת שומר אותה במונגו.
      */
      setData((current) => {
        if (readVisualInsertedElements(current || {})[id]) {
          return removeVisualInsertedElement(current || {}, id);
        }

        if (readVisualInsertedSections(current || {})[id]) {
          return removeVisualInsertedSection(current || {}, id);
        }

        return markVisualElementDeleted(current || {}, id);
      });

      /*
        מסתירים מיד את אותו node כדי שהמשתמש יראה את התוצאה בלי לחכות ל-render.
        זה רק UI מיידי; מקור האמת נשאר __deletedElements שנשמר בשרת.
      */
      const selectedNode = getSelectedDomNode(selectedElement);
      const domNode =
        selectedNode?.getAttribute("data-visual-edit-id") === id
          ? selectedNode
          : findVisualNodeById(canvasRef.current, id);

      if (domNode) {
        domNode.setAttribute("data-visual-deleted", "true");
        domNode.setAttribute("hidden", "true");
        domNode.style.setProperty("display", "none", "important");
      }

      console.log("[BizUply Visual Delete] marked for server save", {
        elementId: id,
        selectedType: selectedElement?.type,
        deletedCount: Object.keys(
          readVisualDeleted(dataRef.current || {}),
        ).length,
      });

      selection.clearSelection();

      return true;
    },
    [canvasRef, selection, setData],
  );

  const restoreElement = useCallback(
    (elementId: string) => {
      const id = String(elementId || "").trim();
      if (!id) return false;

      setData((current) => restoreVisualElement(current || {}, id));

      const domNode = findVisualNodeById(canvasRef.current, id);

      if (domNode) {
        domNode.removeAttribute("data-visual-deleted");
        domNode.removeAttribute("hidden");
        domNode.style.removeProperty("display");
      }

      window.setTimeout(() => {
        applyAllVisualDataToDom(canvasRef.current, dataRef.current || {});
      }, 0);

      return true;
    },
    [canvasRef, setData],
  );

  const duplicateElement = useCallback(
    (explicitElementId?: string) => {
      const selectedId = String(
        explicitElementId || selection.selectedElement?.id || "",
      ).trim();

      if (!selectedId) return false;

      const currentData = dataRef.current || {};
      const insertedSections = readVisualInsertedSections(currentData);
      const insertedElements = readVisualInsertedElements(currentData);
      const sourceSection = insertedSections[selectedId];
      const sourceElement = insertedElements[selectedId];

      const copyVisualMaps = (
        source: Record<string, any>,
        fromId: string,
        toId: string,
      ) => {
        let next = source;

        const contentItem = readVisualContent(source)[fromId];
        const styleItem = readVisualStyles(source)[fromId];
        const layoutItem = readVisualLayout(source)[fromId];
        const animationItem = readVisualAnimations(source)[fromId];
        const attributeItem = readVisualAttributes(source)[fromId];

        if (contentItem) {
          next = writeVisualContentItem(next, toId, contentItem);
        }

        if (styleItem) {
          next = writeVisualStyleItem(next, toId, styleItem as StylePatch);
        }

        if (layoutItem) {
          next = writeVisualLayoutItem(next, toId, layoutItem);
        }

        if (animationItem) {
          next = writeVisualAnimationItem(next, toId, animationItem);
        }

        if (attributeItem) {
          next = writeVisualAttributesItem(next, toId, attributeItem);
        }

        return next;
      };

      if (sourceSection) {
        const newSectionId = createVisualCustomId("custom-section");

        setData((current) => {
          let next = writeVisualInsertedSection(current || {}, {
            ...sourceSection,
            id: newSectionId,
            label: `${sourceSection.label || "סקשן"} (עותק)`,
            anchorId: selectedId,
            placement: "after",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          next = copyVisualMaps(next, selectedId, newSectionId);

          const childElements = Object.values(insertedElements).filter(
            (item) =>
              item?.sectionId === selectedId || item?.parentId === selectedId,
          );

          const idMap: Record<string, string> = {
            [selectedId]: newSectionId,
          };

          childElements.forEach((item) => {
            if (!item?.id) return;
            idMap[item.id] = createVisualCustomId(`custom-${item.type}`);
          });

          childElements.forEach((item) => {
            if (!item?.id) return;

            const nextId = idMap[item.id];
            const nextParentId =
              idMap[item.parentId || ""] || newSectionId;

            next = writeVisualInsertedElement(next, {
              ...item,
              id: nextId,
              parentId: nextParentId,
              sectionId: newSectionId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });

            next = copyVisualMaps(next, item.id, nextId);
          });

          dataRef.current = next;
          return next;
        });

        window.requestAnimationFrame(() => {
          applyAllVisualDataToDom(
            canvasRef.current,
            dataRef.current || {},
          );

          window.requestAnimationFrame(() => {
            selection.selectByElementId(newSectionId, {
              keepPreviousOnMissing: true,
            });
          });
        });

        return true;
      }

      if (sourceElement) {
        const nextId = createVisualCustomId(`custom-${sourceElement.type}`);

        setData((current) => {
          let next = writeVisualInsertedElement(current || {}, {
            ...sourceElement,
            id: nextId,
            label: `${sourceElement.label || "אלמנט"} (עותק)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            layout: {
              ...(readVisualLayout(current)[sourceElement.id] || {}),
              x:
                Number(readVisualLayout(current)[sourceElement.id]?.x || 40) +
                24,
              y:
                Number(readVisualLayout(current)[sourceElement.id]?.y || 40) +
                24,
              translateX:
                Number(
                  readVisualLayout(current)[sourceElement.id]?.translateX || 40,
                ) + 24,
              translateY:
                Number(
                  readVisualLayout(current)[sourceElement.id]?.translateY || 40,
                ) + 24,
            },
          });

          next = copyVisualMaps(next, sourceElement.id, nextId);
          dataRef.current = next;
          return next;
        });

        window.requestAnimationFrame(() => {
          applyAllVisualDataToDom(
            canvasRef.current,
            dataRef.current || {},
          );

          window.requestAnimationFrame(() => {
            selection.selectByElementId(nextId, {
              keepPreviousOnMissing: true,
            });
          });
        });

        return true;
      }

      const nextId = `${selectedId}.copy-${Date.now()}`;
      const selectedContent = content[selectedId];
      const selectedStyle = styles[selectedId];
      const selectedAnimation = animations[selectedId];
      const selectedLayout = layout[selectedId];

      setData((current) => {
        let next = current || {};

        if (selectedContent) {
          next = writeVisualContentItem(next, nextId, selectedContent);
        }

        if (selectedStyle) {
          next = writeVisualStyleItem(next, nextId, selectedStyle as StylePatch);
        }

        if (selectedLayout) {
          next = writeVisualLayoutItem(next, nextId, selectedLayout);
        }

        if (selectedAnimation) {
          next = writeVisualAnimationItem(next, nextId, selectedAnimation);
        }

        dataRef.current = next;
        return next;
      });

      window.requestAnimationFrame(() => {
        applyAllVisualDataToDom(canvasRef.current, dataRef.current || {});
      });

      return true;
    },
    [
      animations,
      canvasRef,
      content,
      layout,
      selection,
      setData,
      styles,
    ],
  );

  const addLibraryElement = useCallback(
    async (libraryId: string) => {
      const libraryItem = ELEMENT_LIBRARY.find((item) => item.id === libraryId);

      if (!libraryItem) {
        console.warn("[BizUply Visual Library] missing element", libraryId);
        return "";
      }

      const root = canvasRef.current;
      if (!root) return "";

      const selectedNode = getSelectedDomNode(selection.selectedElement);
      const sectionNode = getClosestVisualSectionNode(root, selectedNode);
      const sectionId =
        getDirectVisualId(sectionNode) || "visual-root";
      const parentId = sectionId;
      const groupId = createVisualCustomId(`library-${libraryId}`);
      const keyToId: Record<string, string> = {};

      libraryItem.nodes.forEach((nodeTemplate) => {
        keyToId[nodeTemplate.key] = createVisualCustomId(
          `custom-${nodeTemplate.type}`,
        );
      });

      setData((current) => {
        let next = current || {};

        libraryItem.nodes.forEach((nodeTemplate: VisualLibraryNodeTemplate) => {
          const id = keyToId[nodeTemplate.key];
          const parentKey = nodeTemplate.parentKey || "root";
          const resolvedParentId =
            parentKey === "root"
              ? parentId
              : keyToId[parentKey] || parentId;

          next = writeVisualInsertedElement(next, {
            id,
            type: nodeTemplate.type,
            parentId: resolvedParentId,
            sectionId,
            label: nodeTemplate.label,
            tagName: nodeTemplate.tagName,
            libraryId,
            groupId,
            localKey: nodeTemplate.key,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          if (nodeTemplate.content) {
            next = writeVisualContentItem(next, id, nodeTemplate.content);
          }

          if (nodeTemplate.style) {
            next = writeVisualStyleItem(
              next,
              id,
              nodeTemplate.style as StylePatch,
            );
          }

          if (nodeTemplate.layout) {
            next = writeVisualLayoutItem(next, id, nodeTemplate.layout);
          }

          if (nodeTemplate.attributes) {
            next = writeVisualAttributesItem(next, id, nodeTemplate.attributes);
          }
        });

        dataRef.current = next;
        return next;
      });

      const firstId = keyToId[libraryItem.nodes[0]?.key || ""];

      window.requestAnimationFrame(() => {
        applyAllVisualDataToDom(canvasRef.current, dataRef.current || {});

        if (firstId) {
          window.requestAnimationFrame(() => {
            selection.selectByElementId(firstId, {
              keepPreviousOnMissing: true,
            });
          });
        }
      });

      return firstId;
    },
    [canvasRef, selection, setData],
  );

  const getLinkTargets = useCallback(() => {
    const root = canvasRef.current;
    const pages = Array.isArray(renderer?.pages)
      ? renderer.pages.map((page: any) => ({
          id: String(page.id || page.slug || "").trim(),
          label: String(page.name || page.title || page.id || "").trim(),
          slug: String(page.slug || page.id || "").trim(),
          href: `/${String(page.slug || page.id || "").replace(/^\//, "")}`,
        }))
      : [];

    const sections = root
      ? Array.from(
          root.querySelectorAll<HTMLElement>(
            "[data-template-section-id], [data-visual-inserted-section='true']",
          ),
        )
          .map((node) => {
            const id = String(
              node.getAttribute("data-template-section-id") ||
                node.getAttribute("data-visual-edit-id") ||
                node.id ||
                "",
            ).trim();

            const label = String(
              node.getAttribute("data-section-title") ||
                node.getAttribute("data-visual-edit-label") ||
                id,
            ).trim();

            const sectionSlug = id.includes(".")
              ? id.split(".").pop() || id
              : id;

            return {
              id,
              label,
              href: `#${sectionSlug.replace(/^#/, "")}`,
            };
          })
          .filter((item, index, list) => {
            if (!item.id) return false;
            return list.findIndex((entry) => entry.id === item.id) === index;
          })
      : [];

    return { pages, sections };
  }, [canvasRef, renderer]);

  const bringForward = useCallback(
    (elementId?: string) => {
      const id = elementId || selection.selectedElement?.id;
      if (!id) return false;

      const currentZ = Number((styles[id] as Record<string, any>)?.zIndex || 0);

      applyStyle(id, { zIndex: currentZ + 1 });

      return true;
    },
    [applyStyle, selection.selectedElement?.id, styles],
  );

  const sendBackward = useCallback(
    (elementId?: string) => {
      const id = elementId || selection.selectedElement?.id;
      if (!id) return false;

      const currentZ = Number((styles[id] as Record<string, any>)?.zIndex || 0);

      applyStyle(id, { zIndex: currentZ - 1 });

      return true;
    },
    [applyStyle, selection.selectedElement?.id, styles],
  );

  const runtimeCss = useMemo(
    () =>
      buildVisualRuntimeCss(
        styles,
        animations,
        selection.selectedElement?.id,
        selection.hoveredElementId,
      ),
    [
      animations,
      selection.hoveredElementId,
      selection.selectedElement?.id,
      styles,
    ],
  );

  const applyDataToDom = useCallback(() => {
    applyAllVisualDataToDom(canvasRef.current, dataRef.current || {});
  }, []);

  const save = useVisualSave({
    renderer,
    canvasRef,
    data,
    dataRef,
    slug,
    publicUrl,
    siteDomain,
    activePageId,
    onSave,
    onDataSnapshot: replaceData,
  });

  const saveDraftWithPendingMedia = useCallback(async () => {
    await waitForPendingMediaUploads();
    return save.saveDraft();
  }, [save.saveDraft, waitForPendingMediaUploads]);

  const publishWithPendingMedia = useCallback(async () => {
    await waitForPendingMediaUploads();
    return save.publish();
  }, [save.publish, waitForPendingMediaUploads]);

  useVisualKeyboardShortcuts({
    enabled: !isPreviewMode,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    selectedElementId: selection.selectedElement?.id,
    isInlineEditing,
    onUndo: history.undo,
    onRedo: history.redo,
    onDelete: () => deleteElement(),
    onDuplicate: duplicateElement,
    onSave: saveDraftWithPendingMedia,
    onClearSelection: selection.clearSelection,
  });

  return useMemo(
    () => ({
      businessId,
      renderer,
      canvasRef,

      data,
      setData,
      replaceData,
      resetData: history.resetHistory,

      styles,
      animations,
      content,
      deleted,
      layout,
      attributes,
      responsive,
      locked,
      hidden,
      insertedElements,
      insertedSections,
      runtimeCss,

      deviceMode,
      setDeviceMode,
      isPreviewMode,
      setIsPreviewMode,
      togglePreviewMode,
      isInlineEditing,
      setIsInlineEditing,

      selectedElement: selection.selectedElement,
      hoveredElementId: selection.hoveredElementId,
      setSelectedElement: selection.setSelectedElement,
      setHoveredElementId: selection.setHoveredElementId,
      selectNode: selection.selectNode,
      selectByElementId: selection.selectByElementId,
      selectParent: selection.selectParent,
      registerAllVisualElements: selection.registerAllVisualElements,
      clearSelection: selection.clearSelection,
      refreshSelectedElement: selection.refreshSelectedElement,
      handleCanvasClick: selection.handleCanvasClick,
      handleCanvasMouseMove: selection.handleCanvasMouseMove,
      handleCanvasMouseLeave: selection.handleCanvasMouseLeave,

      updateContent,
      updateVisualContent,
      setVisualContent,

      updateText,
      updateInlineText,
      updateElementText,
      updateElementContent,

      startInlineTextEdit,
      finishInlineTextEdit,

      updateImage,
      openMediaPicker,
      openMediaModal,
      closeMediaModal,
      mediaModal,
      applyMediaFromModal,
      applyMediaEditValues,
      resetMediaEditValues,
      uploadMediaFileFromModal,
      openBackgroundMediaPicker,
      updateLink,
      addElement,
      addLibraryMedia,
      addText,
      addButton,
      addImage,
      addVideo,
      addBox,
      addDivider,
      addSection,
      addLibraryElement,
      getLinkTargets,
      getLayerItems,
      bringToFront,
      sendToBack,
      applyStyle,
      resetStyle,
      applyLayout,
      updateLayout,
      updateAttributes,
      applyResponsive,
      setElementLocked,
      toggleElementLocked,
      setElementHidden,
      toggleElementHidden,
      setAnimation,
      clearAnimation,
      previewAnimation,
      deleteElement,
      restoreElement,
      duplicateElement,
      bringForward,
      sendBackward,
      applyDataToDom,

      undo: history.undo,
      redo: history.redo,
      canUndo: history.canUndo,
      canRedo: history.canRedo,

      save: async (status?: "draft" | "published") => {
        if (status === "published") {
          return publishWithPendingMedia();
        }

        return saveDraftWithPendingMedia();
      },
      saveDraft: saveDraftWithPendingMedia,
      publish: publishWithPendingMedia,
      isSaving: save.isSaving || isUploadingMedia,
      isUploadingMedia,
      lastSavedAt: save.lastSavedAt,
      saveError: save.saveError,

      keys: {
        VISUAL_STYLE_KEY,
        VISUAL_ANIMATION_KEY,
        VISUAL_CONTENT_KEY,
        VISUAL_DELETED_KEY,
        VISUAL_LAYOUT_KEY,
        VISUAL_ATTRIBUTE_KEY,
        VISUAL_RESPONSIVE_KEY,
        VISUAL_LOCKED_KEY,
        VISUAL_HIDDEN_KEY,
        VISUAL_INSERTED_ELEMENTS_KEY,
        VISUAL_INSERTED_SECTIONS_KEY,
      },
    }),
    [
      businessId,
      renderer,
      data,
      setData,
      replaceData,
      history.resetHistory,
      history.undo,
      history.redo,
      history.canUndo,
      history.canRedo,
      styles,
      animations,
      content,
      deleted,
      layout,
      attributes,
      responsive,
      locked,
      hidden,
      insertedElements,
      insertedSections,
      runtimeCss,
      deviceMode,
      isPreviewMode,
      isInlineEditing,
      selection,
      updateContent,
      updateVisualContent,
      setVisualContent,
      updateText,
      updateInlineText,
      updateElementText,
      updateElementContent,
      startInlineTextEdit,
      finishInlineTextEdit,
      updateImage,
      openMediaPicker,
      openMediaModal,
      closeMediaModal,
      mediaModal,
      applyMediaFromModal,
      applyMediaEditValues,
      resetMediaEditValues,
      uploadMediaFileFromModal,
      openBackgroundMediaPicker,
      updateLink,
      addElement,
      addLibraryMedia,
      addText,
      addButton,
      addImage,
      addVideo,
      addBox,
      addDivider,
      addSection,
      addLibraryElement,
      getLinkTargets,
      getLayerItems,
      bringToFront,
      sendToBack,
      applyStyle,
      resetStyle,
      applyLayout,
      updateLayout,
      updateAttributes,
      applyResponsive,
      setElementLocked,
      toggleElementLocked,
      setElementHidden,
      toggleElementHidden,
      setAnimation,
      clearAnimation,
      previewAnimation,
      deleteElement,
      restoreElement,
      duplicateElement,
      bringForward,
      sendBackward,
      togglePreviewMode,
      applyDataToDom,
      saveDraftWithPendingMedia,
      publishWithPendingMedia,
      save.isSaving,
      isUploadingMedia,
      save.lastSavedAt,
      save.saveError,
    ],
  );
}