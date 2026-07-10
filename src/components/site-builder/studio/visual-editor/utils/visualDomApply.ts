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

export function applyVisualContentToDom(
  root: HTMLElement | null,
  data: Record<string, any>,
) {
  if (!root) return;

  const content = readVisualContent(data);

  Object.entries(content).forEach(([elementId, item]) => {
    const safeId = safeCssSelectorValue(elementId);

    const node = root.querySelector<HTMLElement>(
      `[data-visual-edit-id="${safeId}"]`,
    );

    if (!node) return;

    if (item.text !== undefined) {
      const type = node.getAttribute("data-visual-edit-type");

      if (
        type !== "image" &&
        !(node instanceof HTMLImageElement) &&
        !(node instanceof HTMLVideoElement)
      ) {
        node.textContent = String(item.text || "");
      }
    }

    if (item.href !== undefined) {
      if (node instanceof HTMLAnchorElement) {
        node.setAttribute("href", item.href || "#");
        node.setAttribute("target", item.target || "_self");

        if (item.rel) {
          node.setAttribute("rel", item.rel);
        } else {
          node.removeAttribute("rel");
        }
      } else {
        const link = node.closest("a") || node.querySelector("a");

        if (link) {
          link.setAttribute("href", item.href || "#");
          link.setAttribute("target", item.target || "_self");

          if (item.rel) {
            link.setAttribute("rel", item.rel);
          } else {
            link.removeAttribute("rel");
          }
        }
      }
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
    getVisualMediaTypeFromNode(node, src);

  if (normalizedType === "video") {
    if (node instanceof HTMLVideoElement) {
      setVideoSource(node, src, alt);
      return;
    }

    const videoNode = node.querySelector?.("video") as HTMLVideoElement | null;

    if (videoNode) {
      setVideoSource(videoNode, src, alt);
      return;
    }

    if (node instanceof HTMLImageElement) {
      const replacement = createVideoReplacement(node, src, alt);
      node.replaceWith(replacement);
      return;
    }

    const imageNode = node.querySelector?.("img") as HTMLImageElement | null;

    if (imageNode) {
      const replacement = createVideoReplacement(imageNode, src, alt);
      imageNode.replaceWith(replacement);
      return;
    }

    const replacement = createVideoReplacement(node, src, alt);
    node.replaceChildren(replacement);
    return;
  }

  if (normalizedType === "image") {
    if (node instanceof HTMLImageElement) {
      setImageSource(node, src, alt);
      return;
    }

    const imageNode = node.querySelector?.("img") as HTMLImageElement | null;

    if (imageNode) {
      setImageSource(imageNode, src, alt);
      return;
    }

    if (node instanceof HTMLVideoElement) {
      const replacement = createImageReplacement(node, src, alt);
      node.replaceWith(replacement);
      return;
    }

    const videoNode = node.querySelector?.("video") as HTMLVideoElement | null;

    if (videoNode) {
      const replacement = createImageReplacement(videoNode, src, alt);
      videoNode.replaceWith(replacement);
      return;
    }

    const replacement = createImageReplacement(node, src, alt);
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
    const nodes = root.querySelectorAll<HTMLElement>(
      selectorForVisualElement(elementId),
    );

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

    const nodes = root.querySelectorAll<HTMLElement>(
      selectorForVisualElement(elementId),
    );

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
    root
      .querySelectorAll<HTMLElement>(selectorForVisualElement(hoveredElementId))
      .forEach((node) => {
        node.setAttribute("data-visual-hovered", "true");
      });
  }

  if (selectedElementId) {
    root
      .querySelectorAll<HTMLElement>(selectorForVisualElement(selectedElementId))
      .forEach((node) => {
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