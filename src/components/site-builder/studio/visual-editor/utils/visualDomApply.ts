import {
  VISUAL_CONTENT_KEY,
  VISUAL_INSERTED_ELEMENTS_KEY,
  VISUAL_INSERTED_SECTIONS_KEY,
  readVisualAttributes,
  readVisualContent,
  readVisualDeleted,
  readVisualHidden,
  readVisualInsertedElements,
  readVisualInsertedSections,
  readVisualLayout,
  readVisualLocked,
  readVisualResponsive,
  readVisualSectionOrder,
  readVisualStyles,
  type VisualContentMap,
  type VisualDeviceMode,
  type VisualInsertedElement,
  type VisualInsertedSection,
  type VisualLayoutItem,
} from "./visualData";

import { applyVisualSectionOrderToDom } from "./visualSectionOrder";

import {
  applyMediaFitStyles,
  getNodeMediaAlt,
  getNodeMediaSrc,
  getVisualMediaTypeFromNode,
  normalizeVisualMediaType,
} from "./visualMediaUtils";

import {
  getNodeText,
  safeCssSelectorValue,
  selectorForVisualElement,
} from "./visualSelectors";

import { applySavedFormBuildersToDom } from "./visualForms";

type FindVisualNodesOptions = {
  allowFallback?: boolean;
};

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
  "a",
  "button",
  "em",
  "b",
  "i",
];

const TEXT_SELECTOR = TEXT_TAGS.join(",");
const MEDIA_SELECTOR = "img, video, picture, source";

const INNER_EDITABLE_SELECTOR = [
  "[data-visual-edit-id]",
  "[data-visual-editable='true']",
  "[data-gjs-type='text']",
  "[data-editable='text']",
  ".lunelle-inline-edit-text",
  TEXT_SELECTOR,
  MEDIA_SELECTOR,
].join(",");


const AUTO_EDITABLE_SELECTOR = [
  "section",
  "header",
  "footer",
  "main",
  "nav",
  "article",
  "aside",
  "form",
  "div",
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
  "a",
  "button",
  "img",
  "picture",
  "video",
  "source",
  "input",
  "textarea",
  "select",
  "ul",
  "ol",
  "li",
  "svg",
].join(",");

const NON_EDITABLE_SELECTOR = [
  "script",
  "style",
  "link",
  "meta",
  "noscript",
  "template",
  "[data-visual-editor-only='true']",
  "[data-visual-selection-box='true']",
  "[data-visual-selection-overlay='true']",
  ".visual-selection-overlay",
  ".visual-floating-toolbar",
  ".visual-context-menu",
  ".visual-inspector-panel",
].join(",");

function normalizeVisualIdPart(value: unknown) {
  return (
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9א-ת_-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "element"
  );
}

function getPageIdForNode(node: HTMLElement, root: HTMLElement) {
  return (
    node
      .closest<HTMLElement>("[data-template-page-id]")
      ?.getAttribute("data-template-page-id") ||
    root
      .querySelector<HTMLElement>("[data-template-page-id]")
      ?.getAttribute("data-template-page-id") ||
    root.getAttribute("data-template-page-id") ||
    root.getAttribute("data-visual-page-id") ||
    root.getAttribute("data-page-id") ||
    "page"
  );
}

function getStableStructureNode(
  node: HTMLElement,
  root: HTMLElement,
) {
  const structure = node.closest<HTMLElement>(
    [
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
    ].join(","),
  );

  if (!structure || !root.contains(structure)) return null;

  return structure;
}

function getStableSectionPart(
  node: HTMLElement,
  root: HTMLElement,
) {
  const structure = getStableStructureNode(node, root);

  if (!structure) return "page";

  const explicit =
    structure.getAttribute("data-template-section-id") ||
    structure.getAttribute("data-section-kind") ||
    structure.getAttribute("data-bizuply-block") ||
    structure.getAttribute("data-studio-section-id") ||
    structure.getAttribute("id") ||
    "";

  if (explicit) return normalizeVisualIdPart(explicit);

  const structures = Array.from(
    root.querySelectorAll<HTMLElement>(
      [
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
      ].join(","),
    ),
  );

  const tagName = normalizeVisualIdPart(
    String(structure.tagName || "section").toLowerCase(),
  );

  return `${tagName}-${Math.max(1, structures.indexOf(structure) + 1)}`;
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
    const tagName = normalizeVisualIdPart(
      String(current.tagName || "element").toLowerCase(),
    );

    parts.unshift(`${tagName}-${index + 1}`);
    current = parent;
  }

  return parts.join(".");
}

function buildStableVisualDomPath(root: HTMLElement, node: HTMLElement) {
  const explicitHtmlId = String(node.getAttribute("id") || "").trim();

  if (explicitHtmlId) {
    return [
      normalizeVisualIdPart(getPageIdForNode(node, root)),
      "html-id",
      normalizeVisualIdPart(explicitHtmlId),
    ].join(".");
  }

  const type = detectAutoVisualType(node);
  const tagName = normalizeVisualIdPart(
    String(node.tagName || "element").toLowerCase(),
  );
  const pagePart = normalizeVisualIdPart(getPageIdForNode(node, root));
  const structure = getStableStructureNode(node, root);
  const sectionPart = getStableSectionPart(node, root);

  if (structure === node && type === "section") {
    return `${pagePart}.${sectionPart}.section`;
  }

  const scope = structure || root || node.parentElement || node;
  const domPath = getStableDomPath(node, scope);

  return [
    pagePart,
    sectionPart,
    normalizeVisualIdPart(type),
    tagName,
    domPath || `${tagName}-1`,
  ]
    .filter(Boolean)
    .join(".");
}

function detectAutoVisualType(node: HTMLElement) {
  const explicitType = getDirectVisualElementType(node);
  if (explicitType) return explicitType;

  const tagName = String(node.tagName || "").toLowerCase();

  if (["img", "picture", "video", "source"].includes(tagName)) {
    return "image";
  }

  if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
    return "text";
  }

  if (
    [
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

  if (["a", "button", "input", "textarea", "select"].includes(tagName)) {
    return "button";
  }

  if (
    [
      "section",
      "header",
      "footer",
      "main",
      "nav",
      "article",
      "aside",
      "form",
    ].includes(tagName)
  ) {
    return "section";
  }

  return "box";
}

function shouldRegisterVisualNode(root: HTMLElement, node: HTMLElement) {
  if (node === root) return false;
  if (!root.contains(node)) return false;
  if (node.matches(NON_EDITABLE_SELECTOR)) return false;
  if (isEditorOnlyNode(node)) return false;

  return node.matches(AUTO_EDITABLE_SELECTOR);
}

/**
 * רושם אוטומטית את כל האלמנטים של כל תבנית לעורך המשותף.
 * מזהים קיימים נשמרים כפי שהם; מזהה אוטומטי נוצר רק כשאין מזהה.
 */
export function registerAllVisualElements(root: HTMLElement | null) {
  if (!root) return;

  const nodes = Array.from(
    root.querySelectorAll<HTMLElement>(AUTO_EDITABLE_SELECTOR),
  );

  nodes.forEach((node) => {
    if (!shouldRegisterVisualNode(root, node)) return;

    const existingId = String(
      node.getAttribute("data-visual-edit-id") ||
        node.getAttribute("data-image-field") ||
        node.getAttribute("data-visual-image-field") ||
        "",
    ).trim();

    const elementId = existingId || buildStableVisualDomPath(root, node);
    const elementType = detectAutoVisualType(node);

    node.setAttribute("data-visual-edit-id", elementId);
    node.setAttribute("data-visual-editable", "true");
    node.setAttribute("data-visual-layer", "true");

    if (!node.getAttribute("data-visual-edit-type")) {
      node.setAttribute("data-visual-edit-type", elementType);
    }

    if (!node.getAttribute("data-visual-type")) {
      node.setAttribute("data-visual-type", elementType);
    }

    if (!node.getAttribute("data-visual-edit-label")) {
      const label =
        String(node.getAttribute("aria-label") || "").trim() ||
        String(node.getAttribute("alt") || "").trim() ||
        String(node.textContent || "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 50) ||
        String(node.tagName || "element").toLowerCase();

      node.setAttribute("data-visual-edit-label", label);
    }
  });
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

function getDirectVisualElementType(node: HTMLElement | null) {
  if (!node) return "";

  const type = String(
    node.getAttribute("data-visual-edit-type") ||
      node.getAttribute("data-visual-type") ||
      node.getAttribute("data-edit-type") ||
      "",
  )
    .trim()
    .toLowerCase();

  if (type === "heading" || type === "paragraph") return "text";
  if (type === "link") return "button";
  if (type === "video" || type === "media" || type === "raw") return "image";

  return type;
}

function getFallbackVisualTypeFromTag(node: HTMLElement | null) {
  const tagName = String(node?.tagName || "").toLowerCase();

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

  if (
    ["section", "article", "header", "footer", "main", "nav", "aside"].includes(
      tagName,
    )
  ) {
    return "section";
  }

  return "box";
}

function getSafeVisualType(node: HTMLElement | null) {
  return getDirectVisualElementType(node) || getFallbackVisualTypeFromTag(node);
}

function findVisualNodes(
  root: HTMLElement | null,
  elementId: string,
  options: FindVisualNodesOptions = {},
) {
  if (!root || !elementId) return [];

  const allowFallback = options.allowFallback !== false;
  const safeId = safeCssSelectorValue(elementId);

  const directNodes = Array.from(
    root.querySelectorAll<HTMLElement>(`[data-visual-edit-id="${safeId}"]`),
  );

  if (directNodes.length) {
    return directNodes;
  }

  if (!allowFallback) {
    return [];
  }

  try {
    return Array.from(
      root.querySelectorAll<HTMLElement>(selectorForVisualElement(elementId)),
    );
  } catch {
    return [];
  }
}

function hasMediaInside(node: HTMLElement) {
  return Boolean(
    node instanceof HTMLImageElement ||
    node instanceof HTMLVideoElement ||
    node instanceof HTMLSourceElement ||
    node.querySelector?.(MEDIA_SELECTOR),
  );
}

function isEditorOnlyNode(node: HTMLElement) {
  return Boolean(
    node.getAttribute("data-editor-only") === "true" ||
    node.getAttribute("data-bizuply-editor-only") === "true" ||
    node.getAttribute("data-bizuply-editor-media-preview") === "true" ||
    node.getAttribute("data-visual-selection-box") === "true" ||
    node.getAttribute("data-visual-selection-overlay") === "true" ||
    node.classList.contains("visual-selection-overlay") ||
    node.classList.contains("visual-floating-toolbar") ||
    node.classList.contains("visual-context-menu") ||
    node.classList.contains("visual-inspector-panel"),
  );
}

function shouldApplyTextToNode(node: HTMLElement) {
  if (isEditorOnlyNode(node)) return false;

  if (node.getAttribute("data-visual-inline-editing") === "true") {
    return false;
  }

  const type = getSafeVisualType(node);
  const tagName = String(node.tagName || "").toLowerCase();

  if (type === "image" || type === "section") return false;

  if (
    node instanceof HTMLImageElement ||
    node instanceof HTMLVideoElement ||
    node instanceof HTMLSourceElement
  ) {
    return false;
  }

  if (tagName === "input" || tagName === "textarea") {
    return true;
  }

  if (type === "text" || type === "button") {
    return !hasMediaInside(node);
  }

  if (TEXT_TAGS.includes(tagName)) {
    return !hasMediaInside(node);
  }

  return false;
}

function applyTextContentToNode(node: HTMLElement, value: string) {
  const tagName = String(node.tagName || "").toLowerCase();

  if (node.getAttribute("data-visual-inline-editing") === "true") {
    return;
  }

  if (node instanceof HTMLInputElement) {
    node.value = value;
    node.setAttribute("value", value);
    node.setAttribute("placeholder", value);
    return;
  }

  if (node instanceof HTMLTextAreaElement) {
    node.value = value;
    node.textContent = value;
    node.setAttribute("placeholder", value);
    return;
  }

  if (tagName === "select") {
    return;
  }

  const paintTarget = getTextPaintTarget(node);

  if (paintTarget && paintTarget !== node) {
    paintTarget.textContent = value;
    return;
  }

  node.textContent = value;
}

function applyLinkContentToNode(
  node: HTMLElement,
  href: string,
  target: string = "_self",
  rel?: string,
) {
  if (isEditorOnlyNode(node)) return;

  const cleanHref = href || "#";
  const cleanTarget = target === "_blank" ? "_blank" : "_self";
  const cleanRel =
    rel || (cleanTarget === "_blank" ? "noopener noreferrer" : "");

  const link =
    node instanceof HTMLAnchorElement
      ? node
      : (node.closest("a") as HTMLAnchorElement | null) ||
        (node.querySelector("a") as HTMLAnchorElement | null);

  if (link) {
    link.setAttribute("href", cleanHref);
    link.setAttribute("target", cleanTarget);
    link.setAttribute("data-visual-link-href", cleanHref);
    link.setAttribute("data-visual-link-target", cleanTarget);
    link.setAttribute("data-link-url", cleanHref);

    if (cleanRel) {
      link.setAttribute("rel", cleanRel);
    } else {
      link.removeAttribute("rel");
    }

    return;
  }

  node.setAttribute("data-visual-link-href", cleanHref);
  node.setAttribute("data-visual-link-target", cleanTarget);
  node.setAttribute("data-link-url", cleanHref);
  node.setAttribute("data-href", cleanHref);

  if (cleanHref && cleanHref !== "#") {
    node.setAttribute("role", "link");
    node.style.cursor = "pointer";
  }
}

function getBestImageNode(node: HTMLElement) {
  if (node instanceof HTMLImageElement) return node;

  return node.querySelector?.("img") as HTMLImageElement | null;
}

function getBestVideoNode(node: HTMLElement) {
  if (node instanceof HTMLVideoElement) return node;

  if (
    node instanceof HTMLSourceElement &&
    node.parentElement instanceof HTMLVideoElement
  ) {
    return node.parentElement;
  }

  return node.querySelector?.("video") as HTMLVideoElement | null;
}

function markMediaNode(
  node: HTMLElement,
  mediaType: "image" | "video" | "raw" | string,
) {
  node.setAttribute("data-visual-editable", "true");
  node.setAttribute("data-visual-edit-type", "image");
  node.setAttribute("data-visual-type", "image");
  node.setAttribute("data-visual-media-type", mediaType);
  node.setAttribute("data-resource-type", mediaType);
}

type EditorMediaPreviewState = {
  opacity: string;
  visibility: string;
  pointerEvents: string;
  parentPosition: string;
};

const editorMediaPreviewByTarget = new WeakMap<HTMLElement, HTMLElement>();
const editorMediaPreviewStateByTarget =
  new WeakMap<HTMLElement, EditorMediaPreviewState>();
const editorMediaPreviewById = new Map<string, HTMLElement>();
const editorMediaTargetById = new Map<string, HTMLElement>();

function getEditorMediaTargetId(target: HTMLElement) {
  return String(
    getDirectVisualElementId(target) ||
      target.getAttribute("data-bizuply-preview-for") ||
      "",
  ).trim();
}

function restoreEditorMediaTarget(target: HTMLElement) {
  const state = editorMediaPreviewStateByTarget.get(target);

  target.style.opacity =
    state?.opacity ??
    target.getAttribute("data-bizuply-preview-original-opacity") ??
    "";

  target.style.visibility =
    state?.visibility ??
    target.getAttribute("data-bizuply-preview-original-visibility") ??
    "";

  target.style.pointerEvents =
    state?.pointerEvents ??
    target.getAttribute(
      "data-bizuply-preview-original-pointer-events",
    ) ??
    "";

  target.removeAttribute("data-bizuply-editor-media-target");
  target.removeAttribute("data-bizuply-preview-original-opacity");
  target.removeAttribute("data-bizuply-preview-original-visibility");
  target.removeAttribute(
    "data-bizuply-preview-original-pointer-events",
  );
}

function clearEditorMediaPreview(target: HTMLElement | null) {
  if (!target) return;

  const targetId = getEditorMediaTargetId(target);

  const preview =
    editorMediaPreviewByTarget.get(target) ||
    (targetId ? editorMediaPreviewById.get(targetId) : null);

  if (preview?.parentElement) {
    preview.remove();
  }

  restoreEditorMediaTarget(target);

  const parent = target.parentElement;

  if (
    parent &&
    !parent.querySelector(
      "[data-bizuply-editor-media-preview='true']",
    ) &&
    parent.hasAttribute("data-bizuply-preview-position-owner")
  ) {
    parent.style.position =
      parent.getAttribute(
        "data-bizuply-preview-original-position",
      ) || "";

    parent.removeAttribute("data-bizuply-preview-position-owner");
    parent.removeAttribute(
      "data-bizuply-preview-original-position",
    );
  }

  editorMediaPreviewByTarget.delete(target);
  editorMediaPreviewStateByTarget.delete(target);

  if (targetId) {
    editorMediaPreviewById.delete(targetId);
    editorMediaTargetById.delete(targetId);
  }
}

function syncEditorMediaPreviewBox(
  target: HTMLElement,
  preview: HTMLElement,
) {
  const parent = target.parentElement;
  if (!parent || !preview.isConnected) return;

  const targetRect = target.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  const computed = window.getComputedStyle(target);

  const left =
    targetRect.left -
    parentRect.left +
    parent.scrollLeft -
    parent.clientLeft;

  const top =
    targetRect.top -
    parentRect.top +
    parent.scrollTop -
    parent.clientTop;

  preview.style.left = `${left}px`;
  preview.style.top = `${top}px`;
  preview.style.width = `${Math.max(1, targetRect.width)}px`;
  preview.style.height = `${Math.max(1, targetRect.height)}px`;
  preview.style.transform = "none";
  preview.style.translate = "none";
  preview.style.rotate = "none";
  preview.style.scale = "none";
  preview.style.transformOrigin = "50% 50%";
  preview.style.borderRadius = computed.borderRadius;

  /*
    שכבת התצוגה (preview) משקפת בדיוק את המדיה המקורית — וידאו ותמונה
    זהים: object-fit לפי הערך המחושב של ה-target (ברירת מחדל cover),
    ללא כפיית contain או רקע לבן שגרמו למראה שונה בין וידאו לתמונה.
  */
  preview.style.setProperty(
    "object-fit",
    (computed.objectFit as CSSStyleDeclaration["objectFit"]) || "cover",
  );
  preview.style.setProperty(
    "object-position",
    computed.objectPosition || "50% 50%",
  );
  preview.style.setProperty(
    "background-color",
    computed.backgroundColor || "transparent",
  );
  preview.style.clipPath = computed.clipPath || "";
  preview.style.opacity =
    preview.getAttribute("data-bizuply-preview-ready") === "true"
      ? "1"
      : "0";

  const computedZIndex = Number.parseInt(computed.zIndex, 10);
  preview.style.zIndex = Number.isFinite(computedZIndex)
    ? String(computedZIndex)
    : "1";
}

function createEditorMediaPreview(
  target: HTMLElement,
  type: "image" | "video",
  src: string,
  alt?: string,
) {
  const parent = target.parentElement;
  if (!parent) return null;

  const targetId =
    getDirectVisualElementId(target) ||
    `media-${Math.random().toString(36).slice(2, 9)}`;

  const expectedTag = type === "video" ? "video" : "img";

  let existingPreview =
    editorMediaPreviewByTarget.get(target) ||
    editorMediaPreviewById.get(targetId) ||
    parent.querySelector<HTMLElement>(
      `[data-bizuply-editor-media-preview="true"][data-bizuply-preview-for="${safeCssSelectorValue(
        targetId,
      )}"]`,
    );

  const previousTarget = editorMediaTargetById.get(targetId);

  if (previousTarget && previousTarget !== target) {
    restoreEditorMediaTarget(previousTarget);
    editorMediaPreviewByTarget.delete(previousTarget);
    editorMediaPreviewStateByTarget.delete(previousTarget);
  }

  if (
    existingPreview &&
    existingPreview.tagName.toLowerCase() !== expectedTag
  ) {
    existingPreview.remove();
    existingPreview = null;
  }

  const parentComputed = window.getComputedStyle(parent);

  const state =
    editorMediaPreviewStateByTarget.get(target) || {
      opacity:
        target.getAttribute("data-bizuply-preview-original-opacity") ??
        target.style.opacity,
      visibility:
        target.getAttribute("data-bizuply-preview-original-visibility") ??
        target.style.visibility,
      pointerEvents:
        target.getAttribute(
          "data-bizuply-preview-original-pointer-events",
        ) ?? target.style.pointerEvents,
      parentPosition: parent.style.position,
    };

  if (parentComputed.position === "static") {
    if (
      !parent.hasAttribute(
        "data-bizuply-preview-original-position",
      )
    ) {
      parent.setAttribute(
        "data-bizuply-preview-original-position",
        parent.style.position,
      );
    }

    parent.style.position = "relative";
    parent.setAttribute(
      "data-bizuply-preview-position-owner",
      targetId,
    );
  }

  target.setAttribute("data-bizuply-editor-media-target", "true");
  target.setAttribute(
    "data-bizuply-preview-original-opacity",
    state.opacity,
  );
  target.setAttribute(
    "data-bizuply-preview-original-visibility",
    state.visibility,
  );
  target.setAttribute(
    "data-bizuply-preview-original-pointer-events",
    state.pointerEvents,
  );

  const preview =
    existingPreview ||
    (type === "video"
      ? target.ownerDocument.createElement("video")
      : target.ownerDocument.createElement("img"));

  preview.setAttribute("data-editor-only", "true");
  preview.setAttribute("data-bizuply-editor-only", "true");
  preview.setAttribute("data-bizuply-editor-media-preview", "true");
  preview.setAttribute("data-bizuply-preview-for", targetId);
  preview.setAttribute("data-visual-editable", "true");
  preview.setAttribute("data-visual-edit-type", "image");
  preview.setAttribute("data-visual-type", "image");
  preview.setAttribute("data-visual-media-type", type);
  preview.setAttribute("data-resource-type", type);
  preview.setAttribute("aria-label", alt || "מדיה");
  preview.removeAttribute("aria-hidden");

  preview.style.position = "absolute";
  preview.style.inset = "auto";
  preview.style.margin = "0";
  preview.style.padding = "0";
  preview.style.pointerEvents = "auto";
  preview.style.cursor = "pointer";
  preview.style.display = "block";
  preview.style.maxWidth = "none";
  preview.style.maxHeight = "none";
  preview.style.boxSizing = "border-box";
  preview.style.willChange = "left,top,width,height,opacity";
  preview.style.contain = "layout paint style";
  preview.style.opacity = "0";

  if (preview.parentElement !== parent) {
    parent.appendChild(preview);
  }

  const revealPreview = () => {
    if (!preview.isConnected) return;

    preview.setAttribute("data-bizuply-preview-ready", "true");
    preview.style.opacity = "1";

    target.style.opacity = "0";
    target.style.visibility = "visible";
    target.style.pointerEvents = "none";

    syncEditorMediaPreviewBox(target, preview);
  };

  const failPreview = () => {
    if (!preview.isConnected) return;

    preview.removeAttribute("data-bizuply-preview-ready");
    preview.style.opacity = "0";
    restoreEditorMediaTarget(target);
  };

  const previousSrc = String(
    preview.getAttribute("data-bizuply-preview-src") || "",
  );

  if (preview instanceof HTMLVideoElement) {
    preview.autoplay = true;
    preview.muted = true;
    preview.defaultMuted = true;
    preview.loop = true;
    preview.playsInline = true;
    preview.preload = "metadata";
    preview.controls = false;
    preview.disablePictureInPicture = true;
    applyMediaFitStyles(preview);
    preview.setAttribute("autoplay", "");
    preview.setAttribute("muted", "");
    preview.setAttribute("loop", "");
    preview.setAttribute("playsinline", "");
    preview.setAttribute("preload", "metadata");
    preview.removeAttribute("controls");

    if (previousSrc !== src) {
      preview.removeAttribute("data-bizuply-preview-ready");
      preview.style.opacity = "0";
      restoreEditorMediaTarget(target);

      preview.src = src;
      preview.setAttribute("data-bizuply-preview-src", src);

      preview.addEventListener("loadeddata", revealPreview, {
        once: true,
      });
      preview.addEventListener("canplay", revealPreview, {
        once: true,
      });
      preview.addEventListener("error", failPreview, {
        once: true,
      });

      try {
        preview.load();
      } catch {
        // The browser continues loading naturally.
      }
    } else if (preview.readyState >= 2) {
      revealPreview();
    }

    void preview.play().catch(() => undefined);
  } else {
    const imagePreview = preview as HTMLImageElement;

    if (previousSrc !== src) {
      preview.removeAttribute("data-bizuply-preview-ready");
      preview.style.opacity = "0";
      restoreEditorMediaTarget(target);

      imagePreview.addEventListener("load", revealPreview, {
        once: true,
      });
      imagePreview.addEventListener("error", failPreview, {
        once: true,
      });

      imagePreview.src = src;
      preview.setAttribute("data-bizuply-preview-src", src);
    } else if (imagePreview.complete && imagePreview.naturalWidth > 0) {
      revealPreview();
    }

    imagePreview.alt = alt || "";
  }

  editorMediaPreviewByTarget.set(target, preview);
  editorMediaPreviewStateByTarget.set(target, state);
  editorMediaPreviewById.set(targetId, preview);
  editorMediaTargetById.set(targetId, target);

  syncEditorMediaPreviewBox(target, preview);

  return preview;
}

export function syncEditorMediaPreviewForTarget(
  target: HTMLElement | null,
) {
  if (!target) return;

  const targetId = getDirectVisualElementId(target);
  const preview =
    editorMediaPreviewByTarget.get(target) ||
    (targetId ? editorMediaPreviewById.get(targetId) : null);

  if (preview) {
    editorMediaPreviewByTarget.set(target, preview);

    if (targetId) {
      editorMediaTargetById.set(targetId, target);
    }

    syncEditorMediaPreviewBox(target, preview);
  }
}

export function syncEditorMediaPreviewsInDom(
  root: HTMLElement | null,
) {
  if (!root) return;

  root
    .querySelectorAll<HTMLElement>(
      "[data-bizuply-editor-media-preview='true']",
    )
    .forEach((preview) => {
      const targetId = String(
        preview.getAttribute("data-bizuply-preview-for") || "",
      ).trim();

      if (!targetId) return;

      const safeId = safeCssSelectorValue(targetId);
      const target = root.querySelector<HTMLElement>(
        `[data-visual-edit-id="${safeId}"]`,
      );

      if (!target) {
        preview.remove();
        return;
      }

      syncEditorMediaPreviewBox(target, preview);
    });
}

function clearVisualSelectionMarkers(root: HTMLElement | null) {
  if (!root) return;

  root
    .querySelectorAll<HTMLElement>(
      [
        "[data-visual-selected]",
        "[data-visual-hovered]",
        "[data-visual-edit-selected]",
        "[data-selected]",
        "[data-visual-active]",
        ".visual-selected",
        ".visual-edit-selected",
        ".is-visual-selected",
        ".is-selected",
      ].join(","),
    )
    .forEach((node) => {
      node.removeAttribute("data-visual-selected");
      node.removeAttribute("data-visual-hovered");
      node.removeAttribute("data-visual-edit-selected");
      node.removeAttribute("data-selected");
      node.removeAttribute("data-visual-active");

      node.classList.remove(
        "visual-selected",
        "visual-edit-selected",
        "is-visual-selected",
        "is-selected",
      );
    });
}

function getDomDepth(root: HTMLElement, node: HTMLElement) {
  let depth = 0;
  let cursor: HTMLElement | null = node;

  while (cursor && cursor !== root) {
    depth += 1;
    cursor = cursor.parentElement;
  }

  return depth;
}

function hasDirectEditableDescendant(node: HTMLElement) {
  return Boolean(
    Array.from(node.children).some((child) => {
      if (!(child instanceof HTMLElement)) return false;

      return Boolean(
        child.matches(INNER_EDITABLE_SELECTOR) ||
        child.querySelector(INNER_EDITABLE_SELECTOR),
      );
    }),
  );
}

function isTextLikeNode(node: HTMLElement) {
  const type = getSafeVisualType(node);
  const tagName = String(node.tagName || "").toLowerCase();

  return type === "text" || TEXT_TAGS.includes(tagName);
}

function isSectionLikeNode(node: HTMLElement) {
  const type = getSafeVisualType(node);
  const tagName = String(node.tagName || "").toLowerCase();

  return (
    type === "section" ||
    type === "box" ||
    [
      "section",
      "article",
      "header",
      "footer",
      "main",
      "nav",
      "aside",
      "form",
      "div",
    ].includes(tagName)
  );
}

function getTextPaintTarget(node: HTMLElement) {
  if (!isTextLikeNode(node)) return node;

  if (node.matches(".lunelle-inline-edit-text")) return node;

  const directInnerText = Array.from(
    node.querySelectorAll<HTMLElement>(
      [
        ".lunelle-inline-edit-text",
        "[data-visual-edit-type='text']",
        "[data-visual-type='text']",
        "[data-gjs-type='text']",
        "[data-editable='text']",
        TEXT_SELECTOR,
      ].join(","),
    ),
  ).find((child) => {
    if (child === node) return false;
    if (isEditorOnlyNode(child)) return false;
    if (hasMediaInside(child)) return false;

    return Boolean(
      String(child.textContent || "")
        .replace(/\s+/g, " ")
        .trim(),
    );
  });

  return directInnerText || node;
}

function getSelectionPaintTarget(node: HTMLElement) {
  if (isEditorOnlyNode(node)) return node;

  const type = getSafeVisualType(node);

  if (type === "image") {
    return getBestImageNode(node) || getBestVideoNode(node) || node;
  }

  if (type === "text" || isTextLikeNode(node)) {
    return getTextPaintTarget(node);
  }

  return node;
}

function scoreVisualNodeForSelection(root: HTMLElement, node: HTMLElement) {
  if (isEditorOnlyNode(node)) return -100000;

  const type = getSafeVisualType(node);
  const tagName = String(node.tagName || "").toLowerCase();
  const text = String(node.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
  let score = getDomDepth(root, node) * 10;

  if (
    type === "image" ||
    node instanceof HTMLImageElement ||
    node instanceof HTMLVideoElement
  ) {
    score += 900;
  }

  if (type === "button") {
    score += 650;
  }

  if (type === "text" || TEXT_TAGS.includes(tagName)) {
    score += 800;
  }

  if (text) {
    score += Math.min(text.length, 80);
  }

  if (node.matches(".lunelle-inline-edit-text")) {
    score += 500;
  }

  if (node.matches("[data-gjs-type='text'], [data-editable='text']")) {
    score += 250;
  }

  if (hasDirectEditableDescendant(node)) {
    score -= 420;
  }

  if (isSectionLikeNode(node) && hasDirectEditableDescendant(node)) {
    score -= 900;
  }

  if (type === "section" || type === "box") {
    score -= 500;
  }

  return score;
}

function getBestVisualNodeForId(
  root: HTMLElement,
  elementId: string,
  options: FindVisualNodesOptions = {},
) {
  const nodes = findVisualNodes(root, elementId, options).filter(
    (node) => !isEditorOnlyNode(node),
  );

  if (!nodes.length) return null;

  return nodes.sort(
    (a, b) =>
      scoreVisualNodeForSelection(root, b) -
      scoreVisualNodeForSelection(root, a),
  )[0];
}

function markNodeAsSelected(node: HTMLElement, mode: "selected" | "hovered") {
  const paintTarget = getSelectionPaintTarget(node);

  if (mode === "hovered") {
    paintTarget.setAttribute("data-visual-hovered", "true");
    return;
  }

  paintTarget.setAttribute("data-visual-selected", "true");
  paintTarget.setAttribute("data-visual-edit-selected", "true");
  paintTarget.setAttribute("data-selected", "true");
  paintTarget.setAttribute("data-visual-active", "true");

  paintTarget.classList.add(
    "visual-selected",
    "visual-edit-selected",
    "is-visual-selected",
    "is-selected",
  );

  /*
    אין להעתיק ID של אלמנט נבחר אל wrapper/paintTarget אחר.
    פעולה כזאת יצרה IDs כפולים וגרמה לטקסט לעבור בין מיקומים.
  */
}

function isTextCollectableNode(node: HTMLElement) {
  if (isEditorOnlyNode(node)) return false;
  if (hasMediaInside(node)) return false;

  const type = getSafeVisualType(node);
  const tagName = String(node.tagName || "").toLowerCase();

  if (type === "text" || type === "button") return true;

  if (tagName === "input" || tagName === "textarea") return true;

  return TEXT_TAGS.includes(tagName);
}

export function applyVisualContentToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const content = readVisualContent(data);

  Object.entries(content).forEach(([elementId, item]) => {
    let nodes = findVisualNodes(root, elementId, {
      allowFallback: false,
    });

    if (!nodes.length) {
      nodes = findVisualNodes(root, elementId, {
        allowFallback: true,
      });
    }

    if (!nodes.length) return;

    nodes.forEach((node) => {
      if (isEditorOnlyNode(node)) return;

      const itemRecord = item as Record<string, any>;

      const specialApplied = applyInsertedSpecialContent(
        node,
        itemRecord,
      );

      if (
        !specialApplied &&
        itemRecord.text !== undefined &&
        shouldApplyTextToNode(node)
      ) {
        applyTextContentToNode(node, String(itemRecord.text ?? ""));
      }

      if (itemRecord.href !== undefined) {
        applyLinkContentToNode(
          node,
          itemRecord.href || "#",
          itemRecord.target || "_self",
          itemRecord.rel,
        );
      }

      if (itemRecord.attribution) {
        node.setAttribute(
          "data-media-attribution",
          String(itemRecord.attribution),
        );
      }

      if (itemRecord.sourceUrl) {
        node.setAttribute(
          "data-media-source-url",
          String(itemRecord.sourceUrl),
        );
      }

      if (itemRecord.license?.code) {
        node.setAttribute(
          "data-media-license",
          String(itemRecord.license.code),
        );
      }

      const mediaSrc = String(
        itemRecord.src ||
          itemRecord.secureUrl ||
          itemRecord.secure_url ||
          itemRecord.url ||
          itemRecord.originalUrl ||
          "",
      ).trim();

      if (mediaSrc) {
        const applyAsBackground =
          itemRecord.target === "background" ||
          itemRecord.background === true ||
          itemRecord.applyAsBackground === true;

        if (applyAsBackground) {
          node.style.setProperty(
            "background-image",
            `url("${mediaSrc.replace(/"/g, "%22")}")`,
            "important",
          );
          node.style.setProperty(
            "background-size",
            String(itemRecord.backgroundSize || "cover"),
            "important",
          );
          node.style.setProperty(
            "background-position",
            String(itemRecord.backgroundPosition || "center"),
            "important",
          );
          node.style.setProperty(
            "background-repeat",
            String(itemRecord.backgroundRepeat || "no-repeat"),
            "important",
          );
          node.setAttribute("data-visual-background-src", mediaSrc);
        } else {
          applyMediaContentToNode(
            node,
            mediaSrc,
            itemRecord.alt,
            itemRecord.mediaType ||
              itemRecord.resourceType ||
              itemRecord.resource_type,
          );
        }
      }
    });
  });
}

export function applyMediaContentToNode(
  node: HTMLElement,
  src: string,
  alt?: string,
  mediaType?: string,
) {
  if (!src || isEditorOnlyNode(node)) return;

  const normalizedType =
    normalizeVisualMediaType(mediaType, src) ||
    getVisualMediaTypeFromNode(node, src) ||
    "image";

  const imageNode = getBestImageNode(node);
  const videoNode = getBestVideoNode(node);

  if (normalizedType === "video") {
    if (videoNode) {
      clearEditorMediaPreview(videoNode);

      videoNode.style.opacity = "";
      videoNode.style.visibility = "";
      videoNode.style.pointerEvents = "";
      videoNode.style.display = "block";
      videoNode.style.maxWidth = "none";
      videoNode.style.maxHeight = "none";
      applyMediaFitStyles(videoNode);

      const previousSrc = String(
        videoNode.getAttribute("data-visual-current-src") ||
          videoNode.currentSrc ||
          videoNode.getAttribute("src") ||
          "",
      );

      videoNode.setAttribute("src", src);
      videoNode.setAttribute("data-visual-current-src", src);
      videoNode.setAttribute("data-video-src", src);
      videoNode.setAttribute("data-visual-media-type", "video");
      videoNode.setAttribute("data-resource-type", "video");
      videoNode.removeAttribute("controls");
      videoNode.setAttribute("autoplay", "");
      videoNode.setAttribute("muted", "");
      videoNode.setAttribute("loop", "");
      videoNode.setAttribute("playsinline", "");
      videoNode.setAttribute("preload", "metadata");

      videoNode.autoplay = true;
      videoNode.muted = true;
      videoNode.defaultMuted = true;
      videoNode.loop = true;
      videoNode.controls = false;
      videoNode.playsInline = true;
      videoNode.preload = "metadata";

      try {
        /*
          טוענים מחדש רק כשה-src באמת השתנה, ומנגנים רק אם הווידאו עצור.
          כך אין reload/play מיותרים בכל עדכון data שגרמו לניצנוץ וקפיצה.
        */
        if (previousSrc !== src) {
          videoNode.src = src;
          videoNode.load();
        }

        if (videoNode.paused) {
          void videoNode.play().catch(() => undefined);
        }
      } catch {
        // Ignore browser media assignment errors.
      }

      if (alt) {
        videoNode.setAttribute("title", alt);
        videoNode.setAttribute("aria-label", alt);
      }

      markMediaNode(videoNode, "video");
      return;
    }

    if (imageNode) {
      imageNode.setAttribute("data-visual-current-src", src);
      imageNode.setAttribute("data-video-src", src);
      imageNode.setAttribute("data-visual-media-type", "video");
      imageNode.setAttribute("data-resource-type", "video");

      if (alt) {
        imageNode.setAttribute("alt", alt);
      }

      markMediaNode(imageNode, "video");
      applyMediaFitStyles(imageNode);

      /*
        React ממשיך לנהל את תגית ה-img המקורית.
        תצוגת הווידאו נוצרת בתוך אותו parent, בדיוק מעל שטח התמונה,
        בלי שכבת fixed ובלי z-index גלובלי שמכסה את כל האתר.
      */
      createEditorMediaPreview(imageNode, "video", src, alt);
      return;
    }

    node.setAttribute("data-visual-current-src", src);
    node.setAttribute("data-video-src", src);
    node.setAttribute("data-visual-media-type", "video");
    node.setAttribute("data-resource-type", "video");
    markMediaNode(node, "video");
    return;
  }

  if (normalizedType === "image") {
    if (imageNode) {
      clearEditorMediaPreview(imageNode);

      imageNode.style.opacity = "";
      imageNode.style.visibility = "";
      imageNode.style.pointerEvents = "";

      imageNode.setAttribute("src", src);
      imageNode.setAttribute("data-visual-current-src", src);
      imageNode.setAttribute("data-image-src", src);
      imageNode.setAttribute("data-visual-media-type", "image");
      imageNode.setAttribute("data-resource-type", "image");

      try {
        imageNode.src = src;
      } catch {
        // Ignore browser image assignment errors.
      }

      if (alt) {
        imageNode.setAttribute("alt", alt);
      }

      markMediaNode(imageNode, "image");
      return;
    }

    if (videoNode) {
      videoNode.setAttribute("poster", src);
      videoNode.setAttribute("data-visual-current-src", src);
      videoNode.setAttribute("data-image-src", src);
      videoNode.setAttribute("data-visual-media-type", "image");
      videoNode.setAttribute("data-resource-type", "image");

      if (alt) {
        videoNode.setAttribute("title", alt);
        videoNode.setAttribute("aria-label", alt);
      }

      markMediaNode(videoNode, "image");
      createEditorMediaPreview(videoNode, "image", src, alt);
      return;
    }

    clearEditorMediaPreview(node);

    node.setAttribute("data-visual-current-src", src);
    node.setAttribute("data-image-src", src);
    node.setAttribute("data-visual-media-type", "image");
    node.setAttribute("data-resource-type", "image");
    markMediaNode(node, "image");
  }
}

export function applyVisualStylesToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const styles = readVisualStyles(data);

  Object.entries(styles).forEach(([elementId, style]) => {
    const nodes = findVisualNodes(root, elementId, {
      allowFallback: false,
    });

    nodes.forEach((node) => {
      if (isEditorOnlyNode(node)) return;

      Object.entries(style || {}).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;

        try {
          node.style.setProperty(
            key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
            String(value),
            "important",
          );
        } catch {
          // ignore invalid css values
        }
      });

      /*
        וידאו מכבד עכשיו את הסגנון השמור בדיוק כמו תמונה.
        אם לא הוגדר object-fit שמור, מחילים ברירת מחדל cover (ללא important)
        כדי שלא תהיה עיוות מברירת המחדל של הדפדפן, אך מבלי לדרוס בחירה של המשתמש.
      */
      const isVideoMedia =
        node instanceof HTMLVideoElement ||
        node.getAttribute("data-visual-media-type") === "video" ||
        node.getAttribute("data-resource-type") === "video";

      if (isVideoMedia && !node.style.objectFit) {
        applyMediaFitStyles(node);
      }
    });
  });
}


function cssPropertyName(key: string) {
  if (key.startsWith("--")) return key;

  return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function rememberAppliedProperties(
  node: HTMLElement,
  attributeName: string,
  properties: string[],
) {
  const previous = String(node.getAttribute(attributeName) || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  previous.forEach((property) => {
    if (!properties.includes(property)) {
      node.style.removeProperty(property);
    }
  });

  if (properties.length) {
    node.setAttribute(attributeName, properties.join(","));
  } else {
    node.removeAttribute(attributeName);
  }
}

function applyStyleRecord(
  node: HTMLElement,
  style: Record<string, any>,
  trackingAttribute: string,
) {
  const appliedProperties: string[] = [];

  Object.entries(style || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    const property = cssPropertyName(key);

    try {
      node.style.setProperty(property, String(value), "important");
      appliedProperties.push(property);
    } catch {
      // Invalid CSS property/value is ignored.
    }
  });

  rememberAppliedProperties(node, trackingAttribute, appliedProperties);
}

function detectVisualDeviceMode(root: HTMLElement): VisualDeviceMode {
  const explicit = String(
    root.getAttribute("data-visual-device") ||
      root.closest<HTMLElement>("[data-visual-device]")?.getAttribute(
        "data-visual-device",
      ) ||
      "",
  )
    .trim()
    .toLowerCase();

  if (explicit === "mobile") return "mobile";
  if (explicit === "tablet") return "tablet";
  if (explicit === "desktop") return "desktop";

  const width = root.getBoundingClientRect().width || root.clientWidth;

  if (width <= 480) return "mobile";
  if (width <= 900) return "tablet";

  return "desktop";
}

function layoutItemToStyle(
  layout: VisualLayoutItem | undefined,
): Record<string, any> {
  if (!layout) return {};

  const style: Record<string, any> = {};

  [
    "width",
    "height",
    "minWidth",
    "maxWidth",
    "minHeight",
    "maxHeight",
    "position",
    "top",
    "right",
    "bottom",
    "left",
    "zIndex",
    "order",
    "display",
    "flexDirection",
    "justifyContent",
    "alignItems",
    "alignSelf",
    "gap",
    "gridTemplateColumns",
    "gridTemplateRows",
    "gridColumn",
    "gridRow",
    "overflow",
    "aspectRatio",
  ].forEach((key) => {
    const value = (layout as Record<string, any>)[key];

    if (value !== undefined && value !== null && value !== "") {
      style[key] = value;
    }
  });

  const isFreeAbsolute =
    Boolean(layout.freePosition) ||
    layout.position === "absolute";

  if (isFreeAbsolute) {
    if (style.left === undefined) style.left = 0;
    if (style.top === undefined) style.top = 0;
    if (style.right === undefined) style.right = "auto";
    if (style.bottom === undefined) style.bottom = "auto";
    if (style.width !== undefined) style.maxWidth = "none";
    if (style.height !== undefined) style.maxHeight = "none";
  }

  const translateX = Number(
    layout.translateX ?? layout.x ?? 0,
  );
  const translateY = Number(
    layout.translateY ?? layout.y ?? 0,
  );

  if (translateX || translateY || isFreeAbsolute) {
    style.translate = `${translateX || 0}px ${translateY || 0}px`;
  }

  if (
    layout.rotate !== undefined &&
    layout.rotate !== null &&
    layout.rotate !== 0
  ) {
    style.rotate = `${Number(layout.rotate)}deg`;
  }

  if (
    layout.scaleX !== undefined ||
    layout.scaleY !== undefined
  ) {
    style.scale = `${Number(layout.scaleX ?? 1)} ${Number(
      layout.scaleY ?? layout.scaleX ?? 1,
    )}`;
  }

  return style;
}

export function applyVisualLayoutToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const layout = readVisualLayout(data);

  Object.entries(layout).forEach(([elementId, item]) => {
    const nodes = findVisualNodes(root, elementId, {
      allowFallback: false,
    });

    nodes.forEach((node) => {
      if (isEditorOnlyNode(node)) return;

      applyStyleRecord(
        node,
        layoutItemToStyle(item),
        "data-visual-applied-layout-properties",
      );
    });
  });
}

export function applyVisualAttributesToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const attributes = readVisualAttributes(data);

  Object.entries(attributes).forEach(([elementId, item]) => {
    const nodes = findVisualNodes(root, elementId, {
      allowFallback: false,
    });

    nodes.forEach((node) => {
      if (isEditorOnlyNode(node)) return;

      Object.entries(item || {}).forEach(([key, value]) => {
        if (
          key === "data-visual-edit-id" ||
          key === "data-visual-edit-type" ||
          key === "data-visual-type"
        ) {
          return;
        }

        if (key === "className" || key === "class") {
          if (value === null || value === "") {
            node.removeAttribute("class");
          } else {
            node.setAttribute("class", String(value));
          }

          return;
        }

        if (value === null || value === false || value === "") {
          node.removeAttribute(key);
          return;
        }

        if (value === true) {
          node.setAttribute(key, "");
          return;
        }

        node.setAttribute(key, String(value));
      });
    });
  });
}

export function applyVisualResponsiveToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const responsive = readVisualResponsive(data);
  const device = detectVisualDeviceMode(root);

  root.setAttribute("data-visual-device", device);

  Object.entries(responsive).forEach(([elementId, deviceMap]) => {
    const item = deviceMap?.[device];
    const nodes = findVisualNodes(root, elementId, {
      allowFallback: false,
    });

    nodes.forEach((node) => {
      if (isEditorOnlyNode(node)) return;

      const style = {
        ...(item?.styles || {}),
        ...layoutItemToStyle(item?.layout),
      };

      applyStyleRecord(
        node,
        style as Record<string, any>,
        "data-visual-applied-responsive-properties",
      );

      if (item?.hidden) {
        node.setAttribute("data-visual-responsive-hidden", "true");
        node.style.setProperty("display", "none", "important");
      } else {
        node.removeAttribute("data-visual-responsive-hidden");

        if (
          node.getAttribute("data-visual-deleted") !== "true" &&
          node.getAttribute("data-visual-hidden") !== "true"
        ) {
          node.style.removeProperty("display");
        }
      }
    });
  });
}

export function applyVisualLockedToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  root
    .querySelectorAll<HTMLElement>("[data-visual-locked='true']")
    .forEach((node) => {
      node.removeAttribute("data-visual-locked");
      node.removeAttribute("aria-disabled");
    });

  const locked = readVisualLocked(data);

  Object.entries(locked).forEach(([elementId, isLocked]) => {
    if (!isLocked) return;

    findVisualNodes(root, elementId, {
      allowFallback: false,
    }).forEach((node) => {
      if (isEditorOnlyNode(node)) return;

      node.setAttribute("data-visual-locked", "true");
      node.setAttribute("aria-disabled", "true");
    });
  });
}

export function applyVisualHiddenToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  root
    .querySelectorAll<HTMLElement>("[data-visual-hidden='true']")
    .forEach((node) => {
      node.removeAttribute("data-visual-hidden");
      node.style.removeProperty("visibility");
      node.style.removeProperty("pointer-events");
    });

  const hidden = readVisualHidden(data);

  Object.entries(hidden).forEach(([elementId, isHidden]) => {
    if (!isHidden) return;

    findVisualNodes(root, elementId, {
      allowFallback: false,
    }).forEach((node) => {
      if (isEditorOnlyNode(node)) return;

      node.setAttribute("data-visual-hidden", "true");
      node.style.setProperty("visibility", "hidden", "important");
      node.style.setProperty("pointer-events", "none", "important");
    });
  });
}

export function applyVisualDeletedToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  root
    .querySelectorAll<HTMLElement>("[data-visual-deleted='true']")
    .forEach((node) => {
      node.removeAttribute("data-visual-deleted");

      const originalDisplay = node.getAttribute(
        "data-visual-deleted-original-display",
      );
      const originalPriority = node.getAttribute(
        "data-visual-deleted-original-display-priority",
      );

      node.removeAttribute("data-visual-deleted-original-display");
      node.removeAttribute(
        "data-visual-deleted-original-display-priority",
      );

      if (
        node.getAttribute("data-visual-responsive-hidden") !== "true"
      ) {
        if (originalDisplay) {
          node.style.setProperty(
            "display",
            originalDisplay,
            originalPriority || "",
          );
        } else {
          node.style.removeProperty("display");
        }
      }
    });

  const deleted = readVisualDeleted(data);

  Object.entries(deleted).forEach(([elementId, isDeleted]) => {
    if (!isDeleted) return;

    const nodes = findVisualNodes(root, elementId, {
      allowFallback: false,
    });

    nodes.forEach((node) => {
      if (isEditorOnlyNode(node)) return;

      if (!node.hasAttribute("data-visual-deleted-original-display")) {
        node.setAttribute(
          "data-visual-deleted-original-display",
          node.style.getPropertyValue("display"),
        );
        node.setAttribute(
          "data-visual-deleted-original-display-priority",
          node.style.getPropertyPriority("display"),
        );
      }

      node.setAttribute("data-visual-deleted", "true");
      node.style.setProperty("display", "none", "important");
    });
  });
}

export function prepareAllVideosInDom(root: HTMLElement | null) {
  if (!root) return;

  root.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
    /*
      הגדרת מאפייני הנגינה נעשית פעם אחת בלבד לכל וידאו.
      חזרה עליה בכל עדכון data גרמה ל-reset של הסגנון ולקפיצות בזמן resize.
    */
    if (video.getAttribute("data-bizuply-video-prepared") !== "true") {
      video.setAttribute("autoplay", "");
      video.setAttribute("muted", "");
      video.setAttribute("loop", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("preload", "metadata");
      video.removeAttribute("controls");

      video.autoplay = true;
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.controls = false;
      video.playsInline = true;
      video.preload = "metadata";

      video.style.display = "block";
      video.style.maxWidth = "none";
      video.style.maxHeight = "none";

      video.setAttribute("data-bizuply-video-prepared", "true");
    }

    /*
      וידאו מתנהג כמו תמונה: object-fit ברירת מחדל cover, ללא כפיית contain
      וללא רקע לבן. מחילים רק כשאין ערך שמור, כדי לא לדרוס בחירת משתמש.
    */
    if (!video.style.objectFit) {
      applyMediaFitStyles(video);
    }

    const src = String(
      video.getAttribute("data-visual-current-src") ||
        video.getAttribute("data-video-src") ||
        video.getAttribute("src") ||
        "",
    ).trim();

    if (src) {
      video.setAttribute("data-visual-current-src", src);
      video.setAttribute("data-video-src", src);
    }

    if (video.paused) {
      void video.play().catch(() => undefined);
    }
  });
}

export function markSelectedVisualElementInDom(
  root: HTMLElement | null,
  selectedElementId?: string,
  hoveredElementId?: string,
) {
  if (!root) return;

  clearVisualSelectionMarkers(root);

  if (hoveredElementId) {
    const hoveredNode = getBestVisualNodeForId(root, hoveredElementId, {
      allowFallback: false,
    });

    if (hoveredNode) {
      markNodeAsSelected(hoveredNode, "hovered");
    }
  }

  if (selectedElementId) {
    const selectedNode = getBestVisualNodeForId(root, selectedElementId, {
      allowFallback: false,
    });

    if (selectedNode) {
      markNodeAsSelected(selectedNode, "selected");
    }
  }
}

export function getBestVisualNodeForSelectionById(
  root: HTMLElement | null,
  elementId: string,
) {
  if (!root) return null;

  return getBestVisualNodeForId(root, elementId, { allowFallback: false });
}


function getVisualRuntimeRoot(root: HTMLElement) {
  return (
    root.querySelector<HTMLElement>('[data-bizuply-site="true"]') ||
    root.querySelector<HTMLElement>('[data-studio-page="true"]') ||
    root.querySelector<HTMLElement>("main") ||
    (root.firstElementChild instanceof HTMLElement
      ? root.firstElementChild
      : root)
  );
}

function findDirectVisualNode(
  root: HTMLElement,
  elementId: string,
) {
  const id = String(elementId || "").trim();
  if (!id) return null;

  const safeId = safeCssSelectorValue(id);

  return root.querySelector<HTMLElement>(
    `[data-visual-edit-id="${safeId}"]`,
  );
}

function markInsertedNode(
  node: HTMLElement,
  id: string,
  type: string,
  label: string,
) {
  node.setAttribute("data-visual-edit-id", id);
  node.setAttribute("data-visual-editable", "true");
  node.setAttribute("data-visual-edit-type", type);
  node.setAttribute("data-visual-type", type);
  node.setAttribute("data-visual-inserted", "true");
  node.setAttribute("data-visual-edit-label", label || type);
}

function ensurePositioningContext(node: HTMLElement) {
  const computed = window.getComputedStyle(node);

  if (computed.position === "static") {
    node.style.position = "relative";
    node.setAttribute(
      "data-visual-positioning-context",
      "true",
    );
  }

  if (computed.overflow === "hidden") {
    node.setAttribute(
      "data-visual-original-overflow",
      node.style.overflow || "",
    );
    node.style.overflow = "visible";
  }

  node.style.isolation = node.style.isolation || "isolate";
}

function createInsertedSectionNode(
  root: HTMLElement,
  item: VisualInsertedSection,
) {
  const section = root.ownerDocument.createElement("section");

  markInsertedNode(
    section,
    item.id,
    "section",
    item.label || "סקשן חדש",
  );

  section.setAttribute(
    "data-visual-inserted-section",
    "true",
  );
  section.setAttribute("data-section-kind", "custom");
  section.setAttribute(
    "data-section-title",
    item.label || "סקשן חדש",
  );

  section.style.position = "relative";
  section.style.width = "100%";
  section.style.minHeight = "320px";
  section.style.padding = "64px 32px";
  section.style.background = item.preset === "cta" ? "#f8fafc" : "#ffffff";
  section.style.overflow = "visible";
  section.style.isolation = "isolate";
  // הסקשן עצמו נפרס על כל הרוחב (רקע מלא), אבל התוכן ממורכז בתוך "לוח" קבוע
  section.style.display = "flex";
  section.style.justifyContent = "center";
  section.style.alignItems = "stretch";
  // Library section coords are LTR artboard (x from left); keep Hebrew via dir on text nodes
  section.style.direction = "ltr";
  section.dir = "ltr";

  // יוצרים מיד את לוח התוכן הממורכז כדי שכל האלמנטים יישבו בתוכו
  getInsertedSectionArtboard(section);

  return section;
}

/**
 * מחזיר (ובמידת הצורך יוצר) את "לוח התוכן" הממורכז שבתוך סקשן שהוזרק.
 * האלמנטים בספריית הסקשנים ממוקמים בקואורדינטות אבסולוטיות על לוח ברוחב
 * קבוע (~1180px). כדי שהסקשן ייראה מקצועי ויתפרס על כל הרוחב, הרקע נפרס
 * על כל המסך אבל התוכן ממורכז בתוך הלוח הזה במקום להיצמד לצד אחד.
 */
function getInsertedSectionArtboard(
  section: HTMLElement,
): HTMLElement {
  // מוודאים שהסקשן ממרכז את התוכן (גם עבור סקשנים ישנים שנשמרו)
  if (section.style.display !== "flex") {
    section.style.display = "flex";
    section.style.justifyContent = "center";
    section.style.alignItems = "stretch";
  }

  let artboard = Array.from(section.children).find(
    (child) =>
      child instanceof HTMLElement &&
      child.getAttribute("data-visual-section-artboard") === "true",
  ) as HTMLElement | undefined;

  if (!artboard) {
    artboard = section.ownerDocument.createElement("div");
    artboard.setAttribute("data-visual-section-artboard", "true");
    artboard.style.position = "relative";
    artboard.style.width = "100%";
    artboard.style.maxWidth = "1180px";
    artboard.style.minHeight = "100%";
    artboard.style.margin = "0 auto";
    artboard.style.direction = "ltr";

    // מעבירים אלמנטים קיימים (מסקשנים ישנים שנשמרו) אל תוך הלוח הממורכז
    Array.from(section.children).forEach((child) => {
      if (
        child instanceof HTMLElement &&
        child !== artboard &&
        child.getAttribute("data-visual-inserted-element") === "true"
      ) {
        artboard!.appendChild(child);
      }
    });

    section.appendChild(artboard);
  }

  return artboard;
}

const LIBRARY_ARTBOARD_WIDTH = 1100;
const artboardResizeObservers = new WeakMap<HTMLElement, ResizeObserver>();

function syncInsertedSectionArtboards(root: HTMLElement) {
  root
    .querySelectorAll<HTMLElement>(
      '[data-visual-inserted-section="true"]',
    )
    .forEach((section) => {
      const artboard = getInsertedSectionArtboard(section);
      const computed = window.getComputedStyle(section);
      const horizontalPadding =
        Number.parseFloat(computed.paddingLeft || "0") +
        Number.parseFloat(computed.paddingRight || "0");
      const availableWidth = Math.max(
        1,
        section.clientWidth - horizontalPadding,
      );
      const scale = Math.min(1, availableWidth / LIBRARY_ARTBOARD_WIDTH);

      if (!section.dataset.visualLibraryDesignHeight) {
        section.dataset.visualLibraryDesignHeight = String(
          Number.parseFloat(section.style.minHeight || "0") ||
            section.clientHeight ||
            520,
        );
      }

      const designHeight =
        Number.parseFloat(section.dataset.visualLibraryDesignHeight) || 520;

      artboard.style.width = `${LIBRARY_ARTBOARD_WIDTH}px`;
      artboard.style.maxWidth = "none";
      artboard.style.minHeight = `${designHeight}px`;
      artboard.style.flex = "0 0 auto";
      artboard.style.transformOrigin = "top center";
      (artboard.style as any).zoom = String(scale);

      section.style.minHeight = `${Math.ceil(designHeight * scale)}px`;
      section.style.overflow = "hidden";
    });
}

function observeInsertedSectionArtboards(root: HTMLElement) {
  if (
    typeof ResizeObserver === "undefined" ||
    artboardResizeObservers.has(root)
  ) {
    return;
  }

  let frame = 0;
  const observer = new ResizeObserver(() => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      syncInsertedSectionArtboards(root);
    });
  });

  observer.observe(root);
  artboardResizeObservers.set(root, observer);
}

function placeInsertedSection(
  runtimeRoot: HTMLElement,
  section: HTMLElement,
  item: VisualInsertedSection,
) {
  const anchor = item.anchorId
    ? findDirectVisualNode(runtimeRoot, item.anchorId)
    : null;

  if (anchor && item.placement === "before") {
    anchor.before(section);
    return;
  }

  if (anchor && item.placement === "after") {
    anchor.after(section);
    return;
  }

  runtimeRoot.appendChild(section);
}

export function renderVisualInsertedSectionsToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const runtimeRoot = getVisualRuntimeRoot(root);
  const sections = readVisualInsertedSections(data || {});
  const ids = new Set(Object.keys(sections));

  root
    .querySelectorAll<HTMLElement>(
      '[data-visual-inserted-section="true"]',
    )
    .forEach((node) => {
      const id = getDirectVisualElementId(node);

      if (!id || !ids.has(id)) {
        node.remove();
      }
    });

  Object.values(sections).forEach((item) => {
    if (!item?.id) return;

    let section = findDirectVisualNode(root, item.id);

    if (
      !section ||
      section.getAttribute(
        "data-visual-inserted-section",
      ) !== "true"
    ) {
      section = createInsertedSectionNode(root, item);
    }

    placeInsertedSection(runtimeRoot, section, item);
  });
}


export function normalizePhoneForHref(value: unknown) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/\D/g, "");

  if (!digits) return "";

  if (hasPlus) return `+${digits}`;
  if (digits.startsWith("0")) return `+972${digits.slice(1)}`;

  return digits;
}

export function normalizeWhatsAppPhone(value: unknown) {
  return normalizePhoneForHref(value).replace(/\D/g, "");
}

function buildInsertedLinkHref(
  type: string,
  item: Record<string, any>,
) {
  if (type === "phone-link") {
    const phone = normalizePhoneForHref(
      item.phoneNumber || item.phone || item.href,
    );
    return phone ? `tel:${phone}` : "#";
  }

  if (type === "email-link") {
    const email = String(item.email || "").trim();
    if (!email) return "#";

    const params = new URLSearchParams();
    if (item.subject) params.set("subject", String(item.subject));
    if (item.body) params.set("body", String(item.body));
    const query = params.toString();

    return `mailto:${email}${query ? `?${query}` : ""}`;
  }

  if (
    type === "social-link" &&
    String(item.platform || "").toLowerCase() === "whatsapp"
  ) {
    const phone = normalizePhoneForHref(
      item.phoneNumber || item.phone,
    ).replace(/\D/g, "");

    if (!phone) return "#";

    const message = String(item.message || "").trim();
    return `https://wa.me/${phone}${
      message ? `?text=${encodeURIComponent(message)}` : ""
    }`;
  }

  return String(item.href || "#");
}

function resolveLibraryIconText(item: Record<string, any>) {
  const explicit = String(item.iconText || "").trim();
  if (explicit) return explicit;

  const name = String(item.iconName || item.platform || "")
    .trim()
    .toLowerCase();

  const icons: Record<string, string> = {
    instagram: "IG",
    facebook: "f",
    whatsapp: "WA",
    tiktok: "♪",
    youtube: "▶",
    linkedin: "in",
    x: "X",
    telegram: "➤",
    pinterest: "P",
    phone: "☎",
    email: "✉",
    map: "⌖",
    waze: "W",
    globe: "◎",
    custom: "◎",
    arrow: "→",
    star: "★",
    check: "✓",
    heart: "♥",
    sparkles: "✦",
    plus: "+",
    play: "▶",
  };

  return icons[name] || "•";
}

function applyInsertedSpecialContent(
  node: HTMLElement,
  item: Record<string, any>,
) {
  const type = getSafeVisualType(node);

  if (
    type === "social-link" ||
    type === "phone-link" ||
    type === "email-link"
  ) {
    const anchor = node as HTMLAnchorElement;
    const icon = resolveLibraryIconText(item);
    const label = String(item.text || "").trim();

    anchor.href = buildInsertedLinkHref(type, item);
    anchor.target = String(
      item.target ||
        (type === "phone-link" || type === "email-link"
          ? "_self"
          : "_blank"),
    );

    if (anchor.target === "_blank") {
      anchor.rel = String(
        item.rel || "noopener noreferrer",
      );
    }

    anchor.setAttribute(
      "aria-label",
      String(item.ariaLabel || label || item.platform || type),
    );

    anchor.replaceChildren();

    const iconUrl = String(item.iconUrl || "").trim();

    if (iconUrl) {
      const iconImage = node.ownerDocument.createElement("img");
      iconImage.setAttribute(
        "data-bizuply-library-icon",
        String(item.iconName || item.platform || "custom"),
      );
      iconImage.setAttribute("src", iconUrl);
      iconImage.setAttribute("alt", "");
      iconImage.setAttribute("aria-hidden", "true");
      iconImage.style.width = String(item.iconWidth || "24px");
      iconImage.style.height = String(item.iconHeight || "24px");
      iconImage.style.display = "block";
      iconImage.style.objectFit = "contain";
      iconImage.style.pointerEvents = "none";
      anchor.appendChild(iconImage);
    } else {
      const iconSpan = node.ownerDocument.createElement("span");
      iconSpan.setAttribute(
        "data-bizuply-library-icon",
        String(item.iconName || item.platform || "custom"),
      );
      iconSpan.textContent = icon;
      iconSpan.style.display = "inline-flex";
      iconSpan.style.alignItems = "center";
      iconSpan.style.justifyContent = "center";
      iconSpan.style.lineHeight = "1";
      iconSpan.style.pointerEvents = "none";
      anchor.appendChild(iconSpan);
    }

    if (label) {
      const labelSpan = node.ownerDocument.createElement("span");
      labelSpan.textContent = label;
      labelSpan.style.pointerEvents = "none";
      anchor.appendChild(labelSpan);
    }

    return true;
  }

  if (type === "icon") {
    node.textContent = resolveLibraryIconText(item);
    node.setAttribute(
      "aria-label",
      String(item.ariaLabel || item.iconName || "icon"),
    );
    return true;
  }

  if (type === "embed" || type === "html") {
    const lottieSrc = String(item.lottieSrc || "").trim();
    const embedType = String(item.embedType || "").trim();

    if (embedType === "lottie" && lottieSrc) {
      node.innerHTML = "";

      const ensureLottiePlayerScript = () => {
        if (typeof customElements !== "undefined" && customElements.get("lottie-player")) {
          return Promise.resolve();
        }

        const existing = document.querySelector(
          'script[data-bizuply-lottie-player="true"]',
        );

        if (existing) {
          return new Promise<void>((resolve) => {
            existing.addEventListener("load", () => resolve(), { once: true });
            window.setTimeout(resolve, 1200);
          });
        }

        return new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src =
            "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
          script.async = true;
          script.setAttribute("data-bizuply-lottie-player", "true");
          script.onload = () => resolve();
          script.onerror = () => resolve();
          document.head.appendChild(script);
          window.setTimeout(resolve, 1200);
        });
      };

      void ensureLottiePlayerScript().then(() => {
        const player = document.createElement("lottie-player");
        player.setAttribute("src", lottieSrc);
        player.setAttribute("background", "transparent");
        player.setAttribute("speed", "1");
        player.setAttribute("loop", "");
        player.setAttribute("autoplay", "");
        player.style.width = "100%";
        player.style.height = "100%";
        node.appendChild(player);
      });

      return true;
    }

    const html = String(item.html || "").trim();
    if (html) {
      node.innerHTML = html;
    }
    return true;
  }

  if (type === "form-field") {
    const field = node as HTMLInputElement | HTMLTextAreaElement;

    if (field instanceof HTMLInputElement) {
      field.type = String(item.inputType || "text");
    }

    field.setAttribute(
      "name",
      String(item.name || node.getAttribute("data-visual-edit-id") || ""),
    );
    field.setAttribute(
      "placeholder",
      String(item.placeholder || ""),
    );

    if (item.value !== undefined) {
      field.value = String(item.value ?? "");
    }

    return true;
  }

  return false;
}

export function applyVisualLibraryPageMode(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const runtimeRoot = getVisualRuntimeRoot(root);
  const blankPage = data?.__blankVisualPage === true;

  Array.from(runtimeRoot.children).forEach((child) => {
    if (!(child instanceof HTMLElement)) return;

    const inserted =
      child.getAttribute("data-visual-inserted-section") === "true";

    if (blankPage && !inserted) {
      if (
        !child.hasAttribute(
          "data-bizuply-library-original-display",
        )
      ) {
        child.setAttribute(
          "data-bizuply-library-original-display",
          child.style.display || "",
        );
      }

      child.style.display = "none";
      child.setAttribute(
        "data-bizuply-library-default-hidden",
        "true",
      );
      return;
    }

    if (
      child.getAttribute(
        "data-bizuply-library-default-hidden",
      ) === "true"
    ) {
      child.style.display =
        child.getAttribute(
          "data-bizuply-library-original-display",
        ) || "";
      child.removeAttribute(
        "data-bizuply-library-default-hidden",
      );
    }
  });
}

function createInsertedElementNode(
  root: HTMLElement,
  item: VisualInsertedElement,
) {
  const type = String(item.type || "text");
  const tagName =
    item.tagName ||
    (type === "button"
      ? "a"
      : type === "image"
        ? "img"
        : type === "video"
          ? "video"
          : type === "social-link" ||
              type === "phone-link" ||
              type === "email-link"
            ? "a"
            : type === "form-field"
              ? "input"
              : "div");

  const node = root.ownerDocument.createElement(tagName);

  markInsertedNode(
    node,
    item.id,
    type,
    item.label ||
      (type === "text"
        ? "טקסט חדש"
        : type === "button"
          ? "כפתור חדש"
          : type === "image"
            ? "תמונה חדשה"
            : type === "video"
              ? "סרטון חדש"
              : type === "divider"
                ? "קו מפריד"
                : "אלמנט חדש"),
  );

  node.setAttribute(
    "data-visual-inserted-element",
    "true",
  );
  node.setAttribute(
    "data-visual-parent-id",
    item.parentId || "",
  );

  node.style.position = "absolute";
  node.style.left = "0px";
  node.style.top = "0px";
  node.style.right = "auto";
  node.style.bottom = "auto";
  node.style.margin = "0";
  node.style.boxSizing = "border-box";
  node.style.touchAction = "none";

  if (type === "text") {
    node.textContent = "טקסט חדש";
    node.style.minWidth = "160px";
    node.style.padding = "6px 10px";
    node.style.fontSize = "32px";
    node.style.fontWeight = "800";
    node.style.lineHeight = "1.2";
    node.style.color = "#111827";
    node.style.whiteSpace = "pre-wrap";
  }

  if (type === "button") {
    node.textContent = "כפתור חדש";
    node.setAttribute("type", "button");
    node.style.minWidth = "150px";
    node.style.minHeight = "48px";
    node.style.padding = "12px 24px";
    node.style.border = "0";
    node.style.borderRadius = "999px";
    node.style.background = "#7c3aed";
    node.style.color = "#ffffff";
    node.style.fontSize = "16px";
    node.style.fontWeight = "800";
    node.style.cursor = "pointer";
  }

  if (type === "image") {
    const image = node as HTMLImageElement;
    image.alt = item.label || "תמונה";
    image.draggable = false;
    image.style.width = "320px";
    image.style.height = "220px";
    image.style.maxWidth = "none";
    image.style.maxHeight = "none";
    image.style.objectFit = "cover";
    image.style.borderRadius = "20px";
    image.style.background =
      "linear-gradient(135deg,#f1f5f9,#e2e8f0)";
  }

  if (type === "video") {
    const video = node as HTMLVideoElement;
    video.autoplay = true;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.controls = false;
    video.style.display = "block";
    video.style.width = "480px";
    video.style.height = "270px";
    video.style.minWidth = "48px";
    video.style.minHeight = "48px";
    video.style.maxWidth = "none";
    video.style.maxHeight = "none";
    /*
      ברירת מחדל זהה לתמונה: cover, כדי שהווידאו ימלא את הקופסה בלי מריחה.
    */
    video.style.objectFit = "cover";
    video.style.objectPosition = "center";
    video.style.borderRadius = "20px";
    video.style.background = "#000000";
  }

  if (type === "box") {
    node.style.width = "320px";
    node.style.height = "220px";
    node.style.borderRadius = "24px";
    node.style.background = "rgba(255,255,255,0.86)";
    node.style.border = "1px solid rgba(15,23,42,0.12)";
    node.style.boxShadow =
      "0 18px 50px rgba(15,23,42,0.14)";
  }

  if (type === "divider") {
    node.style.width = "280px";
    node.style.height = "2px";
    node.style.background = "#111827";
    node.style.borderRadius = "999px";
  }


  if (
    type === "social-link" ||
    type === "phone-link" ||
    type === "email-link"
  ) {
    const anchor = node as HTMLAnchorElement;
    anchor.href = "#";
    anchor.style.width = "58px";
    anchor.style.height = "58px";
    anchor.style.borderRadius = "999px";
    anchor.style.display = "inline-flex";
    anchor.style.alignItems = "center";
    anchor.style.justifyContent = "center";
    anchor.style.gap = "10px";
    anchor.style.textDecoration = "none";
    anchor.style.cursor = "pointer";
  }

  if (type === "icon") {
    node.style.width = "52px";
    node.style.height = "52px";
    node.style.display = "inline-flex";
    node.style.alignItems = "center";
    node.style.justifyContent = "center";
  }

  if (type === "form-field") {
    const field = node as HTMLInputElement | HTMLTextAreaElement;
    field.style.width = "320px";
    field.style.height = "52px";
    field.style.padding = "0 16px";
    field.style.border = "1px solid #e2e8f0";
    field.style.borderRadius = "14px";
    field.style.background = "#ffffff";
    field.style.color = "#0f172a";
    field.style.fontSize = "16px";
    field.style.outline = "none";
  }

  if (type === "embed" || type === "html") {
    node.style.width = "480px";
    node.style.minHeight = "220px";
    node.style.overflow = "auto";
  }

  return node;
}

export function renderVisualInsertedElementsToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const runtimeRoot = getVisualRuntimeRoot(root);
  const elements = readVisualInsertedElements(data || {});
  const ids = new Set(Object.keys(elements));

  root
    .querySelectorAll<HTMLElement>(
      '[data-visual-inserted-element="true"]',
    )
    .forEach((node) => {
      const id = getDirectVisualElementId(node);

      if (!id || !ids.has(id)) {
        node.remove();
      }
    });

  Object.values(elements).forEach((item) => {
    if (!item?.id) return;

    let parent =
      findDirectVisualNode(root, item.parentId) ||
      findDirectVisualNode(root, item.sectionId || "") ||
      runtimeRoot;

    // אם ההורה הוא סקשן שהוזרק — ממקמים בתוך לוח התוכן הממורכז שלו
    if (
      parent instanceof HTMLElement &&
      parent.getAttribute("data-visual-inserted-section") === "true"
    ) {
      parent = getInsertedSectionArtboard(parent);
    }

    ensurePositioningContext(parent);

    let node = findDirectVisualNode(root, item.id);

    const expectedTag = String(
      item.tagName ||
        (item.type === "button"
          ? "a"
          : item.type === "image"
            ? "img"
            : item.type === "video"
              ? "video"
              : item.type === "social-link" ||
                  item.type === "phone-link" ||
                  item.type === "email-link"
                ? "a"
                : item.type === "form-field"
                  ? "input"
                  : "div"),
    ).toLowerCase();

    if (
      !node ||
      node.getAttribute(
        "data-visual-inserted-element",
      ) !== "true" ||
      node.tagName.toLowerCase() !== expectedTag
    ) {
      node?.remove();
      node = createInsertedElementNode(root, item);
    }

    if (node.parentElement !== parent) {
      parent.appendChild(node);
    }
  });
}

export function applyAllVisualDataToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  registerAllVisualElements(root);
  renderVisualInsertedSectionsToDom(root, data);
  renderVisualInsertedElementsToDom(root, data);
  applyVisualLibraryPageMode(root, data);
  applyVisualSectionOrderToDom(
    root,
    readVisualSectionOrder(data || {}),
    String(
      root.getAttribute("data-visual-page-id") ||
        (data as Record<string, any>)?.__activePageId ||
        "home",
    ),
  );
  registerAllVisualElements(root);
  applyVisualContentToDom(root, data);
  applyVisualStylesToDom(root, data);
  applyVisualLayoutToDom(root, data);
  applyVisualAttributesToDom(root, data);
  applyVisualResponsiveToDom(root, data);
  applyVisualLockedToDom(root, data);
  applyVisualHiddenToDom(root, data);
  applyVisualDeletedToDom(root, data);
  prepareAllVideosInDom(root);
  syncInsertedSectionArtboards(root);
  observeInsertedSectionArtboards(root);

  const isPublicRuntime = Boolean(
    root.closest?.("[data-bizuply-public-render-root='true']") ||
      root.matches?.("[data-bizuply-public-render-root='true']"),
  );

  if (!isPublicRuntime) {
    syncEditorMediaPreviewsInDom(root);
  }

  applySavedFormBuildersToDom(root, data);
}

export function collectVisualContentFromDom(
  root: HTMLElement | null,
  currentData: Record<string, any>,
): VisualContentMap {
  const currentContent = readVisualContent(currentData);
  const nextContent: VisualContentMap = { ...currentContent };

  if (!root) return nextContent;

  registerAllVisualElements(root);

  const nodes = Array.from(
    root.querySelectorAll<HTMLElement>("[data-visual-edit-id]"),
  );

  nodes.forEach((node) => {
    if (isEditorOnlyNode(node)) return;

    /*
      חשוב:
      לא משתמשים כאן ב-getVisualElementId,
      כי הוא יכול להחזיר ID של אבא דרך closest.
      בשמירה חייבים ID ישיר בלבד של האלמנט עצמו.
    */
    const elementId = getDirectVisualElementId(node);

    if (!elementId) return;

    const elementType = getSafeVisualType(node);
    const currentValue = (nextContent[elementId] || {}) as Record<string, any>;
    const nextValue: Record<string, any> = { ...currentValue };

    if (isTextCollectableNode(node)) {
      /*
        שומרים תמיד את הטקסט מה-DOM, גם כשהערך ריק.
        כך שינוי טקסט ומחיקה מלאה נשמרים גם בפרסום.
      */
      nextValue.text = getNodeText(node);
    }

    if (
      elementType === "image" ||
      node instanceof HTMLImageElement ||
      node instanceof HTMLVideoElement ||
      node instanceof HTMLSourceElement ||
      node.querySelector?.("img, video, source")
    ) {
      const src = String(
        node.getAttribute("data-visual-current-src") ||
          node.getAttribute("data-video-src") ||
          node.getAttribute("data-image-src") ||
          getNodeMediaSrc(node) ||
          "",
      ).trim();
      const alt = getNodeMediaAlt(node);

      const mediaType =
        getVisualMediaTypeFromNode(node, src) ||
        normalizeVisualMediaType(
          currentValue.mediaType || currentValue.resourceType,
          src,
        );

      const currentMediaSrc = String(
        currentValue.src ||
          currentValue.secureUrl ||
          currentValue.secure_url ||
          currentValue.url ||
          "",
      ).trim();

      const finalMediaSrc = src || currentMediaSrc;

      if (finalMediaSrc || currentValue.src !== undefined) {
        nextValue.src = finalMediaSrc;
        nextValue.url = currentValue.url || currentValue.secureUrl || finalMediaSrc;
        nextValue.secureUrl =
          currentValue.secureUrl || currentValue.url || finalMediaSrc;
      }

      if (alt || currentValue.alt !== undefined) {
        nextValue.alt = alt;
      }

      if (
        mediaType ||
        currentValue.mediaType !== undefined ||
        currentValue.resourceType !== undefined
      ) {
        nextValue.mediaType =
          mediaType ||
          currentValue.mediaType ||
          currentValue.resourceType ||
          "image";

        nextValue.resourceType = nextValue.mediaType;
      }
    }

    const linkNode =
      node instanceof HTMLAnchorElement
        ? node
        : (node.closest("a") as HTMLAnchorElement | null) ||
          (node.querySelector("a") as HTMLAnchorElement | null);

    if (linkNode) {
      const domHref = String(
        linkNode.getAttribute("href") ||
          node.getAttribute("data-visual-link-href") ||
          node.getAttribute("data-link-url") ||
          "",
      );

      const target = String(
        linkNode.getAttribute("target") ||
          node.getAttribute("data-visual-link-target") ||
          "_self",
      );

      const stateHref = String(currentValue.href || "").trim();
      const finalHref =
        stateHref && stateHref !== "#" ? stateHref : domHref;

      if (finalHref || currentValue.href !== undefined) {
        nextValue.href = finalHref;
        nextValue.target =
          currentValue.target || (target === "_blank" ? "_blank" : "_self");
        nextValue.rel =
          currentValue.rel ||
          (nextValue.target === "_blank" ? "noopener noreferrer" : "");
      }

      if (currentValue.phoneNumber !== undefined) {
        nextValue.phoneNumber = currentValue.phoneNumber;
      }

      if (currentValue.phone !== undefined) {
        nextValue.phone = currentValue.phone;
      }

      if (currentValue.email !== undefined) {
        nextValue.email = currentValue.email;
      }

      if (currentValue.subject !== undefined) {
        nextValue.subject = currentValue.subject;
      }

      if (currentValue.message !== undefined) {
        nextValue.message = currentValue.message;
      }
    } else if (String(currentValue.href || "").trim()) {
      nextValue.href = String(currentValue.href || "").trim();
      nextValue.target = currentValue.target || "_self";
      nextValue.rel = currentValue.rel || "";
      if (currentValue.phoneNumber !== undefined) {
        nextValue.phoneNumber = currentValue.phoneNumber;
      }
      if (currentValue.email !== undefined) {
        nextValue.email = currentValue.email;
      }
      if (currentValue.subject !== undefined) {
        nextValue.subject = currentValue.subject;
      }
      if (currentValue.message !== undefined) {
        nextValue.message = currentValue.message;
      }
    }

    if (Object.keys(nextValue).length > 0) {
      nextContent[elementId] = nextValue as VisualContentMap[string];
    }
  });

  return nextContent;
}

export function buildVisualSaveDataFromDom(
  root: HTMLElement | null,
  currentData: Record<string, any>,
): Record<string, any> {
  const nextContent = collectVisualContentFromDom(root, currentData);

  return {
    ...currentData,
    [VISUAL_CONTENT_KEY]: nextContent,
  };
}
