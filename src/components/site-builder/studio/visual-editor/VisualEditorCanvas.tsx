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

type SelectionBox = {
  top: number;
  left: number;
  width: number;
  height: number;
  label?: string;
};

const VISUAL_CONTENT_KEY = "__content";
const DEBUG_VISUAL_CANVAS = false;

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
  "em",
  "b",
  "i",
].join(",");

const TEXT_TAGS = [
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
];

function canvasDebug(label: string, payload?: any) {
  if (!DEBUG_VISUAL_CANVAS) return;

  console.log(
    `%c[Visual Canvas] ${label}`,
    "background:#111827;color:#fff;padding:3px 7px;border-radius:7px;font-weight:900;",
    payload,
  );
}

function debugNode(node: HTMLElement | null) {
  if (!node) return null;

  return {
    tag: String(node.tagName || "").toLowerCase(),
    text: String(node.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 100),
    id: node.getAttribute("data-visual-edit-id"),
    type: node.getAttribute("data-visual-edit-type"),
    visualType: node.getAttribute("data-visual-type"),
    label: node.getAttribute("data-visual-edit-label"),
    editable: node.getAttribute("data-visual-editable"),
    selected: node.getAttribute("data-visual-selected"),
    editSelected: node.getAttribute("data-visual-edit-selected"),
    dataSelected: node.getAttribute("data-selected"),
    inlineEditing: node.getAttribute("data-visual-inline-editing"),
    className: node.className,
    node,
  };
}

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
      "em",
      "b",
      "i",
      "[data-image-field]",
      "[data-edit-type='image']",
      "[data-visual-image-field]",
      "[data-visual-editable='true'][data-visual-edit-id]",
      "[data-visual-edit-id]",
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

  if (TEXT_TAGS.includes(tagName)) {
    return "text";
  }

  return "section";
}

function isTextDomNode(node: HTMLElement | null) {
  if (!node) return false;

  const tagName = String(node.tagName || "").toLowerCase();
  const type = getVisualElementType(node);

  return type === "text" || TEXT_TAGS.includes(tagName);
}

function getTextRangeRect(node: HTMLElement) {
  if (!isTextDomNode(node)) return node.getBoundingClientRect();

  const text = String(node.textContent || "").trim();

  if (!text) return node.getBoundingClientRect();

  const range = document.createRange();

  try {
    range.selectNodeContents(node);

    const rects = Array.from(range.getClientRects()).filter(
      (rect) => rect.width > 0 && rect.height > 0,
    );

    if (!rects.length) return node.getBoundingClientRect();

    const top = Math.min(...rects.map((rect) => rect.top));
    const left = Math.min(...rects.map((rect) => rect.left));
    const right = Math.max(...rects.map((rect) => rect.right));
    const bottom = Math.max(...rects.map((rect) => rect.bottom));

    return {
      top,
      left,
      right,
      bottom,
      width: right - left,
      height: bottom - top,
      x: left,
      y: top,
      toJSON: () => ({}),
    } as DOMRect;
  } catch {
    return node.getBoundingClientRect();
  } finally {
    range.detach();
  }
}

function getVisualSelectionRect(node: HTMLElement) {
  if (isTextDomNode(node)) {
    return getTextRangeRect(node);
  }

  return node.getBoundingClientRect();
}

function isContainerVisualType(node: HTMLElement | null) {
  if (!node) return false;

  const type = getVisualElementType(node);

  return type === "section" || type === "box" || type === "container";
}

function findMostSpecificVisualNode(
  root: HTMLElement,
  target: HTMLElement,
  clientX?: number,
  clientY?: number,
) {
  const elementsAtPoint =
    typeof clientX === "number" && typeof clientY === "number"
      ? document.elementsFromPoint(clientX, clientY)
      : [];

  const pointCandidate = elementsAtPoint.find((element) => {
    if (!(element instanceof HTMLElement) || !root.contains(element)) {
      return false;
    }

    if (element === root || element.closest("[data-visual-selection-box='true']")) {
      return false;
    }

    const type = getVisualElementType(element);
    const tagName = String(element.tagName || "").toLowerCase();

    return (
      type === "text" ||
      type === "image" ||
      type === "video" ||
      type === "button" ||
      TEXT_TAGS.includes(tagName) ||
      ["img", "video", "a", "button", "input", "textarea", "select"].includes(
        tagName,
      )
    );
  });

  if (pointCandidate instanceof HTMLElement) {
    const visualPointCandidate =
      pointCandidate.closest<HTMLElement>(
        "[data-visual-edit-id][data-visual-edit-type='text'], [data-visual-edit-id][data-visual-edit-type='image'], [data-visual-edit-id][data-visual-edit-type='video'], [data-visual-edit-id][data-visual-edit-type='button']",
      ) || pointCandidate;

    if (root.contains(visualPointCandidate)) {
      return visualPointCandidate;
    }
  }

  const directPriority = target.closest<HTMLElement>(
    [
      "[data-visual-edit-id][data-visual-edit-type='text']",
      "[data-visual-edit-id][data-visual-edit-type='image']",
      "[data-visual-edit-id][data-visual-edit-type='video']",
      "[data-visual-edit-id][data-visual-edit-type='button']",
      "[data-gjs-type='text']",
      "[data-editable='text']",
      "[data-editable='image']",
      "[data-editable='button']",
      "[data-editable-link='true']",
      "img",
      "video",
      "a",
      "button",
      "input",
      "textarea",
      "select",
    ].join(","),
  );

  if (directPriority && root.contains(directPriority)) {
    return directPriority;
  }

  const textNode = target.closest<HTMLElement>(TEXT_SELECTOR);

  if (textNode && root.contains(textNode)) {
    return textNode;
  }

  return null;
}

function normalizeNodeForVisualSelection(
  root: HTMLElement,
  target: HTMLElement,
  fallbackNode: HTMLElement | null,
  clientX?: number,
  clientY?: number,
) {
  const specificNode = findMostSpecificVisualNode(root, target, clientX, clientY);

  if (specificNode && root.contains(specificNode)) {
    return specificNode;
  }

  if (fallbackNode && root.contains(fallbackNode) && !isContainerVisualType(fallbackNode)) {
    return fallbackNode;
  }

  const closestVisual = target.closest<HTMLElement>("[data-visual-edit-id]");

  if (closestVisual && root.contains(closestVisual)) {
    return closestVisual;
  }

  return fallbackNode && root.contains(fallbackNode) ? fallbackNode : null;
}

function findInlineEditableTextNode(node: HTMLElement | null) {
  if (!node) return null;

  const textNode = node.closest<HTMLElement>(TEXT_SELECTOR);

  if (textNode) {
    return textNode;
  }

  const visualNode = node.closest<HTMLElement>("[data-visual-edit-id]");

  if (!visualNode) return null;

  if (getVisualElementType(visualNode) === "text") {
    return visualNode;
  }

  return null;
}

function findBestDomNodeForSelection(
  root: HTMLElement,
  target: HTMLElement,
  fallbackNode: HTMLElement | null,
) {
  const textNode = target.closest<HTMLElement>(TEXT_SELECTOR);

  if (textNode && root.contains(textNode)) {
    return textNode;
  }

  const mediaOrControlNode = target.closest<HTMLElement>(
    [
      "img",
      "video",
      "source",
      "a",
      "button",
      "input",
      "textarea",
      "select",
      "[data-image-field]",
      "[data-edit-type='image']",
      "[data-visual-image-field]",
    ].join(","),
  );

  if (mediaOrControlNode && root.contains(mediaOrControlNode)) {
    return mediaOrControlNode;
  }

  const directVisualNode = target.closest<HTMLElement>(
    "[data-visual-edit-id], [data-visual-editable='true']",
  );

  if (directVisualNode && root.contains(directVisualNode)) {
    return directVisualNode;
  }

  if (fallbackNode && root.contains(fallbackNode)) {
    return fallbackNode;
  }

  return null;
}

function placeCaretAtPoint(
  node: HTMLElement,
  clientX?: number,
  clientY?: number,
) {
  node.focus({
    preventScroll: true,
  });

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

function clearDomVisualSelection(root: HTMLElement) {
  root
    .querySelectorAll<HTMLElement>(
      [
        "[data-visual-selected]",
        "[data-visual-edit-selected]",
        "[data-selected]",
        "[data-visual-active]",
        ".visual-selected",
        ".visual-edit-selected",
        ".is-visual-selected",
        ".is-selected",
      ].join(","),
    )
    .forEach((item) => {
      item.removeAttribute("data-visual-selected");
      item.removeAttribute("data-visual-edit-selected");
      item.removeAttribute("data-selected");
      item.removeAttribute("data-visual-active");

      item.classList.remove(
        "visual-selected",
        "visual-edit-selected",
        "is-visual-selected",
        "is-selected",
      );
    });
}

function markDomNodeSelected(root: HTMLElement, node: HTMLElement | null) {
  if (!node || !root.contains(node)) return;

  clearDomVisualSelection(root);

  node.setAttribute("data-visual-selected", "true");
  node.setAttribute("data-visual-edit-selected", "true");
  node.setAttribute("data-selected", "true");
  node.setAttribute("data-visual-active", "true");

  node.classList.add(
    "visual-selected",
    "visual-edit-selected",
    "is-visual-selected",
    "is-selected",
  );

  canvasDebug("direct DOM selected applied", {
    selectedNode: debugNode(node),
  });
}

function forceMarkDomSelected(root: HTMLElement, elementId: string) {
  if (!elementId) return;

  const safeElementId =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(elementId)
      : elementId.replace(/"/g, '\\"');

  const selectedNode = root.querySelector<HTMLElement>(
    `[data-visual-edit-id="${safeElementId}"]`,
  );

  if (!selectedNode) {
    canvasDebug("force selected failed - node not found", {
      elementId,
    });
    return;
  }

  markDomNodeSelected(root, selectedNode);

  canvasDebug("force selected applied", {
    elementId,
    selectedNode: debugNode(selectedNode),
  });
}

function buildSelectedElementFromNode(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  const id = getVisualElementId(node);
  const type = getVisualElementType(node);

  return {
    id,
    type,
    elementId: id,
    elementType: type,
    label:
      node.getAttribute("data-visual-edit-label") ||
      String(node.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40) ||
      node.tagName.toLowerCase(),
    text: isTextDomNode(node)
      ? String(node.textContent || "").replace(/\s+/g, " ").trim()
      : undefined,
    node,
    element: node,
    domNode: node,
    rect: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      right: rect.right,
      bottom: rect.bottom,
    },
  };
}

function selectNodeInEditorState(editorAny: any, node: HTMLElement | null) {
  if (!node) return null;

  const selected = buildSelectedElementFromNode(node);

  if (!selected.id) {
    canvasDebug("manual editor selection skipped - missing id", {
      selected,
      node: debugNode(node),
    });

    return null;
  }

  try {
    editorAny.selectNode?.(node);
  } catch (error) {
    canvasDebug("manual selectNode failed", { error });
  }

  try {
    editorAny.setSelectedElement?.(selected);
  } catch (error) {
    canvasDebug("manual setSelectedElement failed", { error });
  }

  return selected;
}

function writeTextToEditorData(
  editorAny: any,
  elementId: string,
  newText: string,
) {
  if (!elementId) return;

  const text = normalizeEditedText(newText);

  canvasDebug("write text requested", {
    elementId,
    text,
    currentDataKeys: Object.keys(editorAny.data || {}),
    currentContentKeys: Object.keys((editorAny.data || {}).__content || {}),
  });

  const dedicatedCalls = [
    {
      name: "updateInlineText",
      call: () => editorAny.updateInlineText?.(elementId, text),
    },
    {
      name: "updateElementText",
      call: () => editorAny.updateElementText?.(elementId, text),
    },
    {
      name: "updateElementContent",
      call: () => editorAny.updateElementContent?.(elementId, text),
    },
    {
      name: "updateText",
      call: () => editorAny.updateText?.(elementId, text),
    },
    {
      name: "updateVisualContent",
      call: () => editorAny.updateVisualContent?.(elementId, { text }),
    },
    {
      name: "setVisualContent",
      call: () => editorAny.setVisualContent?.(elementId, { text }),
    },
  ];

  for (const item of dedicatedCalls) {
    try {
      const result = item.call();

      canvasDebug(`write text call result: ${item.name}`, {
        result,
      });

      if (result !== undefined) {
        return;
      }
    } catch (error) {
      canvasDebug(`write text call failed: ${item.name}`, {
        error,
      });
    }
  }

  if (typeof editorAny.setData === "function") {
    canvasDebug("write text fallback: setData", {
      elementId,
      text,
    });

    editorAny.setData((current: Record<string, any>) =>
      buildNextDataWithText(current || {}, elementId, text),
    );
    return;
  }

  if (typeof editorAny.setTemplateData === "function") {
    canvasDebug("write text fallback: setTemplateData", {
      elementId,
      text,
    });

    editorAny.setTemplateData((current: Record<string, any>) =>
      buildNextDataWithText(current || {}, elementId, text),
    );
    return;
  }

  if (typeof editorAny.updateData === "function") {
    try {
      canvasDebug("write text fallback: updateData function", {
        elementId,
        text,
      });

      editorAny.updateData((current: Record<string, any>) =>
        buildNextDataWithText(current || {}, elementId, text),
      );
      return;
    } catch (error) {
      canvasDebug("write text updateData function failed", {
        error,
      });

      try {
        editorAny.updateData(
          buildNextDataWithText(editorAny.data || {}, elementId, text),
        );
        return;
      } catch (error2) {
        canvasDebug("write text updateData object failed", {
          error: error2,
        });
      }
    }
  }

  if (editorAny.data && typeof editorAny.data === "object") {
    canvasDebug("write text last fallback: Object.assign editorAny.data", {
      elementId,
      text,
    });

    const nextData = buildNextDataWithText(
      editorAny.data || {},
      elementId,
      text,
    );

    Object.assign(editorAny.data, nextData);
  }
}

function clearNativeTextSelection() {
  const selection = window.getSelection();
  selection?.removeAllRanges();
}

function selectionBelongsToNode(
  selection: Selection | null,
  node: HTMLElement | null,
) {
  if (!selection || !node || selection.rangeCount === 0) return false;

  const anchorNode = selection.anchorNode;
  const focusNode = selection.focusNode;

  return Boolean(
    (anchorNode && (anchorNode === node || node.contains(anchorNode))) ||
      (focusNode && (focusNode === node || node.contains(focusNode))),
  );
}

function hasExpandedTextSelection(node: HTMLElement | null) {
  if (!node) return false;

  const selection = window.getSelection();

  return Boolean(
    selection &&
      !selection.isCollapsed &&
      selection.toString().length > 0 &&
      selectionBelongsToNode(selection, node),
  );
}

function focusEditableNodeWithoutMovingSelection(node: HTMLElement) {
  const selection = window.getSelection();
  const shouldRestoreSelection =
    selectionBelongsToNode(selection, node) && selection?.rangeCount;

  const savedRanges: Range[] = [];

  if (shouldRestoreSelection && selection) {
    for (let index = 0; index < selection.rangeCount; index += 1) {
      savedRanges.push(selection.getRangeAt(index).cloneRange());
    }
  }

  node.focus({
    preventScroll: true,
  });

  if (!selection || !savedRanges.length) return;

  selection.removeAllRanges();

  savedRanges.forEach((range) => {
    selection.addRange(range);
  });
}

export default function VisualEditorCanvas({
  editor,
  className = "",
}: VisualEditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const editingNodeRef = useRef<HTMLElement | null>(null);
  const editingOriginalTextRef = useRef("");
  const lastClickedVisualNodeRef = useRef<HTMLElement | null>(null);

  const [inlineEditingElementId, setInlineEditingElementId] = useState("");
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);

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

  const updateSelectionBoxFromNode = React.useCallback(
    (node: HTMLElement | null) => {
      if (!node || !document.body.contains(node)) {
        setSelectionBox(null);
        return;
      }

      const rect = getVisualSelectionRect(node);

      if (!rect.width || !rect.height) {
        setSelectionBox(null);
        return;
      }

      setSelectionBox({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        label:
          node.getAttribute("data-visual-edit-label") ||
          node.getAttribute("data-visual-edit-type") ||
          node.tagName.toLowerCase(),
      });
    },
    [],
  );

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
    if (!isEditMode) {
      setSelectionBox(null);
      return;
    }

    function refreshBox() {
      updateSelectionBoxFromNode(lastClickedVisualNodeRef.current);
    }

    window.addEventListener("scroll", refreshBox, true);
    window.addEventListener("resize", refreshBox);

    return () => {
      window.removeEventListener("scroll", refreshBox, true);
      window.removeEventListener("resize", refreshBox);
    };
  }, [isEditMode, updateSelectionBoxFromNode]);

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

    if (selectedElementId) {
      forceMarkDomSelected(root, selectedElementId);
    }

    if (lastClickedVisualNodeRef.current) {
      markDomNodeSelected(root, lastClickedVisualNodeRef.current);
      updateSelectionBoxFromNode(lastClickedVisualNodeRef.current);
    }

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
    updateSelectionBoxFromNode,
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

    node.classList.remove("is-visual-inline-editing");

    node.style.userSelect = "";
    node.style.webkitUserSelect = "";
    node.style.cursor = "";

    clearNativeTextSelection();

    editingNodeRef.current = null;
    editingOriginalTextRef.current = "";
    lastClickedVisualNodeRef.current = null;
    setInlineEditingElementId("");
    setSelectionBox(null);

    editorAny.setIsInlineEditing?.(false);
    editorAny.finishInlineTextEdit?.();
  }, [isEditMode, editorAny]);

  useEffect(() => {
    const root = canvasRef.current;
    if (!root) return;

    function applyManualSelection(node: HTMLElement | null) {
      if (!node) return;

      markDomNodeSelected(root, node);
      updateSelectionBoxFromNode(node);
      selectNodeInEditorState(editorAny, node);
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

      node.classList.remove("is-visual-inline-editing");

      node.style.userSelect = "";
      node.style.webkitUserSelect = "";
      node.style.cursor = "";

      clearNativeTextSelection();

      editingNodeRef.current = null;
      editingOriginalTextRef.current = "";
      setInlineEditingElementId("");

      editorAny.setIsInlineEditing?.(false);
      editorAny.finishInlineTextEdit?.(elementId, newText);

      if (lastClickedVisualNodeRef.current) {
        applyManualSelection(lastClickedVisualNodeRef.current);
      } else if (elementId) {
        forceMarkDomSelected(root, elementId);
      }
    }

    function startInlineEdit(
      node: HTMLElement,
      elementId: string,
      clientX?: number,
      clientY?: number,
    ) {
      if (!node || !elementId) return;

      const currentEditingNode = editingNodeRef.current;

      if (currentEditingNode === node && node.isContentEditable) {
        focusEditableNodeWithoutMovingSelection(node);

        if (!hasExpandedTextSelection(node)) {
          placeCaretAtPoint(node, clientX, clientY);
        }

        updateSelectionBoxFromNode(node);
        return;
      }

      if (currentEditingNode && currentEditingNode !== node) {
        finishInlineEdit(true);
      }

      editingNodeRef.current = node;
      editingOriginalTextRef.current = normalizeEditedText(
        node.innerText || node.textContent || "",
      );
      lastClickedVisualNodeRef.current = node;

      node.setAttribute("contenteditable", "true");
      node.setAttribute("spellcheck", "false");
      node.setAttribute("data-visual-inline-editing", "true");

      node.classList.add("is-visual-inline-editing");

      node.style.cursor = "text";
      node.style.userSelect = "text";
      node.style.webkitUserSelect = "text";

      root.style.userSelect = "text";
      root.style.webkitUserSelect = "text";

      setInlineEditingElementId(elementId);
      editorAny.setIsInlineEditing?.(true);
      editorAny.startInlineTextEdit?.(elementId);

      applyManualSelection(node);

      window.requestAnimationFrame(() => {
        placeCaretAtPoint(node, clientX, clientY);
        updateSelectionBoxFromNode(node);
      });
    }

    function handleInlinePointerEvent(event: Event) {
      if (!isEditMode) return;

      const editingNode = editingNodeRef.current;
      const target = event.target;

      if (
        !editingNode ||
        !(target instanceof Node) ||
        !editingNode.contains(target)
      ) {
        return;
      }

      /*
       * אסור לבצע preventDefault כאן.
       * ברירת המחדל של הדפדפן היא זו שמאפשרת גרירה וסימון טבעי
       * של אות, מילה או משפט בתוך contentEditable.
       */
      event.stopPropagation();
    }

    function handleClick(event: MouseEvent) {
      if (!isEditMode) return;

      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const editingNode = editingNodeRef.current;

      if (editingNode) {
        if (editingNode.contains(target)) {
          /*
           * בעבר placeCaretAtPoint הופעל כאן אחרי mouseup/click.
           * בזמן סימון טקסט בגרירה, ה-click הגיע אחרי הסימון והחזיר
           * את הבחירה לסמן יחיד — ולכן ההדגשה נעלמה מיד.
           *
           * עכשיו נותנים לדפדפן לשמור את ה-Selection הטבעי שלו.
           */
          event.stopPropagation();
          focusEditableNodeWithoutMovingSelection(editingNode);
          updateSelectionBoxFromNode(editingNode);
          return;
        }

        finishInlineEdit(true);
      }

      const node = findClickableVisualNode(target);
      const selectedNode = normalizeNodeForVisualSelection(
        root,
        target,
        node,
        event.clientX,
        event.clientY,
      );

      if (!node || !root.contains(node) || !selectedNode) return;
      const elementId =
        getVisualElementId(selectedNode) || getVisualElementId(node);
      const elementType =
        getVisualElementType(selectedNode) || getVisualElementType(node);

      lastClickedVisualNodeRef.current = selectedNode;
      applyManualSelection(selectedNode);

      if (isTextDomNode(selectedNode) && elementType !== "button" && elementId) {
        event.stopPropagation();
        startInlineEdit(selectedNode, elementId, event.clientX, event.clientY);
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      window.setTimeout(() => {
        if (lastClickedVisualNodeRef.current) {
          applyManualSelection(lastClickedVisualNodeRef.current);
        }
      }, 0);

      window.setTimeout(() => {
        if (lastClickedVisualNodeRef.current) {
          applyManualSelection(lastClickedVisualNodeRef.current);
        }
      }, 80);
    }

    function handleDoubleClick(event: MouseEvent) {
      if (!isEditMode) return;

      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const editingNode = editingNodeRef.current;

      if (editingNode && editingNode.contains(target)) {
        /*
         * לא מבטלים dblclick בזמן עריכת טקסט:
         * הדפדפן צריך לבחור את המילה כמו ב-Canva.
         */
        event.stopPropagation();
        focusEditableNodeWithoutMovingSelection(editingNode);
        updateSelectionBoxFromNode(editingNode);
        return;
      }

      const node = findClickableVisualNode(target);
      const selectedNode = normalizeNodeForVisualSelection(
        root,
        target,
        node,
        event.clientX,
        event.clientY,
      );

      if (!node || !selectedNode || !root.contains(node)) return;

      event.preventDefault();
      event.stopPropagation();

      const elementId =
        getVisualElementId(selectedNode) || getVisualElementId(node);
      const elementType =
        getVisualElementType(selectedNode) || getVisualElementType(node);

      lastClickedVisualNodeRef.current = selectedNode;
      applyManualSelection(selectedNode);

      if (!elementId) return;

      if (elementType === "image") {
        editorAny.openMediaPicker?.(elementId);
        return;
      }

      if (elementType === "button") {
        editorAny.openLinkSettings?.(elementId);
        return;
      }

      const textNode =
        selectedNode && isTextDomNode(selectedNode)
          ? selectedNode
          : findInlineEditableTextNode(node);

      if (!textNode) return;

      startInlineEdit(
        textNode,
        getVisualElementId(textNode) || elementId,
        event.clientX,
        event.clientY,
      );
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
      const activeElement = document.activeElement;

      const eventIsInsideEditingNode =
        target instanceof Node && editingNode.contains(target);

      const focusIsInsideEditingNode =
        activeElement instanceof Node && editingNode.contains(activeElement);

      if (!eventIsInsideEditingNode && !focusIsInsideEditingNode) {
        return;
      }

      /*
       * מונע מקיצורי המקלדת של העורך למחוק את כל האלמנט,
       * אבל לא מפעיל preventDefault על Delete/Backspace.
       * כך הדפדפן מוחק רק את הטקסט שסומן.
       */
      event.stopPropagation();

      if (event.key === "Escape") {
        event.preventDefault();
        finishInlineEdit(false);
        return;
      }

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        finishInlineEdit(true);
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        window.requestAnimationFrame(() => {
          const currentEditingNode = editingNodeRef.current;

          if (currentEditingNode) {
            updateSelectionBoxFromNode(currentEditingNode);
          }
        });

        return;
      }
    }

    function handleBeforeInput(event: InputEvent) {
      const editingNode = editingNodeRef.current;
      const target = event.target;

      if (
        !editingNode ||
        !(target instanceof Node) ||
        !editingNode.contains(target)
      ) {
        return;
      }

      /*
       * שומרים את פעולת העריכה בתוך contentEditable ולא מאפשרים
       * לה לעלות לקיצורי הדרך של הקנבס. אין preventDefault.
       */
      event.stopPropagation();
    }

    function handleInput(event: Event) {
      const editingNode = editingNodeRef.current;
      const target = event.target;

      if (
        !editingNode ||
        !(target instanceof Node) ||
        !editingNode.contains(target)
      ) {
        return;
      }

      event.stopPropagation();

      window.requestAnimationFrame(() => {
        const currentEditingNode = editingNodeRef.current;

        if (currentEditingNode) {
          updateSelectionBoxFromNode(currentEditingNode);
        }
      });
    }

    function handleSelectionChange() {
      const editingNode = editingNodeRef.current;
      if (!editingNode) return;

      const selection = window.getSelection();

      if (!selectionBelongsToNode(selection, editingNode)) {
        return;
      }

      updateSelectionBoxFromNode(editingNode);
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

    root.addEventListener("pointerdown", handleInlinePointerEvent, true);
    root.addEventListener("pointerup", handleInlinePointerEvent, true);
    root.addEventListener("mousedown", handleInlinePointerEvent, true);
    root.addEventListener("mouseup", handleInlinePointerEvent, true);
    root.addEventListener("click", handleClick, true);
    root.addEventListener("dblclick", handleDoubleClick, true);
    root.addEventListener("focusout", handleFocusOut, true);
    window.addEventListener("keydown", handleKeyDown, true);
    root.addEventListener("beforeinput", handleBeforeInput as EventListener, true);
    root.addEventListener("input", handleInput, true);
    root.addEventListener("paste", handlePaste, true);
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      root.removeEventListener("pointerdown", handleInlinePointerEvent, true);
      root.removeEventListener("pointerup", handleInlinePointerEvent, true);
      root.removeEventListener("mousedown", handleInlinePointerEvent, true);
      root.removeEventListener("mouseup", handleInlinePointerEvent, true);
      root.removeEventListener("click", handleClick, true);
      root.removeEventListener("dblclick", handleDoubleClick, true);
      root.removeEventListener("focusout", handleFocusOut, true);
      window.removeEventListener("keydown", handleKeyDown, true);
      root.removeEventListener(
        "beforeinput",
        handleBeforeInput as EventListener,
        true,
      );
      root.removeEventListener("input", handleInput, true);
      root.removeEventListener("paste", handlePaste, true);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [editorAny, isEditMode, updateSelectionBoxFromNode]);

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

      {selectionBox ? (
        <div
          data-visual-selection-box="true"
          style={{
            position: "fixed",
            top: selectionBox.top,
            left: selectionBox.left,
            width: selectionBox.width,
            height: selectionBox.height,
            zIndex: 999999,
            pointerEvents: "none",
            border: "2px solid #8b3dff",
            borderRadius: 10,
            boxShadow: "0 0 0 6px rgba(139, 61, 255, 0.12)",
            transition:
              "top 120ms ease, left 120ms ease, width 120ms ease, height 120ms ease",
          }}
        />
      ) : null}

      <style>
        {`
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-visual-edit-id] {
            cursor: pointer;
          }

          [data-visual-template-canvas="true"] [data-visual-selected="true"],
          [data-visual-template-canvas="true"] [data-visual-edit-selected="true"],
          [data-visual-template-canvas="true"] [data-selected="true"],
          [data-visual-template-canvas="true"] [data-visual-active="true"],
          [data-visual-template-canvas="true"] .visual-selected,
          [data-visual-template-canvas="true"] .visual-edit-selected,
          [data-visual-template-canvas="true"] .is-visual-selected,
          [data-visual-template-canvas="true"] .is-selected {
            outline: 2px solid #8b3dff !important;
            outline-offset: 6px !important;
            border-radius: 10px !important;
            box-shadow: 0 0 0 6px rgba(139, 61, 255, .12) !important;
          }

          [data-visual-template-canvas="true"] [data-visual-edit-type="text"][data-visual-selected="true"],
          [data-visual-template-canvas="true"] [data-visual-edit-type="text"][data-visual-edit-selected="true"],
          [data-visual-template-canvas="true"] [data-visual-edit-type="text"][data-selected="true"],
          [data-visual-template-canvas="true"] [data-visual-edit-type="text"][data-visual-active="true"],
          [data-visual-template-canvas="true"] [data-visual-edit-type="text"].visual-selected,
          [data-visual-template-canvas="true"] [data-visual-edit-type="text"].visual-edit-selected,
          [data-visual-template-canvas="true"] [data-visual-edit-type="text"].is-visual-selected,
          [data-visual-template-canvas="true"] [data-visual-edit-type="text"].is-selected,
          [data-visual-template-canvas="true"] [data-visual-inline-editing="true"][data-visual-edit-type="text"],
          [data-visual-template-canvas="true"] [data-gjs-type="text"][data-visual-selected="true"],
          [data-visual-template-canvas="true"] [data-gjs-type="text"][data-visual-inline-editing="true"] {
            display: inline-block !important;
            width: fit-content !important;
            max-width: 100% !important;
            min-width: 0 !important;
          }

          [data-visual-template-canvas="true"] [data-visual-inline-editing="true"] {
            cursor: text !important;
            user-select: text !important;
            -webkit-user-select: text !important;
            -webkit-touch-callout: default !important;
            caret-color: #8b3dff !important;
            outline: 2px solid #8b3dff !important;
            outline-offset: 6px !important;
            border-radius: 10px !important;
            white-space: pre-wrap;
            touch-action: manipulation;
          }

          [data-visual-template-canvas="true"] [contenteditable="true"] {
            cursor: text !important;
            user-select: text !important;
            -webkit-user-select: text !important;
            -webkit-touch-callout: default !important;
            caret-color: #8b3dff !important;
            pointer-events: auto !important;
          }

          [data-visual-template-canvas="true"] [data-visual-inline-editing="true"] *,
          [data-visual-template-canvas="true"] [contenteditable="true"] * {
            user-select: text !important;
            -webkit-user-select: text !important;
          }

          [data-visual-template-canvas="true"] [data-visual-inline-editing="true"]::selection,
          [data-visual-template-canvas="true"] [data-visual-inline-editing="true"] *::selection,
          [data-visual-template-canvas="true"] [contenteditable="true"]::selection,
          [data-visual-template-canvas="true"] [contenteditable="true"] *::selection {
            background: rgba(37, 99, 235, 0.82) !important;
            color: #ffffff !important;
            text-shadow: none !important;
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