export type VisualMediaType = "image" | "video" | "raw" | "";

export function normalizeMediaSrcForDetection(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .split("#")[0]
    .split("?")[0];
}

export function isVideoSrc(src: string) {
  const clean = normalizeMediaSrcForDetection(src);

  return (
    clean.startsWith("data:video/") ||
    clean.startsWith("blob:") ||
    clean.includes("/video/upload/") ||
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m4v") ||
    clean.endsWith(".ogv")
  );
}

export function isImageSrc(src: string) {
  const clean = normalizeMediaSrcForDetection(src);

  return (
    clean.startsWith("data:image/") ||
    clean.includes("/image/upload/") ||
    clean.endsWith(".jpg") ||
    clean.endsWith(".jpeg") ||
    clean.endsWith(".png") ||
    clean.endsWith(".webp") ||
    clean.endsWith(".gif") ||
    clean.endsWith(".svg") ||
    clean.endsWith(".avif")
  );
}

export function normalizeVisualMediaType(
  mediaType?: string,
  src?: string,
): VisualMediaType {
  const explicit = String(mediaType || "").trim().toLowerCase();

  if (explicit === "video") return "video";
  if (explicit === "image") return "image";
  if (explicit === "raw") return "raw";

  if (src && isVideoSrc(src)) return "video";
  if (src && isImageSrc(src)) return "image";

  return "";
}

export function getVideoMimeType(src: string) {
  const clean = normalizeMediaSrcForDetection(src);

  if (clean.startsWith("data:video/")) {
    return clean.slice("data:".length).split(";")[0] || "video/mp4";
  }

  if (clean.includes("/video/upload/") || clean.includes("f_mp4")) {
    return "video/mp4";
  }

  if (clean.endsWith(".webm")) return "video/webm";
  if (clean.endsWith(".mov")) return "video/quicktime";
  if (clean.endsWith(".m4v")) return "video/x-m4v";
  if (clean.endsWith(".ogv")) return "video/ogg";

  return "video/mp4";
}

export function getVisualMediaTypeFromNode(
  node: HTMLElement | null,
  src?: string,
): VisualMediaType {
  if (!node) return normalizeVisualMediaType(undefined, src);

  const attrMediaType =
    node.getAttribute("data-visual-media-type") ||
    node.getAttribute("data-media-type") ||
    node.getAttribute("data-resource-type") ||
    "";

  const explicit = normalizeVisualMediaType(attrMediaType, src);
  if (explicit) return explicit;

  if (node instanceof HTMLSourceElement && node.parentElement instanceof HTMLVideoElement) {
    return "video";
  }

  if (node instanceof HTMLVideoElement || node.querySelector?.("video")) {
    return "video";
  }

  if (node instanceof HTMLImageElement || node.querySelector?.("img")) {
    return "image";
  }

  return normalizeVisualMediaType(undefined, src);
}

/*
  ברירת המחדל של מדיה בעורך.
  וידאו חייב להתנהג בדיוק כמו תמונה: object-fit "cover" כברירת מחדל,
  תוך כיבוד ערך שמור אם המשתמש בחר אחד. שימוש אחיד בערך הזה בכל צנרת
  המדיה מונע את הסתירה בין cover ל-contain שגרמה לקפיצות ולמריחה בזמן resize.
*/
export const DEFAULT_MEDIA_OBJECT_FIT = "cover";
export const DEFAULT_MEDIA_OBJECT_POSITION = "center";

export function resolveMediaObjectFit(
  ...values: Array<string | null | undefined>
): string {
  for (const value of values) {
    const clean = String(value || "").trim().toLowerCase();

    if (clean && clean !== "initial" && clean !== "inherit") {
      return clean;
    }
  }

  return DEFAULT_MEDIA_OBJECT_FIT;
}

/*
  מחיל object-fit / object-position על אלמנט מדיה (img או video) באופן זהה.
  ברירת המחדל היא "cover" כדי להתאים להתנהגות התמונה, אך ערך קיים על
  האלמנט (למשל סגנון שמור שהוחל קודם) מכובד ולא נדרס.
*/
export function applyMediaFitStyles(
  node: HTMLElement,
  options: {
    objectFit?: string | null;
    objectPosition?: string | null;
    important?: boolean;
  } = {},
) {
  const priority = options.important ? "important" : "";

  const fit = resolveMediaObjectFit(
    options.objectFit,
    node.style.objectFit,
    node.style.getPropertyValue("object-fit"),
  );

  node.style.setProperty("object-fit", fit, priority);

  const position =
    String(
      options.objectPosition ||
        node.style.objectPosition ||
        node.style.getPropertyValue("object-position") ||
        "",
    ).trim() || DEFAULT_MEDIA_OBJECT_POSITION;

  node.style.setProperty("object-position", position, priority);
}

/**
 * שומר את תיבת המדיה של העורך גם אחרי img→video באתר הציבורי.
 * בלי זה הווידאו נוטה לפרוץ לפי יחס הפריים המקורי ולשנות גודל.
 */
export function preserveVisualMediaBoxSize(
  source: HTMLElement | null,
  target: HTMLElement | null,
) {
  if (!source || !target) return;

  if (target.style.maxWidth === "none") {
    target.style.removeProperty("max-width");
  }
  if (target.style.maxHeight === "none") {
    target.style.removeProperty("max-height");
  }

  const computed =
    typeof window !== "undefined" ? window.getComputedStyle(source) : null;

  if (computed) {
    applyMediaFitStyles(target, {
      objectFit:
        target.style.objectFit ||
        (computed.objectFit !== "fill" ? computed.objectFit : "") ||
        DEFAULT_MEDIA_OBJECT_FIT,
      objectPosition:
        target.style.objectPosition ||
        computed.objectPosition ||
        DEFAULT_MEDIA_OBJECT_POSITION,
    });

    const borderRadius = source.style.borderRadius || computed.borderRadius;
    if (borderRadius && !target.style.borderRadius) {
      target.style.borderRadius = borderRadius;
    }
  } else if (!target.style.objectFit) {
    applyMediaFitStyles(target);
  }

  if (!target.style.display || target.style.display === "inline") {
    target.style.display = "block";
  }

  if (typeof window === "undefined") return;

  const rect = source.getBoundingClientRect();
  if (!(rect.width > 1 && rect.height > 1)) return;

  if (!target.style.aspectRatio) {
    target.style.aspectRatio = `${Math.round(rect.width)} / ${Math.round(
      rect.height,
    )}`;
  }

  if (!target.style.width) {
    target.style.width = source.style.width || "100%";
  }

  if (!target.style.height) {
    target.style.height = source.style.height || "100%";
  }
}

export function prepareEditorVideoPreview(videoNode: HTMLVideoElement) {
  videoNode.setAttribute("muted", "");
  videoNode.setAttribute("loop", "");
  videoNode.setAttribute("playsinline", "");
  videoNode.setAttribute("autoplay", "");
  videoNode.setAttribute("preload", "auto");
  videoNode.removeAttribute("controls");

  videoNode.defaultMuted = true;
  videoNode.muted = true;
  videoNode.loop = true;
  videoNode.playsInline = true;
  videoNode.autoplay = true;
  videoNode.controls = false;

  if (!videoNode.style.objectFit) {
    videoNode.style.objectFit = DEFAULT_MEDIA_OBJECT_FIT;
  }

  if (!videoNode.style.display) {
    videoNode.style.display = "block";
  }

  const tryPlay = () => {
    /*
      מנגנים play רק כשהווידאו לא כבר מתנגן.
      קריאה חוזרת ל-play() על וידאו פעיל בכל עדכון data גרמה
      לניצנוץ ולקפיצות בזמן resize.
    */
    if (!videoNode.paused) return;

    try {
      const playPromise = videoNode.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Autoplay can be blocked temporarily by the browser.
        });
      }
    } catch {
      // ignore
    }
  };

  if (videoNode.readyState >= 2) {
    tryPlay();
  } else {
    videoNode.addEventListener("loadeddata", tryPlay, { once: true });
    videoNode.addEventListener("canplay", tryPlay, { once: true });
  }
}

export function copyMediaVisualAttributes(from: HTMLElement, to: HTMLElement) {
  Array.from(from.attributes).forEach((attribute) => {
    const name = attribute.name.toLowerCase();

    if (
      [
        "src",
        "srcset",
        "alt",
        "poster",
        "loading",
        "decoding",
        "width",
        "height",
      ].includes(name)
    ) {
      return;
    }

    to.setAttribute(attribute.name, attribute.value);
  });

  if (!to.getAttribute("data-visual-editable")) {
    to.setAttribute("data-visual-editable", "true");
  }

  if (!to.getAttribute("data-visual-edit-type")) {
    to.setAttribute("data-visual-edit-type", "image");
  }
}

export function createVideoReplacement(
  sourceNode: HTMLElement,
  src: string,
  alt?: string,
) {
  const video = document.createElement("video");

  copyMediaVisualAttributes(sourceNode, video);

  video.setAttribute("data-visual-media-type", "video");
  video.setAttribute("data-resource-type", "video");
  video.className = sourceNode.getAttribute("class") || "";

  prepareEditorVideoPreview(video);

  const label =
    alt ||
    sourceNode.getAttribute("alt") ||
    sourceNode.getAttribute("title") ||
    sourceNode.getAttribute("aria-label") ||
    "";

  if (label) {
    video.setAttribute("title", label);
    video.setAttribute("aria-label", label);
  }

  const source = document.createElement("source");
  source.setAttribute("src", src);
  source.setAttribute("type", getVideoMimeType(src));
  video.appendChild(source);

  try {
    video.load();
    prepareEditorVideoPreview(video);
  } catch {
    // ignore
  }

  return video;
}

export function createImageReplacement(
  sourceNode: HTMLElement,
  src: string,
  alt?: string,
) {
  const image = document.createElement("img");

  copyMediaVisualAttributes(sourceNode, image);

  image.setAttribute("data-visual-media-type", "image");
  image.setAttribute("data-resource-type", "image");
  image.className = sourceNode.getAttribute("class") || "";
  image.setAttribute("src", src);
  image.setAttribute(
    "alt",
    alt ||
      sourceNode.getAttribute("alt") ||
      sourceNode.getAttribute("title") ||
      sourceNode.getAttribute("aria-label") ||
      "",
  );

  return image;
}

export function setVideoSource(
  videoNode: HTMLVideoElement,
  src: string,
  alt?: string,
) {
  const sourceNode = videoNode.querySelector("source");

  if (sourceNode) {
    sourceNode.setAttribute("src", src);
    sourceNode.setAttribute("type", getVideoMimeType(src));
  } else {
    const nextSource = document.createElement("source");
    nextSource.setAttribute("src", src);
    nextSource.setAttribute("type", getVideoMimeType(src));
    videoNode.appendChild(nextSource);
  }

  videoNode.setAttribute("src", src);
  videoNode.setAttribute("data-visual-media-type", "video");
  videoNode.setAttribute("data-resource-type", "video");

  if (alt !== undefined) {
    videoNode.setAttribute("title", alt);
    videoNode.setAttribute("aria-label", alt);
  }

  try {
    videoNode.load();
  } catch {
    // ignore
  }

  prepareEditorVideoPreview(videoNode);
}

export function setImageSource(
  imageNode: HTMLImageElement,
  src: string,
  alt?: string,
) {
  imageNode.setAttribute("src", src);
  imageNode.setAttribute("data-visual-media-type", "image");
  imageNode.setAttribute("data-resource-type", "image");

  if (alt !== undefined) {
    imageNode.setAttribute("alt", alt);
  }
}

export function getNodeMediaSrc(node: HTMLElement | null) {
  if (!node) return "";

  if (node instanceof HTMLSourceElement) {
    return String(
      node.getAttribute("src") ||
        (node.parentElement instanceof HTMLVideoElement
          ? node.parentElement.currentSrc || node.parentElement.src || ""
          : ""),
    );
  }

  if (node instanceof HTMLVideoElement) {
    const sourceNode = node.querySelector("source");

    return String(
      sourceNode?.getAttribute("src") ||
        node.getAttribute("src") ||
        node.currentSrc ||
        node.src ||
        "",
    );
  }

  const videoNode = node.querySelector?.("video") as HTMLVideoElement | null;

  if (videoNode) {
    const sourceNode = videoNode.querySelector("source");

    return String(
      sourceNode?.getAttribute("src") ||
        videoNode.getAttribute("src") ||
        videoNode.currentSrc ||
        videoNode.src ||
        "",
    );
  }

  const imageNode =
    node instanceof HTMLImageElement
      ? node
      : (node.querySelector?.("img") as HTMLImageElement | null);

  return String(imageNode?.getAttribute("src") || imageNode?.src || "");
}

export function getNodeMediaAlt(node: HTMLElement | null) {
  if (!node) return "";

  if (node instanceof HTMLSourceElement && node.parentElement instanceof HTMLVideoElement) {
    return String(
      node.parentElement.getAttribute("title") ||
        node.parentElement.getAttribute("aria-label") ||
        "",
    );
  }

  if (node instanceof HTMLVideoElement) {
    return String(node.getAttribute("title") || node.getAttribute("aria-label") || "");
  }

  const videoNode = node.querySelector?.("video") as HTMLVideoElement | null;

  if (videoNode) {
    return String(videoNode.getAttribute("title") || videoNode.getAttribute("aria-label") || "");
  }

  const imageNode =
    node instanceof HTMLImageElement
      ? node
      : (node.querySelector?.("img") as HTMLImageElement | null);

  return String(imageNode?.getAttribute("alt") || "");
}

export type VisualMediaEditValues = {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  sharpness: number;
  vignette: number;
};

export function buildMediaEditFilter(values: VisualMediaEditValues) {
  const brightness = values.brightness / 100;
  const contrast = values.contrast / 100;
  const saturation = values.saturation / 100;
  const exposure = values.exposure / 100;
  const sharpness = 1 + values.sharpness / 100;
  const vignette = values.vignette / 100;

  return [
    `brightness(${brightness * exposure})`,
    `contrast(${contrast})`,
    `saturate(${saturation})`,
    sharpness > 1 ? `contrast(${sharpness})` : "",
    vignette > 0
      ? `drop-shadow(0 0 ${Math.round(vignette * 28)}px rgba(0,0,0,${0.15 + vignette * 0.45}))`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}