import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { StudioTemplateRenderer } from "../../data/templates/templateEditorTypes";

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
  hasPendingVisualMedia,
  normalizeVisualData,
  sanitizeVisualDataForPersistence,
} from "../utils/visualData";

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
  waitForPendingMedia?: () => void | Promise<void>;
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
      (win.Window && value instanceof win.Window) ||
      (win.Event && value instanceof win.Event),
  );
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

  if (isBrowserDomValue(value)) return undefined;

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

function isTemporaryMediaString(value: unknown) {
  if (typeof value !== "string") return false;

  const clean = value.trim().toLowerCase();

  return (
    clean.startsWith("blob:") ||
    clean.startsWith("data:image/") ||
    clean.startsWith("data:video/") ||
    clean.startsWith("data:audio/") ||
    clean.includes(";base64,")
  );
}

function findTemporaryMediaPaths(
  value: any,
  prefix = "payload",
  output: string[] = [],
  seen = new WeakSet<object>(),
) {
  if (output.length >= 30) return output;

  if (typeof value === "string") {
    if (isTemporaryMediaString(value)) {
      output.push(prefix);
    }

    return output;
  }

  if (!value || typeof value !== "object") return output;
  if (seen.has(value)) return output;

  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      findTemporaryMediaPaths(item, `${prefix}[${index}]`, output, seen);
    });

    seen.delete(value);
    return output;
  }

  Object.entries(value).forEach(([key, item]) => {
    findTemporaryMediaPaths(item, `${prefix}.${key}`, output, seen);
  });

  seen.delete(value);

  return output;
}

function assertNoTemporaryMedia(label: string, payload: unknown) {
  const paths = findTemporaryMediaPaths(payload);

  if (!paths.length) return;

  console.error("[BizUply Visual Save] temporary media blocked", {
    label,
    paths,
  });

  throw new Error(
    "יש תמונה או וידאו שעדיין לא סיימו לעלות. המתיני לסיום ההעלאה ונסי שוב.",
  );
}

function mergeVisualContent(
  stateContent: Record<string, any>,
  domContent: Record<string, any>,
) {
  const merged: Record<string, any> = {};
  const allIds = new Set([
    ...Object.keys(stateContent || {}),
    ...Object.keys(domContent || {}),
  ]);

  allIds.forEach((elementId) => {
    const stateItem = stateContent[elementId];
    const domItem = domContent[elementId];

    if (!isPlainObject(stateItem) && !isPlainObject(domItem)) {
      merged[elementId] =
        domItem !== undefined ? domItem : stateItem;
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

    const stateSrc = String(
      stateItem.secureUrl ||
        stateItem.secure_url ||
        stateItem.url ||
        stateItem.src ||
        "",
    ).trim();

    const domSrc = String(
      domItem.secureUrl ||
        domItem.secure_url ||
        domItem.url ||
        domItem.src ||
        "",
    ).trim();

    const stateHasPermanentMedia =
      stateSrc && !isTemporaryMediaString(stateSrc);

    const domHasPermanentMedia =
      domSrc && !isTemporaryMediaString(domSrc);

    const nextItem: Record<string, any> = {
      ...stateItem,
      ...domItem,
    };

    if (stateHasPermanentMedia || domHasPermanentMedia) {
      const finalSrc = stateHasPermanentMedia ? stateSrc : domSrc;

      nextItem.src = finalSrc;
      nextItem.url = finalSrc;
      nextItem.secureUrl = finalSrc;
      nextItem.secure_url =
        stateItem.secure_url ||
        domItem.secure_url ||
        finalSrc;

      nextItem.mediaType =
        stateItem.mediaType ||
        stateItem.resourceType ||
        stateItem.resource_type ||
        domItem.mediaType ||
        domItem.resourceType ||
        domItem.resource_type ||
        "image";

      nextItem.resourceType =
        stateItem.resourceType ||
        stateItem.resource_type ||
        stateItem.mediaType ||
        domItem.resourceType ||
        domItem.resource_type ||
        domItem.mediaType ||
        "image";
    }

    merged[elementId] = nextItem;
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
  const next: Record<string, any> = {
    ...(currentData || {}),
    ...(domSnapshotData || {}),
  };

  VISUAL_MAP_KEYS.forEach((key) => {
    const previousMap = readPlainObject(currentData, key);
    const domMap = readPlainObject(domSnapshotData, key);

    next[key] =
      key === VISUAL_CONTENT_KEY
        ? mergeVisualContent(previousMap, domMap)
        : {
            ...previousMap,
            ...domMap,
          };
  });

  return next;
}

function logPayloadSize(label: string, payload: unknown) {
  try {
    const serialized = JSON.stringify(payload);
    const sizeMb = serialized.length / 1024 / 1024;

    console.log(
      `[BizUply Visual Save] ${label} payload size: ${sizeMb.toFixed(2)}MB`,
      {
        bytes: serialized.length,
      },
    );
  } catch (error) {
    console.warn(
      `[BizUply Visual Save] ${label} payload stringify failed`,
      error,
    );
  }
}

function logSnapshotData(
  label: string,
  payload: Record<string, any>,
) {
  const summary = VISUAL_MAP_KEYS.reduce<Record<string, number>>(
    (result, key) => {
      result[key] = Object.keys(readPlainObject(payload, key)).length;
      return result;
    },
    {},
  );

  console.log(`[BizUply Visual Save] ${label}`, {
    dataKeys: Object.keys(payload || {}),
    visualMapCounts: summary,
  });
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
  waitForPendingMedia,
}: UseVisualSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (dataRef) {
      dataRef.current = data || {};
    }
  }, [data, dataRef]);

  const buildSnapshotData = useCallback(() => {
    const root = canvasRef.current;
    const currentData = normalizeVisualData(
      (dataRef?.current || data || {}) as Record<string, any>,
    );

    const domSnapshot = normalizeVisualData(
      (buildVisualSaveDataFromDom(root, currentData) || {}) as Record<
        string,
        any
      >,
    );

    const merged = mergeVisualSnapshotData({
      currentData,
      domSnapshotData: domSnapshot,
    });

    const cleaned = cleanSerializableValue(merged) || {};
    const sanitized = sanitizeVisualDataForPersistence({
      ...normalizeVisualData(cleaned),
      __activePageId: activePageId || "home",
      __siteSlug: slug || String(cleaned.__siteSlug || ""),
      __publicUrl:
        publicUrl || String(cleaned.__publicUrl || ""),
      __siteDomain:
        siteDomain || String(cleaned.__siteDomain || ""),
    });

    assertNoTemporaryMedia("snapshot", sanitized);

    logSnapshotData("snapshot current", currentData);
    logSnapshotData("snapshot dom", domSnapshot);
    logSnapshotData("snapshot final", sanitized);

    onDataSnapshot?.(sanitized);

    return sanitized;
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

  const executeSave = useCallback(
    async (status: "draft" | "published") => {
      if (!onSave) {
        const message =
          "[BizUply Visual Save] missing onSave handler";

        console.error(message);
        setSaveError(message);
        throw new Error(message);
      }

      setIsSaving(true);
      setSaveError("");

      try {
        await waitForPendingMedia?.();

        const latestData =
          (dataRef?.current || data || {}) as Record<string, any>;

        if (hasPendingVisualMedia(latestData)) {
          throw new Error(
            "יש מדיה שעדיין עולה. המתיני לסיום ההעלאה ונסי שוב.",
          );
        }

        const snapshotData = buildSnapshotData();
        const published = status === "published";

        const payload = buildVisualSavePayload({
          templateKey: renderer.key,
          data: snapshotData,
          slug,
          publicUrl,
          siteDomain,
          published,
          status,
          htmlSnapshot: "",
          snapshotPageId: activePageId,
        });

        assertNoTemporaryMedia(status, payload);
        logPayloadSize(status, payload);

        console.log("[BizUply Visual Save] outgoing payload", {
          templateKey: renderer.key,
          status,
          published,
          slug,
          snapshotPageId: activePageId,
        });

        await onSave(payload);

        setLastSavedAt(new Date().toISOString());

        return payload;
      } catch (error) {
        const fallback =
          status === "published"
            ? "הפרסום נכשל"
            : "השמירה נכשלה";

        const message =
          error instanceof Error ? error.message : fallback;

        setSaveError(message);

        console.error(
          `[BizUply Visual Save] ${status} failed`,
          error,
        );

        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [
      activePageId,
      buildSnapshotData,
      data,
      dataRef,
      onSave,
      publicUrl,
      renderer.key,
      siteDomain,
      slug,
      waitForPendingMedia,
    ],
  );

  const saveDraft = useCallback(
    () => executeSave("draft"),
    [executeSave],
  );

  const publish = useCallback(
    () => executeSave("published"),
    [executeSave],
  );

  return useMemo(
    () => ({
      isSaving,
      lastSavedAt,
      saveError,
      buildSnapshotData,
      saveDraft,
      publish,
    }),
    [
      isSaving,
      lastSavedAt,
      saveError,
      buildSnapshotData,
      saveDraft,
      publish,
    ],
  );
}
