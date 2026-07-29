/**
 * Detect default phone country ISO2 for react-phone-input-2.
 * Prefer Israel when timezone/locale/IP indicate IL.
 */

const IL_TIMEZONES = new Set(["Asia/Jerusalem", "Asia/Tel_Aviv"]);

function fromTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (IL_TIMEZONES.has(tz)) return "il";
  } catch {
    /* ignore */
  }
  return null;
}

function fromLocale() {
  try {
    const langs = [
      ...(navigator.languages || []),
      navigator.language || "",
    ]
      .filter(Boolean)
      .map((l) => l.toLowerCase());

    if (langs.some((l) => l === "he" || l.startsWith("he-") || l.endsWith("-il"))) {
      return "il";
    }
  } catch {
    /* ignore */
  }
  return null;
}

function fromTimezoneRegion() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    // Common mappings when geo API is unavailable
    if (tz.startsWith("America/")) return "us";
    if (tz.startsWith("Europe/London")) return "gb";
    if (tz.startsWith("Europe/")) return "gb";
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Sync best-effort default (no network). Israel when local signals say so.
 */
export function detectPhoneCountrySync() {
  return fromTimezone() || fromLocale() || fromTimezoneRegion() || "us";
}

/**
 * Async refinement via public IP geolocation. Falls back to sync result.
 */
export async function detectPhoneCountry() {
  const sync = detectPhoneCountrySync();
  if (sync === "il") return "il";

  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 2500);
    const res = await fetch("https://ipapi.co/json/", {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    window.clearTimeout(timer);
    if (!res.ok) return sync;
    const data = await res.json();
    const code = String(data?.country_code || "").toLowerCase();
    if (code && /^[a-z]{2}$/.test(code)) return code;
  } catch {
    /* ignore network / CORS / abort */
  }

  return sync;
}
