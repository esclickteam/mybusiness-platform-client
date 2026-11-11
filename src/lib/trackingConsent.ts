export const TRACKING_COOKIE = "bizuply_tracking";
export const NOTICE_VERSION = "2026-11-07";
const LEGACY_NOTICE_VERSION = "2026-11-06";

export type TrackingChoice = "unknown" | "essential" | "all";

export type ConsentPreferences = {
  necessary: true;
  analytics: false;
  advertisement: boolean;
  functionality: false;
  version: string;
  decided: boolean;
};

const EMPTY: ConsentPreferences = {
  necessary: true,
  analytics: false,
  advertisement: false,
  functionality: false,
  version: "",
  decided: false,
};

function cookieDomain(): string {
  if (typeof window === "undefined") return "";
  const host = window.location.hostname.toLowerCase();
  if (host === "bizuply.com" || host.endsWith(".bizuply.com")) return "; Domain=.bizuply.com";
  if (host === "bizuply.co.il" || host.endsWith(".bizuply.co.il")) return "; Domain=.bizuply.co.il";
  return "";
}

function lastTrackingValue(cookie: string): string {
  const values = String(cookie)
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.startsWith(`${TRACKING_COOKIE}=`))
    .map((part) => {
      const raw = part.slice(TRACKING_COOKIE.length + 1);
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    });
  return values.length ? values[values.length - 1] : "";
}

export function parseConsentValue(value: string): ConsentPreferences {
  if (value === "all") {
    return {
      necessary: true,
      analytics: false,
      advertisement: true,
      functionality: false,
      version: LEGACY_NOTICE_VERSION,
      decided: true,
    };
  }
  if (value === "essential") {
    return {
      necessary: true,
      analytics: false,
      advertisement: false,
      functionality: false,
      version: LEGACY_NOTICE_VERSION,
      decided: true,
    };
  }
  if (value.startsWith("v2:")) {
    const [body = "", version = NOTICE_VERSION] = value.slice(3).split(":");
    const tokens = body.split(".").filter(Boolean);
    return {
      necessary: true,
      analytics: false,
      advertisement: tokens.includes("ad"),
      functionality: false,
      version,
      decided: body === "ad" || body === "none",
    };
  }
  return { ...EMPTY };
}

export function readConsent(cookie = typeof document === "undefined" ? "" : document.cookie): ConsentPreferences {
  return parseConsentValue(lastTrackingValue(cookie));
}

export function readTrackingChoice(cookie = typeof document === "undefined" ? "" : document.cookie): TrackingChoice {
  const consent = readConsent(cookie);
  if (!consent.decided) return "unknown";
  return consent.advertisement ? "all" : "essential";
}

export function marketingAllowed(cookie?: string): boolean {
  return readConsent(cookie).advertisement;
}

export function analyticsAllowed(): boolean {
  return false;
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

function consentCookieValue(advertisement: boolean): string {
  return `v2:${advertisement ? "ad" : "none"}:${NOTICE_VERSION}`;
}

export function writeAdvertisementConsent(advertisement: boolean): boolean {
  if (typeof document === "undefined") return false;
  const value = consentCookieValue(advertisement);
  const maxAge = 180 * 24 * 60 * 60;
  const domain = cookieDomain();
  if (domain) document.cookie = `${TRACKING_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${TRACKING_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${domain}`;
  const saved = readConsent();
  if (!saved.decided || saved.advertisement !== advertisement || saved.analytics || saved.functionality) return false;
  const browser = window as Window & { __bizuplyPixelStopped?: boolean };
  if (advertisement) browser.__bizuplyPixelStopped = false;
  else stopMeasurement();
  window.dispatchEvent(new CustomEvent("bizuply-tracking-consent", { detail: advertisement ? "all" : "essential" }));
  return true;
}

export function writeTrackingChoice(choice: "essential" | "all"): void {
  writeAdvertisementConsent(choice === "all");
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
