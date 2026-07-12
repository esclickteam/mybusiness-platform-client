import type {
  VisualLibraryNodeTemplate,
  VisualLibrarySectionTemplate,
} from "./visualLibraryTypes";

export function absoluteLayout(
  x: number,
  y: number,
  width: string | number,
  height?: string | number,
  zIndex = 10,
) {
  return {
    position: "absolute" as const,
    x,
    y,
    translateX: x,
    translateY: y,
    width,
    ...(height !== undefined ? { height } : {}),
    zIndex,
    freePosition: true,
  };
}

export function textNode(
  key: string,
  text: string,
  style: Record<string, any>,
  layout: Record<string, any>,
  label = "טקסט",
): VisualLibraryNodeTemplate {
  return {
    key,
    type: "text",
    label,
    tagName: "div",
    content: { text },
    style,
    layout,
  };
}

export function buttonNode(
  key: string,
  text: string,
  style: Record<string, any>,
  layout: Record<string, any>,
  href = "#",
): VisualLibraryNodeTemplate {
  return {
    key,
    type: "button",
    label: text,
    tagName: "a",
    content: {
      text,
      href,
      target: "_self",
      rel: "",
    },
    style,
    layout,
    attributes: {
      role: "button",
    },
  };
}

export function imageNode(
  key: string,
  src: string,
  style: Record<string, any>,
  layout: Record<string, any>,
  alt = "תמונה",
): VisualLibraryNodeTemplate {
  return {
    key,
    type: "image",
    label: alt,
    tagName: "img",
    content: {
      src,
      url: src,
      secureUrl: src,
      mediaType: "image",
      resourceType: "image",
      alt,
    },
    style,
    layout,
  };
}

export function videoNode(
  key: string,
  src: string,
  style: Record<string, any>,
  layout: Record<string, any>,
  label = "סרטון",
): VisualLibraryNodeTemplate {
  return {
    key,
    type: "video",
    label,
    tagName: "video",
    content: {
      src,
      url: src,
      secureUrl: src,
      mediaType: "video",
      resourceType: "video",
      autoplay: true,
      muted: true,
      loop: true,
      controls: false,
      playsInline: true,
      preload: "auto",
    },
    style,
    layout,
  };
}

export function boxNode(
  key: string,
  style: Record<string, any>,
  layout: Record<string, any>,
  label = "קופסה",
): VisualLibraryNodeTemplate {
  return {
    key,
    type: "box",
    label,
    tagName: "div",
    content: {},
    style,
    layout,
  };
}

export function iconNode(
  key: string,
  iconName: string,
  style: Record<string, any>,
  layout: Record<string, any>,
  label = "אייקון",
): VisualLibraryNodeTemplate {
  return {
    key,
    type: "icon",
    label,
    tagName: "div",
    content: {
      iconName,
      iconText: iconName,
    },
    style,
    layout,
  };
}

export function cloneSection(
  section: VisualLibrarySectionTemplate,
): VisualLibrarySectionTemplate {
  return JSON.parse(JSON.stringify(section));
}
