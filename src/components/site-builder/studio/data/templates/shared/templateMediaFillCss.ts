import type { CSSProperties } from "react";

/**
 * Aggressive media-fill rules for every template root.
 * Ensures cover images always occupy their media box (no empty bands,
 * no clipped/partial placement) even when other responsive CSS fights them.
 */

export const TEMPLATE_MEDIA_FILL_CSS = `
/* —— Bizuply template media fill (all templates) —— */
[data-template-id] .store-media:not(img):not(video),
[data-store-plugin] .store-media:not(img):not(video),
.bizuply-public-mini-site .store-media:not(img):not(video),
.bizuply-public-render-root .store-media:not(img):not(video),
[data-visual-template-canvas="true"] .store-media:not(img):not(video),
[data-template-id] [data-media-replaceable="true"],
[data-template-id] [data-editable-image-card="true"],
[data-template-id] [data-velmora-safe-image-box="true"],
[data-template-id] [data-velmora-hard-image="true"],
[data-template-id] [data-velmora-fan-card="true"] {
  position: relative !important;
  overflow: hidden !important;
  display: block !important;
  width: 100%;
  max-width: 100%;
  isolation: isolate;
}

[data-template-id] .store-media:not(img):not(video) > img,
[data-template-id] .store-media:not(img):not(video) > video,
[data-store-plugin] .store-media:not(img):not(video) > img,
[data-store-plugin] .store-media:not(img):not(video) > video,
.bizuply-public-mini-site .store-media:not(img):not(video) > img,
.bizuply-public-mini-site .store-media:not(img):not(video) > video,
.bizuply-public-render-root .store-media:not(img):not(video) > img,
.bizuply-public-render-root .store-media:not(img):not(video) > video,
[data-visual-template-canvas="true"] .store-media:not(img):not(video) > img,
[data-visual-template-canvas="true"] .store-media:not(img):not(video) > video,
[data-template-id] [data-media-replaceable="true"] > img.absolute,
[data-template-id] [data-media-replaceable="true"] > img[class~="absolute"],
[data-template-id] [data-media-replaceable="true"] > video.absolute,
[data-template-id] [data-editable-image-card="true"] > div > img.absolute,
[data-template-id] [data-editable-image-card="true"] > div > img[class~="absolute"],
[data-template-id] [data-velmora-safe-image-box="true"] > img,
[data-template-id] [data-velmora-hard-image="true"] > img,
[data-template-id] [data-velmora-fan-card="true"] > img,
[data-template-id] img.absolute.inset-0,
[data-template-id] video.absolute.inset-0,
[data-template-id] img[class~="absolute"][class~="inset-0"],
[data-template-id] video[class~="absolute"][class~="inset-0"],
[data-store-plugin] img.absolute.inset-0,
[data-store-plugin] img[class~="absolute"][class~="inset-0"],
.bizuply-public-mini-site img.absolute.inset-0,
.bizuply-public-mini-site img[class~="absolute"][class~="inset-0"],
[data-visual-template-canvas="true"] img.absolute.inset-0,
[data-visual-template-canvas="true"] img[class~="absolute"][class~="inset-0"] {
  position: absolute !important;
  inset: 0 !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  left: 0 !important;
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  min-width: 100% !important;
  min-height: 100% !important;
  max-width: none !important;
  max-height: none !important;
  object-fit: cover !important;
  object-position: center center !important;
}

/* Aspect / fixed-height media boxes keep a real box even with only absolute children */
[data-template-id] .store-media[class*="aspect-"],
[data-store-plugin] .store-media[class*="aspect-"],
[data-template-id] [class*="aspect-"]:has(> img.absolute),
[data-template-id] [class*="aspect-"]:has(> img[class~="absolute"]),
[data-store-plugin] [class*="aspect-"]:has(> img.absolute),
[data-store-plugin] [class*="aspect-"]:has(> img[class~="absolute"]) {
  height: auto !important;
  min-height: 0;
}

/* Flow cover images that carry their own aspect ratio */
[data-template-id] img.store-media[class*="aspect-"],
[data-store-plugin] img.store-media[class*="aspect-"],
[data-template-id] img[class*="aspect-"][class*="object-cover"],
[data-store-plugin] img[class*="aspect-"][class*="object-cover"] {
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  object-fit: cover !important;
  object-position: center center !important;
}
`.trim();

/** Inline style used on React product/category fill images — beats stylesheet wars. */
export const FILL_MEDIA_IMG_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: "block",
  width: "100%",
  height: "100%",
  minWidth: "100%",
  minHeight: "100%",
  maxWidth: "none",
  maxHeight: "none",
  objectFit: "cover",
  objectPosition: "center center",
};
