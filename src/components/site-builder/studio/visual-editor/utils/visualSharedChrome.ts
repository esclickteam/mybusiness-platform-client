/**
 * Site chrome (header / footer) is shared by every page, exactly like Wix.
 *
 * Visual maps are stored per page, and auto-generated element ids are prefixed
 * with the active page id. That combination made a header edit on one page
 * invisible everywhere else. This module keeps a single site-level copy of the
 * chrome edits (`__sharedChrome`) and re-applies it onto whatever element ids
 * the current page actually rendered.
 */

export const VISUAL_SHARED_CHROME_KEY = "__sharedChrome";

/** Maps that must behave identically on every page that shows the chrome. */
const SHARED_CHROME_MAP_KEYS = [
  "__content",
  "__styles",
  "__animations",
  "__layout",
  "__attributes",
  "__responsive",
  "__hiddenElements",
  "__deletedElements",
] as const;

const CHROME_NODE_SELECTOR = [
  "header",
  "footer",
  '[data-section-kind="header"]',
  '[data-section-kind="footer"]',
  '[data-template-section-type="header"]',
  '[data-template-section-type="footer"]',
  '[data-template-section-id="global.header"]',
  '[data-template-section-id="global.footer"]',
].join(",");

const CHROME_SEGMENTS = new Set(["header", "footer"]);

/**
 * Template scalars that React headers still render from (beauty family etc.).
 * Shared chrome `__content` alone is not enough — a later React render paints
 * these fields and overwrites the DOM-applied CTA text after page switch.
 */
export const SHARED_CHROME_SCALAR_KEYS = [
  "heroPrimaryButton",
  "ctaButton",
  "headerCta",
  "headerButtonText",
  "brandName",
  "navHome",
  "navAbout",
  "navServices",
  "navBooking",
  "navContact",
] as const;

const SHARED_CHROME_SCALARS_KEY = "__scalars";

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function readMap(
  data: Record<string, any> | null | undefined,
  key: string,
): Record<string, any> {
  const value = data?.[key];
  return isPlainObject(value) ? value : {};
}

function readSharedScalars(
  sharedChrome: Record<string, any> | null | undefined,
) {
  return readMap(sharedChrome, SHARED_CHROME_SCALARS_KEY);
}

function isNavCanonicalChromeKey(key: string) {
  return /\.nav(\.|$)/i.test(String(key || ""));
}

function resolveExplicitHeaderCtaText(
  sharedContent: Record<string, any>,
  data?: Record<string, any>,
): string {
  const explicitKeys = [
    "chrome.header.primaryCta",
    "chrome.header.cta",
    "chrome.header.button",
  ];

  for (const key of explicitKeys) {
    const text = String(sharedContent[key]?.text || "").trim();
    if (text) return text;
  }

  for (const [key, value] of Object.entries(sharedContent)) {
    if (isNavCanonicalChromeKey(key)) continue;
    if (!/primaryCta|(^|\.)cta$/i.test(key)) continue;
    const text = String(
      isPlainObject(value) ? value.text || "" : "",
    ).trim();
    if (text) return text;
  }

  /*
    Beauty templates historically auto-id the header CTA as
    `chrome.header.button.button.*`. Prefer a single non-brand/non-nav
    button label so older edits like "התחברות" still win after page switch.
  */
  const excluded = new Set(
    [
      data?.brandName,
      data?.navHome,
      data?.navAbout,
      data?.navServices,
      data?.navBooking,
      data?.navContact,
      data?.navPortfolio,
      data?.navBlog,
    ]
      .map((value) => String(value || "").trim())
      .filter(Boolean),
  );

  const buttonTexts = Object.entries(sharedContent)
    .filter(
      ([key]) =>
        /^chrome\.header\.button\b/i.test(key) && !isNavCanonicalChromeKey(key),
    )
    .map(([, value]) =>
      String(isPlainObject(value) ? value.text || "" : "").trim(),
    )
    .filter((text) => text && !excluded.has(text));

  if (buttonTexts.length === 1) return buttonTexts[0];

  const currentHero = String(data?.heroPrimaryButton || "").trim();
  const overrides = buttonTexts.filter((text) => text !== currentHero);
  if (overrides.length === 1) return overrides[0];
  if (overrides.length > 1) return overrides[overrides.length - 1];

  return "";
}

function collectChromeScalarSnapshot(
  data: Record<string, any>,
  previousScalars?: Record<string, any>,
) {
  const next: Record<string, string> = {};

  Object.entries(readSharedScalars(previousScalars)).forEach(([key, value]) => {
    const text = String(value ?? "").trim();
    if (text) next[key] = text;
  });

  SHARED_CHROME_SCALAR_KEYS.forEach((key) => {
    const text = String(data[key] ?? "").trim();
    if (text) next[key] = text;
  });

  return next;
}

/**
 * Push React-facing header scalars from `__sharedChrome` onto root visual data
 * so templates that still render `{data.heroPrimaryButton}` keep the edited CTA
 * after a page switch (instead of falling back to defaultData).
 */
export function applySharedChromeScalarsToVisualData(
  data: Record<string, any> | null | undefined,
) {
  const source = isPlainObject(data) ? data : {};
  const sharedChrome = readSharedChrome(source);
  if (!Object.keys(sharedChrome).length) return source;

  const scalars = readSharedScalars(sharedChrome);
  const ctaFromContent = resolveExplicitHeaderCtaText(
    readMap(sharedChrome, "__content"),
    source,
  );

  let next: Record<string, any> | null = null;

  Object.entries(scalars).forEach(([key, value]) => {
    const text = String(value ?? "").trim();
    if (!text || String(source[key] ?? "") === text) return;
    if (!next) next = { ...source };
    next[key] = text;
  });

  if (
    ctaFromContent &&
    String((next || source).heroPrimaryButton ?? "") !== ctaFromContent
  ) {
    if (!next) next = { ...source };
    next.heroPrimaryButton = ctaFromContent;
  }

  return next || source;
}

/**
 * When a header CTA label is edited, keep the template scalar in sync so React
 * does not repaint the default "תאמו ניסיון" after remount / CRM re-render.
 */
export function syncHeaderCtaScalarFromChromeText(
  data: Record<string, any> | null | undefined,
  elementId: string,
  nextText: string,
  options?: { previousText?: string },
) {
  const source = isPlainObject(data) ? data : {};
  const cleanId = String(elementId || "").trim();
  const text = String(nextText ?? "").trim();
  if (!cleanId || !text || !isChromeVisualElementId(cleanId)) return source;
  if (/\.nav(\.|$)/i.test(cleanId) || /^nav\./i.test(cleanId)) return source;

  const previousText = String(options?.previousText ?? "").trim();
  const currentHero = String(source.heroPrimaryButton ?? "").trim();
  const isExplicitCta = /primaryCta|(^|\.)header\.cta$/i.test(cleanId);
  const matchesHero =
    Boolean(currentHero) &&
    (previousText === currentHero || (!previousText && isExplicitCta));

  if (!isExplicitCta && !matchesHero) return source;

  if (currentHero === text && !isExplicitCta) return source;

  const next: Record<string, any> = {
    ...source,
    heroPrimaryButton: text,
  };

  if (typeof source.ctaButton === "string") {
    next.ctaButton = text;
  }

  return next;
}

/**
 * Canonical, page-independent key for a chrome element id.
 *
 * `home.header.button.button-1`  -> `chrome.header.button.button-1`
 * `global.header.brand.name`     -> `chrome.header.brand.name`
 * `header.cta`                   -> `chrome.header.cta`
 * Returns "" for ids that are not chrome.
 */
export function canonicalChromeVisualKey(elementId: string) {
  const clean = String(elementId || "").trim();
  if (!clean) return "";
  if (clean.startsWith("chrome.")) return clean;

  const segments = clean.split(".");

  if (CHROME_SEGMENTS.has(segments[0])) {
    return ["chrome", ...segments].join(".");
  }

  if (segments.length > 1 && CHROME_SEGMENTS.has(segments[1])) {
    return ["chrome", ...segments.slice(1)].join(".");
  }

  return "";
}

export function isChromeVisualElementId(elementId: string) {
  return Boolean(canonicalChromeVisualKey(elementId));
}

function getVisualElementId(node: Element) {
  return String(node.getAttribute("data-visual-edit-id") || "").trim();
}

/**
 * Every chrome element rendered on this page, grouped by canonical key.
 * A canonical key can map to several ids (e.g. desktop + mobile header).
 */
function collectChromeIdsByCanonicalKey(root: HTMLElement | null) {
  const result = new Map<string, string[]>();
  if (!root) return result;

  const chromeRoots = Array.from(
    root.querySelectorAll<HTMLElement>(CHROME_NODE_SELECTOR),
  );

  if (root.matches?.(CHROME_NODE_SELECTOR)) {
    chromeRoots.push(root);
  }

  chromeRoots.forEach((chromeRoot) => {
    const nodes = [
      chromeRoot,
      ...Array.from(
        chromeRoot.querySelectorAll<HTMLElement>("[data-visual-edit-id]"),
      ),
    ];

    nodes.forEach((node) => {
      const elementId = getVisualElementId(node);
      if (!elementId) return;

      const canonicalKey = canonicalChromeVisualKey(elementId);
      if (!canonicalKey) return;

      const current = result.get(canonicalKey) || [];
      if (!current.includes(elementId)) {
        current.push(elementId);
      }
      result.set(canonicalKey, current);
    });
  });

  return result;
}

export function readSharedChrome(data: Record<string, any> | null | undefined) {
  return readMap(data, VISUAL_SHARED_CHROME_KEY);
}

/**
 * Collect the chrome edits of the page currently in the editor into a single
 * site-level map. Previously stored chrome survives for elements that this
 * page does not render.
 */
export function extractSharedChromeFromVisualData(
  root: HTMLElement | null,
  data: Record<string, any> | null | undefined,
) {
  const source = isPlainObject(data) ? data : {};
  const previousShared = readSharedChrome(source);
  const domChromeIds = collectChromeIdsByCanonicalKey(root);

  const nextShared: Record<string, Record<string, any>> = {};

  SHARED_CHROME_MAP_KEYS.forEach((mapKey) => {
    const previousMap = readMap(previousShared, mapKey);
    const pageMap = readMap(source, mapKey);
    const nextMap: Record<string, any> = { ...previousMap };

    Object.entries(pageMap).forEach(([elementId, value]) => {
      const canonicalKey = canonicalChromeVisualKey(elementId);
      if (!canonicalKey) return;

      /*
        Trust the DOM when the element exists on this page. Pattern-only
        matches still count so chrome saved from another page is not dropped.
      */
      nextMap[canonicalKey] = value;
    });

    /*
      Only drop a shared chrome entry when this page explicitly cleared it
      (key present, empty value). Missing keys usually mean a partial
      snapshot — deleting them made header CTAs revert after page switches.
    */
    Object.keys(previousMap).forEach((canonicalKey) => {
      const renderedIds = domChromeIds.get(canonicalKey);
      if (!renderedIds?.length) return;

      const matchingPageKeys = renderedIds.filter((elementId) =>
        Object.prototype.hasOwnProperty.call(pageMap, elementId),
      );
      if (!matchingPageKeys.length) return;

      const stillHasValue = matchingPageKeys.some((elementId) => {
        const value = pageMap[elementId];
        if (value == null) return false;
        if (typeof value === "string") return value.trim().length > 0;
        if (isPlainObject(value)) {
          return Object.values(value).some(
            (entry) => String(entry ?? "").trim().length > 0,
          );
        }
        return true;
      });

      if (!stillHasValue) {
        delete nextMap[canonicalKey];
      }
    });

    if (Object.keys(nextMap).length) {
      nextShared[mapKey] = nextMap;
    }
  });

  return nextShared;
}

export function writeSharedChromeIntoVisualData(
  root: HTMLElement | null,
  data: Record<string, any> | null | undefined,
) {
  const source = isPlainObject(data) ? data : {};
  const sharedChrome = extractSharedChromeFromVisualData(root, source);
  const scalars = collectChromeScalarSnapshot(
    source,
    readSharedChrome(source),
  );

  if (Object.keys(scalars).length) {
    sharedChrome[SHARED_CHROME_SCALARS_KEY] = scalars;
  }

  return {
    ...source,
    [VISUAL_SHARED_CHROME_KEY]: sharedChrome,
  };
}

/**
 * Drop page-level header/footer entries so the shared chrome is the single
 * source of truth. Only safe once shared chrome actually holds those edits.
 */
export function stripChromeFromVisualData(
  data: Record<string, any> | null | undefined,
) {
  const source = isPlainObject(data) ? data : {};
  const next: Record<string, any> = { ...source };

  SHARED_CHROME_MAP_KEYS.forEach((mapKey) => {
    const pageMap = readMap(source, mapKey);
    const entries = Object.entries(pageMap);
    if (!entries.length) return;

    const kept = entries.filter(
      ([elementId]) => !canonicalChromeVisualKey(elementId),
    );

    if (kept.length !== entries.length) {
      next[mapKey] = Object.fromEntries(kept);
    }
  });

  return next;
}

/**
 * Re-apply the site-level chrome onto the element ids of the page being
 * rendered, so header/footer look identical on every page and in publish.
 */
export function expandSharedChromeIntoVisualData(
  root: HTMLElement | null,
  data: Record<string, any> | null | undefined,
) {
  const source = isPlainObject(data) ? data : {};
  const sharedChrome = readSharedChrome(source);

  if (!root || !Object.keys(sharedChrome).length) return source;

  const domChromeIds = collectChromeIdsByCanonicalKey(root);
  if (!domChromeIds.size) return source;

  const next: Record<string, any> = { ...source };

  SHARED_CHROME_MAP_KEYS.forEach((mapKey) => {
    const sharedMap = readMap(sharedChrome, mapKey);
    if (!Object.keys(sharedMap).length) return;

    const pageMap = readMap(source, mapKey);
    let nextMap: Record<string, any> | null = null;

    Object.entries(sharedMap).forEach(([canonicalKey, value]) => {
      const elementIds = domChromeIds.get(canonicalKey);
      if (!elementIds?.length) return;

      elementIds.forEach((elementId) => {
        const currentValue = pageMap[elementId];
        if (currentValue === value) return;

        /*
          A page-level chrome entry is the live edit in progress, so it wins.
          Publish and page load strip stale page-level chrome (see
          stripChromeFromVisualData) which lets the shared value through.
        */
        if (!nextMap) nextMap = { ...pageMap };
        nextMap[elementId] =
          isPlainObject(value) && isPlainObject(currentValue)
            ? { ...value, ...currentValue }
            : currentValue !== undefined
              ? currentValue
              : value;
      });
    });

    if (nextMap) {
      next[mapKey] = nextMap;
    }
  });

  return applySharedChromeScalarsToVisualData(next);
}
