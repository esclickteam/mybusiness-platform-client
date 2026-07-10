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

function removeBase64MediaFromContent(content: Record<string, any>) {
  const next: Record<string, any> = {};

  Object.entries(content || {}).forEach(([elementId, item]) => {
    if (!isPlainObject(item)) {
      next[elementId] = item;
      return;
    }

    const cleanItem = { ...item };

    const src = String(
      cleanItem.src || cleanItem.secureUrl || cleanItem.url || "",
    );

    const isTemporaryMedia =
      src.startsWith("data:image/") ||
      src.startsWith("data:video/") ||
      src.startsWith("blob:");

    /*
      blob/data URLs לא נשמרים באתר.
      מדיה חייבת להיות קודם ב־Cloudinary,
      וב־data שומרים רק secureUrl/url אמיתי.
    */
    if (isTemporaryMedia) {
      delete cleanItem.src;
      delete cleanItem.url;
      delete cleanItem.secureUrl;
    }

    next[elementId] = cleanItem;
  });

  return next;
}

function buildLeanVisualData(data: Record<string, any>) {
  const cleanData = cleanVisualValue(data || {}) || {};

  const content = isPlainObject(cleanData[VISUAL_CONTENT_KEY])
    ? cleanData[VISUAL_CONTENT_KEY]
    : {};

  const styles = isPlainObject(cleanData[VISUAL_STYLE_KEY])
    ? cleanData[VISUAL_STYLE_KEY]
    : {};

  const animations = isPlainObject(cleanData[VISUAL_ANIMATION_KEY])
    ? cleanData[VISUAL_ANIMATION_KEY]
    : {};

  return {
    [VISUAL_CONTENT_KEY]: removeBase64MediaFromContent(content),
    [VISUAL_STYLE_KEY]: styles,
    [VISUAL_ANIMATION_KEY]: animations,
  };
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

  const domContent = readPlainObject(domSnapshotData, VISUAL_CONTENT_KEY);
  const domStyles = readPlainObject(domSnapshotData, VISUAL_STYLE_KEY);
  const domAnimations = readPlainObject(domSnapshotData, VISUAL_ANIMATION_KEY);

  /*
    חשוב:
    הדאטה מה־state קודם, ואז ה־DOM מוסיף/מעדכן.
    אם ה־DOM מחזיר ריק — לא מוחקים את מה שכבר קיים.
  */
  return {
    ...(currentData || {}),
    ...(domSnapshotData || {}),

    [VISUAL_CONTENT_KEY]: {
      ...previousContent,
      ...domContent,
    },

    [VISUAL_STYLE_KEY]: {
      ...previousStyles,
      ...domStyles,
    },

    [VISUAL_ANIMATION_KEY]: {
      ...previousAnimations,
      ...domAnimations,
    },
  };
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

    console.log(`[BizUply Visual Save] ${label}`, {
      contentKeysCount: Object.keys(content).length,
      contentKeys: Object.keys(content),
      styleKeysCount: Object.keys(styles).length,
      animationKeysCount: Object.keys(animations).length,
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

    /*
      חשוב:
      React state מתעדכן אסינכרונית. אחרי העלאת תמונה/וידאו המשתמש יכול ללחוץ שמירה
      לפני שהקומפוננטה הספיקה לרנדר מחדש, ואז ה־data שב־closure עדיין ישן וריק.
      לכן כאן קוראים קודם מה־dataRef המעודכן סינכרונית מתוך useVisualEditorState.
    */
    const currentData = dataRef?.current || data || {};

    /*
      קודם לוקחים snapshot מה־DOM.
      אבל לא נותנים לו לדרוס את ה־state אם הוא חוזר ריק.
    */
    const domSnapshotRaw = buildVisualSaveDataFromDom(root, currentData) || {};

    const mergedData = mergeVisualSnapshotData({
      currentData,
      domSnapshotData: domSnapshotRaw,
    });

    const nextData = buildLeanVisualData(mergedData);

    logSnapshotData("snapshot current data", currentData || {});
    logSnapshotData("snapshot dom data", domSnapshotRaw);
    logSnapshotData("snapshot final data", nextData);

    onDataSnapshot?.(nextData);

    return nextData;
  }, [canvasRef, data, dataRef, onDataSnapshot]);

  const saveDraft = useCallback(async () => {
    if (!onSave) return null;

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

      logPayloadSize("draft", payload);

      await onSave(payload);

      setLastSavedAt(new Date().toISOString());

      return payload;
    } catch (error) {
      const message = error instanceof Error ? error.message : "שמירה נכשלה";
      setSaveError(message);
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
    if (!onSave) return null;

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

      logPayloadSize("publish", payload);

      await onSave(payload);

      setLastSavedAt(new Date().toISOString());

      return payload;
    } catch (error) {
      const message = error instanceof Error ? error.message : "פרסום נכשל";
      setSaveError(message);
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