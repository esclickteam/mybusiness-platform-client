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
  getVisualElementId,
  getVisualElementType,
  safeCssSelectorValue,
  selectorForVisualElement,
} from "./visualSelectors";

function findVisualNodes(root: HTMLElement | null, elementId: string) {
  if (!root || !elementId) return [];

  const safeId = safeCssSelectorValue(elementId);

  const directNodes = Array.from(
    root.querySelectorAll<HTMLElement>(
      `[data-visual-edit-id="${safeId}"]`,
    ),
  );

  if (directNodes.length) {
    return directNodes;
  }

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
      node.querySelector?.("img, video, picture, source"),
  );
}

function shouldApplyTextToNode(node: HTMLElement) {
  const type = String(node.getAttribute("data-visual-edit-type") || "");
  const tagName = String(node.tagName || "").toLowerCase();

  if (type === "image") return false;

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
    return true;
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
      "a",
      "button",
    ].includes(tagName)
  ) {
    return !hasMediaInside(node);
  }

  return false;
}

function applyTextContentToNode(node: HTMLElement, value: string) {
  const tagName = String(node.tagName || "").toLowerCase();

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

  node.textContent = value;
}

function applyLinkContentToNode(
  node: HTMLElement,
  href: string,
  target: string = "_self",
  rel?: string,
) {
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
  node.setAttribute("data-visual-media-type", mediaType);
  node.setAttribute("data-resource-type", mediaType);
}

export function applyVisualContentToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const content = readVisualContent(data);

  Object.entries(content).forEach(([elementId, item]) => {
    const nodes = findVisualNodes(root, elementId);

    if (!nodes.length) return;

    nodes.forEach((node) => {
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
  if (!src) return;

  const normalizedType =
    normalizeVisualMediaType(mediaType, src) ||
    getVisualMediaTypeFromNode(node, src) ||
    "image";

  if (normalizedType === "video") {
    const videoNode = getBestVideoNode(node);

    if (videoNode) {
      setVideoSource(videoNode, src, alt);
      markMediaNode(videoNode, "video");
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
          node.getAttribute("data-visual-edit-id") ||
            imageNode.getAttribute("data-visual-edit-id") ||
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
        node.getAttribute("data-visual-edit-id") || "",
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
      return;
    }

    const videoNode = getBestVideoNode(node);

    if (videoNode) {
      const replacement = createImageReplacement(videoNode, src, alt);
      markMediaNode(replacement, "image");

      if (!replacement.getAttribute("data-visual-edit-id")) {
        replacement.setAttribute(
          "data-visual-edit-id",
          node.getAttribute("data-visual-edit-id") ||
            videoNode.getAttribute("data-visual-edit-id") ||
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
        node.getAttribute("data-visual-edit-id") || "",
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
    const nodes = findVisualNodes(root, elementId);

    nodes.forEach((node) => {
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

    const nodes = findVisualNodes(root, elementId);

    nodes.forEach((node) => {
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

  root
    .querySelectorAll<HTMLElement>("[data-visual-selected], [data-visual-hovered]")
    .forEach((node) => {
      node.removeAttribute("data-visual-selected");
      node.removeAttribute("data-visual-hovered");
    });

  if (hoveredElementId) {
    findVisualNodes(root, hoveredElementId).forEach((node) => {
      node.setAttribute("data-visual-hovered", "true");
    });
  }

  if (selectedElementId) {
    findVisualNodes(root, selectedElementId).forEach((node) => {
      node.setAttribute("data-visual-selected", "true");
    });
  }
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
    root.querySelectorAll<HTMLElement>(
      "[data-visual-editable='true'][data-visual-edit-id]",
    ),
  );

  nodes.forEach((node) => {
    const elementId = getVisualElementId(node);
    if (!elementId) return;

    const elementType = getVisualElementType(node);
    const currentValue = nextContent[elementId] || {};
    const nextValue: VisualContentMap[string] = { ...currentValue };

    const hasMediaChild = Boolean(
      node.querySelector?.("img, video, picture, source"),
    );

    if (
      !hasMediaChild &&
      (elementType === "text" ||
        elementType === "button" ||
        elementType === "line" ||
        elementType === "box")
    ) {
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