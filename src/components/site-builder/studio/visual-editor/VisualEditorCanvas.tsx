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
const DEBUG_VISUAL_CANVAS = true;

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

function findBestDomNodeForSelection(
  root: HTMLElement,
  target: HTMLElement,
  fallbackNode: HTMLElement | null,
) {
  const textNode = target.closest<HTMLElement>(TEXT_SELECTOR);

  if (textNode && root.contains(textNode)) {
    return textNode;
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

function getDomSelectedNodes(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      [
        "[data-visual-selected='true']",
        "[data-visual-edit-selected='true']",
        "[data-selected='true']",
        ".visual-selected",
        ".visual-edit-selected",
        ".is-visual-selected",
        ".is-selected",
      ].join(","),
    ),
  ).map((item) => debugNode(item));
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

      const rect = node.getBoundingClientRect();

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

    canvasDebug("canvas element attached", {
      root,
      mode: isEditMode ? "edit" : "preview",
    });
  }, [editorAny, isEditMode]);

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

    canvasDebug("dom apply effect start", {
      selectedElementId,
      hoveredElementId,
      inlineEditingElementId,
      isEditMode,
      dataKeys: Object.keys(editorAny.data || {}),
      contentKeys: Object.keys((editorAny.data || {}).__content || {}),
      selectedBeforeApply: getDomSelectedNodes(root),
      lastClickedNode: debugNode(lastClickedVisualNodeRef.current),
    });

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

    canvasDebug("dom apply effect done", {
      selectedElementId,
      hoveredElementId,
      inlineEditingElementId,
      selectedAfterApply: getDomSelectedNodes(root),
    });
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

    canvasDebug("leaving edit mode while inline editing", {
      elementId,
      newText,
      node: debugNode(node),
    });

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
    lastClickedVisualNodeRef.current = null;
    setInlineEditingElementId("");
    setSelectionBox(null);

    editorAny.setIsInlineEditing?.(false);
    editorAny.finishInlineTextEdit?.();
  }, [isEditMode, editorAny]);

  useEffect(() => {
    const root = canvasRef.current;
    if (!root) return;

    function applyManualSelection(node: HTMLElement | null, reason: string) {
      if (!node) return;

      markDomNodeSelected(root, node);
      updateSelectionBoxFromNode(node);

      const selected = selectNodeInEditorState(editorAny, node);

      canvasDebug("manual editor selection applied", {
        reason,
        selected,
        domNode: debugNode(node),
        editorSelectedNow: editorAny.selectedElement,
      });
    }

    function finishInlineEdit(save: boolean) {
      const node = editingNodeRef.current;
      if (!node) return;

      const elementId = getVisualElementId(node);
      const newText = normalizeEditedText(node.innerText);

      canvasDebug("finish inline edit", {
        save,
        elementId,
        newText,
        originalText: editingOriginalTextRef.current,
        node: debugNode(node),
      });

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

      if (lastClickedVisualNodeRef.current) {
        applyManualSelection(lastClickedVisualNodeRef.current, "finishInlineEdit");
      } else if (elementId) {
        forceMarkDomSelected(root, elementId);
      }

      if (typeof editorAny.refreshSelectedElement === "function") {
        window.requestAnimationFrame(() => {
          editorAny.refreshSelectedElement();

          if (lastClickedVisualNodeRef.current) {
            applyManualSelection(
              lastClickedVisualNodeRef.current,
              "finishInlineEdit.refresh",
            );
          }

          canvasDebug("refresh selected element after inline edit", {
            selectedAfterRefresh: editorAny.selectedElement,
            domSelected: getDomSelectedNodes(root),
          });
        });
      }
    }

    function startInlineEdit(node: HTMLElement, elementId: string) {
      const currentEditingNode = editingNodeRef.current;

      canvasDebug("start inline edit", {
        elementId,
        node: debugNode(node),
        currentEditingNode: debugNode(currentEditingNode),
      });

      if (currentEditingNode && currentEditingNode !== node) {
        finishInlineEdit(true);
      }

      editingNodeRef.current = node;
      editingOriginalTextRef.current = node.innerText;

      lastClickedVisualNodeRef.current = node;

      setInlineEditingElementId(elementId);

      editorAny.setIsInlineEditing?.(true);

      applyManualSelection(node, "startInlineEdit");

      node.setAttribute("contenteditable", "true");
      node.setAttribute("spellcheck", "false");
      node.setAttribute("data-visual-inline-editing", "true");

      node.style.userSelect = "text";
      node.style.webkitUserSelect = "text";

      window.requestAnimationFrame(() => {
        node.focus({ preventScroll: true });
        selectAllText(node);
        updateSelectionBoxFromNode(node);

        canvasDebug("inline edit focused", {
          elementId,
          activeElement: debugNode(document.activeElement as HTMLElement | null),
          node: debugNode(node),
        });
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

      canvasDebug("mousedown captured - no selection", {
        target: debugNode(target),
        node: debugNode(node),
        elementId: getVisualElementId(node),
        elementType: getVisualElementType(node),
      });

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
      const bestNode = findBestDomNodeForSelection(root, target, node);
      const elementId = getVisualElementId(node);
      const elementType = getVisualElementType(node);

      canvasDebug("click captured", {
        target: debugNode(target),
        node: debugNode(node),
        bestNode: debugNode(bestNode),
        elementId,
        elementType,
        selectedBefore: editorAny.selectedElement,
        domSelectedBefore: getDomSelectedNodes(root),
      });

      if (!node || !root.contains(node)) return;

      lastClickedVisualNodeRef.current = bestNode || node;

      event.preventDefault();
      event.stopPropagation();

      applyManualSelection(lastClickedVisualNodeRef.current, "click");

      window.setTimeout(() => {
        if (lastClickedVisualNodeRef.current) {
          applyManualSelection(lastClickedVisualNodeRef.current, "click.timeout0");
        }
      }, 0);

      window.setTimeout(() => {
        if (lastClickedVisualNodeRef.current) {
          applyManualSelection(lastClickedVisualNodeRef.current, "click.timeout80");
        }
      }, 80);
    }

    function handleDoubleClick(event: MouseEvent) {
      if (!isEditMode) return;

      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const node = findClickableVisualNode(target);
      const bestNode = findBestDomNodeForSelection(root, target, node);
      const elementId = getVisualElementId(node);
      const elementType = getVisualElementType(node);

      canvasDebug("double click captured", {
        target: debugNode(target),
        node: debugNode(node),
        bestNode: debugNode(bestNode),
        elementId,
        elementType,
        selectedBefore: editorAny.selectedElement,
      });

      if (!node || !root.contains(node)) return;

      lastClickedVisualNodeRef.current = bestNode || node;

      event.preventDefault();
      event.stopPropagation();

      applyManualSelection(lastClickedVisualNodeRef.current, "doubleClick");

      if (!elementId) {
        return;
      }

      if (elementType === "image") {
        editorAny.openMediaPicker?.(elementId);
        return;
      }

      if (elementType === "button") {
        editorAny.openLinkSettings?.(elementId);
        return;
      }

      const selectedNode = lastClickedVisualNodeRef.current;

      const textNode =
        selectedNode &&
        TEXT_SELECTOR.split(",").includes(selectedNode.tagName.toLowerCase())
          ? selectedNode
          : findInlineEditableTextNode(node);

      if (!textNode) {
        return;
      }

      startInlineEdit(textNode, getVisualElementId(textNode) || elementId);
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

          [data-visual-template-canvas="true"] [data-visual-inline-editing="true"] {
            cursor: text !important;
            user-select: text !important;
            -webkit-user-select: text !important;
            outline: 2px solid #8b3dff !important;
            outline-offset: 6px !important;
            border-radius: 10px !important;
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