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

function cleanEditorDomBeforeSnapshot(root: HTMLElement | null) {
  if (!root) return "";

  const clone = root.cloneNode(true) as HTMLElement;

  clone
    .querySelectorAll<HTMLElement>(
      [
        "[data-visual-selection-box='true']",
        "[data-visual-selection-overlay='true']",
        ".visual-selection-overlay",
        ".visual-floating-toolbar",
        ".visual-context-menu",
        ".visual-inspector-panel",
      ].join(","),
    )
    .forEach((node) => node.remove());

  clone
    .querySelectorAll<HTMLElement>(
      [
        "[data-visual-selected]",
        "[data-visual-edit-selected]",
        "[data-selected]",
        "[data-visual-active]",
        "[data-visual-inline-editing]",
        "[contenteditable]",
        "[spellcheck]",
      ].join(","),
    )
    .forEach((node) => {
      node.removeAttribute("data-visual-selected");
      node.removeAttribute("data-visual-edit-selected");
      node.removeAttribute("data-selected");
      node.removeAttribute("data-visual-active");
      node.removeAttribute("data-visual-inline-editing");
      node.removeAttribute("contenteditable");
      node.removeAttribute("spellcheck");

      node.classList.remove(
        "visual-selected",
        "visual-edit-selected",
        "is-visual-selected",
        "is-selected",
      );

      node.style.userSelect = "";
      node.style.webkitUserSelect = "";
      node.style.cursor = "";
    });

  return clone.innerHTML;
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
    const nextData = buildVisualSaveDataFromDom(root, data);

    onDataSnapshot?.(nextData);

    return nextData;
  }, [canvasRef, data, onDataSnapshot]);

  const saveDraft = useCallback(async () => {
    if (!onSave) return null;

    setIsSaving(true);
    setSaveError("");

    try {
      const snapshotData = buildSnapshotData();
      const htmlSnapshot = cleanEditorDomBeforeSnapshot(canvasRef.current);

      const payload = buildVisualSavePayload({
        templateKey: renderer.key,
        data: snapshotData,
        slug,
        publicUrl,
        siteDomain,
        published: false,
        status: "draft",
        htmlSnapshot,
        snapshotPageId: activePageId,
      });

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
    canvasRef,
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
      const htmlSnapshot = cleanEditorDomBeforeSnapshot(canvasRef.current);

      const payload = buildVisualSavePayload({
        templateKey: renderer.key,
        data: snapshotData,
        slug,
        publicUrl,
        siteDomain,
        published: true,
        status: "published",
        htmlSnapshot,
        snapshotPageId: activePageId,
      });

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
    canvasRef,
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