import type { SeoSchemaType } from "../../../../types";
import { newLocalId } from "./schemaBuilders";

function s(value: unknown) {
  return String(value ?? "").trim();
}

function asObject(value: unknown): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};
}

function toArray(value: unknown): any[] {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function stripSchemaUrl(value: unknown) {
  return s(value).replace(/^https?:\/\/schema\.org\//i, "");
}

export function safeParse(json: string): Record<string, any> | null {
  try {
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function parseLocalBusinessSchema(json: string) {
  const o = safeParse(json) || {};
  const address = asObject(o.address);
  const geo = asObject(o.geo);
  const hours = toArray(o.openingHoursSpecification);

  const openAllHours =
    hours.length === 1 &&
    s(hours[0]?.opens) === "00:00" &&
    (s(hours[0]?.closes) === "23:59" || s(hours[0]?.closes) === "24:00");

  const openingHours = openAllHours
    ? []
    : hours.flatMap((row: any) => {
        const days = toArray(row?.dayOfWeek);
        return days.map((day: any) => ({
          id: newLocalId("oh"),
          day: s(day),
          closed: false,
          opens: s(row?.opens),
          closes: s(row?.closes),
        }));
      });

  const services = toArray(o.makesOffer)
    .map((offer: any) => s(offer?.itemOffered?.name))
    .filter(Boolean);

  return {
    businessType: s(o["@type"]) || "LocalBusiness",
    name: s(o.name),
    alternateName: s(o.alternateName),
    description: s(o.description),
    telephone: s(o.telephone),
    email: s(o.email),
    url: s(o.url),
    logo: s(o.logo),
    image: Array.isArray(o.image) ? s(o.image[0]) : s(o.image),
    priceRange: s(o.priceRange),
    currency: "ILS",
    streetAddress: s(address.streetAddress),
    addressLocality: s(address.addressLocality),
    addressRegion: s(address.addressRegion),
    postalCode: s(address.postalCode),
    addressCountry: s(address.addressCountry) || "IL",
    areaServed: typeof o.areaServed === "string" ? s(o.areaServed) : "",
    latitude: s(geo.latitude),
    longitude: s(geo.longitude),
    sameAs: toArray(o.sameAs).map(s).filter(Boolean),
    openingHours,
    openAllHours,
    services,
  };
}

export function parseServiceSchema(json: string) {
  const o = safeParse(json) || {};
  const provider = asObject(o.provider);
  const audience = asObject(o.audience);
  const offers = asObject(o.offers);
  return {
    name: s(o.name),
    description: s(o.description),
    url: s(o.url),
    image: Array.isArray(o.image) ? s(o.image[0]) : s(o.image),
    serviceType: s(o.serviceType),
    providerName: s(provider.name),
    providerType: s(provider["@type"]) || "Organization",
    areaServed: typeof o.areaServed === "string" ? s(o.areaServed) : "",
    audienceType: s(audience.audienceType),
    priceFrom: s(offers.price) || s(offers.lowPrice),
    priceTo: s(offers.highPrice),
    currency: s(offers.priceCurrency) || "ILS",
    priceUnit: "",
    availability: stripSchemaUrl(offers.availability) || "InStock",
    telephone: s(o.telephone),
  };
}

export function parseFaqSchema(json: string) {
  const o = safeParse(json) || {};
  const items = toArray(o.mainEntity)
    .map((q: any) => ({
      id: newLocalId("faq"),
      question: s(q?.name),
      answer: s(asObject(q?.acceptedAnswer).text),
    }))
    .filter((item) => item.question || item.answer);
  return { items: items.length ? items : [{ id: newLocalId("faq"), question: "", answer: "" }] };
}

export function parseProductSchema(json: string) {
  const o = safeParse(json) || {};
  const offers = asObject(o.offers);
  const brand = asObject(o.brand);
  const rating = asObject(o.aggregateRating);
  const seller = asObject(offers.seller);
  return {
    name: s(o.name),
    description: s(o.description),
    sku: s(o.sku),
    gtin: s(o.gtin),
    mpn: s(o.mpn),
    brand: s(brand.name) || (typeof o.brand === "string" ? s(o.brand) : ""),
    images: toArray(o.image).map(s).filter(Boolean),
    url: s(offers.url) || s(o.url),
    price: s(offers.price),
    salePrice: "",
    currency: s(offers.priceCurrency) || "ILS",
    availability: stripSchemaUrl(offers.availability) || "InStock",
    condition: stripSchemaUrl(offers.itemCondition) || "NewCondition",
    sellerName: s(seller.name),
    ratingValue: s(rating.ratingValue),
    reviewCount: s(rating.reviewCount) || s(rating.ratingCount),
  };
}

export function parseOrganizationSchema(json: string) {
  const o = safeParse(json) || {};
  const address = asObject(o.address);
  return {
    name: s(o.name),
    alternateName: s(o.alternateName),
    description: s(o.description),
    url: s(o.url),
    logo: s(o.logo),
    image: Array.isArray(o.image) ? s(o.image[0]) : s(o.image),
    email: s(o.email),
    telephone: s(o.telephone),
    streetAddress: s(address.streetAddress),
    addressLocality: s(address.addressLocality),
    addressRegion: s(address.addressRegion),
    postalCode: s(address.postalCode),
    addressCountry: s(address.addressCountry) || "IL",
    sameAs: toArray(o.sameAs).map(s).filter(Boolean),
    foundingDate: s(o.foundingDate),
  };
}

export function parseWebsiteSchema(json: string) {
  const o = safeParse(json) || {};
  const publisher = asObject(o.publisher);
  const action = asObject(o.potentialAction);
  const target = asObject(action.target);
  return {
    name: s(o.name),
    url: s(o.url),
    alternateName: s(o.alternateName),
    inLanguage: s(o.inLanguage) || "he-IL",
    publisher: s(publisher.name) || (typeof o.publisher === "string" ? s(o.publisher) : ""),
    enableSearch: Boolean(action["@type"]),
    searchUrlTemplate: s(target.urlTemplate),
    availableLanguages: ["he-IL"],
    defaultLanguage: "he-IL",
    localizedPages: {},
  };
}

export function parseBreadcrumbSchema(json: string) {
  const o = safeParse(json) || {};
  const items = toArray(o.itemListElement)
    .map((li: any) => ({
      id: newLocalId("bc"),
      name: s(li?.name),
      url: s(li?.item),
    }))
    .filter((item) => item.name || item.url);
  return { items: items.length ? items : [{ id: newLocalId("bc"), name: "", url: "" }] };
}

export function parseSchema(
  type: SeoSchemaType,
  json: string,
): Record<string, unknown> {
  switch (type) {
    case "LocalBusiness":
      return parseLocalBusinessSchema(json) as unknown as Record<string, unknown>;
    case "Service":
      return parseServiceSchema(json) as unknown as Record<string, unknown>;
    case "FAQPage":
      return parseFaqSchema(json) as unknown as Record<string, unknown>;
    case "Product":
      return parseProductSchema(json) as unknown as Record<string, unknown>;
    case "Organization":
      return parseOrganizationSchema(json) as unknown as Record<string, unknown>;
    case "WebSite":
      return parseWebsiteSchema(json) as unknown as Record<string, unknown>;
    case "BreadcrumbList":
      return parseBreadcrumbSchema(json) as unknown as Record<string, unknown>;
    default:
      return {};
  }
}
