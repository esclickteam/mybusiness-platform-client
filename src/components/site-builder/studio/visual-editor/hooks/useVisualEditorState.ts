import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AnimationPresetValue, StylePatch } from "../../types";
import type { StudioTemplateRenderer } from "../../data/templates/templateEditorTypes";

import {
  VISUAL_ANIMATION_KEY,
  VISUAL_CONTENT_KEY,
  VISUAL_DELETED_KEY,
  VISUAL_STYLE_KEY,
  markVisualElementDeleted,
  readVisualAnimations,
  readVisualContent,
  readVisualDeleted,
  readVisualStyles,
  restoreVisualElement,
  writeVisualAnimationItem,
  writeVisualContentItem,
  writeVisualStyleItem,
} from "../utils/visualData";

import { buildVisualRuntimeCss } from "../utils/visualCssRuntime";
import { applyAllVisualDataToDom } from "../utils/visualDomApply";
import { useVisualHistory } from "./useVisualHistory";
import { useVisualSelection } from "./useVisualSelection";
import { useVisualKeyboardShortcuts } from "./useVisualKeyboardShortcuts";
import { useVisualSave } from "./useVisualSave";

export type VisualDeviceMode = "desktop" | "tablet" | "mobile";

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
    חשוב:
    אם elementId הוא key ישיר ב-defaultData, למשל heroImage,
    מעדכנים אותו כדי שה-React renderer עצמו יקבל את המדיה החדשה.
  */
  if (hasOwn(next, elementId)) {
    next = {
      ...next,
      [elementId]: src,
    };
  }

  /*
    אם elementId הוא path פשוט כמו hero.image או gallery.0.image,
    מנסים גם לעדכן אותו. זה לא מחליף את __content, רק מוסיף תאימות
    לתבניות שקוראות תמונות ישירות מתוך data.
  */
  if (elementId.includes(".")) {
    next = writeNestedValue(next, elementId, src);
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

  const [deviceMode, setDeviceMode] = useState<VisualDeviceMode>("desktop");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isInlineEditing, setIsInlineEditing] = useState(false);

  const history = useVisualHistory<Record<string, any>>(initialData || {});
  const data = history.value;
  const dataRef = useRef<Record<string, any>>(data || initialData || {});

  useEffect(() => {
    dataRef.current = data || {};
  }, [data]);

  const styles = useMemo(() => readVisualStyles(data), [data]);
  const animations = useMemo(() => readVisualAnimations(data), [data]);
  const content = useMemo(() => readVisualContent(data), [data]);
  const deleted = useMemo(() => readVisualDeleted(data), [data]);

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

      setData((current) => {
        const nextData = writeVisualContentItem(current || {}, elementId, {
          text,
        });

        return syncTemplateTextValue(nextData, elementId, text);
      });

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

  const finishInlineTextEdit = useCallback(
    (elementId?: string, value?: string) => {
      if (elementId && typeof value === "string") {
        updateText(elementId, value);
      }

      /*
        חשוב:
        לא קוראים כאן ל-selection.refreshSelectedElement().
        refreshSelectedElement משתמש ב-selectByElementId,
        ובמקרה שלך זה עלול להחזיר בחירה לא נכונה או לא למצוא את האלמנט.
        הבחירה נשארת לפי ה-node שנבחר בפועל ב-VisualEditorCanvas.
      */

      setIsInlineEditing(false);

      return true;
    },
    [updateText],
  );

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
      const targetIds = Array.from(
        new Set([primaryId, selectedId].filter(Boolean)),
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

        return nextData;
      });

      window.setTimeout(() => {
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
      }, 0);

      return true;
    },
    [
      canvasRef,
      dataRef,
      selection.selectedElement?.id,
      selection.selectedElement?.type,
      setData,
    ],
  );

  const openMediaPicker = useCallback(
    async (elementId: string) => {
      if (!elementId) {
        console.warn("[BizUply Visual Media] openMediaPicker missing elementId", {
          selectedElementId: selection.selectedElement?.id,
          selectedElementType: selection.selectedElement?.type,
        });

        return false;
      }

      if (typeof window === "undefined") return false;

      console.log("[BizUply Visual Media] openMediaPicker start", {
        elementId,
        selectedElementId: selection.selectedElement?.id,
        selectedElementType: selection.selectedElement?.type,
      });

      const input = document.createElement("input");

      input.type = "file";
      input.accept = "image/*,video/*";
      input.multiple = false;
      input.style.position = "fixed";
      input.style.left = "-9999px";
      input.style.top = "-9999px";
      input.style.opacity = "0";

      document.body.appendChild(input);

      const cleanup = () => {
        try {
          input.remove();
        } catch {
          // noop
        }
      };

      input.onchange = async () => {
        const file = input.files?.[0];

        cleanup();

        if (!file) {
          console.warn("[BizUply Visual Media] no file selected", { elementId });
          return;
        }

        console.log("[BizUply Visual Media] file selected", {
          elementId,
          name: file.name,
          type: file.type,
          size: file.size,
        });

        try {
          const uploaded = await uploadVisualMediaToCloudinary({
            file,
            businessId,
          });

          console.log("[BizUply Visual Media] upload success", {
            elementId,
            uploaded,
          });

          const didUpdate = updateImage(elementId, {
            src: uploaded.secureUrl || uploaded.src,
            url: uploaded.secureUrl || uploaded.src,
            secureUrl: uploaded.secureUrl || uploaded.src,
            mediaType: uploaded.mediaType,
            resourceType: uploaded.resourceType,
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
          });

          console.log("[BizUply Visual Media] updateImage result after upload", {
            elementId,
            didUpdate,
            contentItem: getVisualContentItemForLog(dataRef.current || {}, elementId),
          });

          window.setTimeout(() => {
            console.log("[BizUply Visual Media] apply after upload timeout", {
              elementId,
              contentItem: getVisualContentItemForLog(dataRef.current || {}, elementId),
            });

            applyAllVisualDataToDom(canvasRef.current, dataRef.current || {});
          }, 0);
        } catch (error) {
          console.error("[BizUply Visual Media] upload failed", error);

          const message =
            error instanceof Error ? error.message : "העלאת המדיה נכשלה";

          window.alert(message);
        }
      };

      (input as HTMLInputElement & { oncancel?: (() => void) | null }).oncancel =
        cleanup;

      input.click();

      return true;
    },
    [
      businessId,
      canvasRef,
      dataRef,
      selection.selectedElement?.id,
      selection.selectedElement?.type,
      updateImage,
    ],
  );

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

      return true;
    },
    [setData],
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

  const deleteElement = useCallback(
    (elementId?: string) => {
      const id = elementId || selection.selectedElement?.id;
      if (!id) return false;

      setData((current) => markVisualElementDeleted(current, id));
      selection.clearSelection();

      return true;
    },
    [selection, setData],
  );

  const restoreElement = useCallback(
    (elementId: string) => {
      if (!elementId) return false;

      setData((current) => restoreVisualElement(current, elementId));

      return true;
    },
    [setData],
  );

  const duplicateElement = useCallback(() => {
    const selected = selection.selectedElement;
    if (!selected?.id) return false;

    const nextId = `${selected.id}.copy-${Date.now()}`;
    const selectedContent = content[selected.id];
    const selectedStyle = styles[selected.id];
    const selectedAnimation = animations[selected.id];

    setData((current) => ({
      ...current,
      [VISUAL_CONTENT_KEY]: selectedContent
        ? {
            ...readVisualContent(current),
            [nextId]: selectedContent,
          }
        : readVisualContent(current),
      [VISUAL_STYLE_KEY]: selectedStyle
        ? {
            ...readVisualStyles(current),
            [nextId]: selectedStyle,
          }
        : readVisualStyles(current),
      [VISUAL_ANIMATION_KEY]: selectedAnimation
        ? {
            ...readVisualAnimations(current),
            [nextId]: selectedAnimation,
          }
        : readVisualAnimations(current),
    }));

    return true;
  }, [animations, content, selection.selectedElement, setData, styles]);

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
    onSave: save.saveDraft,
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
      runtimeCss,

      deviceMode,
      setDeviceMode,
      isPreviewMode,
      setIsPreviewMode,
      isInlineEditing,
      setIsInlineEditing,

      selectedElement: selection.selectedElement,
      hoveredElementId: selection.hoveredElementId,
      setSelectedElement: selection.setSelectedElement,
      setHoveredElementId: selection.setHoveredElementId,
      selectNode: selection.selectNode,
      selectByElementId: selection.selectByElementId,
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
      updateLink,
      applyStyle,
      resetStyle,
      setAnimation,
      clearAnimation,
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
          return save.publish();
        }

        return save.saveDraft();
      },
      saveDraft: save.saveDraft,
      publish: save.publish,
      isSaving: save.isSaving,
      lastSavedAt: save.lastSavedAt,
      saveError: save.saveError,

      keys: {
        VISUAL_STYLE_KEY,
        VISUAL_ANIMATION_KEY,
        VISUAL_CONTENT_KEY,
        VISUAL_DELETED_KEY,
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
      updateLink,
      applyStyle,
      resetStyle,
      setAnimation,
      clearAnimation,
      deleteElement,
      restoreElement,
      duplicateElement,
      bringForward,
      sendBackward,
      applyDataToDom,
      save.saveDraft,
      save.publish,
      save.isSaving,
      save.lastSavedAt,
      save.saveError,
    ],
  );
}