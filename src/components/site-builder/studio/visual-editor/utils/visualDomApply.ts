import {
  VISUAL_CONTENT_KEY,
  readVisualContent,
  readVisualDeleted,
  readVisualStyles,
  type VisualContentMap,
} from "./visualData";

import {
  createImageReplacement,
  createVideoReplacement,
  getNodeMediaAlt,
  getNodeMediaSrc,
  getVisualMediaTypeFromNode,
  normalizeVisualMediaType,
  prepareEditorVideoPreview,
  setImageSource,
  setVideoSource,
} from "./visualMediaUtils";

import {
  getNodeText,
  safeCssSelectorValue,
  selectorForVisualElement,
} from "./visualSelectors";

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

  if (paintTarget !== node) {
    paintTarget.setAttribute(
      "data-visual-edit-id",
      paintTarget.getAttribute("data-visual-edit-id") ||
        getDirectVisualElementId(node),
    );
    paintTarget.setAttribute(
      "data-visual-edit-type",
      paintTarget.getAttribute("data-visual-edit-type") ||
        getSafeVisualType(node),
    );
    paintTarget.setAttribute("data-visual-editable", "true");
  }
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
    const nodes = findVisualNodes(root, elementId, {
      allowFallback: true,
    });

    if (!nodes.length) return;

    nodes.forEach((node) => {
      if (isEditorOnlyNode(node)) return;

      if (item.text !== undefined && shouldApplyTextToNode(node)) {
        applyTextContentToNode(node, String(item.text ?? ""));
      }

      if (item.href !== undefined) {
        applyLinkContentToNode(
          node,
          item.href || "#",
          item.target || "_self",
          item.rel,
        );
      }

      if (item.src !== undefined) {
        applyMediaContentToNode(
          node,
          item.src || "",
          item.alt,
          item.mediaType || item.resourceType,
        );
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

  if (normalizedType === "video") {
    const videoNode = getBestVideoNode(node);

    if (videoNode) {
      setVideoSource(videoNode, src, alt);
      markMediaNode(videoNode, "video");

      if (!videoNode.getAttribute("data-visual-edit-id")) {
        const currentId = getDirectVisualElementId(node);
        if (currentId) videoNode.setAttribute("data-visual-edit-id", currentId);
      }

      prepareEditorVideoPreview(videoNode);
      return;
    }

    const imageNode = getBestImageNode(node);

    if (imageNode) {
      const replacement = createVideoReplacement(imageNode, src, alt);
      markMediaNode(replacement, "video");

      if (!replacement.getAttribute("data-visual-edit-id")) {
        replacement.setAttribute(
          "data-visual-edit-id",
          getDirectVisualElementId(node) ||
            getDirectVisualElementId(imageNode) ||
            "",
        );
      }

      imageNode.replaceWith(replacement);
      prepareEditorVideoPreview(replacement);
      return;
    }

    const replacement = createVideoReplacement(node, src, alt);
    markMediaNode(replacement, "video");

    if (!replacement.getAttribute("data-visual-edit-id")) {
      replacement.setAttribute(
        "data-visual-edit-id",
        getDirectVisualElementId(node) || "",
      );
    }

    node.replaceChildren(replacement);
    prepareEditorVideoPreview(replacement);
    return;
  }

  if (normalizedType === "image") {
    const imageNode = getBestImageNode(node);

    if (imageNode) {
      setImageSource(imageNode, src, alt);
      markMediaNode(imageNode, "image");

      if (!imageNode.getAttribute("data-visual-edit-id")) {
        const currentId = getDirectVisualElementId(node);
        if (currentId) imageNode.setAttribute("data-visual-edit-id", currentId);
      }

      return;
    }

    const videoNode = getBestVideoNode(node);

    if (videoNode) {
      const replacement = createImageReplacement(videoNode, src, alt);
      markMediaNode(replacement, "image");

      if (!replacement.getAttribute("data-visual-edit-id")) {
        replacement.setAttribute(
          "data-visual-edit-id",
          getDirectVisualElementId(node) ||
            getDirectVisualElementId(videoNode) ||
            "",
        );
      }

      videoNode.replaceWith(replacement);
      return;
    }

    const replacement = createImageReplacement(node, src, alt);
    markMediaNode(replacement, "image");

    if (!replacement.getAttribute("data-visual-edit-id")) {
      replacement.setAttribute(
        "data-visual-edit-id",
        getDirectVisualElementId(node) || "",
      );
    }

    node.replaceChildren(replacement);
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
      allowFallback: true,
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
    });
  });
}

export function applyVisualDeletedToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const deleted = readVisualDeleted(data);

  Object.entries(deleted).forEach(([elementId, isDeleted]) => {
    if (!isDeleted) return;

    const nodes = findVisualNodes(root, elementId, {
      allowFallback: true,
    });

    nodes.forEach((node) => {
      if (isEditorOnlyNode(node)) return;

      node.setAttribute("data-visual-deleted", "true");
      node.style.setProperty("display", "none", "important");
    });
  });
}

export function prepareAllVideosInDom(root: HTMLElement | null) {
  if (!root) return;

  root.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
    prepareEditorVideoPreview(video);
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

export function applyAllVisualDataToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  applyVisualContentToDom(root, data);
  applyVisualStylesToDom(root, data);
  applyVisualDeletedToDom(root, data);
  prepareAllVideosInDom(root);
}

export function collectVisualContentFromDom(
  root: HTMLElement | null,
  currentData: Record<string, any>,
): VisualContentMap {
  const currentContent = readVisualContent(currentData);
  const nextContent: VisualContentMap = { ...currentContent };

  if (!root) return nextContent;

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
    const currentValue = nextContent[elementId] || {};
    const nextValue: VisualContentMap[string] = { ...currentValue };

    if (isTextCollectableNode(node)) {
      const text = getNodeText(node);

      if (text || currentValue.text !== undefined) {
        nextValue.text = text;
      }
    }

    if (
      elementType === "image" ||
      node instanceof HTMLImageElement ||
      node instanceof HTMLVideoElement ||
      node instanceof HTMLSourceElement ||
      node.querySelector?.("img, video, source")
    ) {
      const src = getNodeMediaSrc(node);
      const alt = getNodeMediaAlt(node);

      const mediaType =
        getVisualMediaTypeFromNode(node, src) ||
        normalizeVisualMediaType(
          currentValue.mediaType || currentValue.resourceType,
          src,
        );

      if (src || currentValue.src !== undefined) {
        nextValue.src = src;
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
      const href = String(
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

      if (href || currentValue.href !== undefined) {
        nextValue.href = href;
        nextValue.target = target === "_blank" ? "_blank" : "_self";
        nextValue.rel =
          nextValue.target === "_blank" ? "noopener noreferrer" : "";
      }
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
