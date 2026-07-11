import type { AnimationPresetValue, StylePatch } from "../../types";
import type { BizuplyFormConfig } from "../../FormBuilderModal";

export type VisualDeviceMode = "desktop" | "tablet" | "mobile";

export type VisualStyleMap = Record<string, StylePatch>;
export type VisualAnimationMap = Record<string, AnimationPresetValue | string>;

export type VisualContentItem = {
  text?: string;

  src?: string;
  url?: string;
  secureUrl?: string;
  secure_url?: string;
  originalUrl?: string;

  alt?: string;
  title?: string;

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

  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto" | string;

  href?: string;
  target?: "_self" | "_blank" | string;
  rel?: string;

  value?: string;
  placeholder?: string;
  checked?: boolean;
  selected?: boolean;

  uploadState?: "idle" | "preview" | "uploading" | "uploaded" | "error";
  uploadId?: string;
  uploadProgress?: number;
  uploadError?: string;

  [key: string]: any;
};

export type VisualContentMap = Record<string, VisualContentItem>;
export type VisualDeletedMap = Record<string, boolean>;
export type VisualBooleanMap = Record<string, boolean>;

export type VisualLayoutItem = {
  x?: number;
  y?: number;

  width?: string | number;
  height?: string | number;

  minWidth?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;

  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;

  translateX?: number;
  translateY?: number;
  rotate?: number;
  scaleX?: number;
  scaleY?: number;

  zIndex?: number;
  order?: number;

  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  alignSelf?: string;
  gap?: string | number;

  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumn?: string;
  gridRow?: string;

  overflow?: string;
  aspectRatio?: string | number;

  freePosition?: boolean;

  [key: string]: any;
};

export type VisualLayoutMap = Record<string, VisualLayoutItem>;

export type VisualAttributeValue = string | number | boolean | null;
export type VisualAttributeMap = Record<
  string,
  Record<string, VisualAttributeValue>
>;

export type VisualResponsiveItem = {
  styles?: StylePatch;
  layout?: VisualLayoutItem;
  hidden?: boolean;
};

export type VisualResponsiveElementMap = Partial<
  Record<VisualDeviceMode, VisualResponsiveItem>
>;

export type VisualResponsiveMap = Record<
  string,
  VisualResponsiveElementMap
>;

export const VISUAL_STYLE_KEY = "__styles";
export const VISUAL_ANIMATION_KEY = "__animations";
export const VISUAL_CONTENT_KEY = "__content";
export const VISUAL_DELETED_KEY = "__deletedElements";

export const VISUAL_LAYOUT_KEY = "__layout";
export const VISUAL_ATTRIBUTE_KEY = "__attributes";
export const VISUAL_RESPONSIVE_KEY = "__responsive";
export const VISUAL_LOCKED_KEY = "__lockedElements";
export const VISUAL_HIDDEN_KEY = "__hiddenElements";

export const VISUAL_HISTORY_LIMIT = 80;

export const FORM_BUILDER_KEY = "__formBuilder";
export const FORM_BUILDER_BY_ELEMENT_KEY = "__formBuilderByElement";

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeElementId(value: unknown) {
  return String(value || "").trim();
}

function readMap<T extends Record<string, any>>(
  data: Record<string, any> | undefined | null,
  key: string,
): T {
  const value = data?.[key];
  return isPlainObject(value) ? (value as T) : ({} as T);
}

function removeUndefined<T extends Record<string, any>>(value: T): Partial<T> {
  const next: Record<string, any> = {};

  Object.entries(value || {}).forEach(([key, item]) => {
    if (item !== undefined) {
      next[key] = item;
    }
  });

  return next as Partial<T>;
}

function writeMapItem(
  data: Record<string, any>,
  key: string,
  elementId: string,
  patch: Record<string, any>,
) {
  const id = normalizeElementId(elementId);
  if (!id) return data || {};

  const currentMap = readMap<Record<string, any>>(data, key);
  const currentItem = isPlainObject(currentMap[id]) ? currentMap[id] : {};

  return {
    ...(data || {}),
    [key]: {
      ...currentMap,
      [id]: {
        ...currentItem,
        ...removeUndefined(patch || {}),
      },
    },
  };
}

function removeMapItem(
  data: Record<string, any>,
  key: string,
  elementId: string,
) {
  const id = normalizeElementId(elementId);
  if (!id) return data || {};

  const currentMap = readMap<Record<string, any>>(data, key);
  const nextMap = { ...currentMap };
  delete nextMap[id];

  return {
    ...(data || {}),
    [key]: nextMap,
  };
}

function writeBooleanMapItem(
  data: Record<string, any>,
  key: string,
  elementId: string,
  value: boolean,
) {
  const id = normalizeElementId(elementId);
  if (!id) return data || {};

  const currentMap = readMap<Record<string, boolean>>(data, key);
  const nextMap = { ...currentMap };

  if (value) {
    nextMap[id] = true;
  } else {
    delete nextMap[id];
  }

  return {
    ...(data || {}),
    [key]: nextMap,
  };
}

export function cloneVisualData<T>(value: T): T {
  try {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }
  } catch {
    // JSON fallback below.
  }

  try {
    return JSON.parse(JSON.stringify(value ?? {}));
  } catch {
    return {} as T;
  }
}

export function asPlainObject(value: unknown): Record<string, any> {
  return isPlainObject(value) ? value : {};
}

export function readVisualStyles(data: Record<string, any>): VisualStyleMap {
  return readMap<VisualStyleMap>(data, VISUAL_STYLE_KEY);
}

export function readVisualAnimations(
  data: Record<string, any>,
): VisualAnimationMap {
  return readMap<VisualAnimationMap>(data, VISUAL_ANIMATION_KEY);
}

export function readVisualContent(data: Record<string, any>): VisualContentMap {
  return readMap<VisualContentMap>(data, VISUAL_CONTENT_KEY);
}

export function readVisualDeleted(data: Record<string, any>): VisualDeletedMap {
  return readMap<VisualDeletedMap>(data, VISUAL_DELETED_KEY);
}

export function readVisualLayout(data: Record<string, any>): VisualLayoutMap {
  return readMap<VisualLayoutMap>(data, VISUAL_LAYOUT_KEY);
}

export function readVisualAttributes(
  data: Record<string, any>,
): VisualAttributeMap {
  return readMap<VisualAttributeMap>(data, VISUAL_ATTRIBUTE_KEY);
}

export function readVisualResponsive(
  data: Record<string, any>,
): VisualResponsiveMap {
  return readMap<VisualResponsiveMap>(data, VISUAL_RESPONSIVE_KEY);
}

export function readVisualLocked(data: Record<string, any>): VisualBooleanMap {
  return readMap<VisualBooleanMap>(data, VISUAL_LOCKED_KEY);
}

export function readVisualHidden(data: Record<string, any>): VisualBooleanMap {
  return readMap<VisualBooleanMap>(data, VISUAL_HIDDEN_KEY);
}

export function readFormBuilderByElement(
  data: Record<string, any>,
): Record<string, BizuplyFormConfig> {
  return readMap<Record<string, BizuplyFormConfig>>(
    data,
    FORM_BUILDER_BY_ELEMENT_KEY,
  );
}

export function writeVisualContentItem(
  data: Record<string, any>,
  elementId: string,
  patch: VisualContentItem,
): Record<string, any> {
  return writeMapItem(data, VISUAL_CONTENT_KEY, elementId, patch);
}

export function removeVisualContentItem(
  data: Record<string, any>,
  elementId: string,
) {
  return removeMapItem(data, VISUAL_CONTENT_KEY, elementId);
}

export function writeVisualStyleItem(
  data: Record<string, any>,
  elementId: string,
  patch: StylePatch,
): Record<string, any> {
  return writeMapItem(
    data,
    VISUAL_STYLE_KEY,
    elementId,
    patch as Record<string, any>,
  );
}

export function removeVisualStyleItem(
  data: Record<string, any>,
  elementId: string,
) {
  return removeMapItem(data, VISUAL_STYLE_KEY, elementId);
}

export function writeVisualAnimationItem(
  data: Record<string, any>,
  elementId: string,
  animation: AnimationPresetValue | string,
): Record<string, any> {
  const id = normalizeElementId(elementId);
  if (!id) return data || {};

  return {
    ...(data || {}),
    [VISUAL_ANIMATION_KEY]: {
      ...readVisualAnimations(data),
      [id]: animation,
    },
  };
}

export function removeVisualAnimationItem(
  data: Record<string, any>,
  elementId: string,
) {
  return removeMapItem(data, VISUAL_ANIMATION_KEY, elementId);
}

export function writeVisualLayoutItem(
  data: Record<string, any>,
  elementId: string,
  patch: VisualLayoutItem,
): Record<string, any> {
  return writeMapItem(data, VISUAL_LAYOUT_KEY, elementId, patch);
}

export function removeVisualLayoutItem(
  data: Record<string, any>,
  elementId: string,
) {
  return removeMapItem(data, VISUAL_LAYOUT_KEY, elementId);
}

export function writeVisualAttributesItem(
  data: Record<string, any>,
  elementId: string,
  patch: Record<string, VisualAttributeValue>,
): Record<string, any> {
  return writeMapItem(data, VISUAL_ATTRIBUTE_KEY, elementId, patch);
}

export function removeVisualAttributesItem(
  data: Record<string, any>,
  elementId: string,
) {
  return removeMapItem(data, VISUAL_ATTRIBUTE_KEY, elementId);
}

export function writeVisualResponsiveItem(
  data: Record<string, any>,
  elementId: string,
  device: VisualDeviceMode,
  patch: VisualResponsiveItem,
): Record<string, any> {
  const id = normalizeElementId(elementId);
  if (!id) return data || {};

  const currentMap = readVisualResponsive(data);
  const currentElement = currentMap[id] || {};
  const currentDevice = currentElement[device] || {};

  return {
    ...(data || {}),
    [VISUAL_RESPONSIVE_KEY]: {
      ...currentMap,
      [id]: {
        ...currentElement,
        [device]: {
          ...currentDevice,
          ...removeUndefined(patch as Record<string, any>),
          styles: patch.styles
            ? {
                ...(currentDevice.styles || {}),
                ...(patch.styles as Record<string, any>),
              }
            : currentDevice.styles,
          layout: patch.layout
            ? {
                ...(currentDevice.layout || {}),
                ...patch.layout,
              }
            : currentDevice.layout,
        },
      },
    },
  };
}

export function removeVisualResponsiveItem(
  data: Record<string, any>,
  elementId: string,
  device?: VisualDeviceMode,
) {
  const id = normalizeElementId(elementId);
  if (!id) return data || {};

  if (!device) {
    return removeMapItem(data, VISUAL_RESPONSIVE_KEY, id);
  }

  const currentMap = readVisualResponsive(data);
  const currentElement = { ...(currentMap[id] || {}) };
  delete currentElement[device];

  const nextMap = { ...currentMap };

  if (Object.keys(currentElement).length) {
    nextMap[id] = currentElement;
  } else {
    delete nextMap[id];
  }

  return {
    ...(data || {}),
    [VISUAL_RESPONSIVE_KEY]: nextMap,
  };
}

export function markVisualElementDeleted(
  data: Record<string, any>,
  elementId: string,
): Record<string, any> {
  return writeBooleanMapItem(data, VISUAL_DELETED_KEY, elementId, true);
}

export function restoreVisualElement(
  data: Record<string, any>,
  elementId: string,
): Record<string, any> {
  return writeBooleanMapItem(data, VISUAL_DELETED_KEY, elementId, false);
}

export function setVisualElementLocked(
  data: Record<string, any>,
  elementId: string,
  locked: boolean,
): Record<string, any> {
  return writeBooleanMapItem(data, VISUAL_LOCKED_KEY, elementId, locked);
}

export function setVisualElementHidden(
  data: Record<string, any>,
  elementId: string,
  hidden: boolean,
): Record<string, any> {
  return writeBooleanMapItem(data, VISUAL_HIDDEN_KEY, elementId, hidden);
}

export function writeFormBuilderForElement(
  data: Record<string, any>,
  elementId: string,
  form: BizuplyFormConfig,
): Record<string, any> {
  const id = normalizeElementId(elementId);
  if (!id) return data || {};

  return {
    ...(data || {}),
    [FORM_BUILDER_BY_ELEMENT_KEY]: {
      ...readFormBuilderByElement(data),
      [id]: cloneVisualData(form),
    },
  };
}

export function removeFormBuilderForElement(
  data: Record<string, any>,
  elementId: string,
) {
  return removeMapItem(data, FORM_BUILDER_BY_ELEMENT_KEY, elementId);
}

export function isTemporaryVisualMediaUrl(value: unknown) {
  const src = String(value || "").trim().toLowerCase();

  return (
    src.startsWith("blob:") ||
    src.startsWith("data:image/") ||
    src.startsWith("data:video/") ||
    src.startsWith("data:audio/") ||
    src.includes(";base64,")
  );
}

export function hasPendingVisualMedia(data: Record<string, any>) {
  return Object.values(readVisualContent(data || {})).some((item) => {
    const src =
      item?.secureUrl ||
      item?.secure_url ||
      item?.url ||
      item?.src ||
      "";

    return (
      item?.uploadState === "preview" ||
      item?.uploadState === "uploading" ||
      isTemporaryVisualMediaUrl(src)
    );
  });
}

export function sanitizeVisualDataForPersistence(
  data: Record<string, any>,
): Record<string, any> {
  const nextData = cloneVisualData(data || {});
  const content = readVisualContent(nextData);
  const nextContent: VisualContentMap = {};

  Object.entries(content).forEach(([elementId, item]) => {
    const nextItem: VisualContentItem = { ...(item || {}) };

    delete nextItem.uploadId;
    delete nextItem.uploadProgress;
    delete nextItem.uploadError;

    if (nextItem.uploadState === "uploaded") {
      nextItem.uploadState = "idle";
    }

    const candidates = [
      nextItem.secureUrl,
      nextItem.secure_url,
      nextItem.url,
      nextItem.src,
      nextItem.originalUrl,
    ];

    const permanentSrc = candidates.find(
      (value) =>
        typeof value === "string" &&
        value.trim() &&
        !isTemporaryVisualMediaUrl(value),
    );

    if (permanentSrc) {
      nextItem.src = permanentSrc;
      nextItem.url = permanentSrc;
      nextItem.secureUrl = permanentSrc;
      nextItem.secure_url = permanentSrc;
    } else {
      ["src", "url", "secureUrl", "secure_url", "originalUrl"].forEach(
        (key) => {
          const value = nextItem[key];

          if (isTemporaryVisualMediaUrl(value)) {
            delete nextItem[key];
          }
        },
      );
    }

    nextContent[elementId] = nextItem;
  });

  return {
    ...nextData,
    [VISUAL_CONTENT_KEY]: nextContent,
  };
}

export function normalizeVisualData(
  data: Record<string, any> | undefined | null,
): Record<string, any> {
  const source = asPlainObject(data);

  return {
    ...source,
    [VISUAL_STYLE_KEY]: cloneVisualData(readVisualStyles(source)),
    [VISUAL_ANIMATION_KEY]: cloneVisualData(readVisualAnimations(source)),
    [VISUAL_CONTENT_KEY]: cloneVisualData(readVisualContent(source)),
    [VISUAL_DELETED_KEY]: cloneVisualData(readVisualDeleted(source)),
    [VISUAL_LAYOUT_KEY]: cloneVisualData(readVisualLayout(source)),
    [VISUAL_ATTRIBUTE_KEY]: cloneVisualData(readVisualAttributes(source)),
    [VISUAL_RESPONSIVE_KEY]: cloneVisualData(readVisualResponsive(source)),
    [VISUAL_LOCKED_KEY]: cloneVisualData(readVisualLocked(source)),
    [VISUAL_HIDDEN_KEY]: cloneVisualData(readVisualHidden(source)),
    [FORM_BUILDER_BY_ELEMENT_KEY]: cloneVisualData(
      readFormBuilderByElement(source),
    ),
  };
}
