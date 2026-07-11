import type { AnimationPresetValue, StylePatch } from "../../types";
import type { BizuplyFormConfig } from "../../FormBuilderModal";

/**
 * visualData.ts
 *
 * מקור האמת של כל הנתונים שהעורך הוויזואלי שומר.
 * הקובץ נשאר תואם למבנה הקיים, ובמקביל מוסיף תמיכה מסודרת
 * במיקום, גודל, רספונסיביות, מאפייני DOM, נעילה והסתרה.
 */

export type VisualDeviceMode = "desktop" | "tablet" | "mobile";

export type VisualStyleMap = Record<string, StylePatch>;

export type VisualAnimationMap = Record<
  string,
  AnimationPresetValue | string
>;

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
};

export type VisualContentMap = Record<string, VisualContentItem>;

export type VisualDeletedMap = Record<string, boolean>;

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

export type VisualBooleanMap = Record<string, boolean>;

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

export const VISUAL_COLLECTION_KEYS = new Set([
  VISUAL_STYLE_KEY,
  VISUAL_ANIMATION_KEY,
  VISUAL_CONTENT_KEY,
  VISUAL_DELETED_KEY,
  VISUAL_LAYOUT_KEY,
  VISUAL_ATTRIBUTE_KEY,
  VISUAL_RESPONSIVE_KEY,
  VISUAL_LOCKED_KEY,
  VISUAL_HIDDEN_KEY,
  FORM_BUILDER_KEY,
  FORM_BUILDER_BY_ELEMENT_KEY,
]);

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeElementId(elementId: unknown) {
  return String(elementId || "").trim();
}

function omitUndefined<T extends Record<string, any>>(source: T): Partial<T> {
  return Object.entries(source || {}).reduce<Partial<T>>((result, [key, value]) => {
    if (value !== undefined) {
      (result as Record<string, any>)[key] = value;
    }

    return result;
  }, {});
}

function readRecord<T extends Record<string, any>>(
  data: Record<string, any>,
  key: string,
): T {
  const value = data?.[key];

  if (isPlainObject(value)) {
    return value as T;
  }

  return {} as T;
}

function writeMapItem<T extends Record<string, any>>(
  data: Record<string, any>,
  key: string,
  elementId: string,
  patch: Record<string, any>,
): Record<string, any> {
  const id = normalizeElementId(elementId);
  if (!id) return data || {};

  const currentMap = readRecord<Record<string, T>>(data || {}, key);
  const currentItem = isPlainObject(currentMap[id]) ? currentMap[id] : {};
  const cleanPatch = omitUndefined(patch);

  return {
    ...(data || {}),
    [key]: {
      ...currentMap,
      [id]: {
        ...currentItem,
        ...cleanPatch,
      },
    },
  };
}

function removeMapItem(
  data: Record<string, any>,
  key: string,
  elementId: string,
): Record<string, any> {
  const id = normalizeElementId(elementId);
  if (!id) return data || {};

  const currentMap = readRecord<Record<string, any>>(data || {}, key);

  if (!Object.prototype.hasOwnProperty.call(currentMap, id)) {
    return data || {};
  }

  const nextMap = { ...currentMap };
  delete nextMap[id];

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
    // מעבר ל-JSON fallback
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
  return readRecord<VisualStyleMap>(data || {}, VISUAL_STYLE_KEY);
}

export function readVisualAnimations(
  data: Record<string, any>,
): VisualAnimationMap {
  return readRecord<VisualAnimationMap>(data || {}, VISUAL_ANIMATION_KEY);
}

export function readVisualContent(data: Record<string, any>): VisualContentMap {
  return readRecord<VisualContentMap>(data || {}, VISUAL_CONTENT_KEY);
}

export function readVisualDeleted(data: Record<string, any>): VisualDeletedMap {
  return readRecord<VisualDeletedMap>(data || {}, VISUAL_DELETED_KEY);
}

export function readVisualLayout(data: Record<string, any>): VisualLayoutMap {
  return readRecord<VisualLayoutMap>(data || {}, VISUAL_LAYOUT_KEY);
}

export function readVisualAttributes(
  data: Record<string, any>,
): VisualAttributeMap {
  return readRecord<VisualAttributeMap>(data || {}, VISUAL_ATTRIBUTE_KEY);
}

export function readVisualResponsive(
  data: Record<string, any>,
): VisualResponsiveMap {
  return readRecord<VisualResponsiveMap>(data || {}, VISUAL_RESPONSIVE_KEY);
}

export function readVisualLocked(data: Record<string, any>): VisualBooleanMap {
  return readRecord<VisualBooleanMap>(data || {}, VISUAL_LOCKED_KEY);
}

export function readVisualHidden(data: Record<string, any>): VisualBooleanMap {
  return readRecord<VisualBooleanMap>(data || {}, VISUAL_HIDDEN_KEY);
}

export function readFormBuilderByElement(
  data: Record<string, any>,
): Record<string, BizuplyFormConfig> {
  return readRecord<Record<string, BizuplyFormConfig>>(
    data || {},
    FORM_BUILDER_BY_ELEMENT_KEY,
  );
}

export function writeVisualContentItem(
  data: Record<string, any>,
  elementId: string,
  patch: VisualContentItem,
): Record<string, any> {
  return writeMapItem<VisualContentItem>(
    data || {},
    VISUAL_CONTENT_KEY,
    elementId,
    patch || {},
  );
}

export function removeVisualContentItem(
  data: Record<string, any>,
  elementId: string,
): Record<string, any> {
  return removeMapItem(data || {}, VISUAL_CONTENT_KEY, elementId);
}

export function writeVisualStyleItem(
  data: Record<string, any>,
  elementId: string,
  patch: StylePatch,
): Record<string, any> {
  return writeMapItem<StylePatch>(
    data || {},
    VISUAL_STYLE_KEY,
    elementId,
    patch || {},
  );
}

export function removeVisualStyleItem(
  data: Record<string, any>,
  elementId: string,
): Record<string, any> {
  return removeMapItem(data || {}, VISUAL_STYLE_KEY, elementId);
}

export function writeVisualAnimationItem(
  data: Record<string, any>,
  elementId: string,
  animation: AnimationPresetValue | string,
): Record<string, any> {
  const id = normalizeElementId(elementId);
  if (!id) return data || {};

  const currentAnimations = readVisualAnimations(data || {});

  return {
    ...(data || {}),
    [VISUAL_ANIMATION_KEY]: {
      ...currentAnimations,
      [id]: animation,
    },
  };
}

export function removeVisualAnimationItem(
  data: Record<string, any>,
  elementId: string,
): Record<string, any> {
  return removeMapItem(data || {}, VISUAL_ANIMATION_KEY, elementId);
}

export function writeVisualLayoutItem(
  data: Record<string, any>,
  elementId: string,
  patch: VisualLayoutItem,
): Record<string, any> {
  return writeMapItem<VisualLayoutItem>(
    data || {},
    VISUAL_LAYOUT_KEY,
    elementId,
    patch || {},
  );
}

export function removeVisualLayoutItem(
  data: Record<string, any>,
  elementId: string,
): Record<string, any> {
  return removeMapItem(data || {}, VISUAL_LAYOUT_KEY, elementId);
}

export function writeVisualAttributesItem(
  data: Record<string, any>,
  elementId: string,
  patch: Record<string, VisualAttributeValue>,
): Record<string, any> {
  return writeMapItem<Record<string, VisualAttributeValue>>(
    data || {},
    VISUAL_ATTRIBUTE_KEY,
    elementId,
    patch || {},
  );
}

export function removeVisualAttributesItem(
  data: Record<string, any>,
  elementId: string,
): Record<string, any> {
  return removeMapItem(data || {}, VISUAL_ATTRIBUTE_KEY, elementId);
}

export function writeVisualResponsiveItem(
  data: Record<string, any>,
  elementId: string,
  device: VisualDeviceMode,
  patch: VisualResponsiveItem,
): Record<string, any> {
  const id = normalizeElementId(elementId);
  if (!id) return data || {};

  const currentResponsive = readVisualResponsive(data || {});
  const currentElement = currentResponsive[id] || {};
  const currentDevice = currentElement[device] || {};

  return {
    ...(data || {}),
    [VISUAL_RESPONSIVE_KEY]: {
      ...currentResponsive,
      [id]: {
        ...currentElement,
        [device]: {
          ...currentDevice,
          ...omitUndefined(patch || {}),
          styles: patch?.styles
            ? {
                ...(currentDevice.styles || {}),
                ...omitUndefined(patch.styles as Record<string, any>),
              }
            : currentDevice.styles,
          layout: patch?.layout
            ? {
                ...(currentDevice.layout || {}),
                ...omitUndefined(patch.layout as Record<string, any>),
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
): Record<string, any> {
  const id = normalizeElementId(elementId);
  if (!id) return data || {};

  const currentResponsive = readVisualResponsive(data || {});

  if (!currentResponsive[id]) {
    return data || {};
  }

  if (!device) {
    return removeMapItem(data || {}, VISUAL_RESPONSIVE_KEY, id);
  }

  const nextElement = { ...currentResponsive[id] };
  delete nextElement[device];

  const nextResponsive = { ...currentResponsive };

  if (Object.keys(nextElement).length === 0) {
    delete nextResponsive[id];
  } else {
    nextResponsive[id] = nextElement;
  }

  return {
    ...(data || {}),
    [VISUAL_RESPONSIVE_KEY]: nextResponsive,
  };
}

function writeBooleanMapItem(
  data: Record<string, any>,
  key: string,
  elementId: string,
  value: boolean,
): Record<string, any> {
  const id = normalizeElementId(elementId);
  if (!id) return data || {};

  const currentMap = readRecord<VisualBooleanMap>(data || {}, key);

  if (!value) {
    const nextMap = { ...currentMap };
    delete nextMap[id];

    return {
      ...(data || {}),
      [key]: nextMap,
    };
  }

  return {
    ...(data || {}),
    [key]: {
      ...currentMap,
      [id]: true,
    },
  };
}

export function markVisualElementDeleted(
  data: Record<string, any>,
  elementId: string,
): Record<string, any> {
  return writeBooleanMapItem(
    data || {},
    VISUAL_DELETED_KEY,
    elementId,
    true,
  );
}

export function restoreVisualElement(
  data: Record<string, any>,
  elementId: string,
): Record<string, any> {
  return writeBooleanMapItem(
    data || {},
    VISUAL_DELETED_KEY,
    elementId,
    false,
  );
}

export function setVisualElementLocked(
  data: Record<string, any>,
  elementId: string,
  locked: boolean,
): Record<string, any> {
  return writeBooleanMapItem(
    data || {},
    VISUAL_LOCKED_KEY,
    elementId,
    locked,
  );
}

export function setVisualElementHidden(
  data: Record<string, any>,
  elementId: string,
  hidden: boolean,
): Record<string, any> {
  return writeBooleanMapItem(
    data || {},
    VISUAL_HIDDEN_KEY,
    elementId,
    hidden,
  );
}

export function writeFormBuilderForElement(
  data: Record<string, any>,
  elementId: string,
  form: BizuplyFormConfig,
): Record<string, any> {
  const id = normalizeElementId(elementId);
  if (!id) return data || {};

  const current = readFormBuilderByElement(data || {});

  return {
    ...(data || {}),
    [FORM_BUILDER_BY_ELEMENT_KEY]: {
      ...current,
      [id]: cloneVisualData(form),
    },
  };
}

export function removeFormBuilderForElement(
  data: Record<string, any>,
  elementId: string,
): Record<string, any> {
  return removeMapItem(
    data || {},
    FORM_BUILDER_BY_ELEMENT_KEY,
    elementId,
  );
}

export function isTemporaryVisualMediaUrl(value: unknown) {
  const src = String(value || "").trim().toLowerCase();

  return src.startsWith("blob:") || src.startsWith("data:");
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

/**
 * מנקה שדות זמניים לפני שמירה לשרת.
 * לא מוחק את המדיה הקבועה שכבר הועלתה.
 */
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

    const candidateSrc =
      nextItem.secureUrl ||
      nextItem.secure_url ||
      nextItem.url ||
      nextItem.src ||
      "";

    if (!isTemporaryVisualMediaUrl(candidateSrc)) {
      nextContent[elementId] = nextItem;
      return;
    }

    /*
     * כתובת blob/data תקפה רק בדפדפן המקומי.
     * לא מאפשרים לה להיכנס למסד או לפרסום.
     */
    delete nextItem.src;
    delete nextItem.url;
    delete nextItem.secureUrl;
    delete nextItem.secure_url;
    delete nextItem.originalUrl;
    nextItem.uploadState = "error";

    nextContent[elementId] = nextItem;
  });

  return {
    ...nextData,
    [VISUAL_CONTENT_KEY]: nextContent,
  };
}

/**
 * מבטיח שכל המפות קיימות. שימושי בטעינה ראשונית ובמיגרציות.
 */
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
