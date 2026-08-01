/**
 * Shared responsive foundation for EVERY website template (all ~213).
 *
 * Injected via:
 * - PublicVisualSiteRenderer (published sites)
 * - visualCssRuntime (visual editor)
 * - templateRendererRegistry.createRenderer (editorCss for every template)
 *
 * Scopes to template roots + public/editor roots. Targets unprefixed
 * Tailwind utilities only so mobile-first patterns stay intact.
 */

const ROOTS = [
  "[data-template-id]",
  ".bizuply-public-mini-site",
  ".bizuply-public-render-root",
  "[data-bizuply-published-html='true']",
  "[data-bizuply-template-fallback='true']",
  "[data-visual-template-canvas='true']",
] as const;

function expandSelector(prefix: string, selector: string): string {
  return selector
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `${prefix} ${part}`)
    .join(",\n");
}

function underRoots(selector: string): string {
  return ROOTS.map((root) => expandSelector(root, selector)).join(",\n");
}

function underDevice(device: "mobile" | "tablet", selector: string): string {
  return expandSelector(`[data-visual-device="${device}"]`, selector);
}

function rule(selectors: string, body: string): string {
  return `${selectors} {\n  ${body.trim().replace(/\n/g, "\n  ")}\n}`;
}

function mediaRules(
  query: string,
  pairs: Array<{ selector: string; body: string }>,
): string {
  const inner = pairs
    .map(({ selector, body }) => rule(underRoots(selector), body))
    .join("\n\n");
  return `@media ${query} {\n${inner}\n}`;
}

function deviceRules(
  device: "mobile" | "tablet",
  pairs: Array<{ selector: string; body: string }>,
): string {
  return pairs
    .map(({ selector, body }) =>
      rule(underDevice(device, selector), body),
    )
    .join("\n\n");
}

const GRID_MOBILE = [
  ".grid-cols-2",
  ".grid-cols-3",
  ".grid-cols-4",
  ".grid-cols-5",
  ".grid-cols-6",
  ".grid-cols-7",
  ".grid-cols-8",
  ".grid-cols-9",
  ".grid-cols-10",
  ".grid-cols-11",
  ".grid-cols-12",
];

const GRID_TABLET = [
  ".grid-cols-3",
  ".grid-cols-4",
  ".grid-cols-5",
  ".grid-cols-6",
  ".grid-cols-7",
  ".grid-cols-8",
  ".grid-cols-9",
  ".grid-cols-10",
  ".grid-cols-11",
  ".grid-cols-12",
];

const MOBILE_PAIRS: Array<{ selector: string; body: string }> = [
  ...GRID_MOBILE.map((selector) => ({
    selector,
    body: "grid-template-columns: minmax(0, 1fr) !important;",
  })),
  {
    selector: ".text-9xl",
    body: "font-size: clamp(1.75rem, 8vw, 2.5rem) !important; line-height: 1.1 !important;",
  },
  {
    selector: ".text-8xl",
    body: "font-size: clamp(1.7rem, 7.5vw, 2.35rem) !important; line-height: 1.1 !important;",
  },
  {
    selector: ".text-7xl",
    body: "font-size: clamp(1.65rem, 7vw, 2.15rem) !important; line-height: 1.12 !important;",
  },
  {
    selector: ".text-6xl",
    body: "font-size: clamp(1.55rem, 6.5vw, 1.95rem) !important; line-height: 1.15 !important;",
  },
  {
    selector: ".text-5xl",
    body: "font-size: clamp(1.45rem, 6vw, 1.75rem) !important; line-height: 1.2 !important;",
  },
  {
    selector: ".text-4xl",
    body: "font-size: clamp(1.35rem, 5.5vw, 1.55rem) !important; line-height: 1.25 !important;",
  },
  {
    selector: ".text-3xl",
    body: "font-size: clamp(1.25rem, 5vw, 1.4rem) !important; line-height: 1.3 !important;",
  },
  {
    selector:
      ".px-8, .px-10, .px-12, .px-14, .px-16, .px-20, .px-24, .px-28, .px-32",
    body: "padding-left: 1rem !important; padding-right: 1rem !important;",
  },
  {
    selector: ".pl-8, .pl-10, .pl-12, .pl-14, .pl-16, .pl-20, .pl-24",
    body: "padding-left: 1rem !important;",
  },
  {
    selector: ".pr-8, .pr-10, .pr-12, .pr-14, .pr-16, .pr-20, .pr-24",
    body: "padding-right: 1rem !important;",
  },
  {
    selector: ".py-16, .py-20, .py-24, .py-28, .py-32, .py-36, .py-40",
    body: "padding-top: 3rem !important; padding-bottom: 3rem !important;",
  },
  {
    selector: ".pt-16, .pt-20, .pt-24, .pt-28, .pt-32, .pt-36, .pt-40",
    body: "padding-top: 3rem !important;",
  },
  {
    selector: ".pb-16, .pb-20, .pb-24, .pb-28, .pb-32, .pb-36, .pb-40",
    body: "padding-bottom: 3rem !important;",
  },
  {
    selector: ".gap-8, .gap-10, .gap-12, .gap-14, .gap-16, .gap-20",
    body: "gap: 1rem !important;",
  },
  {
    selector: ".space-x-8 > :not([hidden]) ~ :not([hidden]), .space-x-10 > :not([hidden]) ~ :not([hidden]), .space-x-12 > :not([hidden]) ~ :not([hidden])",
    body: "--tw-space-x-reverse: 0; margin-right: calc(0.75rem * var(--tw-space-x-reverse)); margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));",
  },
  {
    selector:
      ".flex-row:not(.flex-col):not(.sm\\:flex-col):not(.md\\:flex-col):not(.lg\\:flex-col)",
    body: "flex-wrap: wrap;",
  },
  {
    selector: ".whitespace-nowrap",
    body: "white-space: normal !important;",
  },
  {
    selector: "[class*='w-['], [class*='min-w-['], [class*='max-w-\\[']",
    body: "max-width: 100% !important;",
  },
  {
    // Collapse tall section shells on mobile — but never strip media/hero/journal
    // min-heights or photos lose their plane and look nothing like desktop.
    selector:
      "[class*='min-h-[4']:not(img):not(video):not(.journal-hero):not(.journal-media):not([data-template-section-type='hero']):not([data-section-kind='hero']), [class*='min-h-[5']:not(img):not(video):not(.journal-hero):not(.journal-media):not([data-template-section-type='hero']):not([data-section-kind='hero']), [class*='min-h-[6']:not(img):not(video):not(.journal-hero):not(.journal-media):not([data-template-section-type='hero']):not([data-section-kind='hero']), [class*='min-h-[7']:not(img):not(video):not(.journal-hero):not(.journal-media):not([data-template-section-type='hero']):not([data-section-kind='hero']), [class*='min-h-[8']:not(img):not(video):not(.journal-hero):not(.journal-media):not([data-template-section-type='hero']):not([data-section-kind='hero']), [class*='min-h-[9']:not(img):not(video):not(.journal-hero):not(.journal-media):not([data-template-section-type='hero']):not([data-section-kind='hero'])",
    body: "min-height: 0 !important;",
  },
  {
    // Keep journal article images readable on phones (same visual weight as desktop).
    selector: ".journal-media, .journal-card-media",
    body: "display: block !important; width: 100% !important; max-width: 100% !important;",
  },
  {
    selector: ".journal-media img, .journal-card-media img, .journal-hero img",
    body: "display: block !important; width: 100% !important; height: 100% !important; max-height: none !important; object-fit: cover !important; object-position: center !important;",
  },
  {
    selector: ".journal-hero",
    body: "min-height: min(72vh, 36rem) !important;",
  },
  {
    selector: "section, header, footer, main, article",
    body: "max-width: 100%;",
  },
  {
    selector: "nav",
    body: "max-width: 100%; flex-wrap: wrap;",
  },
];

const TABLET_PAIRS: Array<{ selector: string; body: string }> = [
  ...GRID_TABLET.map((selector) => ({
    selector,
    body: "grid-template-columns: repeat(2, minmax(0, 1fr)) !important;",
  })),
  {
    selector: ".text-9xl",
    body: "font-size: 3.25rem !important; line-height: 1.08 !important;",
  },
  {
    selector: ".text-8xl",
    body: "font-size: 2.95rem !important; line-height: 1.1 !important;",
  },
  {
    selector: ".text-7xl",
    body: "font-size: 2.65rem !important; line-height: 1.1 !important;",
  },
  {
    selector: ".text-6xl",
    body: "font-size: 2.35rem !important; line-height: 1.12 !important;",
  },
  {
    selector: ".px-16, .px-20, .px-24, .px-28, .px-32",
    body: "padding-left: 1.5rem !important; padding-right: 1.5rem !important;",
  },
  {
    selector: ".py-28, .py-32, .py-36, .py-40",
    body: "padding-top: 4rem !important; padding-bottom: 4rem !important;",
  },
];

export const templateResponsiveCss = `
/* —— Bizuply template responsive foundation (all templates) —— */
${rule(
  ROOTS.join(",\n"),
  `
position: relative;
width: 100%;
max-width: 100%;
overflow-x: clip;
box-sizing: border-box;
`,
)}

/* Keep fixed/absolute headers inside the site/canvas (not the browser viewport) */
${rule(
  [
    '[data-visual-template-canvas="true"] header.fixed',
    '[data-visual-template-canvas="true"] header[class~="fixed"]',
    '[data-visual-template-canvas="true"] [data-template-section-type="header"].fixed',
    '[data-visual-template-canvas="true"] [data-template-section-type="header"][class~="fixed"]',
    '[data-visual-template-canvas="true"] [data-section-kind="header"].fixed',
    '[data-visual-template-canvas="true"] [data-section-kind="header"][class~="fixed"]',
  ].join(",\n"),
  `
position: sticky !important;
top: 0 !important;
left: auto !important;
right: auto !important;
inset-inline: 0 !important;
width: 100% !important;
max-width: 100% !important;
`,
)}

${rule(
  underRoots("header, [data-template-section-type='header'], [data-section-kind='header']"),
  `
max-width: 100%;
left: auto;
right: auto;
inset-inline: 0;
`,
)}

${rule(
  underRoots("*, *::before, *::after"),
  `
box-sizing: border-box;
`,
)}

${rule(
  underRoots("img, video, canvas, svg, iframe, embed, object"),
  `
max-width: 100%;
`,
)}

/*
  Intrinsic height ONLY for unconstrained flow media.
  A blanket height:auto on every img overrides Tailwind fill/fixed
  heights (h-full, h-48, h-[310px], absolute inset fills) and leaves empty
  colored bands inside product/media boxes across all templates.
*/
${rule(
  underRoots(
    [
      'img:not([class*=" h-"]):not([class^="h-"]):not([class*=":h-"]):not(.absolute):not([class~="absolute"]):not([class*=":absolute"])',
      'video:not([class*=" h-"]):not([class^="h-"]):not([class*=":h-"]):not(.absolute):not([class~="absolute"]):not([class*=":absolute"])',
    ].join(", "),
  ),
  `
height: auto;
`,
)}

/* Fill media must occupy the full positioned / aspect box */
${rule(
  underRoots(
    [
      "img.h-full",
      "video.h-full",
      "img[class~='h-full']",
      "video[class~='h-full']",
      "img[class*=' h-full']",
      "video[class*=' h-full']",
      "img[class*=':h-full']",
      "video[class*=':h-full']",
      "img.absolute.inset-0",
      "video.absolute.inset-0",
      "img[class~='absolute'][class~='inset-0']",
      "video[class~='absolute'][class~='inset-0']",
      ".store-media:not(img):not(video) > img",
      ".store-media:not(img):not(video) > video",
      ".journal-media > img",
      ".journal-media > video",
      ".journal-card-media > img",
      ".journal-card-media > video",
      ".journal-hero > img",
      ".journal-hero img.absolute",
      "[data-media-replaceable='true'] > img.h-full",
      "[data-editable-image-card='true'] > img.h-full",
      "[data-velmora-safe-image-box='true'] > img",
      "[data-velmora-hard-image='true'] > img",
      "[data-velmora-fan-card='true'] > img",
    ].join(", "),
  ),
  `
height: 100% !important;
max-height: none;
`,
)}

${rule(
  underRoots(
    [
      "img.absolute.inset-0",
      "video.absolute.inset-0",
      "img[class~='absolute'][class~='inset-0']",
      "video[class~='absolute'][class~='inset-0']",
      ".store-media:not(img):not(video) > img",
      ".store-media:not(img):not(video) > video",
      ".journal-media > img",
      ".journal-media > video",
      ".journal-card-media > img",
      ".journal-card-media > video",
    ].join(", "),
  ),
  `
width: 100%;
max-width: none;
object-fit: cover;
object-position: center;
`,
)}

${rule(
  underRoots("iframe"),
  `
width: 100%;
max-width: 100%;
`,
)}

${rule(
  underRoots("table"),
  `
display: block;
width: 100%;
max-width: 100%;
overflow-x: auto;
-webkit-overflow-scrolling: touch;
`,
)}

${rule(
  underRoots("pre, code"),
  `
max-width: 100%;
overflow-x: auto;
white-space: pre-wrap;
word-break: break-word;
`,
)}

${rule(
  underRoots("h1, h2, h3, h4, h5, h6, p, li, label, a, button, span"),
  `
overflow-wrap: anywhere;
word-break: break-word;
`,
)}

${mediaRules("(max-width: 767px)", MOBILE_PAIRS)}

${mediaRules("(min-width: 768px) and (max-width: 1023px)", TABLET_PAIRS)}

/* Editor device preview + public JS device detection */
${deviceRules("mobile", MOBILE_PAIRS)}

${deviceRules("tablet", TABLET_PAIRS)}
`.trim();

/** Prepend shared responsive CSS onto a template's editorCss string. */
export function withTemplateResponsiveCss(editorCss?: string | null): string {
  const base = String(editorCss || "").trim();
  if (!base) return templateResponsiveCss;
  if (base.includes("Bizuply template responsive foundation")) return base;
  return `${templateResponsiveCss}\n\n${base}`;
}
