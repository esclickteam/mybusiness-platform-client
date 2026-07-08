export type BizuplyVisualMediaType = "image" | "video" | "raw" | "";

export type BizuplyVisualMediaValue = {
  src?: string;
  url?: string;
  secureUrl?: string;
  alt?: string;
  title?: string;
  mediaType?: string;
  resourceType?: string;
  mimeType?: string;
  publicId?: string;
};

export function normalizeMediaUrl(value: unknown): string {
  if (!value) return "";

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    const source = value as BizuplyVisualMediaValue;

    return String(
      source.src ||
        source.secureUrl ||
        source.url ||
        "",
    ).trim();
  }

  return "";
}

export function normalizeMediaAlt(value: unknown): string {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "";
  }

  const source = value as BizuplyVisualMediaValue;

  return String(source.alt || source.title || "").trim();
}

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
    clean.includes("resource_type=video") ||
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m4v") ||
    clean.endsWith(".ogv") ||
    clean.endsWith(".ogg")
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
  mimeType?: string,
): BizuplyVisualMediaType {
  const explicit = String(mediaType || "").trim().toLowerCase();
  const mime = String(mimeType || "").trim().toLowerCase();

  if (explicit === "video") return "video";
  if (explicit === "image") return "image";
  if (explicit === "raw") return "raw";

  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("image/")) return "image";

  if (src && isVideoSrc(src)) return "video";
  if (src && isImageSrc(src)) return "image";

  return "";
}

export function getVideoMimeType(src: string) {
  const clean = normalizeMediaSrcForDetection(src);

  if (clean.startsWith("data:video/")) {
    return clean.slice("data:".length).split(";")[0] || "video/mp4";
  }

  if (clean.includes("/video/upload/")) return "video/mp4";
  if (clean.includes("f_mp4")) return "video/mp4";
  if (clean.endsWith(".webm")) return "video/webm";
  if (clean.endsWith(".mov")) return "video/quicktime";
  if (clean.endsWith(".m4v")) return "video/x-m4v";
  if (clean.endsWith(".ogv")) return "video/ogg";
  if (clean.endsWith(".ogg")) return "video/ogg";

  return "video/mp4";
}

export function normalizeVisualMediaValue(value: unknown): {
  src: string;
  alt: string;
  mediaType: BizuplyVisualMediaType;
  resourceType: BizuplyVisualMediaType;
  mimeType: string;
  publicId: string;
} {
  const src = normalizeMediaUrl(value);
  const alt = normalizeMediaAlt(value);

  if (typeof value === "object" && value && !Array.isArray(value)) {
    const source = value as BizuplyVisualMediaValue;

    const mediaType = normalizeVisualMediaType(
      source.mediaType || source.resourceType,
      src,
      source.mimeType,
    );

    return {
      src,
      alt,
      mediaType,
      resourceType: mediaType,
      mimeType: String(source.mimeType || (mediaType === "video" ? getVideoMimeType(src) : "")),
      publicId: String(source.publicId || ""),
    };
  }

  const mediaType = normalizeVisualMediaType("", src, "");

  return {
    src,
    alt,
    mediaType,
    resourceType: mediaType,
    mimeType: mediaType === "video" ? getVideoMimeType(src) : "",
    publicId: "",
  };
}

export function prepareVisualVideo(videoNode: HTMLVideoElement) {
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
    videoNode.style.objectFit = "cover";
  }

  if (!videoNode.style.display) {
    videoNode.style.display = "block";
  }

  const tryPlay = () => {
    try {
      const playPromise = videoNode.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
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

function copySafeMediaAttributes(from: HTMLElement, to: HTMLElement) {
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

export function createVisualVideoElement(
  sourceNode: HTMLElement,
  src: string,
  alt = "",
) {
  const video = document.createElement("video");

  copySafeMediaAttributes(sourceNode, video);

  video.className = sourceNode.getAttribute("class") || "";
  video.setAttribute("data-visual-media-type", "video");
  video.setAttribute("data-resource-type", "video");

  if (alt) {
    video.setAttribute("title", alt);
    video.setAttribute("aria-label", alt);
  }

  const source = document.createElement("source");
  source.setAttribute("src", src);
  source.setAttribute("type", getVideoMimeType(src));
  video.appendChild(source);

  prepareVisualVideo(video);

  try {
    video.load();
    prepareVisualVideo(video);
  } catch {
    // ignore
  }

  return video;
}

export function createVisualImageElement(
  sourceNode: HTMLElement,
  src: string,
  alt = "",
) {
  const image = document.createElement("img");

  copySafeMediaAttributes(sourceNode, image);

  image.className = sourceNode.getAttribute("class") || "";
  image.setAttribute("src", src);
  image.setAttribute("alt", alt);
  image.setAttribute("data-visual-media-type", "image");
  image.setAttribute("data-resource-type", "image");

  return image;
}

export function getDirectVideoNode(node: HTMLElement) {
  if (node instanceof HTMLVideoElement) return node;

  if (
    node instanceof HTMLSourceElement &&
    node.parentElement instanceof HTMLVideoElement
  ) {
    return node.parentElement;
  }

  return node.querySelector?.("video") as HTMLVideoElement | null;
}

export function getDirectImageNode(node: HTMLElement) {
  return node instanceof HTMLImageElement
    ? node
    : (node.querySelector?.("img") as HTMLImageElement | null);
}

export function setVisualVideoSource(
  videoNode: HTMLVideoElement,
  src: string,
  alt = "",
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
    videoNode.setAttribute("title", alt || "");
    videoNode.setAttribute("aria-label", alt || "");
  }

  prepareVisualVideo(videoNode);

  try {
    videoNode.load();
    prepareVisualVideo(videoNode);
  } catch {
    // ignore
  }
}

function makeNodeSafeForMediaLayer(node: HTMLElement) {
  const computedPosition =
    typeof window !== "undefined" ? window.getComputedStyle(node).position : "";

  if (!computedPosition || computedPosition === "static") {
    node.style.position = "relative";
  }

  if (!node.style.overflow) {
    node.style.overflow = "hidden";
  }

  Array.from(node.children).forEach((child) => {
    const childElement = child as HTMLElement;

    if (childElement.getAttribute("data-visual-media-layer") === "true") {
      return;
    }

    if (!childElement.style.position) {
      childElement.style.position = "relative";
    }

    if (!childElement.style.zIndex) {
      childElement.style.zIndex = "1";
    }
  });
}

export function applyVisualMediaLayerToContainer(
  node: HTMLElement,
  value: unknown,
) {
  const media = normalizeVisualMediaValue(value);

  if (!media.src) return;

  const wantsVideo = media.mediaType === "video";
  const wantsImage = media.mediaType === "image";

  if (!wantsVideo && !wantsImage) return;

  makeNodeSafeForMediaLayer(node);

  const previousLayer = node.querySelector?.(
    "[data-visual-media-layer='true']",
  ) as HTMLElement | null;

  if (wantsVideo) {
    let videoNode =
      previousLayer instanceof HTMLVideoElement
        ? previousLayer
        : (previousLayer?.querySelector?.("video") as HTMLVideoElement | null);

    if (!videoNode) {
      previousLayer?.remove();

      videoNode = document.createElement("video");
      videoNode.setAttribute("data-visual-media-layer", "true");
      videoNode.setAttribute("data-visual-editable", "false");
      videoNode.setAttribute("data-visual-media-type", "video");
      videoNode.setAttribute("data-resource-type", "video");
      videoNode.setAttribute("aria-hidden", "true");
      videoNode.tabIndex = -1;
      videoNode.className = "bizuply-visual-media-layer";

      videoNode.style.position = "absolute";
      videoNode.style.inset = "0";
      videoNode.style.width = "100%";
      videoNode.style.height = "100%";
      videoNode.style.objectFit = "cover";
      videoNode.style.zIndex = "0";
      videoNode.style.pointerEvents = "none";

      node.insertBefore(videoNode, node.firstChild);
    }

    setVisualVideoSource(videoNode, media.src, media.alt);
    return;
  }

  let imageNode =
    previousLayer instanceof HTMLImageElement
      ? previousLayer
      : (previousLayer?.querySelector?.("img") as HTMLImageElement | null);

  if (!imageNode) {
    previousLayer?.remove();

    imageNode = document.createElement("img");
    imageNode.setAttribute("data-visual-media-layer", "true");
    imageNode.setAttribute("data-visual-editable", "false");
    imageNode.setAttribute("data-visual-media-type", "image");
    imageNode.setAttribute("data-resource-type", "image");
    imageNode.setAttribute("aria-hidden", "true");
    imageNode.className = "bizuply-visual-media-layer";

    imageNode.style.position = "absolute";
    imageNode.style.inset = "0";
    imageNode.style.width = "100%";
    imageNode.style.height = "100%";
    imageNode.style.objectFit = "cover";
    imageNode.style.zIndex = "0";
    imageNode.style.pointerEvents = "none";

    node.insertBefore(imageNode, node.firstChild);
  }

  imageNode.setAttribute("src", media.src);
  imageNode.setAttribute("alt", media.alt || "");
}

export function applyVisualMediaToNode(
  node: HTMLElement,
  value: unknown,
) {
  const media = normalizeVisualMediaValue(value);

  if (!media.src) return;

  const wantsVideo = media.mediaType === "video";
  const wantsImage = media.mediaType === "image";

  const videoNode = getDirectVideoNode(node);
  const imageNode = getDirectImageNode(node);

  if (wantsVideo) {
    if (videoNode) {
      setVisualVideoSource(videoNode, media.src, media.alt);
      return;
    }

    if (imageNode) {
      const video = createVisualVideoElement(imageNode, media.src, media.alt);
      imageNode.replaceWith(video);
      return;
    }

    if (node.getAttribute("data-visual-edit-type") === "image") {
      const video = createVisualVideoElement(node, media.src, media.alt);
      node.replaceWith(video);
      return;
    }

    applyVisualMediaLayerToContainer(node, media);
    return;
  }

  if (wantsImage) {
    if (imageNode) {
      imageNode.setAttribute("src", media.src);
      imageNode.setAttribute("alt", media.alt || "");
      imageNode.setAttribute("data-visual-media-type", "image");
      imageNode.setAttribute("data-resource-type", "image");
      return;
    }

    if (videoNode) {
      const image = createVisualImageElement(videoNode, media.src, media.alt);
      videoNode.replaceWith(image);
      return;
    }

    if (node.getAttribute("data-visual-edit-type") === "image") {
      const image = createVisualImageElement(node, media.src, media.alt);
      node.replaceWith(image);
      return;
    }

    applyVisualMediaLayerToContainer(node, media);
  }
}

export function readVisualMediaFromNode(node: HTMLElement) {
  const videoNode = getDirectVideoNode(node);
  const imageNode = getDirectImageNode(node);

  if (videoNode) {
    const sourceNode = videoNode.querySelector("source");

    const src = String(
      sourceNode?.getAttribute("src") ||
        videoNode.getAttribute("src") ||
        videoNode.currentSrc ||
        videoNode.src ||
        "",
    );

    return {
      src,
      alt: String(
        videoNode.getAttribute("title") ||
          videoNode.getAttribute("aria-label") ||
          "",
      ),
      mediaType: "video" as const,
      resourceType: "video" as const,
      mimeType: getVideoMimeType(src),
    };
  }

  if (imageNode) {
    const src = String(imageNode.getAttribute("src") || imageNode.src || "");

    return {
      src,
      alt: String(imageNode.getAttribute("alt") || ""),
      mediaType: "image" as const,
      resourceType: "image" as const,
      mimeType: "",
    };
  }

  const layer = node.querySelector?.(
    "[data-visual-media-layer='true']",
  ) as HTMLElement | null;

  if (layer) {
    return readVisualMediaFromNode(layer);
  }

  return null;
}
