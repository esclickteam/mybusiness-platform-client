import React, { useCallback, useMemo, useRef, useState } from "react";

import type {
  VisualEditableElementType,
  VisualSelectedElement,
} from "../../VisualInspector";

import {
  findEditableVisualNode,
  getNodeText,
  getVisualElementLabel,
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

  node?: HTMLElement;
  element?: HTMLElement;
  domNode?: HTMLElement;
};

type UseVisualSelectionOptions = {
  canvasRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
};

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

const MEDIA_SELECTOR = "img,video,source";
const CONTROL_SELECTOR = "a,button,input,textarea,select";
const STRUCTURE_SELECTOR = "header,footer,section,main,article,nav,aside,form";

const EDITABLE_SELECTOR = [
  "[data-visual-editable='true'][data-visual-edit-id]",
  "[data-visual-edit-id]",
  "[data-image-field]",
  "[data-edit-type='image']",
  "[data-visual-image-field]",
].join(",");

function safeCssSelectorValue(value: string) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(String(value || ""));
  }

  return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

function getDirectVisualElementId(node: HTMLElement | null) {
  if (!node) return "";

  return String(
    node.getAttribute("data-visual-edit-id") ||
      node.getAttribute("data-image-field") ||
      node.getAttribute("data-visual-image-field") ||
      "",
  );
}

function normalizeVisualType(value: string): VisualEditableElementType | "" {
  const clean = String(value || "").trim().toLowerCase();

  if (clean === "section") return "section";
  if (clean === "text") return "text";
  if (clean === "heading") return "text";
  if (clean === "paragraph") return "text";
  if (clean === "image") return "image";
  if (clean === "video") return "image";
  if (clean === "media") return "image";
  if (clean === "raw") return "image";
  if (clean === "button") return "button";
  if (clean === "link") return "button";
  if (clean === "line") return "line";
  if (clean === "box") return "box";
  if (clean === "icon") return "icon";

  return "";
}

function getDirectVisualElementType(node: HTMLElement | null) {
  if (!node) return "";

  return normalizeVisualType(
    node.getAttribute("data-visual-edit-type") ||
      node.getAttribute("data-visual-type") ||
      node.getAttribute("data-edit-type") ||
      "",
  );
}

function isEditableNode(node: HTMLElement | null) {
  if (!node) return false;

  return Boolean(
    getDirectVisualElementId(node) ||
      node.getAttribute("data-visual-editable") === "true" ||
      node.getAttribute("data-edit-type") === "image",
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
  const directType = getDirectVisualElementType(node);

  if (directType) {
    return directType;
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

function closestInsideCanvas(
  target: HTMLElement,
  canvas: HTMLElement,
  selector: string,
) {
  const node = target.closest<HTMLElement>(selector);

  if (!node || !canvas.contains(node)) return null;

  return node;
}

function getPageIdForNode(node: HTMLElement, canvas: HTMLElement | null) {
  return (
    node.closest<HTMLElement>("[data-template-page-id]")?.getAttribute(
      "data-template-page-id",
    ) ||
    canvas?.querySelector<HTMLElement>("[data-template-page-id]")?.getAttribute(
      "data-template-page-id",
    ) ||
    canvas?.getAttribute("data-template-page-id") ||
    "page"
  );
}

function getTextSeed(node: HTMLElement) {
  return normalizeIdPart(
    String(node.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 34),
  );
}

function ensureNodeHasVisualId(node: HTMLElement, canvas: HTMLElement | null) {
  const directExistingId = getDirectVisualElementId(node);

  if (directExistingId) {
    if (!node.getAttribute("data-visual-edit-id")) {
      node.setAttribute("data-visual-edit-id", directExistingId);
    }

    if (!node.getAttribute("data-visual-editable")) {
      node.setAttribute("data-visual-editable", "true");
    }

    if (!node.getAttribute("data-visual-edit-type")) {
      node.setAttribute("data-visual-edit-type", getVisualTypeFromNode(node));
    }

    return directExistingId;
  }

  const type = getVisualTypeFromNode(node);
  const tagName = String(node.tagName || "element").toLowerCase();

  const pageId = normalizeIdPart(getPageIdForNode(node, canvas));

  const sectionNode = node.closest<HTMLElement>(
    "[data-template-section-id], [data-section-kind]",
  );

  const sectionKind = normalizeIdPart(
    sectionNode?.getAttribute("data-template-section-id") ||
      sectionNode?.getAttribute("data-section-kind") ||
      "page",
  );

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

  const seed = type === "text" || type === "button" ? getTextSeed(node) : "";

  const nextId = [
    pageId,
    sectionKind,
    normalizeIdPart(type),
    normalizeIdPart(tagName),
    seed,
    String(index),
  ]
    .filter(Boolean)
    .join(".");

  node.setAttribute("data-visual-edit-id", nextId);
  node.setAttribute("data-visual-editable", "true");
  node.setAttribute("data-visual-edit-type", type);
  node.setAttribute("data-visual-type", type);
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

  const htmlTarget = target;

  /*
    חשוב:
    לא מתחילים מ-findEditableVisualNode.
    בקוד הישן זה תפס לפעמים section/parent לפני הטקסט.
    כאן קודם מחפשים את האלמנט הכי פנימי שהמשתמש באמת לחץ עליו.
  */

  const mediaNode = closestInsideCanvas(htmlTarget, canvas, MEDIA_SELECTOR);

  if (mediaNode) {
    return mediaNode;
  }

  const controlNode = closestInsideCanvas(htmlTarget, canvas, CONTROL_SELECTOR);

  if (controlNode) {
    return controlNode;
  }

  const textNode = closestInsideCanvas(htmlTarget, canvas, TEXT_SELECTOR);

  if (textNode) {
    return textNode;
  }

  const directEditableNode = closestInsideCanvas(
    htmlTarget,
    canvas,
    EDITABLE_SELECTOR,
  );

  if (directEditableNode) {
    return directEditableNode;
  }

  let current: HTMLElement | null = htmlTarget;

  while (current && current !== canvas) {
    const tagName = String(current.tagName || "").toLowerCase();

    if (isEditableNode(current)) {
      return current;
    }

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
      ].includes(tagName)
    ) {
      return current;
    }

    current = current.parentElement;
  }

  const fromUtils = findEditableVisualNode(htmlTarget, canvas);

  if (fromUtils && canvas.contains(fromUtils)) {
    return fromUtils;
  }

  const structureNode = closestInsideCanvas(
    htmlTarget,
    canvas,
    STRUCTURE_SELECTOR,
  );

  if (structureNode) {
    return structureNode;
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

    node,
    element: node,
    domNode: node,
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