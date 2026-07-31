import type { MetaLocationTarget } from "../../../../api/metaCampaignsApi";

export type GeoPoint = { latitude: number; longitude: number };

const geoCache = new Map<string, GeoPoint | null>();

const ISRAEL_CENTER: GeoPoint = { latitude: 31.5, longitude: 34.85 };

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

/** Display geocode only — Meta targeting still uses official keys / address. */
export async function geocodeLocation(
  location: MetaLocationTarget
): Promise<GeoPoint | null> {
  if (
    location.latitude != null &&
    location.longitude != null &&
    Number.isFinite(location.latitude) &&
    Number.isFinite(location.longitude)
  ) {
    return { latitude: location.latitude, longitude: location.longitude };
  }

  if (location.type === "country" && location.key === "IL") {
    return ISRAEL_CENTER;
  }

  const key = cacheKey(location);
  if (geoCache.has(key)) return geoCache.get(key) || null;

  const q = queryFor(location);
  if (!q) {
    geoCache.set(key, null);
    return null;
  }

  try {
    const country = (location.countryCode || "").toUpperCase();
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("q", q);
    if (country) url.searchParams.set("countrycodes", country.toLowerCase());

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        // Nominatim requires a valid identifying UA.
        "Accept-Language": "he,en",
      },
    });
    if (!response.ok) {
      geoCache.set(key, null);
      return null;
    }
    const rows = (await response.json()) as Array<{ lat?: string; lon?: string }>;
    const lat = Number(rows?.[0]?.lat);
    const lng = Number(rows?.[0]?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      geoCache.set(key, null);
      return null;
    }
    const point = { latitude: lat, longitude: lng };
    geoCache.set(key, point);
    return point;
  } catch {
    geoCache.set(key, null);
    return null;
  }
}

export async function enrichLocationsWithCoords(
  locations: MetaLocationTarget[]
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
    const point = await geocodeLocation(item);
    if (!point) {
      next.push(item);
      continue;
    }
    next.push({
      ...item,
      latitude: point.latitude,
      longitude: point.longitude,
    });
    // Soft rate-limit for Nominatim.
    await new Promise((resolve) => window.setTimeout(resolve, 200));
  }
  return next;
}
