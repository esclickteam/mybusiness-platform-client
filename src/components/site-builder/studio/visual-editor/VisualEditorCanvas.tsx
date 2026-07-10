import React, { useEffect, useMemo, useRef } from "react";

import {
  applyAllVisualDataToDom,
  markSelectedVisualElementInDom,
} from "./utils/visualDomApply";

import type { VisualDeviceMode } from "./visualEditorTypes";
import type { useVisualEditorState } from "./hooks/useVisualEditorState";

type VisualEditorCanvasProps = {
  editor: ReturnType<typeof useVisualEditorState>;
  className?: string;
};

function getDeviceWidth(device: VisualDeviceMode) {
  if (device === "mobile") return "390px";
  if (device === "tablet") return "820px";

  return "100%";
}

function getDeviceMaxWidth(device: VisualDeviceMode) {
  if (device === "mobile") return "390px";
  if (device === "tablet") return "820px";

  return "100%";
}

function findClickableVisualNode(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return null;

  return target.closest<HTMLElement>(
    [
      "[data-visual-editable='true'][data-visual-edit-id]",
      "[data-visual-edit-id]",
      "[data-image-field]",
      "[data-edit-type='image']",
      "[data-visual-image-field]",
      "img",
      "video",
      "source",
      "a",
      "button",
      "input",
      "textarea",
      "select",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "span",
      "strong",
      "small",
      "label",
      "section",
      "article",
      "form",
    ].join(","),
  );
}

function getVisualElementId(node: HTMLElement | null) {
  if (!node) return "";

  return (
    node.getAttribute("data-visual-edit-id") ||
    node
      .closest<HTMLElement>("[data-visual-edit-id]")
      ?.getAttribute("data-visual-edit-id") ||
    ""
  );
}

function getVisualElementType(node: HTMLElement | null) {
  if (!node) return "";

  const explicit =
    node.getAttribute("data-visual-edit-type") ||
    node
      .closest<HTMLElement>("[data-visual-edit-type]")
      ?.getAttribute("data-visual-edit-type") ||
    "";

  if (explicit) return explicit;

  const tagName = String(node.tagName || "").toLowerCase();

  if (tagName === "img" || tagName === "video" || tagName === "source") {
    return "image";
  }

  if (
    tagName === "a" ||
    tagName === "button" ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  ) {
    return "button";
  }

  if (
    [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "span",
      "strong",
      "small",
      "label",
    ].includes(tagName)
  ) {
    return "text";
  }

  return "section";
}

export default function VisualEditorCanvas({
  editor,
  className = "",
}: VisualEditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const editorAny = editor as any;

  const TemplateComponent = useMemo(() => {
    const rendererAny = editorAny.renderer as any;

    return (
      rendererAny?.Component ||
      rendererAny?.component ||
      rendererAny?.Renderer ||
      rendererAny?.render ||
      null
    ) as React.ComponentType<any> | null;
  }, [editorAny.renderer]);

  const isPreviewMode = Boolean(editorAny.isPreviewMode);
  const isEditMode = !isPreviewMode;

  const selectedElementId = String(editorAny.selectedElement?.id || "");
  const hoveredElementId = String(editorAny.hoveredElementId || "");

  const runtimeCss = useMemo(() => {
    if (typeof editorAny.buildRuntimeCss === "function") {
      return (
        editorAny.buildRuntimeCss({
          selectedElementId,
          hoveredElementId,
        }) || ""
      );
    }

    if (typeof editorAny.runtimeCss === "string") {
      return editorAny.runtimeCss;
    }

    return "";
  }, [
    editorAny,
    selectedElementId,
    hoveredElementId,
    editorAny.styles,
    editorAny.animations,
    editorAny.runtimeCss,
  ]);

  useEffect(() => {
    const root = canvasRef.current;
    if (!root) return;

    if (typeof editorAny.setCanvasElement === "function") {
      editorAny.setCanvasElement(root);
    }

    if (editorAny.canvasRef) {
      try {
        editorAny.canvasRef.current = root;
      } catch {
        // ignore
      }
    }
  }, [editorAny]);

  useEffect(() => {
    const root = canvasRef.current;
    if (!root) return;

    applyAllVisualDataToDom(root, editorAny.data || {});

    markSelectedVisualElementInDom(
      root,
      selectedElementId || "",
      hoveredElementId || "",
    );

    if (isEditMode) {
      root.style.userSelect = "none";
      root.style.webkitUserSelect = "none";
    } else {
      root.style.userSelect = "";
      root.style.webkitUserSelect = "";
    }
  }, [
    editorAny.data,
    selectedElementId,
    hoveredElementId,
    isEditMode,
  ]);

  useEffect(() => {
    const root = canvasRef.current;
    if (!root) return;

    function handleMouseDown(event: MouseEvent) {
      if (!isEditMode) return;

      const node = findClickableVisualNode(event.target);
      if (!node || !root.contains(node)) return;

      event.preventDefault();
      event.stopPropagation();
    }

    function handleClick(event: MouseEvent) {
      if (!isEditMode) return;

      const node = findClickableVisualNode(event.target);
      if (!node || !root.contains(node)) return;

      event.preventDefault();
      event.stopPropagation();

      if (typeof editorAny.handleCanvasClick === "function") {
        editorAny.handleCanvasClick(
          event as unknown as React.MouseEvent<HTMLElement>,
        );
      }
    }

    function handleDoubleClick(event: MouseEvent) {
      if (!isEditMode) return;

      const node = findClickableVisualNode(event.target);
      if (!node || !root.contains(node)) return;

      event.preventDefault();
      event.stopPropagation();

      const elementId = getVisualElementId(node);
      const elementType = getVisualElementType(node);

      if (!elementId) return;

      if (elementType === "image") {
        editorAny.openMediaPicker?.(elementId);
        return;
      }

      if (elementType === "button") {
        editorAny.openLinkSettings?.(elementId);
        return;
      }

      editorAny.startInlineTextEdit?.(elementId);
    }

    root.addEventListener("mousedown", handleMouseDown, true);
    root.addEventListener("click", handleClick, true);
    root.addEventListener("dblclick", handleDoubleClick, true);

    return () => {
      root.removeEventListener("mousedown", handleMouseDown, true);
      root.removeEventListener("click", handleClick, true);
      root.removeEventListener("dblclick", handleDoubleClick, true);
    };
  }, [editorAny, isEditMode]);

  const deviceMode = (editorAny.deviceMode || "desktop") as VisualDeviceMode;
  const deviceWidth = getDeviceWidth(deviceMode);
  const deviceMaxWidth = getDeviceMaxWidth(deviceMode);

  if (!TemplateComponent) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center bg-slate-100 p-8">
        <div className="max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-black text-slate-400">
            לא נמצא Component לתבנית
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            צריך לבדוק את renderer
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "visual-editor-scroll-area h-full overflow-y-auto overflow-x-hidden bg-slate-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseMove={editorAny.handleCanvasMouseMove}
      onMouseLeave={editorAny.handleCanvasMouseLeave}
      onContextMenu={editorAny.handleCanvasContextMenu}
    >
      <style>{runtimeCss}</style>

      <div className="mx-auto min-h-full px-3 py-6 lg:px-6">
        <div
          className={[
            "mx-auto min-h-[720px] overflow-visible bg-white shadow-[0_24px_90px_rgba(15,23,42,0.14)] transition-all duration-300",
            deviceMode === "desktop" ? "w-full" : "rounded-[32px]",
          ].join(" ")}
          style={{
            width: deviceWidth,
            maxWidth: deviceMaxWidth,
          }}
        >
          <div
            ref={canvasRef}
            data-visual-template-canvas="true"
            data-visual-preview-mode={isPreviewMode ? "true" : "false"}
            data-visual-editor-mode={isEditMode ? "edit" : "preview"}
            className={[
              "min-h-full overflow-visible",
              isEditMode
                ? "cursor-default select-none"
                : "cursor-auto select-auto",
            ].join(" ")}
            dir="rtl"
          >
            <TemplateComponent
              data={editorAny.data}
              mode={isPreviewMode ? "preview" : "edit"}
              businessId={editorAny.businessId}
              activePageId={editorAny.activePageId || editorAny.activePageID || "home"}
              initialPage={editorAny.activePageId || editorAny.activePageID || "home"}
              isStudioStatic={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}