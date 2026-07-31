import type { MetaLocationTarget } from "../../../../api/metaCampaignsApi";
import { geocodeMetaPlace } from "../../../../api/metaCampaignsApi";

export type GeoPoint = { latitude: number; longitude: number };

const geoCache = new Map<string, GeoPoint | null>();

const ISRAEL_CENTER: GeoPoint = { latitude: 31.5, longitude: 34.85 };

/** Reliable centers for common Israeli cities when geocode APIs are slow/blocked. */
const ISRAEL_CITY_FALLBACKS: Array<{ match: RegExp; point: GeoPoint }> = [
  { match: /haifa|חיפה/i, point: { latitude: 32.794, longitude: 34.9896 } },
  {
    match: /qiryat[\s-]?atta|kiryat[\s-]?ata|קריית[\s-]?אתא/i,
    point: { latitude: 32.8114, longitude: 35.1124 },
  },
  { match: /tel[\s-]?aviv|תל[\s-]?אביב/i, point: { latitude: 32.0853, longitude: 34.7818 } },
  { match: /jerusalem|ירושלים/i, point: { latitude: 31.7683, longitude: 35.2137 } },
  { match: /beer[\s-]?sheva|be'er[\s-]?sheva|באר[\s-]?שבע/i, point: { latitude: 31.25297, longitude: 34.79146 } },
  { match: /netanya|נתניה/i, point: { latitude: 32.3215, longitude: 34.8532 } },
  { match: /rishon|ראשון/i, point: { latitude: 31.973, longitude: 34.7925 } },
  { match: /petah[\s-]?tikva|פתח[\s-]?תקווה|פתח תקוה/i, point: { latitude: 32.0871, longitude: 34.8878 } },
  { match: /ashdod|אשדוד/i, point: { latitude: 31.8044, longitude: 34.6553 } },
  { match: /ashkelon|אשקלון/i, point: { latitude: 31.6688, longitude: 34.5743 } },
  { match: /herzliya|הרצליה/i, point: { latitude: 32.1624, longitude: 34.8447 } },
  { match: /ramat[\s-]?gan|רמת[\s-]?גן/i, point: { latitude: 32.0684, longitude: 34.8248 } },
  { match: /holon|חולון/i, point: { latitude: 32.0114, longitude: 34.7746 } },
  { match: /bat[\s-]?yam|בת[\s-]?ים/i, point: { latitude: 32.0171, longitude: 34.7456 } },
  { match: /rehovot|רחובות/i, point: { latitude: 31.8928, longitude: 34.8113 } },
  { match: /kfar[\s-]?saba|כפר[\s-]?סבא/i, point: { latitude: 32.175, longitude: 34.9069 } },
  { match: /modi'?in|מודיעין/i, point: { latitude: 31.897, longitude: 35.0104 } },
  { match: /eilat|אילת/i, point: { latitude: 29.5577, longitude: 34.9519 } },
  { match: /nazareth|נצרת/i, point: { latitude: 32.6996, longitude: 35.3035 } },
  { match: /acre|akko|עכו/i, point: { latitude: 32.9272, longitude: 35.082 } },
  { match: /tiberias|טבריה/i, point: { latitude: 32.7922, longitude: 35.5312 } },
  { match: /hadera|חדרה/i, point: { latitude: 32.434, longitude: 34.9196 } },
  { match: /ra'?anana|רעננה/i, point: { latitude: 32.1848, longitude: 34.8713 } },
];

function cacheKey(location: MetaLocationTarget) {
  return [
    location.type,
    location.key,
    location.name,
    location.region,
    location.countryCode || location.countryName,
    location.addressString,
  ]
    .filter(Boolean)
    .join("|")
    .toLowerCase();
}

function queryFor(location: MetaLocationTarget) {
  if (location.addressString?.trim()) return location.addressString.trim();
  return [location.name, location.region, location.countryName || location.countryCode]
    .filter(Boolean)
    .join(", ");
}

function fallbackPoint(location: MetaLocationTarget): GeoPoint | null {
  const haystack = `${location.name || ""} ${location.addressString || ""} ${location.region || ""}`;
  for (const row of ISRAEL_CITY_FALLBACKS) {
    if (row.match.test(haystack)) return row.point;
  }
  if (location.type === "country" && String(location.key || "").toUpperCase() === "IL") {
    return ISRAEL_CENTER;
  }
  return null;
}

async function geocodeViaServer(
  businessId: string | null | undefined,
  location: MetaLocationTarget
): Promise<GeoPoint | null> {
  if (!businessId) return null;
  try {
    const data = await geocodeMetaPlace(businessId, {
      q: queryFor(location),
      countryCode: location.countryCode || "IL",
      name: location.name || "",
    });
    const latitude = Number(data?.latitude);
    const longitude = Number(data?.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return { latitude, longitude };
  } catch {
    return null;
  }
}

async function geocodeViaNominatim(location: MetaLocationTarget): Promise<GeoPoint | null> {
  const q = queryFor(location);
  if (!q) return null;

  try {
    const country = (location.countryCode || "IL").toUpperCase();
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "3");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("q", q);
    url.searchParams.set("countrycodes", country.toLowerCase() || "il");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "Accept-Language": "he,en",
      },
    });
    if (!response.ok) return null;
    const rows = (await response.json()) as Array<{
      lat?: string;
      lon?: string;
      type?: string;
      class?: string;
      importance?: number;
    }>;
    const ranked = [...(rows || [])].sort((a, b) => {
      const score = (row: { type?: string; class?: string; importance?: number }) => {
        const type = `${row.class || ""}:${row.type || ""}`;
        if (/city|town|village|municipality|suburb/i.test(type)) return 3 + (row.importance || 0);
        if (/administrative/i.test(type)) return 2 + (row.importance || 0);
        return row.importance || 0;
      };
      return score(b) - score(a);
    });
    const lat = Number(ranked?.[0]?.lat);
    const lng = Number(ranked?.[0]?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { latitude: lat, longitude: lng };
  } catch {
    return null;
  }
}

/** Display geocode only — Meta targeting still uses official keys / address. */
export async function geocodeLocation(
  location: MetaLocationTarget,
  businessId?: string | null
): Promise<GeoPoint | null> {
  if (
    location.latitude != null &&
    location.longitude != null &&
    Number.isFinite(location.latitude) &&
    Number.isFinite(location.longitude)
  ) {
    return { latitude: location.latitude, longitude: location.longitude };
  }

  const key = cacheKey(location);
  if (geoCache.has(key)) return geoCache.get(key) || null;

  // Instant fallback so the map pin/radius never stays blank for common cities.
  const local = fallbackPoint(location);
  if (local) {
    geoCache.set(key, local);
    // Still try to refine via server in the background later if needed.
    return local;
  }

  const fromServer = await geocodeViaServer(businessId, location);
  if (fromServer) {
    geoCache.set(key, fromServer);
    return fromServer;
  }

  const fromNominatim = await geocodeViaNominatim(location);
  geoCache.set(key, fromNominatim);
  return fromNominatim;
}

export async function enrichLocationsWithCoords(
  locations: MetaLocationTarget[],
  businessId?: string | null
): Promise<MetaLocationTarget[]> {
  const next: MetaLocationTarget[] = [];
  for (const item of locations) {
    if (
      item.latitude != null &&
      item.longitude != null &&
      Number.isFinite(item.latitude) &&
      Number.isFinite(item.longitude)
    ) {
      next.push(item);
      continue;
    }
    const point = await geocodeLocation(item, businessId);
    if (!point) {
      next.push(item);
      continue;
    }
    next.push({
      ...item,
      latitude: point.latitude,
      longitude: point.longitude,
    });
  }
  return next;
}
