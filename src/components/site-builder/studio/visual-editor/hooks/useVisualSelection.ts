import React, { useCallback, useMemo, useRef, useState } from "react";

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
  text?: string;
  src?: string;
  alt?: string;

  href?: string;
  target?: "_self" | "_blank" | string;
  rel?: string;

  mediaType?: "image" | "video" | "raw" | string;
  resourceType?: "image" | "video" | "raw" | string;

  linkValue?: string;
  linkTarget?: "_self" | "_blank" | string;
};

type UseVisualSelectionOptions = {
  canvasRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
};

function safeCssSelectorValue(value: string) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

function isEditableNode(node: HTMLElement | null) {
  if (!node) return false;

  return Boolean(
    node.getAttribute("data-visual-edit-id") ||
      node.getAttribute("data-visual-editable") === "true" ||
      node.getAttribute("data-image-field") ||
      node.getAttribute("data-edit-type") === "image" ||
      node.getAttribute("data-visual-image-field"),
  );
}

function getFallbackVisualTypeFromTag(
  node: HTMLElement | null,
): VisualEditableElementType {
  const tagName = String(node?.tagName || "").toLowerCase();

  if (tagName === "img" || tagName === "video" || tagName === "source") {
    return "image";
  }

  if (
    tagName === "button" ||
    tagName === "a" ||
    tagName === "input" ||
    tagName === "select" ||
    tagName === "textarea"
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
      "em",
      "b",
      "i",
    ].includes(tagName)
  ) {
    return "text";
  }

  if (
    ["header", "footer", "section", "main", "article", "nav", "aside"].includes(
      tagName,
    )
  ) {
    return "section";
  }

  if (tagName === "svg" || tagName === "path") {
    return "icon";
  }

  return "box";
}

function getVisualTypeFromNode(
  node: HTMLElement | null,
): VisualEditableElementType {
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

  return getFallbackVisualTypeFromTag(node);
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

  const target = String(
    linkNode?.getAttribute("target") ||
      node.getAttribute("target") ||
      node.getAttribute("data-visual-link-target") ||
      "_self",
  );

  return target === "_blank" ? "_blank" : "_self";
}

function getBestMediaNode(node: HTMLElement | null) {
  if (!node) return null;

  if (
    node instanceof HTMLImageElement ||
    node instanceof HTMLVideoElement ||
    node instanceof HTMLSourceElement
  ) {
    return node;
  }

  return node.querySelector<HTMLElement>("img, video, source") || node;
}

function shouldReadText(type: VisualEditableElementType) {
  return type === "text" || type === "button";
}

function normalizeIdPart(value: string) {
  return (
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9א-ת_-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "element"
  );
}

function ensureNodeHasVisualId(node: HTMLElement, canvas: HTMLElement | null) {
  const existingId = getVisualElementId(node);
  if (existingId) return existingId;

  const type = getVisualTypeFromNode(node);
  const tagName = String(node.tagName || "element").toLowerCase();

  const sectionNode = node.closest<HTMLElement>(
    "[data-template-section-id], [data-section-kind]",
  );

  const sectionKind =
    sectionNode?.getAttribute("data-template-section-id") ||
    sectionNode?.getAttribute("data-section-kind") ||
    "page";

  const siblings = canvas
    ? Array.from(
        canvas.querySelectorAll<HTMLElement>(
          [
            "[data-visual-editable='true']",
            "[data-visual-edit-id]",
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
        ),
      )
    : [];

  const index = Math.max(1, siblings.indexOf(node) + 1);

  const nextId = `${normalizeIdPart(sectionKind)}.${normalizeIdPart(
    type,
  )}.${normalizeIdPart(tagName)}.${index}`;

  node.setAttribute("data-visual-edit-id", nextId);
  node.setAttribute("data-visual-editable", "true");
  node.setAttribute("data-visual-edit-type", type);
  node.setAttribute("data-visual-auto-id", "true");

  if (!node.getAttribute("data-visual-edit-label")) {
    node.setAttribute(
      "data-visual-edit-label",
      getVisualElementLabel(node) || nextId,
    );
  }

  return nextId;
}

function findBestEditableNode(
  target: EventTarget | null,
  canvas: HTMLElement | null,
) {
  if (!canvas || !isHTMLElement(target)) return null;

  const fromUtils = findEditableVisualNode(target, canvas);

  if (fromUtils && canvas.contains(fromUtils)) {
    return fromUtils;
  }

  const direct = target.closest<HTMLElement>(
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

  if (direct && canvas.contains(direct)) {
    return direct;
  }

  let current: HTMLElement | null = target;

  while (current && current !== canvas) {
    if (isEditableNode(current)) return current;

    const tagName = String(current.tagName || "").toLowerCase();

    if (
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
        "section",
        "article",
        "form",
      ].includes(tagName)
    ) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

function buildSelectedElementFromNode(
  node: HTMLElement,
  canvas: HTMLElement | null,
): VisualSelectedElementWithLink | null {
  const elementId = ensureNodeHasVisualId(node, canvas);

  if (!elementId) return null;

  const type = getVisualTypeFromNode(node);
  const label = getVisualElementLabel(node) || elementId;
  const rect = node.getBoundingClientRect();

  const mediaNode = type === "image" ? getBestMediaNode(node) : node;

  const src = type === "image" ? getNodeMediaSrc(mediaNode) : "";
  const alt = type === "image" ? getNodeMediaAlt(mediaNode) : "";
  const mediaType =
    type === "image" ? getVisualMediaTypeFromNode(mediaNode, src) : "";

  const linkValue = getNodeLinkHref(node);
  const linkTarget = getNodeLinkTarget(node);

  return {
    id: elementId,
    type,
    label,
    tagName: String(node.tagName || "").toLowerCase(),

    text: shouldReadText(type) ? getNodeText(node) : undefined,

    src: src || undefined,
    alt: alt || undefined,
    mediaType: mediaType || undefined,
    resourceType: mediaType || undefined,

    href: linkValue || undefined,
    target: linkTarget,
    rel: linkTarget === "_blank" ? "noopener noreferrer" : "",

    rect: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    },

    linkValue,
    linkTarget,
  } as VisualSelectedElementWithLink;
}

export function useVisualSelection({
  canvasRef,
  enabled = true,
}: UseVisualSelectionOptions) {
  const [selectedElement, setSelectedElement] =
    useState<VisualSelectedElementWithLink | null>(null);

  const selectedElementRef =
    useRef<VisualSelectedElementWithLink | null>(null);

  const [hoveredElementId, setHoveredElementId] = useState("");

  const setSelectedElementSafe = useCallback(
    (value: VisualSelectedElementWithLink | null) => {
      selectedElementRef.current = value;
      setSelectedElement(value);
    },
    [],
  );

  const clearSelection = useCallback(() => {
    selectedElementRef.current = null;
    setSelectedElement(null);
    setHoveredElementId("");
  }, []);

  const selectNode = useCallback(
    (node: HTMLElement | null, options?: { keepPreviousOnMissing?: boolean }) => {
      const canvas = canvasRef.current;

      if (!enabled) {
        return selectedElementRef.current;
      }

      if (!node || !canvas || !canvas.contains(node)) {
        if (options?.keepPreviousOnMissing) {
          return selectedElementRef.current;
        }

        setSelectedElementSafe(null);
        return null;
      }

      const selected = buildSelectedElementFromNode(node, canvas);

      if (!selected) {
        if (options?.keepPreviousOnMissing) {
          return selectedElementRef.current;
        }

        setSelectedElementSafe(null);
        return null;
      }

      setSelectedElementSafe(selected);
      return selected;
    },
    [canvasRef, enabled, setSelectedElementSafe],
  );

  const selectByElementId = useCallback(
    (elementId: string, options?: { keepPreviousOnMissing?: boolean }) => {
      const canvas = canvasRef.current;

      if (!canvas || !elementId) {
        return options?.keepPreviousOnMissing
          ? selectedElementRef.current
          : null;
      }

      const safeId = safeCssSelectorValue(elementId);

      const node = canvas.querySelector<HTMLElement>(
        `[data-visual-edit-id="${safeId}"]`,
      );

      if (!node) {
        return options?.keepPreviousOnMissing
          ? selectedElementRef.current
          : null;
      }

      return selectNode(node, options);
    },
    [canvasRef, selectNode],
  );

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!enabled) return;

      const canvas = canvasRef.current;
      const node = findBestEditableNode(event.target, canvas);

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
      const node = findBestEditableNode(event.target, canvas);

      if (!node) {
        setHoveredElementId("");
        return;
      }

      const elementId = ensureNodeHasVisualId(node, canvas);

      setHoveredElementId(elementId);
    },
    [canvasRef, enabled],
  );

  const handleCanvasMouseLeave = useCallback(() => {
    setHoveredElementId("");
  }, []);

  const refreshSelectedElement = useCallback(() => {
    const current = selectedElementRef.current;

    if (!current?.id) return current;

    return selectByElementId(current.id, {
      keepPreviousOnMissing: true,
    });
  }, [selectByElementId]);

  return useMemo(
    () => ({
      selectedElement,
      hoveredElementId,

      setSelectedElement: setSelectedElementSafe,
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
      setSelectedElementSafe,
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