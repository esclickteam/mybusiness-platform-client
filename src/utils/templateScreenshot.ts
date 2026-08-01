import manifest from "../data/templateScreenshotManifest.json";

type ScreenshotManifest = Record<string, string>;

const screenshotManifest = manifest as ScreenshotManifest;

function normalizeKey(value: string | null | undefined) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

/**
 * Full-page static screenshot URL for gallery cards.
 * Never returns hero/cover/featured images — only generated template screenshots.
 */
export function getTemplateFullPageScreenshotUrl(
  templateKey: string | null | undefined,
): string {
  const key = normalizeKey(templateKey);
  if (!key) return "";

  const fromManifest = String(screenshotManifest[key] || "").trim();
  if (fromManifest) return fromManifest;

  return "";
}

export function listTemplateScreenshotKeys() {
  return Object.keys(screenshotManifest).filter((key) =>
    Boolean(String(screenshotManifest[key] || "").trim()),
  );
}

export function hasTemplateFullPageScreenshot(
  templateKey: string | null | undefined,
) {
  return Boolean(getTemplateFullPageScreenshotUrl(templateKey));
}
