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
    // Pin to physical top-left so RTL canvas doesn't push nodes off-screen
    left: 0,
    top: 0,
    right: "auto",
    bottom: "auto",
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
    style: {
      direction: "rtl",
      textAlign: "right",
      ...style,
    },
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

/**
 * מוסיף עומק (צל רך) לכרטיסים בהירים כדי שיראו מקצועיים יותר.
 * מדלג בבטחה על רקעים מלאים, גרדיאנטים, שכבות שקופות, פאנלים כהים
 * ומפות — כך שרק כרטיסים לבנים/בהירים מקבלים את הצל.
 */
function withCardDepth(
  style: Record<string, any>,
): Record<string, any> {
  const bg = String(style.backgroundColor || "")
    .toLowerCase()
    .trim();

  const hasShadow = style.boxShadow !== undefined;
  const hasBgImage = style.backgroundImage !== undefined;
  const isTranslucent =
    bg === "" ||
    bg === "transparent" ||
    bg.includes("rgba") ||
    bg.includes("hsla");

  // רקעים בהירים בלבד: לבן או גוונים פסטליים שמתחילים ב-#f
  const isLight =
    bg === "white" ||
    bg === "#fff" ||
    bg === "#ffffff" ||
    /^#f[0-9a-f]{2}([0-9a-f]{3})?$/.test(bg);

  if (isLight && !hasShadow && !hasBgImage && !isTranslucent) {
    return {
      ...style,
      boxShadow: "0 18px 40px -24px rgba(15,23,42,0.25)",
    };
  }

  return style;
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
    style: withCardDepth(style),
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
