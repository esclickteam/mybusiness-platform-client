export const TRACKING_COOKIE = "bizuply_tracking";
export const NOTICE_VERSION = "2026-11-06";

export type TrackingChoice = "unknown" | "essential" | "all";

function cookieDomain(): string {
  if (typeof window === "undefined") return "";
  const host = window.location.hostname.toLowerCase();
  if (host === "bizuply.com" || host.endsWith(".bizuply.com")) return "; Domain=.bizuply.com";
  return "";
}

export function readTrackingChoice(cookie = typeof document === "undefined" ? "" : document.cookie): TrackingChoice {
  const match = String(cookie).match(/(?:^|; )bizuply_tracking=([^;]*)/);
  if (!match) return "unknown";
  const value = decodeURIComponent(match[1]);
  if (value === "all" || value === "essential") return value;
  return "unknown";
}

export function marketingAllowed(cookie?: string): boolean {
  return readTrackingChoice(cookie) === "all";
}

function expireCookie(name: string): void {
  const host = window.location.hostname;
  const base = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = base;
  document.cookie = `${base}; Domain=${host}`;
  if (host === "bizuply.com" || host.endsWith(".bizuply.com")) {
    document.cookie = `${base}; Domain=.bizuply.com`;
  }
}

export function clearMeasurementCookies(): void {
  if (typeof document === "undefined") return;
  expireCookie("_fbp");
  expireCookie("_fbc");
}

export function stopMeasurement(): void {
  const browser = window as Window & { __bizuplyPixelStopped?: boolean; fbq?: (...args: unknown[]) => void };
  browser.__bizuplyPixelStopped = true;
  const current = browser.fbq;
  if (typeof current === "function") {
    try {
      current("consent", "revoke");
    } catch {
      /* The loaded pixel rejected the revocation call. The no-op below still blocks later events. */
    }
    browser.fbq = () => {};
  }
  clearMeasurementCookies();
}

export function writeTrackingChoice(choice: "essential" | "all"): void {
  if (typeof document === "undefined") return;
  const maxAge = 180 * 24 * 60 * 60;
  document.cookie = `${TRACKING_COOKIE}=${choice}; Path=/; Max-Age=${maxAge}; SameSite=Lax${cookieDomain()}`;
  const browser = window as Window & { __bizuplyPixelStopped?: boolean };
  if (choice === "all") browser.__bizuplyPixelStopped = false;
  else stopMeasurement();
  window.dispatchEvent(new CustomEvent("bizuply-tracking-consent", { detail: choice }));
}

export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("bizuply-open-cookie-settings"));
}

export function clearTrackingChoice(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${TRACKING_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${cookieDomain()}`;
  stopMeasurement();
}
