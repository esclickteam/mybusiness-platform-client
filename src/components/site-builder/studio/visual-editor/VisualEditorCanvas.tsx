import React, { useEffect, useMemo, useRef } from "react";

import {
  applyAllVisualDataToDom,
  markSelectedVisualElementInDom,
} from "./utils/visualDomApply";

import type { VisualDeviceMode, VisualEditorController } from "./visualEditorTypes";

type VisualEditorCanvasProps = {
  editor: VisualEditorController;
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

export default function VisualEditorCanvas({
  editor,
  className = "",
}: VisualEditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const TemplateComponent = editor.renderer.Component;

  const runtimeCss = useMemo(
    () =>
      editor.buildRuntimeCss?.({
        selectedElementId: editor.selectedElement?.id,
        hoveredElementId: editor.hoveredElementId,
      }) || "",
    [
      editor,
      editor.selectedElement?.id,
      editor.hoveredElementId,
      editor.styles,
      editor.animations,
    ],
  );

  useEffect(() => {
    const root = canvasRef.current;
    if (!root) return;

    editor.setCanvasElement?.(root);
  }, [editor]);

  useEffect(() => {
    const root = canvasRef.current;
    if (!root) return;

    applyAllVisualDataToDom(root, editor.data);
    markSelectedVisualElementInDom(
      root,
      editor.selectedElement?.id,
      editor.hoveredElementId,
    );
  }, [
    editor.data,
    editor.selectedElement?.id,
    editor.hoveredElementId,
  ]);

  const deviceWidth = getDeviceWidth(editor.deviceMode);
  const deviceMaxWidth = getDeviceMaxWidth(editor.deviceMode);

  return (
    <div
      className={[
        "visual-editor-scroll-area h-full overflow-y-auto overflow-x-hidden bg-slate-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={editor.handleCanvasClick}
      onMouseMove={editor.handleCanvasMouseMove}
      onMouseLeave={editor.handleCanvasMouseLeave}
      onContextMenu={editor.handleCanvasContextMenu}
    >
      <style>{runtimeCss}</style>

      <div className="mx-auto min-h-full px-3 py-6 lg:px-6">
        <div
          className={[
            "mx-auto min-h-[720px] overflow-visible bg-white shadow-[0_24px_90px_rgba(15,23,42,0.14)] transition-all duration-300",
            editor.deviceMode === "desktop" ? "w-full" : "rounded-[32px]",
          ].join(" ")}
          style={{
            width: deviceWidth,
            maxWidth: deviceMaxWidth,
          }}
        >
          <div
            ref={canvasRef}
            data-visual-template-canvas="true"
            data-visual-preview-mode={editor.isPreviewMode ? "true" : "false"}
            className="min-h-full overflow-visible"
            dir="rtl"
          >
            <TemplateComponent
              data={editor.data}
              mode={editor.isPreviewMode ? "preview" : "edit"}
              businessId={editor.businessId}
              activePageId={editor.activePageId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
