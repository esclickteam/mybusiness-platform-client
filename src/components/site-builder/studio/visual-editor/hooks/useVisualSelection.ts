import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  VisualEditableElementType,
  VisualSelectedElement,
} from "../../VisualInspector";

import {
  getNodeText,
  getVisualElementLabel,
} from "../utils/visualSelectors";

import {
  getNodeMediaAlt,
  getNodeMediaSrc,
  getVisualMediaTypeFromNode,
} from "../utils/visualMediaUtils";
import {
  isInsidePluginWidgetContent,
  isPluginWidgetShell,
  resolvePluginWidgetSelectionTarget,
  shouldSkipPluginWidgetRegistration,
} from "../utils/visualPluginWidgets";

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

  parentId?: string;
  parentNode?: HTMLElement | null;

  deleteTargetId?: string;
  deleteTargetNode?: HTMLElement;

  computedStyle?: {
    display?: string;
    position?: string;
    width?: string;
    height?: string;
    color?: string;
    backgroundColor?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    textAlign?: string;
    opacity?: string;
    zIndex?: string;
    transform?: string;
  };

  detectedAnimation?: {
    name?: string;
    duration?: string;
    delay?: string;
    timingFunction?: string;
    iterationCount?: string;
    transitionProperty?: string;
    transitionDuration?: string;
    transitionDelay?: string;
  };
};

type UseVisualSelectionOptions = {
  canvasRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
};

type SelectNodeOptions = {
  keepPreviousOnMissing?: boolean;
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

const CONTROL_TAGS = new Set([
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "option",
]);

const MEDIA_TAGS = new Set([
  "img",
  "video",
  "source",
  "picture",
  "canvas",
]);

const SECTION_TAGS = new Set([
  "header",
  "footer",
  "section",
  "main",
  "article",
  "nav",
  "aside",
  "form",
]);

const BOX_TAGS = new Set([
  "div",
  "ul",
  "ol",
  "li",
  "figure",
  "fieldset",
  "details",
  "summary",
]);

const AUTO_VISUAL_SELECTOR = [
  "header",
  "footer",
  "section",
  "nav",
  "article",
  "main",
  "aside",
  "div",
  "ul",
  "ol",
  "li",
  "figure",
  "figcaption",
  "form",
  "fieldset",
  "label",
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
  "em",
  "b",
  "i",
  "blockquote",
  "button",
  "a",
  "img",
  "picture",
  "video",
  "source",
  "canvas",
  "svg",
  "input",
  "textarea",
  "select",
].join(",");

const STRUCTURE_SELECTOR = [
  "[data-template-section-id]",
  "[data-section-kind]",
  "[data-bizuply-block]",
  "[data-studio-section-id]",
  "header",
  "footer",
  "section",
  "main",
  "article",
  "nav",
  "aside",
  "form",
].join(",");

const EDITOR_ONLY_SELECTOR = [
  "[data-editor-only='true']",
  "[data-bizuply-editor-only='true']",
  "[data-bizuply-editor-media-preview='true']",
  "[data-visual-selection-box='true']",
  "[data-visual-selection-overlay='true']",
  "[data-visual-toolbar-layer='true']",
  "[data-visual-context-menu-layer='true']",
  ".visual-selection-overlay",
  ".visual-floating-toolbar",
  ".visual-context-menu",
  ".visual-inspector-panel",
  "[data-bizuply-plugin-runtime='true']",
].join(",");

function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

function safeCssSelectorValue(value: string) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(String(value || ""));
  }

  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
}

function resolveEditorMediaPreviewTarget(
  node: HTMLElement,
  canvas: HTMLElement,
) {
  const preview = node.closest<HTMLElement>(
    "[data-bizuply-editor-media-preview='true'][data-bizuply-preview-for]",
  );

  if (!preview) return node;

  const targetId = String(
    preview.getAttribute("data-bizuply-preview-for") || "",
  ).trim();

  if (!targetId) return node;

  const safeId = safeCssSelectorValue(targetId);

  return (
    canvas.querySelector<HTMLElement>(
      `[data-visual-edit-id="${safeId}"]:not([data-bizuply-editor-media-preview="true"])`,
    ) || node
  );
}

function normalizeIdPart(value: unknown) {
  return (
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9א-ת_-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "element"
  );
}

function getDirectVisualElementId(node: HTMLElement | null) {
  if (!node) return "";

  return String(
    node.getAttribute("data-visual-edit-id") ||
      node.getAttribute("data-field") ||
      node.getAttribute("data-image-field") ||
      node.getAttribute("data-visual-field") ||
      node.getAttribute("data-visual-image-field") ||
      node.getAttribute("data-template-field") ||
      node.getAttribute("data-content-field") ||
      node.getAttribute("data-media-field") ||
      "",
  ).trim();
}

function normalizeVisualType(
  value: unknown,
): VisualEditableElementType | "" {
  const clean = String(value || "").trim().toLowerCase();

  if (clean === "section") return "section";

  if (
    clean === "text" ||
    clean === "heading" ||
    clean === "paragraph"
  ) {
    return "text";
  }

  if (
    clean === "image" ||
    clean === "video" ||
    clean === "media" ||
    clean === "raw"
  ) {
    return "image";
  }

  if (clean === "button" || clean === "link" || clean === "control") {
    return "button";
  }

  if (clean === "line") return "line";
  if (clean === "box" || clean === "container") return "box";
  if (clean === "icon" || clean === "svg") return "icon";

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

function getVisualTypeFromNode(
  node: HTMLElement | null,
): VisualEditableElementType {
  const tagName = String(node?.tagName || "").toLowerCase();

  /*
    מדיה תמיד נשארת מדיה — גם אם על האלמנט/הורה נתקעו
    data-section-kind / data-template-section-id אחרי סידור סקשנים.
  */
  if (
    MEDIA_TAGS.has(tagName) ||
    node?.getAttribute("data-bizuply-editor-media-preview") === "true" ||
    node?.getAttribute("data-visual-media-type") === "video" ||
    node?.getAttribute("data-visual-media-type") === "image"
  ) {
    return "image";
  }

  const directType = getDirectVisualElementType(node);

  if (directType && directType !== "section") return directType;

  if (directType === "section") {
    if (MEDIA_TAGS.has(tagName)) return "image";
    return "section";
  }

  if (
    node?.matches(
      "[data-visual-inserted-section='true'], [data-visual-edit-type='section']",
    )
  ) {
    return "section";
  }

  if (
    node?.matches(
      "[data-template-section-id], [data-section-kind], [data-bizuply-block], [data-studio-section-id]",
    ) &&
    (SECTION_TAGS.has(tagName) ||
      tagName === "div" ||
      tagName === "article")
  ) {
    return "section";
  }

  if (CONTROL_TAGS.has(tagName)) return "button";
  if (TEXT_TAGS.has(tagName)) return "text";
  if (SECTION_TAGS.has(tagName)) return "section";
  if (tagName === "svg" || tagName === "path") return "icon";
  if (tagName === "hr") return "line";
  if (BOX_TAGS.has(tagName)) return "box";

  return "box";
}

function isEditorOnlyNode(node: HTMLElement | null) {
  if (!node) return true;

  return Boolean(node.closest(EDITOR_ONLY_SELECTOR));
}

function getPageIdForNode(
  node: HTMLElement,
  canvas: HTMLElement | null,
) {
  return (
    node
      .closest<HTMLElement>("[data-template-page-id]")
      ?.getAttribute("data-template-page-id") ||
    canvas
      ?.querySelector<HTMLElement>("[data-template-page-id]")
      ?.getAttribute("data-template-page-id") ||
    canvas?.getAttribute("data-template-page-id") ||
    "page"
  );
}

function getStableStructureNode(
  node: HTMLElement,
  canvas: HTMLElement | null,
) {
  const structure = node.closest<HTMLElement>(STRUCTURE_SELECTOR);

  if (!structure || !canvas?.contains(structure)) return null;

  return structure;
}

function getStableSectionPart(
  node: HTMLElement,
  canvas: HTMLElement | null,
) {
  const structure = getStableStructureNode(node, canvas);

  if (!structure) return "page";

  const explicit =
    structure.getAttribute("data-template-section-id") ||
    structure.getAttribute("data-section-kind") ||
    structure.getAttribute("data-bizuply-block") ||
    structure.getAttribute("data-studio-section-id") ||
    structure.getAttribute("id") ||
    "";

  if (explicit) return normalizeIdPart(explicit);

  const tagName = normalizeIdPart(
    String(structure.tagName || "section").toLowerCase(),
  );

  if (!canvas) return `${tagName}-1`;

  const structures = Array.from(
    canvas.querySelectorAll<HTMLElement>(STRUCTURE_SELECTOR),
  );

  const index = Math.max(1, structures.indexOf(structure) + 1);

  return `${tagName}-${index}`;
}

function getStableDomPath(
  node: HTMLElement,
  scope: HTMLElement,
) {
  const parts: string[] = [];
  let current: HTMLElement | null = node;

  while (current && current !== scope) {
    const parent = current.parentElement;
    if (!parent) break;

    const siblings = Array.from(parent.children).filter(
      (item): item is HTMLElement =>
        item instanceof HTMLElement && !isEditorOnlyNode(item),
    );

    const index = Math.max(0, siblings.indexOf(current));
    const tagName = normalizeIdPart(
      String(current.tagName || "element").toLowerCase(),
    );

    parts.unshift(`${tagName}-${index + 1}`);
    current = parent;
  }

  return parts.join(".");
}

function buildStableVisualId(
  node: HTMLElement,
  canvas: HTMLElement | null,
) {
  const explicitHtmlId = String(node.getAttribute("id") || "").trim();

  if (explicitHtmlId) {
    return [
      normalizeIdPart(getPageIdForNode(node, canvas)),
      "html-id",
      normalizeIdPart(explicitHtmlId),
    ].join(".");
  }

  const type = getVisualTypeFromNode(node);
  const tagName = normalizeIdPart(
    String(node.tagName || "element").toLowerCase(),
  );
  const pagePart = normalizeIdPart(getPageIdForNode(node, canvas));
  const structure = getStableStructureNode(node, canvas);
  const sectionPart = getStableSectionPart(node, canvas);

  if (structure === node && type === "section") {
    return `${pagePart}.${sectionPart}.section`;
  }

  const scope = structure || canvas || node.parentElement || node;
  const domPath = getStableDomPath(node, scope);

  return [
    pagePart,
    sectionPart,
    normalizeIdPart(type),
    tagName,
    domPath || `${tagName}-1`,
  ]
    .filter(Boolean)
    .join(".");
}

function ensureNodeHasVisualId(
  node: HTMLElement,
  canvas: HTMLElement | null,
) {
  const currentId = getDirectVisualElementId(node);
  const tagName = String(node.tagName || "").toLowerCase();
  const inferredType = getVisualTypeFromNode(node);

  /*
    לא דורסים סוג מדיה קיים ל-section בגלל attributes של סקשן הורה/סידור.
  */
  const type = MEDIA_TAGS.has(tagName) ? "image" : inferredType;

  const elementId = currentId || buildStableVisualId(node, canvas);

  node.setAttribute("data-visual-edit-id", elementId);
  node.setAttribute("data-visual-editable", "true");
  node.setAttribute("data-visual-edit-type", type);
  node.setAttribute("data-visual-type", type);

  if (!currentId) {
    node.setAttribute("data-visual-auto-id", "true");
  }

  if (!node.getAttribute("data-visual-edit-label")) {
    node.setAttribute(
      "data-visual-edit-label",
      getVisualElementLabel(node) || elementId,
    );
  }

  return elementId;
}

function normalizeCandidateNode(
  node: HTMLElement,
  canvas: HTMLElement,
) {
  const resolvedNode = resolveEditorMediaPreviewTarget(
    node,
    canvas,
  );

  if (
    !canvas.contains(resolvedNode) ||
    isEditorOnlyNode(resolvedNode)
  ) {
    return null;
  }

  if (resolvedNode.tagName.toLowerCase() === "path") {
    const svg = resolvedNode.closest<SVGElement>("svg");

    if (svg instanceof HTMLElement && canvas.contains(svg)) {
      return svg;
    }

    return resolvedNode.parentElement;
  }

  if (resolvedNode instanceof HTMLSourceElement) {
    const mediaParent =
      resolvedNode.closest<HTMLElement>("video, picture");

    if (mediaParent && canvas.contains(mediaParent)) {
      return mediaParent;
    }
  }

  /*
    Form labels/buttons wrap tiny spans/icons. Prefer the stable editable
    parent so drag/resize targets the whole field label or submit button.
  */
  if (
    resolvedNode.getAttribute("data-visual-ignore-select") === "true" ||
    (String(resolvedNode.tagName || "").toLowerCase() === "span" &&
      resolvedNode.closest(
        'label[data-visual-edit-id], button[data-visual-edit-id], [data-bizuply-form-field-label="true"]',
      ))
  ) {
    const parent = resolvedNode.closest<HTMLElement>(
      "[data-visual-edit-id], label, button",
    );

    if (parent && canvas.contains(parent)) {
      return parent;
    }
  }

  /*
    Prefer the field slot/wrapper over nested inputs so contact forms
    drag as whole boxes (header/nav already use leaf text nodes).
  */
  {
    const fieldSlot = resolvedNode.closest<HTMLElement>(
      '[data-bizuply-form-field-wrapper="true"][data-visual-edit-id], .ido-form-field-slot[data-visual-edit-id]',
    );

    if (
      fieldSlot &&
      canvas.contains(fieldSlot) &&
      (resolvedNode === fieldSlot ||
        fieldSlot.contains(resolvedNode) ||
        ["input", "textarea", "select", "button"].includes(
          String(resolvedNode.tagName || "").toLowerCase(),
        ))
    ) {
      return fieldSlot;
    }
  }

  const pluginTarget = resolvePluginWidgetSelectionTarget(resolvedNode, canvas);
  if (pluginTarget) {
    return pluginTarget;
  }

  return resolvedNode;
}

function scoreCandidate(
  node: HTMLElement,
  target: HTMLElement,
  canvas: HTMLElement,
) {
  if (isEditorOnlyNode(node)) return -100000;
  if (isInsidePluginWidgetContent(node)) return -100000;

  const type = getVisualTypeFromNode(node);
  const tagName = String(node.tagName || "").toLowerCase();
  const rect = node.getBoundingClientRect();

  if (!rect.width || !rect.height) return -10000;

  let score = 0;

  if (node === target) score += 1000;

  let depth = 0;
  let cursor: HTMLElement | null = node;

  while (cursor && cursor !== canvas) {
    depth += 1;
    cursor = cursor.parentElement;
  }

  score += depth * 15;

  if (type === "text") score += 900;
  if (type === "image") score += 850;
  if (type === "button") score += 800;
  if (type === "icon") score += 700;
  if (type === "line") score += 650;
  if (type === "box") score += 300;
  if (type === "section") score += 100;

  if (TEXT_TAGS.has(tagName)) score += 300;
  if (MEDIA_TAGS.has(tagName)) score += 300;
  if (CONTROL_TAGS.has(tagName)) score += 300;

  if (node.hasAttribute("data-visual-edit-id")) score += 120;
  if (node.hasAttribute("data-visual-editable")) score += 80;
  if (isPluginWidgetShell(node)) score += 8000;

  const childEditableCount = node.querySelectorAll(
    "[data-visual-edit-id], h1, h2, h3, h4, h5, h6, p, span, img, video, button, a",
  ).length;

  if (childEditableCount > 0 && (type === "section" || type === "box")) {
    score -= Math.min(childEditableCount * 60, 700);
  }

  return score;
}

function collectCandidatesFromEvent(
  eventTarget: EventTarget | null,
  canvas: HTMLElement | null,
  nativeEvent?: MouseEvent,
) {
  if (!canvas || !isHTMLElement(eventTarget)) return [];

  const target = eventTarget;
  const candidates: HTMLElement[] = [];

  const addCandidate = (value: unknown) => {
    if (!isHTMLElement(value)) return;

    const normalized = normalizeCandidateNode(value, canvas);

    if (!normalized || candidates.includes(normalized)) return;

    if (
      normalized.matches(AUTO_VISUAL_SELECTOR) ||
      normalized.hasAttribute("data-visual-edit-id") ||
      normalized.getAttribute("data-visual-editable") === "true"
    ) {
      candidates.push(normalized);
    }
  };

  if (nativeEvent && typeof nativeEvent.composedPath === "function") {
    nativeEvent.composedPath().forEach(addCandidate);
  }

  if (
    nativeEvent &&
    typeof nativeEvent.clientX === "number" &&
    typeof nativeEvent.clientY === "number"
  ) {
    document
      .elementsFromPoint(nativeEvent.clientX, nativeEvent.clientY)
      .forEach(addCandidate);
  }

  let cursor: HTMLElement | null = target;

  while (cursor && cursor !== canvas) {
    addCandidate(cursor);
    cursor = cursor.parentElement;
  }

  return candidates;
}

function findBestEditableNode(
  eventTarget: EventTarget | null,
  canvas: HTMLElement | null,
  nativeEvent?: MouseEvent,
) {
  if (!canvas || !isHTMLElement(eventTarget)) return null;

  const target = eventTarget;
  const candidates = collectCandidatesFromEvent(
    eventTarget,
    canvas,
    nativeEvent,
  );

  if (!candidates.length) {
    return null;
  }

  return candidates.sort(
    (a, b) =>
      scoreCandidate(b, target, canvas) -
      scoreCandidate(a, target, canvas),
  )[0];
}

function getNodeLinkHref(node: HTMLElement | null) {
  if (!node) return "";

  const linkNode =
    node instanceof HTMLAnchorElement
      ? node
      : (node.closest("a") as HTMLAnchorElement | null) ||
        (node.querySelector("a") as HTMLAnchorElement | null);

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
      : (node.closest("a") as HTMLAnchorElement | null) ||
        (node.querySelector("a") as HTMLAnchorElement | null);

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

function getParentVisualNode(
  node: HTMLElement,
  canvas: HTMLElement | null,
) {
  if (!canvas) return null;

  let parent = node.parentElement;

  while (parent && parent !== canvas) {
    if (
      parent.matches(AUTO_VISUAL_SELECTOR) &&
      !isEditorOnlyNode(parent)
    ) {
      ensureNodeHasVisualId(parent, canvas);
      return parent;
    }

    parent = parent.parentElement;
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

  const parentNode = getParentVisualNode(node, canvas);
  const parentId = getDirectVisualElementId(parentNode);

  const computed = window.getComputedStyle(node);

  return {
    id: elementId,
    type,
    label,
    tagName: String(node.tagName || "").toLowerCase(),

    text:
      type === "text" || type === "button"
        ? getNodeText(node)
        : undefined,

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

    parentNode,
    parentId: parentId || undefined,

    deleteTargetNode: node,
    deleteTargetId: elementId,

    computedStyle: {
      display: computed.display,
      position: computed.position,
      width: computed.width,
      height: computed.height,
      color: computed.color,
      backgroundColor: computed.backgroundColor,
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      lineHeight: computed.lineHeight,
      textAlign: computed.textAlign,
      opacity: computed.opacity,
      zIndex: computed.zIndex,
      transform: computed.transform,
    },

    detectedAnimation: {
      name:
        computed.animationName && computed.animationName !== "none"
          ? computed.animationName
          : "",
      duration: computed.animationDuration,
      delay: computed.animationDelay,
      timingFunction: computed.animationTimingFunction,
      iterationCount: computed.animationIterationCount,
      transitionProperty: computed.transitionProperty,
      transitionDuration: computed.transitionDuration,
      transitionDelay: computed.transitionDelay,
    },
  } as VisualSelectedElementWithLink;
}

export function registerAllVisualElements(
  canvas: HTMLElement | null,
) {
  if (!canvas) return 0;

  const nodes = Array.from(
    canvas.querySelectorAll<HTMLElement>(AUTO_VISUAL_SELECTOR),
  ).filter(
    (node) =>
      !isEditorOnlyNode(node) && !shouldSkipPluginWidgetRegistration(node),
  );

  nodes.forEach((node) => {
    ensureNodeHasVisualId(node, canvas);
  });

  return nodes.length;
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

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let frameId = 0;

    const register = () => {
      window.cancelAnimationFrame(frameId);

      frameId = window.requestAnimationFrame(() => {
        registerAllVisualElements(canvas);
      });
    };

    register();

    const observer = new MutationObserver((mutations) => {
      const hasRelevantMutation = mutations.some(
        (mutation) =>
          mutation.type === "childList" ||
          (mutation.type === "attributes" &&
            mutation.attributeName !== "style" &&
            mutation.attributeName !== "class"),
      );

      if (hasRelevantMutation) {
        register();
      }
    });

    observer.observe(canvas, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [
        "data-template-page-id",
        "data-template-section-id",
        "data-section-kind",
        "data-bizuply-block",
        "data-studio-section-id",
        "data-visual-edit-id",
        "data-visual-edit-type",
      ],
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [canvasRef, enabled]);

  const selectNode = useCallback(
    (
      node: HTMLElement | null,
      options?: SelectNodeOptions,
    ) => {
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

      const normalizedNode = normalizeCandidateNode(
        resolveEditorMediaPreviewTarget(node, canvas),
        canvas,
      );

      if (!normalizedNode) {
        if (options?.keepPreviousOnMissing) {
          return selectedElementRef.current;
        }

        setSelectedElementSafe(null);
        return null;
      }

      const selected = buildSelectedElementFromNode(
        normalizedNode,
        canvas,
      );

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
    (
      elementId: string,
      options?: SelectNodeOptions,
    ) => {
      const canvas = canvasRef.current;
      const id = String(elementId || "").trim();

      if (!canvas || !id) {
        if (options?.keepPreviousOnMissing) {
          return selectedElementRef.current;
        }

        setSelectedElementSafe(null);
        return null;
      }

      const safeId = safeCssSelectorValue(id);

      const node = canvas.querySelector<HTMLElement>(
        `[data-visual-edit-id="${safeId}"]`,
      );

      if (!node) {
        if (options?.keepPreviousOnMissing) {
          return selectedElementRef.current;
        }

        setSelectedElementSafe(null);
        return null;
      }

      return selectNode(node, options);
    },
    [canvasRef, selectNode, setSelectedElementSafe],
  );

  const selectParent = useCallback(() => {
    const current = selectedElementRef.current;
    const canvas = canvasRef.current;

    if (!current || !canvas) return null;

    const node =
      current.node ||
      current.domNode ||
      current.element ||
      null;

    if (!(node instanceof HTMLElement)) return null;

    const parentNode = getParentVisualNode(node, canvas);

    if (!parentNode) return current;

    return selectNode(parentNode, {
      keepPreviousOnMissing: true,
    });
  }, [canvasRef, selectNode]);

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!enabled) return;

      const canvas = canvasRef.current;
      const nativeEvent = event.nativeEvent as MouseEvent;
      const node = findBestEditableNode(
        event.target,
        canvas,
        nativeEvent,
      );

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
      const nativeEvent = event.nativeEvent as MouseEvent;
      const node = findBestEditableNode(
        event.target,
        canvas,
        nativeEvent,
      );

      if (!node) {
        setHoveredElementId("");
        return;
      }

      const elementId = ensureNodeHasVisualId(node, canvas);

      setHoveredElementId((current) =>
        current === elementId ? current : elementId,
      );
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
      selectParent,

      clearSelection,
      refreshSelectedElement,

      registerAllVisualElements: () =>
        registerAllVisualElements(canvasRef.current),

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
      selectParent,
      clearSelection,
      refreshSelectedElement,
      canvasRef,
      handleCanvasClick,
      handleCanvasMouseMove,
      handleCanvasMouseLeave,
    ],
  );
}
