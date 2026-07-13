"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  applyAllVisualDataToDom,
  markSelectedVisualElementInDom,
  syncEditorMediaPreviewForTarget,
  syncEditorMediaPreviewsInDom,
} from "./utils/visualDomApply";

import type { VisualDeviceMode } from "./visualEditorTypes";
import type { useVisualEditorState } from "./hooks/useVisualEditorState";

type VisualEditorCanvasProps = {
  editor: ReturnType<typeof useVisualEditorState>;
  className?: string;
};

type SelectionBox = {
  top: number;
  left: number;
  width: number;
  height: number;
  label?: string;
};

type ResizeHandle =
  | "nw"
  | "n"
  | "ne"
  | "e"
  | "se"
  | "s"
  | "sw"
  | "w";

type InteractionSnapshot = {
  transition: string;
  transitionPriority: string;
  willChange: string;
  willChangePriority: string;
  touchAction: string;
  touchActionPriority: string;
};

type InteractionGeometry = {
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
};

type DragSession = {
  mode: "move" | "resize";
  handle?: ResizeHandle;
  node: HTMLElement;
  elementId: string;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  scaleX: number;
  scaleY: number;
  startTranslateX: number;
  startTranslateY: number;
  interactionSnapshot: InteractionSnapshot;
};

type DirectDragSession = {
  node: HTMLElement;
  elementId: string;
  startX: number;
  startY: number;
  startTranslateX: number;
  startTranslateY: number;
  scaleX: number;
  scaleY: number;
  started: boolean;
  interactionSnapshot: InteractionSnapshot;
};

const TEXT_TAGS = new Set([
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
  "em",
  "b",
  "i",
  "blockquote",
  "figcaption",
]);

const EDITOR_UI_SELECTOR = [
  "[data-visual-selection-box='true']",
  "[data-visual-resize-handle='true']",
  "[data-visual-drag-handle='true']",
  "[data-visual-floating-toolbar='true']",
  "[data-visual-context-menu='true']",
  "[data-visual-selection-overlay='true']",
  ".visual-floating-toolbar",
  ".visual-context-menu",
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

function getElementId(node: HTMLElement | null) {
  return String(node?.getAttribute("data-visual-edit-id") || "").trim();
}

function getElementType(node: HTMLElement | null) {
  if (!node) return "";

  const explicit = String(
    node.getAttribute("data-visual-edit-type") ||
      node.getAttribute("data-visual-type") ||
      node.getAttribute("data-edit-type") ||
      "",
  )
    .trim()
    .toLowerCase();

  if (["image", "video", "media", "raw"].includes(explicit)) {
    return "image";
  }

  if (["button", "link", "control"].includes(explicit)) {
    return "button";
  }

  if (["text", "heading", "paragraph"].includes(explicit)) {
    return "text";
  }

  if (explicit) return explicit;

  const tagName = String(node.tagName || "").toLowerCase();

  if (["img", "video", "source", "picture"].includes(tagName)) {
    return "image";
  }

  if (["a", "button", "input", "textarea", "select"].includes(tagName)) {
    return "button";
  }

  if (TEXT_TAGS.has(tagName)) return "text";

  if (
    [
      "section",
      "article",
      "header",
      "footer",
      "main",
      "nav",
      "aside",
      "form",
    ].includes(tagName)
  ) {
    return "section";
  }

  return "box";
}

function isTextNode(node: HTMLElement | null) {
  if (!node) return false;

  return (
    getElementType(node) === "text" ||
    TEXT_TAGS.has(String(node.tagName || "").toLowerCase())
  );
}

function escapeCssValue(value: string) {
  if (
    typeof CSS !== "undefined" &&
    typeof CSS.escape === "function"
  ) {
    return CSS.escape(value);
  }

  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function getSelectedNode(editor: any, root: HTMLElement | null) {
  const direct =
    editor?.selectedElement?.node ||
    editor?.selectedElement?.domNode ||
    editor?.selectedElement?.element ||
    null;

  if (direct instanceof HTMLElement && root?.contains(direct)) {
    return direct;
  }

  const elementId = String(editor?.selectedElement?.id || "").trim();

  if (!root || !elementId) return null;

  return root.querySelector<HTMLElement>(
    `[data-visual-edit-id="${escapeCssValue(elementId)}"]`,
  );
}

function findVisualNodeFromTarget(
  target: HTMLElement,
  root: HTMLElement,
) {
  const direct = target.closest<HTMLElement>("[data-visual-edit-id]");

  if (!direct || !root.contains(direct)) return null;

  return direct;
}

function normalizeText(value: string) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\r\n/g, "\n");
}

function placeCaretAtPoint(
  node: HTMLElement,
  clientX?: number,
  clientY?: number,
) {
  node.focus({ preventScroll: true });

  const selection = window.getSelection();
  if (!selection) return;

  let range: Range | null = null;

  const doc = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (
      x: number,
      y: number,
    ) => { offsetNode: Node; offset: number } | null;
  };

  if (typeof clientX === "number" && typeof clientY === "number") {
    if (typeof doc.caretPositionFromPoint === "function") {
      const position = doc.caretPositionFromPoint(clientX, clientY);

      if (position) {
        range = document.createRange();
        range.setStart(position.offsetNode, position.offset);
        range.collapse(true);
      }
    } else if (typeof doc.caretRangeFromPoint === "function") {
      range = doc.caretRangeFromPoint(clientX, clientY);
    }
  }

  if (!range || !node.contains(range.startContainer)) {
    range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(false);
  }

  selection.removeAllRanges();
  selection.addRange(range);
}

function parseCssLength(value: string | undefined) {
  const clean = String(value || "").trim();

  if (!clean || clean === "none" || clean === "auto") return 0;

  const parsed = Number.parseFloat(clean);

  return Number.isFinite(parsed) ? parsed : 0;
}

function getComputedTranslate(node: HTMLElement) {
  /*
   * transform של התבנית אינו התזוזה של העורך.
   * לדוגמה transform: translateX(-50%) משמש למרכוז.
   * אם קוראים את המטריצה שלו ומכניסים אותה שוב ל-translate,
   * האלמנט קופץ לצד כי אותה תזוזה מופעלת פעמיים.
   *
   * העורך שומר תזוזה רק ב-CSS individual property בשם translate,
   * ולכן transform / rotate / scale המקוריים נשארים ללא שינוי.
   */
  const computed = window.getComputedStyle(node);
  const individualTranslate = String(computed.translate || "").trim();

  if (!individualTranslate || individualTranslate === "none") {
    return { x: 0, y: 0 };
  }

  const parts = individualTranslate.split(/\s+/).filter(Boolean);
  const xValue = parts[0] || "0";
  const yValue = parts[1] || "0";

  /*
   * תרגום באחוזים או calc() שייך בדרך כלל לעיצוב המקורי,
   * לא לגרירה שנשמרה בעורך. מתעלמים ממנו כדי למנוע קפיצה.
   */
  if (
    xValue.includes("%") ||
    yValue.includes("%") ||
    xValue.includes("calc(") ||
    yValue.includes("calc(")
  ) {
    return { x: 0, y: 0 };
  }

  return {
    x: parseCssLength(xValue),
    y: parseCssLength(yValue),
  };
}

function getInteractionGeometry(node: HTMLElement): InteractionGeometry {
  const rect = node.getBoundingClientRect();
  const computed = window.getComputedStyle(node);

  const width =
    node.offsetWidth ||
    parseCssLength(node.style.getPropertyValue("width")) ||
    parseCssLength(computed.width) ||
    rect.width ||
    1;

  const height =
    node.offsetHeight ||
    parseCssLength(node.style.getPropertyValue("height")) ||
    parseCssLength(computed.height) ||
    rect.height ||
    1;

  const rawScaleX = rect.width > 0 ? rect.width / width : 1;
  const rawScaleY = rect.height > 0 ? rect.height / height : 1;

  return {
    width,
    height,
    scaleX:
      Number.isFinite(rawScaleX) && rawScaleX > 0
        ? rawScaleX
        : 1,
    scaleY:
      Number.isFinite(rawScaleY) && rawScaleY > 0
        ? rawScaleY
        : 1,
  };
}

function applyLiveTranslate(
  node: HTMLElement,
  translateX: number,
  translateY: number,
) {
  node.style.setProperty(
    "translate",
    `${translateX}px ${translateY}px`,
    "important",
  );
}

function applyLiveSize(
  node: HTMLElement,
  width: number,
  height: number,
) {
  const safeWidth = Math.round(Math.max(24, width) * 100) / 100;
  const safeHeight = Math.round(Math.max(24, height) * 100) / 100;

  node.style.setProperty("width", `${safeWidth}px`, "important");
  node.style.setProperty("height", `${safeHeight}px`, "important");
  node.style.setProperty("inline-size", `${safeWidth}px`, "important");
  node.style.setProperty("block-size", `${safeHeight}px`, "important");
  node.style.setProperty("min-width", "24px", "important");
  node.style.setProperty("min-height", "24px", "important");
  node.style.setProperty("max-width", "none", "important");
  node.style.setProperty("max-height", "none", "important");
  node.style.setProperty("aspect-ratio", "auto", "important");
  node.style.setProperty("box-sizing", "border-box", "important");
  node.style.setProperty("flex", "none", "important");
}

function getStablePosition(node: HTMLElement) {
  const position = window.getComputedStyle(node).position;

  return position === "static" ? "relative" : position;
}

function getMinimumElementSize(node: HTMLElement) {
  const type = getElementType(node);

  if (type === "text") {
    return { width: 40, height: 24 };
  }

  if (type === "button") {
    return { width: 48, height: 32 };
  }

  if (
    node instanceof HTMLImageElement ||
    node instanceof HTMLVideoElement ||
    type === "image"
  ) {
    return { width: 64, height: 48 };
  }

  return { width: 32, height: 32 };
}

function prepareNodeForInteraction(node: HTMLElement): InteractionSnapshot {
  const snapshot: InteractionSnapshot = {
    transition: node.style.getPropertyValue("transition"),
    transitionPriority: node.style.getPropertyPriority("transition"),
    willChange: node.style.getPropertyValue("will-change"),
    willChangePriority: node.style.getPropertyPriority("will-change"),
    touchAction: node.style.getPropertyValue("touch-action"),
    touchActionPriority: node.style.getPropertyPriority("touch-action"),
  };

  node.style.setProperty("transition", "none", "important");
  node.style.setProperty(
    "will-change",
    "width, height, translate",
    "important",
  );
  node.style.setProperty("touch-action", "none", "important");

  return snapshot;
}

function restoreInlineProperty(
  node: HTMLElement,
  property: string,
  value: string,
  priority: string,
) {
  if (value) {
    node.style.setProperty(property, value, priority);
  } else {
    node.style.removeProperty(property);
  }
}

function restoreNodeAfterInteraction(
  node: HTMLElement,
  snapshot: InteractionSnapshot,
) {
  restoreInlineProperty(
    node,
    "transition",
    snapshot.transition,
    snapshot.transitionPriority,
  );
  restoreInlineProperty(
    node,
    "will-change",
    snapshot.willChange,
    snapshot.willChangePriority,
  );
  restoreInlineProperty(
    node,
    "touch-action",
    snapshot.touchAction,
    snapshot.touchActionPriority,
  );
}

function sameSelectionBox(
  first: SelectionBox | null,
  second: SelectionBox | null,
) {
  if (first === second) return true;
  if (!first || !second) return false;

  return (
    Math.abs(first.top - second.top) < 0.25 &&
    Math.abs(first.left - second.left) < 0.25 &&
    Math.abs(first.width - second.width) < 0.25 &&
    Math.abs(first.height - second.height) < 0.25 &&
    first.label === second.label
  );
}

function sizeMediaChildren(node: HTMLElement) {
  const isDirectMedia =
    node instanceof HTMLImageElement ||
    node instanceof HTMLVideoElement;

  if (isDirectMedia) {
    node.style.setProperty("display", "block", "important");
    node.style.setProperty("box-sizing", "border-box", "important");
    node.style.setProperty("max-width", "none", "important");
    node.style.setProperty("max-height", "none", "important");
    node.style.setProperty("min-width", "0", "important");
    node.style.setProperty("min-height", "0", "important");
    node.style.setProperty("aspect-ratio", "auto", "important");
    node.style.setProperty("object-fit", "cover", "important");
    node.style.setProperty("object-position", "center", "important");
    node.style.setProperty(
      "background-color",
      "transparent",
      "important",
    );

    return;
  }

  node
    .querySelectorAll<HTMLElement>("img, video, picture")
    .forEach((mediaNode) => {
      mediaNode.style.setProperty("display", "block", "important");
      mediaNode.style.setProperty("width", "100%", "important");
      mediaNode.style.setProperty("height", "100%", "important");
      mediaNode.style.setProperty("max-width", "none", "important");
      mediaNode.style.setProperty("max-height", "none", "important");
      mediaNode.style.setProperty("min-width", "0", "important");
      mediaNode.style.setProperty("min-height", "0", "important");
      mediaNode.style.setProperty("box-sizing", "border-box", "important");
      mediaNode.style.setProperty("object-fit", "cover", "important");
      mediaNode.style.setProperty(
        "object-position",
        "center",
        "important",
      );
      mediaNode.style.setProperty(
        "background-color",
        "transparent",
        "important",
      );
    });
}

function getResizeCursor(handle: ResizeHandle) {
  if (handle === "n" || handle === "s") return "ns-resize";
  if (handle === "e" || handle === "w") return "ew-resize";
  if (handle === "nw" || handle === "se") return "nwse-resize";
  return "nesw-resize";
}

const HANDLE_POSITIONS: Array<{
  handle: ResizeHandle;
  style: React.CSSProperties;
}> = [
  { handle: "nw", style: { left: -6, top: -6 } },
  {
    handle: "n",
    style: { left: "50%", top: -6, transform: "translateX(-50%)" },
  },
  { handle: "ne", style: { right: -6, top: -6 } },
  {
    handle: "e",
    style: { right: -6, top: "50%", transform: "translateY(-50%)" },
  },
  { handle: "se", style: { right: -6, bottom: -6 } },
  {
    handle: "s",
    style: { left: "50%", bottom: -6, transform: "translateX(-50%)" },
  },
  { handle: "sw", style: { left: -6, bottom: -6 } },
  {
    handle: "w",
    style: { left: -6, top: "50%", transform: "translateY(-50%)" },
  },
];

export default function VisualEditorCanvas({
  editor,
  className = "",
}: VisualEditorCanvasProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const editingNodeRef = useRef<HTMLElement | null>(null);
  const originalTextRef = useRef("");
  const dragSessionRef = useRef<DragSession | null>(null);
  const directDragSessionRef = useRef<DirectDragSession | null>(null);
  const animationFrameRef = useRef(0);
  const directAnimationFrameRef = useRef(0);
  const pendingDirectPointRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntilRef = useRef(0);
  const interactionActiveRef = useRef(false);
  const selectionOverlayRef = useRef<HTMLDivElement | null>(null);
  const selectionBoxRef = useRef<SelectionBox | null>(null);
  const selectedNodeRef = useRef<HTMLElement | null>(null);

  const [inlineEditingElementId, setInlineEditingElementId] = useState("");
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);

  const editorAny = editor as any;

  const TemplateComponent = useMemo(() => {
    const renderer = editorAny.renderer as any;

    return (
      renderer?.Component ||
      renderer?.component ||
      renderer?.Renderer ||
      renderer?.render ||
      null
    ) as React.ComponentType<any> | null;
  }, [editorAny.renderer]);

  const isPreviewMode = Boolean(editorAny.isPreviewMode);
  const isEditMode = !isPreviewMode;
  const selectedElementId = String(editorAny.selectedElement?.id || "");
  const hoveredElementId = String(editorAny.hoveredElementId || "");
  const deviceMode = (editorAny.deviceMode || "desktop") as VisualDeviceMode;

  const runtimeCss = useMemo(() => {
    if (typeof editorAny.runtimeCss === "string") {
      return editorAny.runtimeCss;
    }

    if (typeof editorAny.buildRuntimeCss === "function") {
      return (
        editorAny.buildRuntimeCss({
          selectedElementId,
          hoveredElementId,
        }) || ""
      );
    }

    return "";
  }, [
    editorAny.runtimeCss,
    editorAny.styles,
    editorAny.animations,
    selectedElementId,
    hoveredElementId,
  ]);

  const paintSelectionOverlay = useCallback((box: SelectionBox | null) => {
    const overlay = selectionOverlayRef.current;

    if (!overlay) return;

    if (!box) {
      overlay.style.display = "none";
      return;
    }

    overlay.style.display = "block";
    overlay.style.top = `${box.top}px`;
    overlay.style.left = `${box.left}px`;
    overlay.style.width = `${box.width}px`;
    overlay.style.height = `${box.height}px`;
  }, []);

  const refreshSelectionBox = useCallback(
    ({
      node,
      commitReactState = true,
    }: {
      node?: HTMLElement | null;
      commitReactState?: boolean;
    } = {}) => {
      const root = rootRef.current;
      const selectedNode = node || getSelectedNode(editorAny, root);

      if (!selectedNode || !document.body.contains(selectedNode)) {
        selectionBoxRef.current = null;
        paintSelectionOverlay(null);

        if (commitReactState) {
          setSelectionBox(null);
        }

        return;
      }

      selectedNodeRef.current = selectedNode;

      const rect = selectedNode.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        selectionBoxRef.current = null;
        paintSelectionOverlay(null);

        if (commitReactState) {
          setSelectionBox(null);
        }

        return;
      }

      const nextBox: SelectionBox = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        label:
          selectedNode.getAttribute("data-visual-edit-label") ||
          selectedNode.getAttribute("data-visual-edit-type") ||
          selectedNode.tagName.toLowerCase(),
      };

      selectionBoxRef.current = nextBox;
      paintSelectionOverlay(nextBox);

      if (commitReactState) {
        setSelectionBox((current) =>
          sameSelectionBox(current, nextBox) ? current : nextBox,
        );
      }
    },
    [editorAny, paintSelectionOverlay],
  );

  const finishInlineEdit = useCallback(
    (save: boolean) => {
      const node = editingNodeRef.current;
      if (!node) return;

      const elementId = getElementId(node);
      const nextText = normalizeText(node.innerText || node.textContent || "");

      if (!save) {
        node.textContent = originalTextRef.current;
      } else if (elementId) {
        if (typeof editorAny.updateText === "function") {
          editorAny.updateText(elementId, nextText);
        } else if (typeof editorAny.finishInlineTextEdit === "function") {
          editorAny.finishInlineTextEdit(elementId, nextText);
        }
      }

      node.removeAttribute("contenteditable");
      node.removeAttribute("spellcheck");
      node.removeAttribute("data-visual-inline-editing");
      node.classList.remove("is-visual-inline-editing");
      node.style.removeProperty("cursor");
      node.style.removeProperty("user-select");
      node.style.removeProperty("-webkit-user-select");

      editingNodeRef.current = null;
      originalTextRef.current = "";
      setInlineEditingElementId("");
      editorAny.setIsInlineEditing?.(false);

      window.requestAnimationFrame(() => {
        refreshSelectionBox({ node, commitReactState: true });
      });
    },
    [editorAny, refreshSelectionBox],
  );

  const startInlineEdit = useCallback(
    (
      node: HTMLElement,
      elementId: string,
      clientX?: number,
      clientY?: number,
    ) => {
      if (!node || !elementId || !isTextNode(node)) return;

      if (editingNodeRef.current && editingNodeRef.current !== node) {
        finishInlineEdit(true);
      }

      editingNodeRef.current = node;
      originalTextRef.current = normalizeText(
        node.innerText || node.textContent || "",
      );

      node.setAttribute("contenteditable", "true");
      node.setAttribute("spellcheck", "false");
      node.setAttribute("data-visual-inline-editing", "true");
      node.classList.add("is-visual-inline-editing");
      node.style.setProperty("cursor", "text", "important");
      node.style.setProperty("user-select", "text", "important");
      node.style.setProperty("-webkit-user-select", "text", "important");

      setInlineEditingElementId(elementId);
      editorAny.setIsInlineEditing?.(true);
      editorAny.startInlineTextEdit?.(elementId);

      window.requestAnimationFrame(() => {
        placeCaretAtPoint(node, clientX, clientY);
        refreshSelectionBox({ node, commitReactState: true });
      });
    },
    [editorAny, finishInlineEdit, refreshSelectionBox],
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    applyAllVisualDataToDom(root, editorAny.data || {});
    markSelectedVisualElementInDom(
      root,
      selectedElementId,
      hoveredElementId,
    );
    syncEditorMediaPreviewsInDom(root);

    window.requestAnimationFrame(() => {
      refreshSelectionBox({ commitReactState: true });
    });
  }, [
    editorAny.data,
    editorAny.styles,
    editorAny.layouts,
    editorAny.layout,
    editorAny.responsive,
    editorAny.hidden,
    editorAny.deleted,
    selectedElementId,
    hoveredElementId,
    deviceMode,
    refreshSelectionBox,
  ]);

  useEffect(() => {
    const handleViewportChange = () => {
      if (interactionActiveRef.current) return;

      syncEditorMediaPreviewsInDom(rootRef.current);
      refreshSelectionBox({ commitReactState: true });
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(handleViewportChange)
        : null;

    if (rootRef.current) {
      observer?.observe(rootRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
      observer?.disconnect();
    };
  }, [refreshSelectionBox]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isEditMode) return;

    const handleClick = (event: MouseEvent) => {
      if (Date.now() < suppressClickUntilRef.current) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (!(event.target instanceof HTMLElement)) return;
      if (event.target.closest(EDITOR_UI_SELECTOR)) return;

      const editingNode = editingNodeRef.current;

      if (editingNode) {
        if (editingNode.contains(event.target)) {
          event.stopPropagation();
          return;
        }

        finishInlineEdit(true);
      }

      const selected = editorAny.selectNode?.(event.target);
      const node =
        selected?.node instanceof HTMLElement
          ? selected.node
          : findVisualNodeFromTarget(event.target, root);

      if (!node) return;

      selectedNodeRef.current = node;
      refreshSelectionBox({ node, commitReactState: true });

      if (event.target.closest("a")) {
        event.preventDefault();
      }
    };

    const handleDoubleClick = (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      if (event.target.closest(EDITOR_UI_SELECTOR)) return;

      const selected = editorAny.selectNode?.(event.target);
      const node =
        selected?.node instanceof HTMLElement
          ? selected.node
          : findVisualNodeFromTarget(event.target, root);

      if (!node || !isTextNode(node)) return;

      const elementId = String(selected?.id || getElementId(node)).trim();
      if (!elementId) return;

      event.preventDefault();
      event.stopPropagation();
      startInlineEdit(node, elementId, event.clientX, event.clientY);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const editingNode = editingNodeRef.current;
      if (!editingNode) return;

      if (event.key === "Escape") {
        event.preventDefault();
        finishInlineEdit(false);
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        finishInlineEdit(true);
      }
    };

    root.addEventListener("click", handleClick, true);
    root.addEventListener("dblclick", handleDoubleClick, true);
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      root.removeEventListener("click", handleClick, true);
      root.removeEventListener("dblclick", handleDoubleClick, true);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [
    editorAny,
    finishInlineEdit,
    isEditMode,
    refreshSelectionBox,
    startInlineEdit,
  ]);

  const commitLayout = useCallback(
    (elementId: string, patch: Record<string, any>) => {
      if (typeof editorAny.applyLayout === "function") {
        editorAny.applyLayout(elementId, patch);
        return;
      }

      if (typeof editorAny.updateLayout === "function") {
        editorAny.updateLayout(elementId, patch);
        return;
      }

      editorAny.applyStyle?.(elementId, patch);
    },
    [editorAny],
  );

  const startMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!isEditMode || inlineEditingElementId) return;

      const root = rootRef.current;
      const node = getSelectedNode(editorAny, root);
      const elementId = getElementId(node);

      if (!node || !elementId) return;
      if (Boolean(editorAny.locked?.[elementId])) return;

      const translate = getComputedTranslate(node);
      const geometry = getInteractionGeometry(node);
      const interactionSnapshot = prepareNodeForInteraction(node);

      selectedNodeRef.current = node;
      interactionActiveRef.current = true;
      suppressClickUntilRef.current = Date.now() + 350;
      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";

      dragSessionRef.current = {
        mode: "move",
        node,
        elementId,
        startX: event.clientX,
        startY: event.clientY,
        startWidth: geometry.width,
        startHeight: geometry.height,
        scaleX: geometry.scaleX,
        scaleY: geometry.scaleY,
        startTranslateX: translate.x,
        startTranslateY: translate.y,
        interactionSnapshot,
      };

      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
      event.stopPropagation();
    },
    [editorAny, inlineEditingElementId, isEditMode],
  );

  const startResize = useCallback(
    (
      event: React.PointerEvent<HTMLButtonElement>,
      handle: ResizeHandle,
    ) => {
      if (!isEditMode || inlineEditingElementId) return;

      const root = rootRef.current;
      const node = getSelectedNode(editorAny, root);
      const elementId = getElementId(node);

      if (!node || !elementId) return;
      if (Boolean(editorAny.locked?.[elementId])) return;

      const translate = getComputedTranslate(node);
      const geometry = getInteractionGeometry(node);
      const interactionSnapshot = prepareNodeForInteraction(node);

      selectedNodeRef.current = node;
      interactionActiveRef.current = true;
      suppressClickUntilRef.current = Date.now() + 350;
      document.body.style.userSelect = "none";
      document.body.style.cursor = getResizeCursor(handle);

      dragSessionRef.current = {
        mode: "resize",
        handle,
        node,
        elementId,
        startX: event.clientX,
        startY: event.clientY,
        startWidth: geometry.width,
        startHeight: geometry.height,
        scaleX: geometry.scaleX,
        scaleY: geometry.scaleY,
        startTranslateX: translate.x,
        startTranslateY: translate.y,
        interactionSnapshot,
      };

      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
      event.stopPropagation();
    },
    [editorAny, inlineEditingElementId, isEditMode],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      const session = dragSessionRef.current;
      if (!session) return;

      const deltaX =
        (event.clientX - session.startX) /
        Math.max(session.scaleX, 0.0001);
      const deltaY =
        (event.clientY - session.startY) /
        Math.max(session.scaleY, 0.0001);

      window.cancelAnimationFrame(animationFrameRef.current);

      animationFrameRef.current = window.requestAnimationFrame(() => {
        if (session.mode === "move") {
          const translateX = session.startTranslateX + deltaX;
          const translateY = session.startTranslateY + deltaY;

          applyLiveTranslate(session.node, translateX, translateY);
          syncEditorMediaPreviewForTarget(session.node);
          refreshSelectionBox({
            node: session.node,
            commitReactState: false,
          });
          return;
        }

        const handle = session.handle;
        if (!handle) return;

        const minimum = getMinimumElementSize(session.node);
        let width = session.startWidth;
        let height = session.startHeight;
        let translateX = session.startTranslateX;
        let translateY = session.startTranslateY;

        if (handle.includes("e")) {
          width = Math.max(minimum.width, session.startWidth + deltaX);
        }

        if (handle.includes("s")) {
          height = Math.max(minimum.height, session.startHeight + deltaY);
        }

        if (handle.includes("w")) {
          width = Math.max(minimum.width, session.startWidth - deltaX);
          translateX += session.startWidth - width;
        }

        if (handle.includes("n")) {
          height = Math.max(minimum.height, session.startHeight - deltaY);
          translateY += session.startHeight - height;
        }

        if (handle === "e" || handle === "w") {
          height = session.startHeight;
        }

        if (handle === "n" || handle === "s") {
          width = session.startWidth;
        }

        applyLiveSize(session.node, width, height);
        applyLiveTranslate(session.node, translateX, translateY);
        sizeMediaChildren(session.node);
        syncEditorMediaPreviewForTarget(session.node);

        refreshSelectionBox({
          node: session.node,
          commitReactState: false,
        });
      });

      event.preventDefault();
      event.stopPropagation();
    },
    [refreshSelectionBox],
  );

  const finishDrag = useCallback(
    (event: React.PointerEvent) => {
      const session = dragSessionRef.current;
      if (!session) return;

      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;

      const translate = getComputedTranslate(session.node);

      suppressClickUntilRef.current = Date.now() + 350;

      if (session.mode === "move") {
        commitLayout(session.elementId, {
          position: getStablePosition(session.node),
          translateX: translate.x,
          translateY: translate.y,
          x: translate.x,
          y: translate.y,
        });
      } else {
        const width =
          parseCssLength(session.node.style.getPropertyValue("width")) ||
          getInteractionGeometry(session.node).width;
        const height =
          parseCssLength(session.node.style.getPropertyValue("height")) ||
          getInteractionGeometry(session.node).height;

        commitLayout(session.elementId, {
          position: getStablePosition(session.node),
          width: `${Math.round(width)}px`,
          height: `${Math.round(height)}px`,
          minWidth: "24px",
          minHeight: "24px",
          maxWidth: "none",
          maxHeight: "none",
          aspectRatio: "auto",
          translateX: translate.x,
          translateY: translate.y,
          x: translate.x,
          y: translate.y,
        });
      }

      syncEditorMediaPreviewForTarget(session.node);
      restoreNodeAfterInteraction(
        session.node,
        session.interactionSnapshot,
      );

      interactionActiveRef.current = false;
      dragSessionRef.current = null;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";

      try {
        (event.currentTarget as HTMLElement).releasePointerCapture(
          event.pointerId,
        );
      } catch {
        // Pointer capture may already be released by the browser.
      }

      refreshSelectionBox({
        node: session.node,
        commitReactState: true,
      });

      event.preventDefault();
      event.stopPropagation();
    },
    [commitLayout, refreshSelectionBox],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isEditMode) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || inlineEditingElementId) return;
      if (!(event.target instanceof HTMLElement)) return;
      if (event.target.closest(EDITOR_UI_SELECTOR)) return;
      if (event.target.closest('[contenteditable="true"]')) return;

      const selected = editorAny.selectNode?.(event.target);
      const node =
        selected?.node instanceof HTMLElement
          ? selected.node
          : findVisualNodeFromTarget(event.target, root);
      const elementId = String(selected?.id || getElementId(node)).trim();

      if (!node || !elementId || Boolean(editorAny.locked?.[elementId])) {
        return;
      }

      selectedNodeRef.current = node;
      refreshSelectionBox({ node, commitReactState: true });

      if (getElementType(node) === "section") return;

      const translate = getComputedTranslate(node);
      const geometry = getInteractionGeometry(node);
      const interactionSnapshot = prepareNodeForInteraction(node);

      directDragSessionRef.current = {
        node,
        elementId,
        startX: event.clientX,
        startY: event.clientY,
        startTranslateX: translate.x,
        startTranslateY: translate.y,
        scaleX: geometry.scaleX,
        scaleY: geometry.scaleY,
        started: false,
        interactionSnapshot,
      };
    };

    const handlePointerMove = (event: PointerEvent) => {
      const session = directDragSessionRef.current;
      if (!session) return;

      const viewportDeltaX = event.clientX - session.startX;
      const viewportDeltaY = event.clientY - session.startY;

      if (
        !session.started &&
        Math.hypot(viewportDeltaX, viewportDeltaY) < 4
      ) {
        return;
      }

      session.started = true;
      interactionActiveRef.current = true;
      pendingDirectPointRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      event.preventDefault();
      event.stopPropagation();

      if (!directAnimationFrameRef.current) {
        directAnimationFrameRef.current = window.requestAnimationFrame(() => {
          directAnimationFrameRef.current = 0;

          const activeSession = directDragSessionRef.current;
          const point = pendingDirectPointRef.current;

          if (!activeSession || !point) return;

          const deltaX =
            (point.x - activeSession.startX) /
            Math.max(activeSession.scaleX, 0.0001);
          const deltaY =
            (point.y - activeSession.startY) /
            Math.max(activeSession.scaleY, 0.0001);

          const translateX = activeSession.startTranslateX + deltaX;
          const translateY = activeSession.startTranslateY + deltaY;

          applyLiveTranslate(activeSession.node, translateX, translateY);
          syncEditorMediaPreviewForTarget(activeSession.node);
          refreshSelectionBox({
            node: activeSession.node,
            commitReactState: false,
          });
        });
      }

      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    };

    const handlePointerUp = (event: PointerEvent) => {
      const session = directDragSessionRef.current;
      if (!session) return;

      directDragSessionRef.current = null;
      window.cancelAnimationFrame(directAnimationFrameRef.current);
      directAnimationFrameRef.current = 0;
      pendingDirectPointRef.current = null;

      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      if (!session.started) {
        restoreNodeAfterInteraction(
          session.node,
          session.interactionSnapshot,
        );
        interactionActiveRef.current = false;
        return;
      }

      const deltaX =
        (event.clientX - session.startX) /
        Math.max(session.scaleX, 0.0001);
      const deltaY =
        (event.clientY - session.startY) /
        Math.max(session.scaleY, 0.0001);
      const finalX = session.startTranslateX + deltaX;
      const finalY = session.startTranslateY + deltaY;

      applyLiveTranslate(session.node, finalX, finalY);
      syncEditorMediaPreviewForTarget(session.node);

      commitLayout(session.elementId, {
        position: getStablePosition(session.node),
        translateX: finalX,
        translateY: finalY,
        x: finalX,
        y: finalY,
      });

      restoreNodeAfterInteraction(
        session.node,
        session.interactionSnapshot,
      );

      suppressClickUntilRef.current = Date.now() + 350;
      interactionActiveRef.current = false;
      refreshSelectionBox({
        node: session.node,
        commitReactState: true,
      });

      event.preventDefault();
      event.stopPropagation();
    };

    root.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("pointermove", handlePointerMove, {
      capture: true,
      passive: false,
    });
    window.addEventListener("pointerup", handlePointerUp, true);
    window.addEventListener("pointercancel", handlePointerUp, true);

    return () => {
      const session = directDragSessionRef.current;

      if (session) {
        restoreNodeAfterInteraction(
          session.node,
          session.interactionSnapshot,
        );
      }

      window.cancelAnimationFrame(directAnimationFrameRef.current);
      root.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("pointermove", handlePointerMove, true);
      window.removeEventListener("pointerup", handlePointerUp, true);
      window.removeEventListener("pointercancel", handlePointerUp, true);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      interactionActiveRef.current = false;
      directDragSessionRef.current = null;
    };
  }, [
    commitLayout,
    editorAny,
    inlineEditingElementId,
    isEditMode,
    refreshSelectionBox,
  ]);

  useEffect(() => {
    return () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.cancelAnimationFrame(directAnimationFrameRef.current);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);

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

  const showResizeHandles =
    Boolean(selectionBox) && isEditMode && !inlineEditingElementId;

  return (
    <div
      className={[
        "visual-editor-scroll-area h-full overflow-y-auto overflow-x-hidden bg-slate-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseMove={(event) => {
        if (interactionActiveRef.current) return;
        editorAny.handleCanvasMouseMove?.(event);
      }}
      onMouseLeave={editorAny.handleCanvasMouseLeave}
      onContextMenu={editorAny.handleCanvasContextMenu}
    >
      <style>{runtimeCss}</style>

      {selectionBox ? (
        <div
          ref={selectionOverlayRef}
          data-visual-selection-box="true"
          style={{
            position: "fixed",
            top: selectionBox.top,
            left: selectionBox.left,
            width: selectionBox.width,
            height: selectionBox.height,
            zIndex: 2147482000,
            pointerEvents: "none",
            border: "2px solid #7c3aed",
            borderRadius: 10,
            boxShadow: "0 0 0 5px rgba(124,58,237,0.12)",
            transition: "none",
          }}
        >
          {selectionBox.label ? (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: -30,
                height: 24,
                maxWidth: 220,
                padding: "0 9px",
                display: "flex",
                alignItems: "center",
                borderRadius: 8,
                background: "#7c3aed",
                color: "#fff",
                fontSize: 11,
                fontWeight: 900,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                pointerEvents: "none",
              }}
            >
              {selectionBox.label}
            </div>
          ) : null}

          {!inlineEditingElementId ? (
            <button
              type="button"
              data-visual-drag-handle="true"
              aria-label="גרירת אלמנט"
              title="גרירת אלמנט"
              onPointerDown={startMove}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
              style={{
                position: "absolute",
                left: -1,
                top: -32,
                width: 28,
                height: 26,
                padding: 0,
                border: "2px solid #7c3aed",
                borderRadius: 8,
                background: "#ffffff",
                color: "#7c3aed",
                fontSize: 16,
                fontWeight: 900,
                lineHeight: "20px",
                cursor: "grab",
                pointerEvents: "auto",
                touchAction: "none",
                boxShadow: "0 4px 12px rgba(15,23,42,0.14)",
              }}
            >
              ✥
            </button>
          ) : null}

          {showResizeHandles
            ? HANDLE_POSITIONS.map(({ handle, style }) => (
                <button
                  key={handle}
                  type="button"
                  data-visual-resize-handle="true"
                  aria-label={`resize-${handle}`}
                  onPointerDown={(event) => startResize(event, handle)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={finishDrag}
                  onPointerCancel={finishDrag}
                  style={{
                    position: "absolute",
                    width: 12,
                    height: 12,
                    padding: 0,
                    borderRadius: 999,
                    border: "2px solid #7c3aed",
                    background: "#fff",
                    cursor: getResizeCursor(handle),
                    pointerEvents: "auto",
                    touchAction: "none",
                    ...style,
                  }}
                />
              ))
            : null}
        </div>
      ) : null}

      <style>
        {`
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-visual-edit-id] {
            cursor: pointer;
          }

          [data-visual-template-canvas="true"] img,
          [data-visual-template-canvas="true"] video {
            background-color: transparent !important;
          }

          [data-visual-template-canvas="true"] [data-bizuply-editor-media-preview="true"] {
            transition: none !important;
            animation: none !important;
            pointer-events: none !important;
            background-color: transparent !important;
          }

          [data-visual-template-canvas="true"] [data-visual-inline-editing="true"],
          [data-visual-template-canvas="true"] [contenteditable="true"] {
            cursor: text !important;
            user-select: text !important;
            -webkit-user-select: text !important;
            caret-color: #7c3aed !important;
            outline: 2px solid #7c3aed !important;
            outline-offset: 4px !important;
            white-space: pre-wrap !important;
          }

          [data-visual-template-canvas="true"] [data-visual-inline-editing="true"] *,
          [data-visual-template-canvas="true"] [contenteditable="true"] * {
            user-select: text !important;
            -webkit-user-select: text !important;
          }

          [data-visual-template-canvas="true"] [contenteditable="true"]::selection,
          [data-visual-template-canvas="true"] [contenteditable="true"] *::selection {
            background: rgba(37, 99, 235, 0.82) !important;
            color: #ffffff !important;
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
            width: getDeviceWidth(deviceMode),
            maxWidth: getDeviceMaxWidth(deviceMode),
          }}
        >
          <div
            ref={rootRef}
            data-visual-template-canvas="true"
            data-visual-device={deviceMode}
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
              viewMode={isPreviewMode ? "preview" : "edit"}
              runtimeMode={isPreviewMode ? "preview" : "edit"}
              businessId={editorAny.businessId}
              activePageId={
                editorAny.activePageId ||
                editorAny.activePageID ||
                "home"
              }
              currentPageId={
                editorAny.activePageId ||
                editorAny.activePageID ||
                "home"
              }
              initialPage={
                editorAny.activePageId ||
                editorAny.activePageID ||
                "home"
              }
              initialPageId={
                editorAny.activePageId ||
                editorAny.activePageID ||
                "home"
              }
              isStudioStatic={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
