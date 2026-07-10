import React, { useEffect, useMemo, useRef, useState } from "react";

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

const VISUAL_CONTENT_KEY = "__content";

const TEXT_SELECTOR = [
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
].join(",");

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
    node.getAttribute("data-visual-type") ||
    node.getAttribute("data-edit-type") ||
    node
      .closest<HTMLElement>("[data-visual-edit-type]")
      ?.getAttribute("data-visual-edit-type") ||
    node
      .closest<HTMLElement>("[data-visual-type]")
      ?.getAttribute("data-visual-type") ||
    node.closest<HTMLElement>("[data-edit-type]")?.getAttribute("data-edit-type") ||
    "";

  if (explicit) {
    if (explicit === "image" || explicit === "video" || explicit === "media") {
      return "image";
    }

    if (explicit === "link" || explicit === "button") {
      return "button";
    }

    if (
      explicit === "text" ||
      explicit === "heading" ||
      explicit === "paragraph"
    ) {
      return "text";
    }

    return explicit;
  }

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

function findInlineEditableTextNode(node: HTMLElement | null) {
  if (!node) return null;

  const textNode = node.closest<HTMLElement>(TEXT_SELECTOR);

  if (textNode && getVisualElementId(textNode)) {
    return textNode;
  }

  const visualNode = node.closest<HTMLElement>("[data-visual-edit-id]");

  if (!visualNode) return null;

  if (getVisualElementType(visualNode) === "text") {
    return visualNode;
  }

  return null;
}

function selectAllText(node: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(node);

  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

function normalizeEditedText(value: string) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\r\n/g, "\n");
}

function setDeepValue(target: Record<string, any>, path: string, value: any) {
  const parts = path
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) return;

  let cursor = target;

  parts.slice(0, -1).forEach((part) => {
    if (!cursor[part] || typeof cursor[part] !== "object") {
      cursor[part] = {};
    }

    cursor = cursor[part];
  });

  cursor[parts[parts.length - 1]] = value;
}

function buildNextDataWithText(
  previousData: Record<string, any>,
  elementId: string,
  newText: string,
) {
  const previous =
    previousData && typeof previousData === "object" ? previousData : {};

  const previousContent =
    previous[VISUAL_CONTENT_KEY] &&
    typeof previous[VISUAL_CONTENT_KEY] === "object"
      ? previous[VISUAL_CONTENT_KEY]
      : {};

  const previousItem =
    previousContent[elementId] && typeof previousContent[elementId] === "object"
      ? previousContent[elementId]
      : {};

  const nextData: Record<string, any> = {
    ...previous,
    [elementId]: newText,
    [VISUAL_CONTENT_KEY]: {
      ...previousContent,
      [elementId]: {
        ...previousItem,
        text: newText,
      },
    },
  };

  if (elementId.includes(".")) {
    setDeepValue(nextData, elementId, newText);
  }

  return nextData;
}

function writeTextToEditorData(
  editorAny: any,
  elementId: string,
  newText: string,
) {
  if (!elementId) return;

  const text = normalizeEditedText(newText);

  const dedicatedCalls = [
    () => editorAny.updateInlineText?.(elementId, text),
    () => editorAny.updateElementText?.(elementId, text),
    () => editorAny.updateElementContent?.(elementId, text),
    () => editorAny.updateText?.(elementId, text),
    () => editorAny.updateVisualContent?.(elementId, { text }),
    () => editorAny.setVisualContent?.(elementId, { text }),
  ];

  for (const call of dedicatedCalls) {
    try {
      const result = call();

      if (result !== undefined) {
        return;
      }
    } catch {
      // try next option
    }
  }

  if (typeof editorAny.setData === "function") {
    editorAny.setData((current: Record<string, any>) =>
      buildNextDataWithText(current || {}, elementId, text),
    );
    return;
  }

  if (typeof editorAny.setTemplateData === "function") {
    editorAny.setTemplateData((current: Record<string, any>) =>
      buildNextDataWithText(current || {}, elementId, text),
    );
    return;
  }

  if (typeof editorAny.updateData === "function") {
    try {
      editorAny.updateData((current: Record<string, any>) =>
        buildNextDataWithText(current || {}, elementId, text),
      );
      return;
    } catch {
      try {
        editorAny.updateData(
          buildNextDataWithText(editorAny.data || {}, elementId, text),
        );
        return;
      } catch {
        // fallback below
      }
    }
  }

  if (editorAny.data && typeof editorAny.data === "object") {
    const nextData = buildNextDataWithText(
      editorAny.data || {},
      elementId,
      text,
    );

    Object.assign(editorAny.data, nextData);
  }
}

export default function VisualEditorCanvas({
  editor,
  className = "",
}: VisualEditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const editingNodeRef = useRef<HTMLElement | null>(null);
  const editingOriginalTextRef = useRef("");

  const [inlineEditingElementId, setInlineEditingElementId] = useState("");

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

    if (!inlineEditingElementId) {
      applyAllVisualDataToDom(root, editorAny.data || {});
    }

    markSelectedVisualElementInDom(
      root,
      selectedElementId || "",
      hoveredElementId || "",
    );

    if (isEditMode) {
      if (inlineEditingElementId) {
        root.style.userSelect = "text";
        root.style.webkitUserSelect = "text";
      } else {
        root.style.userSelect = "none";
        root.style.webkitUserSelect = "none";
      }
    } else {
      root.style.userSelect = "";
      root.style.webkitUserSelect = "";
    }
  }, [
    editorAny.data,
    selectedElementId,
    hoveredElementId,
    isEditMode,
    inlineEditingElementId,
  ]);

  useEffect(() => {
    if (isEditMode) return;

    const node = editingNodeRef.current;
    if (!node) return;

    const elementId = getVisualElementId(node);
    const newText = normalizeEditedText(node.innerText);

    if (elementId) {
      writeTextToEditorData(editorAny, elementId, newText);
    }

    node.removeAttribute("contenteditable");
    node.removeAttribute("spellcheck");
    node.removeAttribute("data-visual-inline-editing");

    node.style.userSelect = "";
    node.style.webkitUserSelect = "";

    editingNodeRef.current = null;
    editingOriginalTextRef.current = "";
    setInlineEditingElementId("");

    editorAny.setIsInlineEditing?.(false);
    editorAny.finishInlineTextEdit?.();
  }, [isEditMode, editorAny]);

  useEffect(() => {
    const root = canvasRef.current;
    if (!root) return;

    function callEditorClick(event: MouseEvent) {
      if (typeof editorAny.handleCanvasClick === "function") {
        try {
          editorAny.handleCanvasClick(
            event as unknown as React.MouseEvent<HTMLElement>,
          );
        } catch {
          // ignore
        }
      }
    }

    function finishInlineEdit(save: boolean) {
      const node = editingNodeRef.current;
      if (!node) return;

      const elementId = getVisualElementId(node);
      const newText = normalizeEditedText(node.innerText);

      if (save && elementId) {
        writeTextToEditorData(editorAny, elementId, newText);
      }

      if (!save) {
        node.innerText = editingOriginalTextRef.current;
      }

      node.removeAttribute("contenteditable");
      node.removeAttribute("spellcheck");
      node.removeAttribute("data-visual-inline-editing");

      node.style.userSelect = "";
      node.style.webkitUserSelect = "";

      editingNodeRef.current = null;
      editingOriginalTextRef.current = "";
      setInlineEditingElementId("");

      editorAny.setIsInlineEditing?.(false);
      editorAny.finishInlineTextEdit?.();

      if (typeof editorAny.refreshSelectedElement === "function") {
        window.requestAnimationFrame(() => {
          editorAny.refreshSelectedElement();
        });
      }
    }

    function startInlineEdit(node: HTMLElement, elementId: string) {
      const currentEditingNode = editingNodeRef.current;

      if (currentEditingNode && currentEditingNode !== node) {
        finishInlineEdit(true);
      }

      editingNodeRef.current = node;
      editingOriginalTextRef.current = node.innerText;

      setInlineEditingElementId(elementId);

      editorAny.setIsInlineEditing?.(true);
      editorAny.startInlineTextEdit?.(elementId);

      node.setAttribute("contenteditable", "true");
      node.setAttribute("spellcheck", "false");
      node.setAttribute("data-visual-inline-editing", "true");

      node.style.userSelect = "text";
      node.style.webkitUserSelect = "text";

      window.requestAnimationFrame(() => {
        node.focus({ preventScroll: true });
        selectAllText(node);
      });
    }

    function handleMouseDown(event: MouseEvent) {
      if (!isEditMode) return;

      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const editingNode = editingNodeRef.current;

      if (editingNode) {
        if (editingNode.contains(target)) {
          return;
        }

        finishInlineEdit(true);
      }

      const node = findClickableVisualNode(target);
      if (!node || !root.contains(node)) return;

      event.preventDefault();
      event.stopPropagation();
    }

    function handleClick(event: MouseEvent) {
      if (!isEditMode) return;

      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const editingNode = editingNodeRef.current;

      if (editingNode && editingNode.contains(target)) {
        return;
      }

      const node = findClickableVisualNode(target);
      if (!node || !root.contains(node)) return;

      event.preventDefault();
      event.stopPropagation();

      callEditorClick(event);
    }

    function handleDoubleClick(event: MouseEvent) {
      if (!isEditMode) return;

      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const node = findClickableVisualNode(target);
      if (!node || !root.contains(node)) return;

      event.preventDefault();
      event.stopPropagation();

      callEditorClick(event);

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

      const textNode = findInlineEditableTextNode(node);

      if (!textNode) {
        editorAny.startInlineTextEdit?.(elementId);
        return;
      }

      startInlineEdit(textNode, elementId);
    }

    function handleFocusOut(event: FocusEvent) {
      const editingNode = editingNodeRef.current;
      if (!editingNode) return;

      const nextTarget = event.relatedTarget;

      if (nextTarget instanceof Node && editingNode.contains(nextTarget)) {
        return;
      }

      window.setTimeout(() => {
        const activeElement = document.activeElement;

        if (activeElement instanceof Node && editingNode.contains(activeElement)) {
          return;
        }

        finishInlineEdit(true);
      }, 0);
    }

    function handleKeyDown(event: KeyboardEvent) {
      const editingNode = editingNodeRef.current;
      if (!editingNode) return;

      const target = event.target;

      if (!(target instanceof Node) || !editingNode.contains(target)) {
        return;
      }

      event.stopPropagation();

      if (event.key === "Escape") {
        event.preventDefault();
        finishInlineEdit(false);
        return;
      }

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        finishInlineEdit(true);
      }
    }

    function handlePaste(event: ClipboardEvent) {
      const editingNode = editingNodeRef.current;
      if (!editingNode) return;

      const target = event.target;

      if (!(target instanceof Node) || !editingNode.contains(target)) {
        return;
      }

      event.preventDefault();

      const text = event.clipboardData?.getData("text/plain") || "";

      if (!text) return;

      document.execCommand("insertText", false, text);
    }

    root.addEventListener("mousedown", handleMouseDown, true);
    root.addEventListener("click", handleClick, true);
    root.addEventListener("dblclick", handleDoubleClick, true);
    root.addEventListener("focusout", handleFocusOut, true);
    root.addEventListener("keydown", handleKeyDown, true);
    root.addEventListener("paste", handlePaste, true);

    return () => {
      root.removeEventListener("mousedown", handleMouseDown, true);
      root.removeEventListener("click", handleClick, true);
      root.removeEventListener("dblclick", handleDoubleClick, true);
      root.removeEventListener("focusout", handleFocusOut, true);
      root.removeEventListener("keydown", handleKeyDown, true);
      root.removeEventListener("paste", handlePaste, true);
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

      <style>
        {`
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-visual-edit-id] {
            cursor: pointer;
          }

          [data-visual-template-canvas="true"] [data-visual-inline-editing="true"] {
            cursor: text !important;
            user-select: text !important;
            -webkit-user-select: text !important;
            outline: 2px solid #8b3dff !important;
            outline-offset: 6px !important;
            border-radius: 6px;
            white-space: pre-wrap;
          }

          [data-visual-template-canvas="true"] [data-visual-inline-editing="true"] * {
            user-select: text !important;
            -webkit-user-select: text !important;
          }

          .visual-selection-overlay,
          [data-visual-selection-overlay="true"] {
            pointer-events: none !important;
          }
        `}
      </style>

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
              isEditMode && !inlineEditingElementId
                ? "cursor-default select-none"
                : "cursor-auto select-auto",
            ].join(" ")}
            dir="rtl"
          >
            <TemplateComponent
              data={editorAny.data}
              mode={isPreviewMode ? "preview" : "edit"}
              businessId={editorAny.businessId}
              activePageId={
                editorAny.activePageId || editorAny.activePageID || "home"
              }
              initialPage={
                editorAny.activePageId || editorAny.activePageID || "home"
              }
              isStudioStatic={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}