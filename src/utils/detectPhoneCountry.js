/**
 * Detect default phone country ISO2 for react-phone-input-2.
 * Prefer Israel when timezone/locale/language/IP indicate IL.
 */

const IL_TIMEZONES = new Set(["Asia/Jerusalem", "Asia/Tel_Aviv"]);

function normalizeCountry(code) {
  const c = String(code || "").toLowerCase().trim();
  return /^[a-z]{2}$/.test(c) ? c : null;
}

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

    if (
      langs.some(
        (l) => l === "he" || l.startsWith("he-") || l.endsWith("-il")
      )
    ) {
      return "il";
    }
  } catch {
    /* ignore */
  }
  return null;
}

function fromAppLanguage() {
  try {
    const stored =
      localStorage.getItem("i18nextLng") ||
      localStorage.getItem("bizuply_lang") ||
      "";
    const lang = String(stored).toLowerCase();
    if (lang === "he" || lang.startsWith("he-") || lang.endsWith("-il")) {
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
    if (tz.startsWith("America/")) return "us";
    if (tz.startsWith("Europe/London")) return "gb";
    if (tz.startsWith("Europe/Paris") || tz.startsWith("Europe/Berlin")) {
      return tz.includes("Paris") ? "fr" : "de";
    }
    if (tz.startsWith("Europe/")) return "gb";
  } catch {
    /* ignore */
  }
  return null;
}

async function fetchCountryFromUrl(url, pick) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return normalizeCountry(pick(data));
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Sync best-effort default (no network). Israel when local signals say so.
 */
export function detectPhoneCountrySync() {
  return (
    fromTimezone() ||
    fromLocale() ||
    fromAppLanguage() ||
    fromTimezoneRegion() ||
    "us"
  );
}

/**
 * Async refinement via public IP geolocation. Falls back to sync result.
 */
export async function detectPhoneCountry() {
  const sync = detectPhoneCountrySync();
  if (sync === "il") return "il";

  const fromIpapi = await fetchCountryFromUrl(
    "https://ipapi.co/json/",
    (data) => data?.country_code
  );
  if (fromIpapi) return fromIpapi;

  const fromIpWho = await fetchCountryFromUrl(
    "https://ipwho.is/",
    (data) => (data?.success === false ? null : data?.country_code)
  );
  if (fromIpWho) return fromIpWho;

  return sync;
}
