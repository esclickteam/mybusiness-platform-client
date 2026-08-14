export const SW_SCOPE = "/";
export const SW_SCRIPT_VERSION = 10;
export const SW_URL = `/service-worker.js?v=${SW_SCRIPT_VERSION}`;
export const LEGACY_GENERIC_TAG = "bizuply-notification";
export const LEGACY_GENERIC_BODY = "יש לך התראה חדשה";

export function shouldForceRebindOnSwMessage(type: unknown): boolean {
  // Browser rotated the endpoint. Do not force-rebind on SW_ACTIVATED —
  // that is what orphaned the live iPhone token in v7.
  return type === "PUSH_SUBSCRIPTION_CHANGED";
}

export function isCurrentSwScript(scriptURL: string, origin: string): boolean {
  try {
    const parsed = new URL(scriptURL, origin);
    return (
      parsed.pathname.endsWith("/service-worker.js") &&
      parsed.search === `?v=${SW_SCRIPT_VERSION}`
    );
  } catch {
    return false;
  }
}

export function shouldShowWebPushBanner(payload: {
  title?: string;
  body?: string;
}): boolean {
  return Boolean(String(payload?.title || "").trim() && String(payload?.body || "").trim());
}

export function isLegacyGenericBanner(note: {
  title?: string;
  body?: string;
  tag?: string;
}): boolean {
  const title = String(note?.title || "");
  const body = String(note?.body || "");
  const tag = String(note?.tag || "");
  return (
    tag === LEGACY_GENERIC_TAG ||
    body === LEGACY_GENERIC_BODY ||
    (title === "BizUply" && !title.includes("·"))
  );
}
