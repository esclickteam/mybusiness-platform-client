/**
 * Public Bizuply Travel marketing host.
 * Kept separate from customer sites (*.sites.bizuply.com) and partner white-label hosts.
 */

export const TRAVEL_CANONICAL_HOST = "travel.bizuply.com";

const TRAVEL_HOSTS = new Set([
  TRAVEL_CANONICAL_HOST,
  "www.travel.bizuply.com",
]);

export const TRAVEL_SEO_TITLE = "Bizuply Travel | Travel Technology Platform";

export const TRAVEL_SEO_DESCRIPTION =
  "Bizuply Travel is a travel technology platform by Bizuply LLC, connecting travel businesses with flights, hotels, cars, activities, events, restaurants, insurance, eSIM and transfer services.";

export function isBizuplyTravelHost(hostname) {
  const host = String(hostname || "")
    .toLowerCase()
    .trim()
    .split(":")[0];
  return TRAVEL_HOSTS.has(host);
}
