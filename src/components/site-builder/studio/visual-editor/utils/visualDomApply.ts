import {
  VISUAL_CONTENT_KEY,
  readVisualAttributes,
  readVisualContent,
  readVisualDeleted,
  readVisualHidden,
  readVisualInsertedElements,
  readVisualInsertedSections,
  readVisualLayout,
  readVisualLocked,
  readVisualResponsive,
  readVisualStyles,
  type VisualContentMap,
  type VisualDeviceMode,
  type VisualInsertedElement,
  type VisualInsertedSection,
  type VisualLayoutItem,
} from "./visualData";

import {
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

type FindVisualNodesOptions = {
  allowFallback?: boolean;
};

type EditorMediaPreviewState = {
  opacity: string;
  opacityPriority: string;
  visibility: string;
  visibilityPriority: string;
  pointerEvents: string;
  pointerEventsPriority: string;
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
  "blockquote",
  "figcaption",
];

const TEXT_SELECTOR = TEXT_TAGS.join(",");
const MEDIA_SELECTOR = "img, video, picture, source";

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
  "[data-editor-only='true']",
  "[data-bizuply-editor-only='true']",
  "[data-bizuply-editor-media-preview='true']",
  "[data-visual-selection-box='true']",
  "[data-visual-selection-overlay='true']",
  ".visual-selection-overlay",
  ".visual-floating-toolbar",
  ".visual-context-menu",
  ".visual-inspector-panel",
].join(",");

const EDITOR_PREVIEW_SELECTOR =
  "[data-bizuply-editor-media-preview='true']";

const editorMediaPreviewByTarget = new WeakMap<HTMLElement, HTMLElement>();
const editorMediaPreviewStateByTarget =
  new WeakMap<HTMLElement, EditorMediaPreviewState>();
const editorMediaPreviewById = new Map<string, HTMLElement>();
const editorMediaTargetById = new Map<string, HTMLElement>();

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

function getStableDomPath(node: HTMLElement, scope: HTMLElement) {
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

function getDirectVisualElementId(node: HTMLElement | null) {
  if (!node) return "";

  return String(
    node.getAttribute("data-visual-edit-id") ||
      node.getAttribute("data-image-field") ||
      node.getAttribute("data-visual-image-field") ||
      "",
  ).trim();
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
  if (type === "video" || type === "media" || type === "raw") {
    return "image";
  }

  return type;
}

function getFallbackVisualTypeFromTag(node: HTMLElement | null) {
  const tagName = String(node?.tagName || "").toLowerCase();

  if (["img", "video", "source", "picture"].includes(tagName)) {
    return "image";
  }

  if (
    ["a", "button", "input", "textarea", "select"].includes(tagName)
  ) {
    return "button";
  }

  if (TEXT_TAGS.includes(tagName)) return "text";

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

function getSafeVisualType(node: HTMLElement | null) {
  return getDirectVisualElementType(node) || getFallbackVisualTypeFromTag(node);
}

function detectAutoVisualType(node: HTMLElement) {
  return getSafeVisualType(node);
}

function isEditorOnlyNode(node: HTMLElement) {
  return Boolean(
    node.matches(NON_EDITABLE_SELECTOR) ||
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

function shouldRegisterVisualNode(root: HTMLElement, node: HTMLElement) {
  if (node === root) return false;
  if (!root.contains(node)) return false;
  if (isEditorOnlyNode(node)) return false;

  return node.matches(AUTO_EDITABLE_SELECTOR);
}

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

function findVisualNodes(
  root: HTMLElement | null,
  elementId: string,
  options: FindVisualNodesOptions = {},
) {
  if (!root || !elementId) return [];

  const allowFallback = options.allowFallback !== false;
  const safeId = safeCssSelectorValue(elementId);

  const directNodes = Array.from(
    root.querySelectorAll<HTMLElement>(
      `[data-visual-edit-id="${safeId}"]`,
    ),
  );

  if (directNodes.length) return directNodes;
  if (!allowFallback) return [];

  try {
    return Array.from(
      root.querySelectorAll<HTMLElement>(
        selectorForVisualElement(elementId),
      ),
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

  if (tagName === "input" || tagName === "textarea") return true;

  if (type === "text" || type === "button") {
    return !hasMediaInside(node);
  }

  return TEXT_TAGS.includes(tagName) && !hasMediaInside(node);
}

function getTextPaintTarget(node: HTMLElement) {
  if (node.matches(TEXT_SELECTOR)) return node;

  const candidates = Array.from(
    node.querySelectorAll<HTMLElement>(TEXT_SELECTOR),
  ).filter((item) => !isEditorOnlyNode(item) && !hasMediaInside(item));

  return candidates.length === 1 ? candidates[0] : node;
}

function applyTextContentToNode(node: HTMLElement, value: string) {
  if (node.getAttribute("data-visual-inline-editing") === "true") return;

  if (node instanceof HTMLInputElement) {
    node.value = value;
    node.setAttribute("value", value);
    return;
  }

  if (node instanceof HTMLTextAreaElement) {
    node.value = value;
    node.textContent = value;
    return;
  }

  if (node instanceof HTMLSelectElement) return;

  const target = getTextPaintTarget(node);
  target.textContent = value;
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

  return node.querySelector?.(
    "video:not([data-bizuply-editor-media-preview='true'])",
  ) as HTMLVideoElement | null;
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

function normalizeMediaPresentation(node: HTMLElement) {
  node.style.setProperty("display", "block", "important");
  node.style.setProperty("object-fit", "cover", "important");
  node.style.setProperty("object-position", "center", "important");
  node.style.setProperty(
    "background-color",
    "transparent",
    "important",
  );
  node.style.setProperty("max-width", "none", "important");
  node.style.setProperty("max-height", "none", "important");
  node.style.setProperty("box-sizing", "border-box", "important");
}

function setImageSource(
  image: HTMLImageElement,
  src: string,
  alt?: string,
) {
  if (image.getAttribute("src") !== src) {
    image.setAttribute("src", src);
  }

  if (alt !== undefined) {
    image.setAttribute("alt", alt || "");
  }

  image.setAttribute("data-visual-current-src", src);
  image.setAttribute("data-visual-media-type", "image");
  image.setAttribute("data-resource-type", "image");
  normalizeMediaPresentation(image);
}

function setVideoSource(
  video: HTMLVideoElement,
  src: string,
  alt?: string,
) {
  const previousSource = String(
    video.getAttribute("data-visual-current-src") ||
      video.currentSrc ||
      video.getAttribute("src") ||
      "",
  ).trim();

  if (previousSource !== src) {
    video.setAttribute("src", src);
    video.setAttribute("data-visual-current-src", src);

    const sourceNode = video.querySelector("source");
    if (sourceNode) sourceNode.setAttribute("src", src);

    try {
      video.load();
    } catch {
      // The browser may load the source automatically.
    }
  }

  video.setAttribute("playsinline", "");
  video.playsInline = true;
  video.preload = video.preload || "metadata";
  video.muted = true;
  video.defaultMuted = true;

  if (alt !== undefined) {
    video.setAttribute("title", alt || "");
    video.setAttribute("aria-label", alt || "");
  }

  markMediaNode(video, "video");
  normalizeMediaPresentation(video);
}

function getEditorMediaTargetId(target: HTMLElement) {
  return String(
    getDirectVisualElementId(target) ||
      target.getAttribute("data-bizuply-preview-for") ||
      "",
  ).trim();
}

function restoreStyleProperty(
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

function restoreEditorMediaTarget(target: HTMLElement) {
  const state = editorMediaPreviewStateByTarget.get(target);

  if (state) {
    restoreStyleProperty(
      target,
      "opacity",
      state.opacity,
      state.opacityPriority,
    );
    restoreStyleProperty(
      target,
      "visibility",
      state.visibility,
      state.visibilityPriority,
    );
    restoreStyleProperty(
      target,
      "pointer-events",
      state.pointerEvents,
      state.pointerEventsPriority,
    );
  } else {
    target.style.opacity =
      target.getAttribute("data-bizuply-preview-original-opacity") || "";
    target.style.visibility =
      target.getAttribute("data-bizuply-preview-original-visibility") || "";
    target.style.pointerEvents =
      target.getAttribute(
        "data-bizuply-preview-original-pointer-events",
      ) || "";
  }

  target.removeAttribute("data-bizuply-editor-media-target");
  target.removeAttribute("data-bizuply-preview-original-opacity");
  target.removeAttribute("data-bizuply-preview-original-visibility");
  target.removeAttribute("data-bizuply-preview-original-pointer-events");
}

function maybeRestorePreviewParent(parent: HTMLElement | null) {
  if (!parent) return;

  if (parent.querySelector(EDITOR_PREVIEW_SELECTOR)) return;
  if (!parent.hasAttribute("data-bizuply-preview-position-owner")) return;

  parent.style.position =
    parent.getAttribute("data-bizuply-preview-original-position") || "";
  parent.removeAttribute("data-bizuply-preview-position-owner");
  parent.removeAttribute("data-bizuply-preview-original-position");
}

function clearEditorMediaPreview(target: HTMLElement | null) {
  if (!target) return;

  const targetId = getEditorMediaTargetId(target);
  const preview =
    editorMediaPreviewByTarget.get(target) ||
    (targetId ? editorMediaPreviewById.get(targetId) : null);

  preview?.remove();
  restoreEditorMediaTarget(target);

  editorMediaPreviewByTarget.delete(target);
  editorMediaPreviewStateByTarget.delete(target);

  if (targetId) {
    editorMediaPreviewById.delete(targetId);
    editorMediaTargetById.delete(targetId);
  }
}

function ensurePreviewPositioningContext(
  parent: HTMLElement,
  targetId: string,
) {
  const computed = window.getComputedStyle(parent);

  if (computed.position !== "static") return;

  if (!parent.hasAttribute("data-bizuply-preview-original-position")) {
    parent.setAttribute(
      "data-bizuply-preview-original-position",
      parent.style.position,
    );
  }

  parent.style.position = "relative";
  parent.setAttribute("data-bizuply-preview-position-owner", targetId);
}

function syncEditorMediaPreviewBox(
  target: HTMLElement,
  preview: HTMLElement,
) {
  if (!target.isConnected || !preview.isConnected) return;

  const computed = window.getComputedStyle(target);

  if (
    computed.display === "none" ||
    computed.visibility === "hidden"
  ) {
    preview.style.setProperty("display", "none", "important");
    return;
  }

  const rect = target.getBoundingClientRect();

  if (rect.width <= 0 || rect.height <= 0) {
    preview.style.setProperty("display", "none", "important");
    return;
  }

  /*
   * שכבת התצוגה מחוברת ל-body ונמדדת ישירות מול ה-viewport.
   * כך אין חישוב כפול של zoom, RTL, offsetParent או transform של ההורה.
   */
  preview.style.setProperty("position", "fixed", "important");
  preview.style.setProperty("left", `${rect.left}px`, "important");
  preview.style.setProperty("top", `${rect.top}px`, "important");
  preview.style.setProperty("width", `${rect.width}px`, "important");
  preview.style.setProperty("height", `${rect.height}px`, "important");
  preview.style.setProperty("inset", "auto", "important");
  preview.style.setProperty("transform", "none", "important");
  preview.style.setProperty("translate", "none", "important");
  preview.style.setProperty("rotate", "none", "important");
  preview.style.setProperty("scale", "none", "important");
  preview.style.setProperty("transform-origin", "50% 50%", "important");

  preview.style.setProperty("display", "block", "important");
  preview.style.setProperty("margin", "0", "important");
  preview.style.setProperty("padding", "0", "important");
  preview.style.setProperty("box-sizing", "border-box", "important");
  preview.style.setProperty("max-width", "none", "important");
  preview.style.setProperty("max-height", "none", "important");
  preview.style.setProperty("min-width", "0", "important");
  preview.style.setProperty("min-height", "0", "important");
  preview.style.setProperty("transition", "none", "important");
  preview.style.setProperty("animation", "none", "important");
  preview.style.setProperty("will-change", "left, top, width, height", "important");
  preview.style.setProperty("backface-visibility", "hidden", "important");
  preview.style.setProperty("-webkit-backface-visibility", "hidden", "important");
  preview.style.setProperty("transform", "translateZ(0)", "important");
  preview.style.setProperty("-webkit-transform", "translateZ(0)", "important");
  preview.style.setProperty("contain", "paint", "important");
  preview.style.setProperty("pointer-events", "none", "important");
  preview.style.setProperty("user-select", "none", "important");
  preview.style.setProperty("touch-action", "none", "important");
  preview.style.setProperty("border-radius", computed.borderRadius, "important");
  preview.style.setProperty("clip-path", computed.clipPath || "none", "important");
  preview.style.setProperty(
    "object-fit",
    computed.objectFit && computed.objectFit !== "fill"
      ? computed.objectFit
      : "cover",
    "important",
  );
  preview.style.setProperty(
    "object-position",
    computed.objectPosition || "50% 50%",
    "important",
  );
  preview.style.setProperty("background-color", "transparent", "important");
  preview.style.setProperty("visibility", "visible", "important");

  const isVideoPreview = preview instanceof HTMLVideoElement;
  const isReady =
    !isVideoPreview ||
    preview.getAttribute("data-bizuply-preview-ready") === "true" ||
    preview.readyState >= 2;

  preview.style.setProperty("opacity", isReady ? "1" : "0", "important");
  preview.style.setProperty("z-index", "2147481000", "important");
}

function createEditorMediaPreview(
  target: HTMLElement,
  type: "image" | "video",
  src: string,
  alt?: string,
) {
  /*
   * בזמן resize/move אסור להחליף preview, src או DOM node.
   * אם כבר קיימת שכבה, רק מסנכרנים את הקופסה שלה.
   */
  if (target.hasAttribute("data-visual-active-interaction")) {
    const activeTargetId = getEditorMediaTargetId(target);
    const activePreview =
      editorMediaPreviewByTarget.get(target) ||
      (activeTargetId ? editorMediaPreviewById.get(activeTargetId) : null);

    if (activePreview) {
      syncEditorMediaPreviewBox(target, activePreview);
      return activePreview;
    }
  }
  const targetId =
    getDirectVisualElementId(target) ||
    target.getAttribute("data-bizuply-preview-for") ||
    `media-${Math.random().toString(36).slice(2, 9)}`;

  const expectedTag = type === "video" ? "video" : "img";
  let preview =
    editorMediaPreviewByTarget.get(target) ||
    editorMediaPreviewById.get(targetId) ||
    target.ownerDocument.querySelector<HTMLElement>(
      `[data-bizuply-editor-media-preview="true"][data-bizuply-preview-for="${safeCssSelectorValue(
        targetId,
      )}"]`,
    );

  const previousTarget = editorMediaTargetById.get(targetId);

  if (previousTarget && previousTarget !== target) {
    clearEditorMediaPreview(previousTarget);
    preview = null;
  }

  if (preview && preview.tagName.toLowerCase() !== expectedTag) {
    preview.remove();
    preview = null;
  }

  let targetState = editorMediaPreviewStateByTarget.get(target);

  if (!targetState) {
    const legacyOpacity = target.getAttribute(
      "data-bizuply-preview-original-opacity",
    );
    const legacyVisibility = target.getAttribute(
      "data-bizuply-preview-original-visibility",
    );
    const legacyPointerEvents = target.getAttribute(
      "data-bizuply-preview-original-pointer-events",
    );

    targetState = {
      opacity:
        legacyOpacity !== null
          ? legacyOpacity
          : target.style.getPropertyValue("opacity"),
      opacityPriority:
        legacyOpacity !== null
          ? ""
          : target.style.getPropertyPriority("opacity"),
      visibility:
        legacyVisibility !== null
          ? legacyVisibility
          : target.style.getPropertyValue("visibility"),
      visibilityPriority:
        legacyVisibility !== null
          ? ""
          : target.style.getPropertyPriority("visibility"),
      pointerEvents:
        legacyPointerEvents !== null
          ? legacyPointerEvents
          : target.style.getPropertyValue("pointer-events"),
      pointerEventsPriority:
        legacyPointerEvents !== null
          ? ""
          : target.style.getPropertyPriority("pointer-events"),
    };

    editorMediaPreviewStateByTarget.set(target, targetState);
  }

  target.setAttribute("data-bizuply-editor-media-target", "true");
  target.setAttribute(
    "data-bizuply-preview-original-opacity",
    targetState.opacity,
  );
  target.setAttribute(
    "data-bizuply-preview-original-visibility",
    targetState.visibility,
  );
  target.setAttribute(
    "data-bizuply-preview-original-pointer-events",
    targetState.pointerEvents,
  );

  /*
   * לא מסתירים את תמונת המקור. היא משמשת poster יציב מתחת לווידאו,
   * ולכן אין פריים שחור או הבהוב בזמן טעינה/שינוי גודל.
   */
  if (targetState.opacity) {
    target.style.setProperty(
      "opacity",
      targetState.opacity,
      targetState.opacityPriority,
    );
  } else {
    target.style.removeProperty("opacity");
  }

  target.style.setProperty("visibility", "visible", "important");
  target.style.setProperty("pointer-events", "auto", "important");
  target.style.setProperty("background-color", "transparent", "important");

  if (!preview) {
    preview =
      type === "video"
        ? target.ownerDocument.createElement("video")
        : target.ownerDocument.createElement("img");

    (target.ownerDocument.body || target.ownerDocument.documentElement).appendChild(
      preview,
    );
  }

  preview.setAttribute("data-editor-only", "true");
  preview.setAttribute("data-bizuply-editor-only", "true");
  preview.setAttribute("data-bizuply-editor-media-preview", "true");
  preview.setAttribute("data-bizuply-preview-for", targetId);
  preview.setAttribute("data-visual-media-type", type);
  preview.setAttribute("data-resource-type", type);
  preview.setAttribute("aria-hidden", "true");
  preview.setAttribute("draggable", "false");

  if (type === "video" && preview instanceof HTMLVideoElement) {
    const currentSrc = String(
      preview.getAttribute("data-bizuply-preview-src") || "",
    ).trim();

    const targetPoster =
      target instanceof HTMLImageElement
        ? String(target.currentSrc || target.src || "").trim()
        : "";

    preview.autoplay = true;
    preview.muted = true;
    preview.defaultMuted = true;
    preview.loop = true;
    preview.controls = false;
    preview.playsInline = true;
    preview.preload = "auto";
    preview.disablePictureInPicture = true;
    preview.setAttribute("playsinline", "");
    preview.setAttribute("muted", "");
    preview.setAttribute("loop", "");
    preview.setAttribute("autoplay", "");
    preview.setAttribute("preload", "auto");
    preview.setAttribute("data-bizuply-preview-src", src);

    if (targetPoster && targetPoster !== src && !targetPoster.startsWith("blob:")) {
      preview.poster = targetPoster;
    }

    normalizeMediaPresentation(preview);

    const markReady = () => {
      preview.setAttribute("data-bizuply-preview-ready", "true");
      syncEditorMediaPreviewBox(target, preview);
    };

    /* src/load משתנים רק כאשר המשתמש החליף סרטון — לעולם לא בזמן resize. */
    if (currentSrc !== src) {
      preview.removeAttribute("data-bizuply-preview-ready");
      preview.src = src;
      preview.addEventListener("loadeddata", markReady, { once: true });
      preview.addEventListener("canplay", markReady, { once: true });

      try {
        preview.load();
      } catch {
        // The browser may load the source automatically.
      }
    } else if (preview.readyState >= 2) {
      markReady();
    }

    if (preview.paused) {
      void preview.play().catch(() => undefined);
    }
  } else if (type === "image" && preview instanceof HTMLImageElement) {
    preview.alt = alt || "";

    if (preview.getAttribute("src") !== src) {
      preview.removeAttribute("data-bizuply-preview-ready");
      preview.setAttribute("src", src);
      preview.addEventListener(
        "load",
        () => {
          preview?.setAttribute("data-bizuply-preview-ready", "true");
          if (preview) syncEditorMediaPreviewBox(target, preview);
        },
        { once: true },
      );
    } else if (preview.complete) {
      preview.setAttribute("data-bizuply-preview-ready", "true");
    }
  }

  editorMediaPreviewByTarget.set(target, preview);
  editorMediaPreviewById.set(targetId, preview);
  editorMediaTargetById.set(targetId, target);

  syncEditorMediaPreviewBox(target, preview);

  return preview;
}

function getPreviewTarget(node: HTMLElement) {
  if (node instanceof HTMLImageElement) return node;

  if (
    node instanceof HTMLSourceElement &&
    node.parentElement instanceof HTMLVideoElement
  ) {
    return node.parentElement;
  }

  const image = getBestImageNode(node);
  if (image) return image;

  return node instanceof HTMLVideoElement ? node : null;
}

function createBackgroundVideo(
  node: HTMLElement,
  src: string,
  alt?: string,
) {
  let video = node.querySelector<HTMLVideoElement>(
    ":scope > video[data-bizuply-visual-background-video='true']",
  );

  if (!video) {
    video = node.ownerDocument.createElement("video");
    video.setAttribute("data-bizuply-visual-background-video", "true");
    video.setAttribute("data-visual-editable", "false");
    video.setAttribute("aria-hidden", "true");
    node.insertBefore(video, node.firstChild);
  }

  if (window.getComputedStyle(node).position === "static") {
    node.style.position = "relative";
  }

  video.style.setProperty("position", "absolute", "important");
  video.style.setProperty("inset", "0", "important");
  video.style.setProperty("width", "100%", "important");
  video.style.setProperty("height", "100%", "important");
  video.style.setProperty("pointer-events", "none", "important");
  video.style.setProperty("z-index", "0", "important");

  setVideoSource(video, src, alt);
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.defaultMuted = true;
  void video.play().catch(() => undefined);

  return video;
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

  node.setAttribute("data-visual-current-src", src);
  node.setAttribute("data-visual-media-type", normalizedType);
  node.setAttribute("data-resource-type", normalizedType);

  if (normalizedType === "video") {
    const videoNode = getBestVideoNode(node);

    if (videoNode) {
      clearEditorMediaPreview(getPreviewTarget(node));
      setVideoSource(videoNode, src, alt);
      return;
    }

    const previewTarget = getPreviewTarget(node);

    if (previewTarget) {
      previewTarget.setAttribute("data-visual-current-src", src);
      previewTarget.setAttribute("data-video-src", src);
      previewTarget.setAttribute("data-visual-media-type", "video");
      previewTarget.setAttribute("data-resource-type", "video");

      if (alt !== undefined) {
        previewTarget.setAttribute("alt", alt || "");
      }

      markMediaNode(previewTarget, "video");
      createEditorMediaPreview(previewTarget, "video", src, alt);
    }

    return;
  }

  const previewTarget = getPreviewTarget(node);
  if (previewTarget) clearEditorMediaPreview(previewTarget);

  const imageNode = getBestImageNode(node);

  if (imageNode) {
    setImageSource(imageNode, src, alt);
    return;
  }

  /*
   * לא מחליפים VIDEO/IMG ידנית בתוך DOM שמנוהל על ידי React.
   * החלפה קבועה נעשית רק על clone בזמן השמירה והפרסום.
   */
  const videoNode = getBestVideoNode(node);

  if (videoNode) {
    videoNode.setAttribute("data-visual-current-src", src);
    videoNode.setAttribute("data-image-src", src);
    videoNode.setAttribute("data-visual-media-type", "image");
    videoNode.setAttribute("data-resource-type", "image");

    if (alt !== undefined) {
      videoNode.setAttribute("title", alt || "");
      videoNode.setAttribute("aria-label", alt || "");
    }
  }
}

export function syncEditorMediaPreviewForTarget(
  target: HTMLElement | null,
) {
  if (!target) return;

  const directPreview = editorMediaPreviewByTarget.get(target);
  if (directPreview) syncEditorMediaPreviewBox(target, directPreview);

  target
    .querySelectorAll<HTMLElement>(
      "[data-bizuply-editor-media-target='true']",
    )
    .forEach((childTarget) => {
      const preview = editorMediaPreviewByTarget.get(childTarget);
      if (preview) syncEditorMediaPreviewBox(childTarget, preview);
    });
}

export function syncEditorMediaPreviewsInDom(root: HTMLElement | null) {
  if (!root) return;

  Array.from(editorMediaTargetById.entries()).forEach(
    ([targetId, target]) => {
      const preview = editorMediaPreviewById.get(targetId);

      if (!target.isConnected || !preview?.isConnected) {
        clearEditorMediaPreview(target);
        return;
      }

      if (!root.contains(target)) return;
      syncEditorMediaPreviewBox(target, preview);
    },
  );

  root
    .querySelectorAll<HTMLElement>(
      "[data-bizuply-editor-media-target='true']",
    )
    .forEach((target) => {
      const targetId = getEditorMediaTargetId(target);
      const preview =
        editorMediaPreviewByTarget.get(target) ||
        (targetId ? editorMediaPreviewById.get(targetId) : null) ||
        target.ownerDocument.querySelector<HTMLElement>(
          `[data-bizuply-editor-media-preview="true"][data-bizuply-preview-for="${safeCssSelectorValue(
            targetId,
          )}"]`,
        );

      if (!preview) return;

      editorMediaPreviewByTarget.set(target, preview);
      if (targetId) {
        editorMediaPreviewById.set(targetId, preview);
        editorMediaTargetById.set(targetId, target);
      }

      syncEditorMediaPreviewBox(target, preview);
    });
}

export function applyVisualContentToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const content = readVisualContent(data);

  Object.entries(content).forEach(([elementId, rawItem]) => {
    const item = (rawItem || {}) as Record<string, any>;
    const nodes = findVisualNodes(root, elementId, {
      allowFallback: false,
    });

    nodes.forEach((node) => {
      if (isEditorOnlyNode(node)) return;

      if (item.text !== undefined && shouldApplyTextToNode(node)) {
        applyTextContentToNode(node, String(item.text ?? ""));
      }

      if (item.href !== undefined) {
        applyLinkContentToNode(
          node,
          String(item.href || ""),
          String(item.target || "_self"),
          String(item.rel || ""),
        );
      }

      const source = String(
        item.src ||
          item.secureUrl ||
          item.secure_url ||
          item.url ||
          item.originalUrl ||
          "",
      ).trim();

      if (item.attribution) {
        node.setAttribute(
          "data-media-attribution",
          String(item.attribution),
        );
      }

      if (item.sourceUrl) {
        node.setAttribute(
          "data-media-source-url",
          String(item.sourceUrl),
        );
      }

      if (item.license?.code) {
        node.setAttribute(
          "data-media-license",
          String(item.license.code),
        );
      }

      if (source) {
        const applyAsBackground =
          item.target === "background" ||
          item.background === true ||
          item.applyAsBackground === true;

        if (applyAsBackground) {
          const normalizedType =
            normalizeVisualMediaType(
              item.mediaType ||
                item.resourceType ||
                item.resource_type,
              source,
            ) || "image";

          if (normalizedType === "video") {
            createBackgroundVideo(node, source, item.alt);
          } else {
            node.style.setProperty(
              "background-image",
              `url("${source.replace(/"/g, "%22")}")`,
              "important",
            );
            node.style.setProperty(
              "background-size",
              String(item.backgroundSize || "cover"),
              "important",
            );
            node.style.setProperty(
              "background-position",
              String(item.backgroundPosition || "center"),
              "important",
            );
            node.style.setProperty(
              "background-repeat",
              String(item.backgroundRepeat || "no-repeat"),
              "important",
            );
            node.setAttribute("data-visual-background-src", source);
          }
        } else {
          applyMediaContentToNode(
            node,
            source,
            item.alt,
            item.mediaType ||
              item.resourceType ||
              item.resource_type,
          );
        }
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
      // Invalid CSS is ignored so one bad value cannot break the editor.
    }
  });

  rememberAppliedProperties(node, trackingAttribute, appliedProperties);
}

function detectVisualDeviceMode(root: HTMLElement): VisualDeviceMode {
  const explicit = String(
    root.getAttribute("data-visual-device") ||
      root
        .closest<HTMLElement>("[data-visual-device]")
        ?.getAttribute("data-visual-device") ||
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
  const source = layout as Record<string, any>;

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
    "flex",
    "flexGrow",
    "flexShrink",
    "flexBasis",
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
    "boxSizing",
  ].forEach((key) => {
    const value = source[key];

    if (value !== undefined && value !== null && value !== "") {
      style[key] = value;
    }
  });

  const translateX = Number(layout.translateX ?? layout.x ?? 0);
  const translateY = Number(layout.translateY ?? layout.y ?? 0);

  if (translateX || translateY) {
    style.translate = `${translateX}px ${translateY}px`;
  }

  if (
    layout.rotate !== undefined &&
    layout.rotate !== null &&
    Number(layout.rotate) !== 0
  ) {
    style.rotate = `${Number(layout.rotate)}deg`;
  }

  if (
    layout.scale !== undefined &&
    layout.scale !== null &&
    Number(layout.scale) !== 1
  ) {
    style.scale = String(Number(layout.scale));
  }

  return style;
}

export function applyVisualStylesToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const styles = readVisualStyles(data);

  Object.entries(styles).forEach(([elementId, style]) => {
    findVisualNodes(root, elementId, { allowFallback: false }).forEach(
      (node) => {
        if (isEditorOnlyNode(node)) return;

        applyStyleRecord(
          node,
          (style || {}) as Record<string, any>,
          "data-visual-applied-style-properties",
        );
      },
    );
  });
}

export function applyVisualLayoutToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const layout = readVisualLayout(data);

  Object.entries(layout).forEach(([elementId, item]) => {
    findVisualNodes(root, elementId, { allowFallback: false }).forEach(
      (node) => {
        if (isEditorOnlyNode(node)) return;

        applyStyleRecord(
          node,
          layoutItemToStyle(item),
          "data-visual-applied-layout-properties",
        );
      },
    );
  });
}

export function applyVisualAttributesToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const attributes = readVisualAttributes(data);

  Object.entries(attributes).forEach(([elementId, item]) => {
    findVisualNodes(root, elementId, { allowFallback: false }).forEach(
      (node) => {
        if (isEditorOnlyNode(node)) return;

        Object.entries((item || {}) as Record<string, any>).forEach(
          ([key, value]) => {
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
          },
        );
      },
    );
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

  Object.entries(responsive).forEach(([elementId, rawDeviceMap]) => {
    const deviceMap = rawDeviceMap as Record<string, any>;
    const item = deviceMap?.[device];

    findVisualNodes(root, elementId, { allowFallback: false }).forEach(
      (node) => {
        if (isEditorOnlyNode(node)) return;

        const style = {
          ...(item?.styles || {}),
          ...layoutItemToStyle(item?.layout),
        };

        applyStyleRecord(
          node,
          style,
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
      },
    );
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

    findVisualNodes(root, elementId, { allowFallback: false }).forEach(
      (node) => {
        if (isEditorOnlyNode(node)) return;
        node.setAttribute("data-visual-locked", "true");
        node.setAttribute("aria-disabled", "true");
      },
    );
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

    findVisualNodes(root, elementId, { allowFallback: false }).forEach(
      (node) => {
        if (isEditorOnlyNode(node)) return;
        node.setAttribute("data-visual-hidden", "true");
        node.style.setProperty("visibility", "hidden", "important");
        node.style.setProperty("pointer-events", "none", "important");
      },
    );
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

      if (node.getAttribute("data-visual-responsive-hidden") !== "true") {
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

    findVisualNodes(root, elementId, { allowFallback: false }).forEach(
      (node) => {
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
      },
    );
  });
}

function getInsertedRuntimeRoot(root: HTMLElement) {
  return (
    root.querySelector<HTMLElement>("[data-template-runtime-root]") ||
    root.querySelector<HTMLElement>("[data-bizuply-site='true']") ||
    root.querySelector<HTMLElement>("[data-studio-page='true']") ||
    root
  );
}

function applyInsertedItemBasics(
  node: HTMLElement,
  item: Record<string, any>,
  fallbackId: string,
  fallbackType: string,
) {
  const id = String(item.id || item.elementId || fallbackId);
  const type = String(item.type || fallbackType);

  node.setAttribute("data-visual-edit-id", id);
  node.setAttribute("data-visual-editable", "true");
  node.setAttribute("data-visual-edit-type", type);
  node.setAttribute("data-visual-type", type);
  node.setAttribute("data-visual-inserted", "true");

  if (item.label) {
    node.setAttribute("data-visual-edit-label", String(item.label));
  }

  if (item.className || item.class) {
    node.className = String(item.className || item.class);
  }

  Object.entries((item.attributes || {}) as Record<string, any>).forEach(
    ([key, value]) => {
      if (value === undefined || value === null || value === false) return;
      node.setAttribute(key, value === true ? "" : String(value));
    },
  );

  applyStyleRecord(
    node,
    {
      ...(item.styles || item.style || {}),
      ...layoutItemToStyle(item.layout),
    },
    "data-visual-applied-inserted-properties",
  );
}

function createInsertedSectionNode(
  root: HTMLElement,
  rawItem: VisualInsertedSection,
  index: number,
) {
  const item = rawItem as unknown as Record<string, any>;
  const node = root.ownerDocument.createElement(
    String(item.tagName || item.tag || "section"),
  );
  const id = String(item.id || item.sectionId || `inserted-section-${index + 1}`);

  applyInsertedItemBasics(node, item, id, "section");
  node.setAttribute("data-visual-inserted-section", "true");

  if (item.html !== undefined) {
    node.innerHTML = String(item.html || "");
  } else if (item.text !== undefined) {
    node.textContent = String(item.text || "");
  }

  return node;
}

function createInsertedElementNode(
  root: HTMLElement,
  rawItem: VisualInsertedElement,
  index: number,
) {
  const item = rawItem as unknown as Record<string, any>;
  const type = String(item.type || "box").toLowerCase();
  const tagName = String(
    item.tagName ||
      item.tag ||
      (type === "text"
        ? "div"
        : type === "button"
          ? "button"
          : type === "image"
            ? "img"
            : type === "video"
              ? "video"
              : type === "link"
                ? "a"
                : type === "input" || type === "form-field"
                  ? "input"
                  : "div"),
  );

  const node = root.ownerDocument.createElement(tagName);
  const id = String(item.id || item.elementId || `inserted-element-${index + 1}`);

  applyInsertedItemBasics(node, item, id, type === "video" ? "image" : type);
  node.setAttribute("data-visual-inserted-element", "true");

  if (node instanceof HTMLImageElement) {
    setImageSource(node, String(item.src || item.url || ""), String(item.alt || ""));
  } else if (node instanceof HTMLVideoElement) {
    setVideoSource(node, String(item.src || item.url || ""), String(item.alt || ""));
    node.autoplay = item.autoplay !== false;
    node.loop = item.loop !== false;
    node.muted = item.muted !== false;
    node.defaultMuted = node.muted;
    node.controls = item.controls === true;
    void node.play().catch(() => undefined);
  } else if (node instanceof HTMLAnchorElement) {
    node.href = String(item.href || item.url || "#");
    node.target = item.target === "_blank" ? "_blank" : "_self";
    node.textContent = String(item.text || item.label || "קישור");
  } else if (node instanceof HTMLInputElement) {
    node.type = String(item.inputType || "text");
    node.placeholder = String(item.placeholder || item.text || "");
    node.value = String(item.value || "");
  } else if (item.html !== undefined) {
    node.innerHTML = String(item.html || "");
  } else if (item.text !== undefined) {
    node.textContent = String(item.text || "");
  }

  return node;
}

export function renderVisualInsertedSectionsToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const runtimeRoot = getInsertedRuntimeRoot(root);
  const inserted = readVisualInsertedSections(data);
  const items = Object.values(inserted || {}) as VisualInsertedSection[];
  const expectedIds = new Set(
    items.map((item: any, index) =>
      String(item?.id || item?.sectionId || `inserted-section-${index + 1}`),
    ),
  );

  runtimeRoot
    .querySelectorAll<HTMLElement>("[data-visual-inserted-section='true']")
    .forEach((node) => {
      if (!expectedIds.has(getDirectVisualElementId(node))) node.remove();
    });

  items.forEach((item: any, index) => {
    const id = String(
      item?.id || item?.sectionId || `inserted-section-${index + 1}`,
    );
    let node = runtimeRoot.querySelector<HTMLElement>(
      `[data-visual-inserted-section="true"][data-visual-edit-id="${safeCssSelectorValue(
        id,
      )}"]`,
    );

    if (!node) {
      node = createInsertedSectionNode(runtimeRoot, item, index);
      runtimeRoot.appendChild(node);
    } else {
      applyInsertedItemBasics(node, item, id, "section");
    }
  });
}

export function renderVisualInsertedElementsToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const runtimeRoot = getInsertedRuntimeRoot(root);
  const inserted = readVisualInsertedElements(data);
  const items = Object.values(inserted || {}) as VisualInsertedElement[];
  const expectedIds = new Set(
    items.map((item: any, index) =>
      String(item?.id || item?.elementId || `inserted-element-${index + 1}`),
    ),
  );

  runtimeRoot
    .querySelectorAll<HTMLElement>("[data-visual-inserted-element='true']")
    .forEach((node) => {
      if (!expectedIds.has(getDirectVisualElementId(node))) node.remove();
    });

  items.forEach((item: any, index) => {
    const id = String(
      item?.id || item?.elementId || `inserted-element-${index + 1}`,
    );
    const parentId = String(item?.parentId || item?.sectionId || "").trim();
    const parent = parentId
      ? runtimeRoot.querySelector<HTMLElement>(
          `[data-visual-edit-id="${safeCssSelectorValue(parentId)}"]`,
        ) || runtimeRoot
      : runtimeRoot;

    let node = runtimeRoot.querySelector<HTMLElement>(
      `[data-visual-inserted-element="true"][data-visual-edit-id="${safeCssSelectorValue(
        id,
      )}"]`,
    );

    if (!node) {
      node = createInsertedElementNode(runtimeRoot, item, index);
      parent.appendChild(node);
    } else {
      applyInsertedItemBasics(
        node,
        item,
        id,
        String(item?.type || "box"),
      );
    }
  });
}

export function applyVisualLibraryPageMode(
  root: HTMLElement,
  data: Record<string, any>,
) {
  const activePageId = String(
    data.__activePageId || data.activePageId || "",
  ).trim();

  if (!activePageId) return;

  const pages = root.querySelectorAll<HTMLElement>("[data-template-page-id]");
  if (!pages.length) return;

  pages.forEach((page) => {
    const pageId = String(page.getAttribute("data-template-page-id") || "");

    if (!page.hasAttribute("data-bizuply-original-page-display")) {
      page.setAttribute(
        "data-bizuply-original-page-display",
        page.style.getPropertyValue("display"),
      );
      page.setAttribute(
        "data-bizuply-original-page-display-priority",
        page.style.getPropertyPriority("display"),
      );
    }

    if (pageId === activePageId) {
      const original = page.getAttribute("data-bizuply-original-page-display");
      const priority = page.getAttribute(
        "data-bizuply-original-page-display-priority",
      );

      if (original) {
        page.style.setProperty("display", original, priority || "");
      } else {
        page.style.removeProperty("display");
      }
    } else {
      page.style.setProperty("display", "none", "important");
    }
  });
}

export function prepareAllVideosInDom(root: HTMLElement | null) {
  if (!root) return;

  root.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
    video.setAttribute("playsinline", "");
    video.playsInline = true;
    video.preload = video.preload || "metadata";
    normalizeMediaPresentation(video);

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

    if (video.autoplay) {
      video.muted = true;
      video.defaultMuted = true;
      void video.play().catch(() => undefined);
    }
  });
}

function clearVisualSelectionMarkers(root: HTMLElement) {
  root
    .querySelectorAll<HTMLElement>(
      [
        "[data-visual-selected='true']",
        "[data-visual-hovered='true']",
        ".is-visual-selected",
        ".is-visual-hovered",
      ].join(","),
    )
    .forEach((node) => {
      node.removeAttribute("data-visual-selected");
      node.removeAttribute("data-visual-hovered");
      node.classList.remove("is-visual-selected", "is-visual-hovered");
    });
}

function markNodeAsSelected(
  node: HTMLElement,
  mode: "selected" | "hovered",
) {
  if (mode === "selected") {
    node.setAttribute("data-visual-selected", "true");
    node.classList.add("is-visual-selected");
  } else {
    node.setAttribute("data-visual-hovered", "true");
    node.classList.add("is-visual-hovered");
  }
}

function getBestVisualNodeForId(
  root: HTMLElement,
  elementId: string,
  options: FindVisualNodesOptions = {},
) {
  const nodes = findVisualNodes(root, elementId, options);
  if (!nodes.length) return null;

  return (
    nodes.find((node) => !isEditorOnlyNode(node) && node.offsetParent !== null) ||
    nodes.find((node) => !isEditorOnlyNode(node)) ||
    null
  );
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

    if (hoveredNode) markNodeAsSelected(hoveredNode, "hovered");
  }

  if (selectedElementId) {
    const selectedNode = getBestVisualNodeForId(root, selectedElementId, {
      allowFallback: false,
    });

    if (selectedNode) markNodeAsSelected(selectedNode, "selected");
  }
}

export function getBestVisualNodeForSelectionById(
  root: HTMLElement | null,
  elementId: string,
) {
  if (!root) return null;
  return getBestVisualNodeForId(root, elementId, { allowFallback: false });
}

export function applyAllVisualDataToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  renderVisualInsertedSectionsToDom(root, data);
  renderVisualInsertedElementsToDom(root, data);
  registerAllVisualElements(root);
  applyVisualLibraryPageMode(root, data);
  applyVisualContentToDom(root, data);
  applyVisualStylesToDom(root, data);
  applyVisualLayoutToDom(root, data);
  applyVisualAttributesToDom(root, data);
  applyVisualResponsiveToDom(root, data);
  applyVisualLockedToDom(root, data);
  applyVisualHiddenToDom(root, data);
  applyVisualDeletedToDom(root, data);
  prepareAllVideosInDom(root);
  syncEditorMediaPreviewsInDom(root);
}

function getNodeLinkHref(node: HTMLElement) {
  const link =
    node instanceof HTMLAnchorElement
      ? node
      : (node.closest("a") as HTMLAnchorElement | null) ||
        (node.querySelector("a") as HTMLAnchorElement | null);

  return String(
    link?.getAttribute("href") ||
      node.getAttribute("data-visual-link-href") ||
      node.getAttribute("data-link-url") ||
      "",
  );
}

function getNodeLinkTarget(node: HTMLElement) {
  const link =
    node instanceof HTMLAnchorElement
      ? node
      : (node.closest("a") as HTMLAnchorElement | null) ||
        (node.querySelector("a") as HTMLAnchorElement | null);

  return String(
    link?.getAttribute("target") ||
      node.getAttribute("data-visual-link-target") ||
      "_self",
  );
}

function shouldCollectVisualTextFromNode(node: HTMLElement, type: string) {
  if (node.getAttribute("data-visual-inline-editing") === "true") {
    return true;
  }

  if (type !== "text" && type !== "button") return false;
  return !hasMediaInside(node);
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

    const elementId = getDirectVisualElementId(node);
    if (!elementId) return;

    const type = getSafeVisualType(node);
    const currentValue =
      ((nextContent[elementId] || {}) as Record<string, any>) || {};
    const nextValue: Record<string, any> = { ...currentValue };

    if (shouldCollectVisualTextFromNode(node, type)) {
      nextValue.text = getNodeText(node);
    }

    if (type === "image") {
      const src = String(
        node.getAttribute("data-visual-current-src") ||
          getNodeMediaSrc(node) ||
          currentValue.src ||
          "",
      ).trim();
      const alt = String(getNodeMediaAlt(node) || currentValue.alt || "");
      const mediaType =
        String(
          node.getAttribute("data-visual-media-type") ||
            node.getAttribute("data-resource-type") ||
            "",
        ) ||
        getVisualMediaTypeFromNode(node, src) ||
        normalizeVisualMediaType(
          currentValue.mediaType || currentValue.resourceType,
          src,
        ) ||
        "image";

      if (src || currentValue.src !== undefined) {
        nextValue.src = src;
        nextValue.url = src;
        nextValue.secureUrl = src;
      }

      if (alt || currentValue.alt !== undefined) {
        nextValue.alt = alt;
      }

      nextValue.mediaType = mediaType;
      nextValue.resourceType = mediaType;
    }

    const href = getNodeLinkHref(node);
    const target = getNodeLinkTarget(node) === "_blank" ? "_blank" : "_self";

    if (href || currentValue.href !== undefined) {
      nextValue.href = href;
      nextValue.target = target;
      nextValue.rel = target === "_blank" ? "noopener noreferrer" : "";
    }

    if (Object.keys(nextValue).length > 0) {
      nextContent[elementId] = nextValue;
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
