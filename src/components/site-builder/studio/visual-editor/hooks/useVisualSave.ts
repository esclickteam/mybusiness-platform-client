import { useCallback, useMemo, useState } from "react";

import type { StudioTemplateRenderer } from "../../data/templates/templateEditorTypes";
import { buildVisualSavePayload } from "../utils/visualSaveAdapter";
import { buildVisualSaveDataFromDom } from "../utils/visualDomApply";

type VisualSavePayload = ReturnType<typeof buildVisualSavePayload>;

type UseVisualSaveOptions = {
  renderer: StudioTemplateRenderer;
  canvasRef: React.RefObject<HTMLElement | null>;
  data: Record<string, any>;
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

    const src = String(cleanItem.src || "");
    const isBase64Media =
      src.startsWith("data:image/") ||
      src.startsWith("data:video/") ||
      src.startsWith("blob:");

    /*
      חשוב:
      blob/data URLs לא נשמרים באתר.
      מדיה חייבת להישמר קודם ב־Cloudinary,
      וב־data לשמור רק secureUrl.
    */
    if (isBase64Media) {
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

function logPayloadSize(label: string, payload: unknown) {
  try {
    const body = JSON.stringify(payload);
    const mb = body.length / 1024 / 1024;

    console.log(`[BizUply Visual Save] ${label} payload size: ${mb.toFixed(2)}MB`, {
      bytes: body.length,
    });
  } catch (error) {
    console.warn(`[BizUply Visual Save] ${label} payload stringify failed`, error);
  }
}

export function useVisualSave({
  renderer,
  canvasRef,
  data,
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

  const buildSnapshotData = useCallback(() => {
    const root = canvasRef.current;

    /*
      אוספים רק תוכן/סטיילים/אנימציות מה־DOM,
      ואז מנקים כל DOM node / React internals / base64 media.
    */
    const nextDataRaw = buildVisualSaveDataFromDom(root, data);
    const nextData = buildLeanVisualData(nextDataRaw);

    onDataSnapshot?.(nextData);

    return nextData;
  }, [canvasRef, data, onDataSnapshot]);

  const saveDraft = useCallback(async () => {
    if (!onSave) return null;

    setIsSaving(true);
    setSaveError("");

    try {
      const snapshotData = buildSnapshotData();

      /*
        לא שולחים htmlSnapshot.
        זה היה מנפח את הבקשה וגורם ל־PayloadTooLargeError.
        בתבניות React שומרים רק data קטן:
        __content / __styles / __animations
      */
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