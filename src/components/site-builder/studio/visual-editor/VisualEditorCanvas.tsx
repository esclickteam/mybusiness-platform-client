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

    canvasDebug("canvas element attached", {
      root,
      mode: isEditMode ? "edit" : "preview",
    });
  }, [editorAny, isEditMode]);

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
          canvasDebug("call editor handleCanvasClick start", {
            selectedBefore: editorAny.selectedElement,
          });

          editorAny.handleCanvasClick(
            event as unknown as React.MouseEvent<HTMLElement>,
          );

          canvasDebug("call editor handleCanvasClick done", {
            selectedImmediatelyAfter: editorAny.selectedElement,
          });
        } catch (error) {
          canvasDebug("call editor handleCanvasClick failed", {
            error,
          });
        }
      } else {
        canvasDebug("editor handleCanvasClick missing");
      }
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
        markDomNodeSelected(root, lastClickedVisualNodeRef.current);
      } else if (elementId) {
        forceMarkDomSelected(root, elementId);
      }

      if (typeof editorAny.refreshSelectedElement === "function") {
        window.requestAnimationFrame(() => {
          editorAny.refreshSelectedElement();

          if (lastClickedVisualNodeRef.current) {
            markDomNodeSelected(root, lastClickedVisualNodeRef.current);
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
      editorAny.startInlineTextEdit?.(elementId);

      node.setAttribute("contenteditable", "true");
      node.setAttribute("spellcheck", "false");
      node.setAttribute("data-visual-inline-editing", "true");

      node.style.userSelect = "text";
      node.style.webkitUserSelect = "text";

      markDomNodeSelected(root, node);

      window.requestAnimationFrame(() => {
        node.focus({ preventScroll: true });
        selectAllText(node);

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
          canvasDebug("mousedown inside editing node", {
            target: debugNode(target),
            editingNode: debugNode(editingNode),
          });
          return;
        }

        canvasDebug("mousedown outside editing node - saving first", {
          target: debugNode(target),
          editingNode: debugNode(editingNode),
        });

        finishInlineEdit(true);
      }

      const node = findClickableVisualNode(target);
      const bestNode = findBestDomNodeForSelection(root, target, node);

      canvasDebug("mousedown captured", {
        target: debugNode(target),
        node: debugNode(node),
        bestNode: debugNode(bestNode),
        elementId: getVisualElementId(node),
        elementType: getVisualElementType(node),
      });

      if (!node || !root.contains(node)) return;

      lastClickedVisualNodeRef.current = bestNode || node;
      markDomNodeSelected(root, lastClickedVisualNodeRef.current);

      event.preventDefault();
      event.stopPropagation();
    }

    function handleClick(event: MouseEvent) {
      if (!isEditMode) return;

      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const editingNode = editingNodeRef.current;

      if (editingNode && editingNode.contains(target)) {
        canvasDebug("click inside editing node - ignored by selection", {
          target: debugNode(target),
          editingNode: debugNode(editingNode),
        });
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
      markDomNodeSelected(root, lastClickedVisualNodeRef.current);

      event.preventDefault();
      event.stopPropagation();

      callEditorClick(event);

      markDomNodeSelected(root, lastClickedVisualNodeRef.current);

      window.setTimeout(() => {
        if (lastClickedVisualNodeRef.current) {
          markDomNodeSelected(root, lastClickedVisualNodeRef.current);
        }

        canvasDebug("click after selection timeout 0", {
          elementId,
          elementType,
          selectedAfter: editorAny.selectedElement,
          selectedId: editorAny.selectedElement?.id,
          domSelected: getDomSelectedNodes(root),
        });
      }, 0);

      window.setTimeout(() => {
        if (lastClickedVisualNodeRef.current) {
          markDomNodeSelected(root, lastClickedVisualNodeRef.current);
        }

        canvasDebug("click after selection timeout 80", {
          elementId,
          elementType,
          selectedAfter: editorAny.selectedElement,
          selectedId: editorAny.selectedElement?.id,
          domSelected: getDomSelectedNodes(root),
        });
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
      markDomNodeSelected(root, lastClickedVisualNodeRef.current);

      event.preventDefault();
      event.stopPropagation();

      callEditorClick(event);

      if (!elementId) {
        canvasDebug("double click stopped - missing elementId", {
          target: debugNode(target),
          node: debugNode(node),
          bestNode: debugNode(bestNode),
        });
        return;
      }

      if (elementType === "image") {
        canvasDebug("double click opens media picker", {
          elementId,
        });

        editorAny.openMediaPicker?.(elementId);
        return;
      }

      if (elementType === "button") {
        canvasDebug("double click opens link settings", {
          elementId,
        });

        editorAny.openLinkSettings?.(elementId);
        return;
      }

      const textNode =
        bestNode && TEXT_SELECTOR.split(",").includes(bestNode.tagName.toLowerCase())
          ? bestNode
          : findInlineEditableTextNode(node);

      canvasDebug("double click text resolve", {
        elementId,
        textNode: debugNode(textNode),
      });

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

      canvasDebug("focusout while editing", {
        editingNode: debugNode(editingNode),
        nextTarget: nextTarget instanceof HTMLElement ? debugNode(nextTarget) : nextTarget,
      });

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

      canvasDebug("keydown while editing", {
        key: event.key,
        shiftKey: event.shiftKey,
        target: target instanceof HTMLElement ? debugNode(target) : target,
      });

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

      canvasDebug("paste while editing", {
        text,
      });

      if (!text) return;

      document.execCommand("insertText", false, text);
    }

    canvasDebug("canvas listeners attached", {
      isEditMode,
      root,
    });

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

      canvasDebug("canvas listeners detached");
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