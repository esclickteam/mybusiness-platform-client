import type { AnimationPresetValue, StylePatch } from "../../types";
import type { BizuplyFormConfig } from "../../FormBuilderModal";

export type VisualStyleMap = Record<string, StylePatch>;

export type VisualAnimationMap = Record<string, AnimationPresetValue | string>;

export type VisualContentItem = {
  text?: string;
  src?: string;
  alt?: string;
  mediaType?: "image" | "video" | "raw" | string;
  resourceType?: "image" | "video" | "raw" | string;
  href?: string;
  target?: "_self" | "_blank" | string;
  rel?: string;
};

export type VisualContentMap = Record<string, VisualContentItem>;

export type VisualDeletedMap = Record<string, boolean>;

export const VISUAL_STYLE_KEY = "__styles";
export const VISUAL_ANIMATION_KEY = "__animations";
export const VISUAL_CONTENT_KEY = "__content";
export const VISUAL_DELETED_KEY = "__deletedElements";
export const VISUAL_HISTORY_LIMIT = 80;

export const FORM_BUILDER_KEY = "__formBuilder";
export const FORM_BUILDER_BY_ELEMENT_KEY = "__formBuilderByElement";

export function cloneVisualData<T>(value: T): T {
  try {
    return JSON.parse(JSON.stringify(value || {}));
  } catch {
    return {} as T;
  }
}

export function asPlainObject(value: unknown): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, any>;
}

export function readVisualStyles(data: Record<string, any>): VisualStyleMap {
  const value = data?.[VISUAL_STYLE_KEY];

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as VisualStyleMap;
  }

  return {};
}

export function readVisualAnimations(
  data: Record<string, any>,
): VisualAnimationMap {
  const value = data?.[VISUAL_ANIMATION_KEY];

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as VisualAnimationMap;
  }

  return {};
}

export function readVisualContent(data: Record<string, any>): VisualContentMap {
  const value = data?.[VISUAL_CONTENT_KEY];

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as VisualContentMap;
  }

  return {};
}

export function readVisualDeleted(data: Record<string, any>): VisualDeletedMap {
  const value = data?.[VISUAL_DELETED_KEY];

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as VisualDeletedMap;
  }

  return {};
}

export function readFormBuilderByElement(
  data: Record<string, any>,
): Record<string, BizuplyFormConfig> {
  const value = data?.[FORM_BUILDER_BY_ELEMENT_KEY];

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, BizuplyFormConfig>;
  }

  return {};
}

export function writeVisualContentItem(
  data: Record<string, any>,
  elementId: string,
  patch: VisualContentItem,
): Record<string, any> {
  const currentContent = readVisualContent(data);

  return {
    ...data,
    [VISUAL_CONTENT_KEY]: {
      ...currentContent,
      [elementId]: {
        ...(currentContent[elementId] || {}),
        ...patch,
      },
    },
  };
}

export function writeVisualStyleItem(
  data: Record<string, any>,
  elementId: string,
  patch: StylePatch,
): Record<string, any> {
  const currentStyles = readVisualStyles(data);

  return {
    ...data,
    [VISUAL_STYLE_KEY]: {
      ...currentStyles,
      [elementId]: {
        ...(currentStyles[elementId] || {}),
        ...patch,
      },
    },
  };
}

export function writeVisualAnimationItem(
  data: Record<string, any>,
  elementId: string,
  animation: AnimationPresetValue | string,
): Record<string, any> {
  const currentAnimations = readVisualAnimations(data);

  return {
    ...data,
    [VISUAL_ANIMATION_KEY]: {
      ...currentAnimations,
      [elementId]: animation,
    },
  };
}

export function markVisualElementDeleted(
  data: Record<string, any>,
  elementId: string,
): Record<string, any> {
  const currentDeleted = readVisualDeleted(data);

  return {
    ...data,
    [VISUAL_DELETED_KEY]: {
      ...currentDeleted,
      [elementId]: true,
    },
  };
}

export function restoreVisualElement(
  data: Record<string, any>,
  elementId: string,
): Record<string, any> {
  const currentDeleted = readVisualDeleted(data);
  const nextDeleted = { ...currentDeleted };

  delete nextDeleted[elementId];

  return {
    ...data,
    [VISUAL_DELETED_KEY]: nextDeleted,
  };
}

export function writeFormBuilderForElement(
  data: Record<string, any>,
  elementId: string,
  form: BizuplyFormConfig,
): Record<string, any> {
  const current = readFormBuilderByElement(data);

  return {
    ...data,
    [FORM_BUILDER_BY_ELEMENT_KEY]: {
      ...current,
      [elementId]: form,
    },
  };
}