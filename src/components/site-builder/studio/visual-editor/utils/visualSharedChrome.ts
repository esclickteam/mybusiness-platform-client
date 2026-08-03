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

    // Keys whose element is rendered here but has no edit anymore were reset.
    Object.keys(previousMap).forEach((canonicalKey) => {
      const renderedIds = domChromeIds.get(canonicalKey);
      if (!renderedIds?.length) return;

      const stillEdited = renderedIds.some((elementId) =>
        Object.prototype.hasOwnProperty.call(pageMap, elementId),
      );

      if (!stillEdited) {
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

  return next;
}
