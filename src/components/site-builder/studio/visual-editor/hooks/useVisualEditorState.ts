import { useCallback, useMemo, useRef, useState } from "react";

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

  const styles = useMemo(() => readVisualStyles(data), [data]);
  const animations = useMemo(() => readVisualAnimations(data), [data]);
  const content = useMemo(() => readVisualContent(data), [data]);
  const deleted = useMemo(() => readVisualDeleted(data), [data]);

  const selection = useVisualSelection({
    canvasRef,
    enabled: !isPreviewMode,
  });

  const setData = useCallback(
    (nextData: Record<string, any> | ((current: Record<string, any>) => Record<string, any>)) => {
      history.setValue(nextData);
    },
    [history],
  );

  const replaceData = useCallback(
    (nextData: Record<string, any> | ((current: Record<string, any>) => Record<string, any>)) => {
      history.replaceValue(nextData);
    },
    [history],
  );

  const updateContent = useCallback(
    (elementId: string, patch: Record<string, any>) => {
      setData((current) => writeVisualContentItem(current, elementId, patch));
    },
    [setData],
  );

  const updateText = useCallback(
    (elementId: string, value: string) => {
      updateContent(elementId, { text: value });
    },
    [updateContent],
  );

  const updateImage = useCallback(
    (
      elementId: string,
      payload: {
        src?: string;
        alt?: string;
        mediaType?: "image" | "video" | "raw" | string;
        resourceType?: "image" | "video" | "raw" | string;
      },
    ) => {
      const mediaType = payload.mediaType || payload.resourceType;

      updateContent(elementId, {
        ...payload,
        mediaType,
        resourceType: mediaType,
      });
    },
    [updateContent],
  );

  const updateLink = useCallback(
    (
      elementId: string,
      payload: { href?: string; target?: "_self" | "_blank" | string; rel?: string },
    ) => {
      updateContent(elementId, {
        href: payload.href || "",
        target: payload.target || "_self",
        rel: payload.rel || (payload.target === "_blank" ? "noopener noreferrer" : ""),
      });
    },
    [updateContent],
  );

  const applyStyle = useCallback(
    (elementId: string, style: StylePatch) => {
      setData((current) => writeVisualStyleItem(current, elementId, style));
    },
    [setData],
  );

  const resetStyle = useCallback(
    (elementId: string) => {
      setData((current) => {
        const currentStyles = readVisualStyles(current);
        const nextStyles = { ...currentStyles };
        delete nextStyles[elementId];

        return {
          ...current,
          [VISUAL_STYLE_KEY]: nextStyles,
        };
      });
    },
    [setData],
  );

  const setAnimation = useCallback(
    (elementId: string, animation: AnimationPresetValue | string) => {
      setData((current) => writeVisualAnimationItem(current, elementId, animation));
    },
    [setData],
  );

  const clearAnimation = useCallback(
    (elementId: string) => {
      setData((current) => {
        const currentAnimations = readVisualAnimations(current);
        const nextAnimations = { ...currentAnimations };
        delete nextAnimations[elementId];

        return {
          ...current,
          [VISUAL_ANIMATION_KEY]: nextAnimations,
        };
      });
    },
    [setData],
  );

  const deleteElement = useCallback(
    (elementId?: string) => {
      const id = elementId || selection.selectedElement?.id;
      if (!id) return;

      setData((current) => markVisualElementDeleted(current, id));
      selection.clearSelection();
    },
    [selection, setData],
  );

  const restoreElement = useCallback(
    (elementId: string) => {
      if (!elementId) return;
      setData((current) => restoreVisualElement(current, elementId));
    },
    [setData],
  );

  const duplicateElement = useCallback(() => {
    const selected = selection.selectedElement;
    if (!selected?.id) return;

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
  }, [animations, content, selection.selectedElement, setData, styles]);

  const bringForward = useCallback(
    (elementId?: string) => {
      const id = elementId || selection.selectedElement?.id;
      if (!id) return;

      const currentZ = Number((styles[id] as Record<string, any>)?.zIndex || 0);
      applyStyle(id, { zIndex: currentZ + 1 });
    },
    [applyStyle, selection.selectedElement?.id, styles],
  );

  const sendBackward = useCallback(
    (elementId?: string) => {
      const id = elementId || selection.selectedElement?.id;
      if (!id) return;

      const currentZ = Number((styles[id] as Record<string, any>)?.zIndex || 0);
      applyStyle(id, { zIndex: currentZ - 1 });
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
    [animations, selection.hoveredElementId, selection.selectedElement?.id, styles],
  );

  const applyDataToDom = useCallback(() => {
    applyAllVisualDataToDom(canvasRef.current, data);
  }, [data]);

  const save = useVisualSave({
    renderer,
    canvasRef,
    data,
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
      updateText,
      updateImage,
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
      updateText,
      updateImage,
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
