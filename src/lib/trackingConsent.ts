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

export function writeTrackingChoice(choice: "essential" | "all"): void {
  if (typeof document === "undefined") return;
  const maxAge = 180 * 24 * 60 * 60;
  document.cookie = `${TRACKING_COOKIE}=${choice}; Path=/; Max-Age=${maxAge}; SameSite=Lax${cookieDomain()}`;
  window.dispatchEvent(new CustomEvent("bizuply-tracking-consent", { detail: choice }));
}

export function clearTrackingChoice(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${TRACKING_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${cookieDomain()}`;
}
