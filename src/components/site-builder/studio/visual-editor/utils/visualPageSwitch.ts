import {
  VISUAL_SHARED_CHROME_KEY,
  extractSharedChromeFromVisualData,
  readSharedChrome,
} from "./visualSharedChrome";

function asPlainObject(value: unknown): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};
}

/**
 * Build the in-memory session after leaving a page.
 * Only site-wide chrome + meta — never the leaving page's body maps.
 */
export function buildVisualPageSwitchSession(options: {
  snapshot: Record<string, any>;
  previousSession?: Record<string, any> | null;
  nextPageId: string;
  fallbackSharedChrome?: Record<string, any> | null;
}) {
  const snapshot = asPlainObject(options.snapshot);
  const previous = asPlainObject(options.previousSession);
  const hasSnapshot = Object.keys(snapshot).length > 0;

  const chromeFromSnapshot = readSharedChrome(snapshot);
  const sharedChrome = Object.keys(chromeFromSnapshot).length
    ? chromeFromSnapshot
    : hasSnapshot
      ? extractSharedChromeFromVisualData(null, snapshot)
      : asPlainObject(options.fallbackSharedChrome);

  return {
    __siteSlug: snapshot.__siteSlug || previous.__siteSlug,
    __publicUrl: snapshot.__publicUrl || previous.__publicUrl,
    __siteDomain: snapshot.__siteDomain || previous.__siteDomain,
    [VISUAL_SHARED_CHROME_KEY]: sharedChrome,
    __activePageId: String(options.nextPageId || "").trim() || "home",
    __blankVisualPage: false,
    __libraryPage: false,
    __libraryPageTemplateId: undefined,
  };
}
