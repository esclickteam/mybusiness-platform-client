import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  VisualEditableElementType,
  VisualSelectedElement,
} from "../../VisualInspector";

import {
  findEditableVisualNode,
  getNodeText,
  getVisualElementId,
  getVisualElementLabel,
  getVisualElementType,
} from "../utils/visualSelectors";

import {
  getNodeMediaAlt,
  getNodeMediaSrc,
  getVisualMediaTypeFromNode,
} from "../utils/visualMediaUtils";

export type VisualSelectedElementWithLink = VisualSelectedElement & {
  linkValue?: string;
  linkTarget?: "_self" | "_blank" | string;
};

type UseVisualSelectionOptions = {
  canvasRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
};

function getVisualTypeFromNode(node: HTMLElement | null): VisualEditableElementType {
  const attrType = getVisualElementType(node);

  if (
    attrType === "section" ||
    attrType === "text" ||
    attrType === "image" ||
    attrType === "button" ||
    attrType === "line" ||
    attrType === "box" ||
    attrType === "icon"
  ) {
    return attrType;
  }

  const tagName = String(node?.tagName || "").toLowerCase();

  if (tagName === "img" || tagName === "video" || tagName === "source") return "image";
  if (tagName === "button" || tagName === "a" || tagName === "input" || tagName === "select" || tagName === "textarea") return "button";
  if (["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "strong", "small", "label"].includes(tagName)) return "text";
  if (["header", "footer", "section", "main", "article", "nav", "aside"].includes(tagName)) return "section";
  if (tagName === "svg" || tagName === "path") return "icon";

  return "box";
}

function getNodeLinkHref(node: HTMLElement | null) {
  if (!node) return "";

  const linkNode =
    node instanceof HTMLAnchorElement
      ? node
      : (node.querySelector?.("a") as HTMLAnchorElement | null);

  return String(
    linkNode?.getAttribute("href") ||
      node.getAttribute("href") ||
      node.getAttribute("data-visual-link-href") ||
      node.getAttribute("data-link-url") ||
      node.getAttribute("data-href") ||
      "",
  );
}

function getNodeLinkTarget(node: HTMLElement | null) {
  if (!node) return "_self";

  const linkNode =
    node instanceof HTMLAnchorElement
      ? node
      : (node.querySelector?.("a") as HTMLAnchorElement | null);

  return String(
    linkNode?.getAttribute("target") ||
      node.getAttribute("target") ||
      node.getAttribute("data-visual-link-target") ||
      "_self",
  );
}

function buildSelectedElementFromNode(
  node: HTMLElement,
): VisualSelectedElementWithLink | null {
  const elementId = getVisualElementId(node);
  if (!elementId) return null;

  const type = getVisualTypeFromNode(node);
  const label = getVisualElementLabel(node) || elementId;
  const rect = node.getBoundingClientRect();
  const src = type === "image" ? getNodeMediaSrc(node) : "";
  const alt = type === "image" ? getNodeMediaAlt(node) : "";
  const mediaType = type === "image" ? getVisualMediaTypeFromNode(node, src) : "";

  return {
    id: elementId,
    type,
    label,
    tagName: String(node.tagName || "").toLowerCase(),
    text: type === "text" || type === "button" ? getNodeText(node) : undefined,
    src: src || undefined,
    alt: alt || undefined,
    mediaType: mediaType || undefined,
    rect: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    },
    linkValue: getNodeLinkHref(node),
    linkTarget: getNodeLinkTarget(node),
  } as VisualSelectedElementWithLink;
}

export function useVisualSelection({
  canvasRef,
  enabled = true,
}: UseVisualSelectionOptions) {
  const [selectedElement, setSelectedElement] =
    useState<VisualSelectedElementWithLink | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState("");

  const clearSelection = useCallback(() => {
    setSelectedElement(null);
  }, []);

  const selectNode = useCallback((node: HTMLElement | null) => {
    if (!node) {
      setSelectedElement(null);
      return null;
    }

    const selected = buildSelectedElementFromNode(node);
    setSelectedElement(selected);
    return selected;
  }, []);

  const selectByElementId = useCallback(
    (elementId: string) => {
      const canvas = canvasRef.current;
      if (!canvas || !elementId) return null;

      const safeId = String(elementId).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      const node = canvas.querySelector<HTMLElement>(
        `[data-visual-edit-id="${safeId}"]`,
      );

      return selectNode(node);
    },
    [canvasRef, selectNode],
  );

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!enabled) return;

      const canvas = canvasRef.current;
      const target = event.target;
      const node = findEditableVisualNode(target, canvas);

      if (!node) {
        clearSelection();
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      selectNode(node);
    },
    [canvasRef, clearSelection, enabled, selectNode],
  );

  const handleCanvasMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!enabled) return;

      const canvas = canvasRef.current;
      const node = findEditableVisualNode(event.target, canvas);
      const elementId = getVisualElementId(node);

      setHoveredElementId(elementId);
    },
    [canvasRef, enabled],
  );

  const handleCanvasMouseLeave = useCallback(() => {
    setHoveredElementId("");
  }, []);

  const refreshSelectedElement = useCallback(() => {
    if (!selectedElement?.id) return;
    selectByElementId(selectedElement.id);
  }, [selectByElementId, selectedElement?.id]);

  useEffect(() => {
    if (!selectedElement?.id) return;

    const frame = window.requestAnimationFrame(() => {
      refreshSelectedElement();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [refreshSelectedElement, selectedElement?.id]);

  return useMemo(
    () => ({
      selectedElement,
      hoveredElementId,
      setSelectedElement,
      setHoveredElementId,
      selectNode,
      selectByElementId,
      clearSelection,
      refreshSelectedElement,
      handleCanvasClick,
      handleCanvasMouseMove,
      handleCanvasMouseLeave,
    }),
    [
      selectedElement,
      hoveredElementId,
      selectNode,
      selectByElementId,
      clearSelection,
      refreshSelectedElement,
      handleCanvasClick,
      handleCanvasMouseMove,
      handleCanvasMouseLeave,
    ],
  );
}
