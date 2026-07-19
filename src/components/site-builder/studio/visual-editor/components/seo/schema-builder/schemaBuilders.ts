import type { SeoSchemaType } from "../../../../types";
import type {
  BreadcrumbFormData,
  FaqFormData,
  LocalBusinessFormData,
  OrganizationFormData,
  ProductFormData,
  SchemaBuilderContext,
  ServiceFormData,
  WebsiteFormData,
} from "./schemaTypes";

const SCHEMA_CONTEXT = "https://schema.org";

let localId = 0;
export function newLocalId(prefix = "row") {
  localId += 1;
  return `${prefix}_${Date.now().toString(36)}_${localId.toString(36)}`;
}

function s(value: unknown) {
  return String(value ?? "").trim();
}

/** Remove empty strings, empty arrays, and empty objects recursively. */
export function pruneEmpty(value: any): any {
  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => pruneEmpty(item))
      .filter((item) => item !== undefined);
    return cleaned.length ? cleaned : undefined;
  }
  if (value && typeof value === "object") {
    const out: Record<string, any> = {};
    Object.keys(value).forEach((key) => {
      const cleaned = pruneEmpty(value[key]);
      if (cleaned !== undefined) out[key] = cleaned;
    });
    // Keep objects that carry an @type even if otherwise empty is avoided:
    const keys = Object.keys(out).filter((k) => k !== "@type");
    return keys.length ? out : undefined;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }
  if (value === null || value === undefined) return undefined;
  return value;
}

/* ============ Default form data ============ */

export function defaultFormData(
  type: SeoSchemaType,
  ctx: SchemaBuilderContext,
): Record<string, unknown> {
  switch (type) {
    case "LocalBusiness":
      return {
        businessType: "LocalBusiness",
        name: ctx.siteName || "",
        alternateName: "",
        description: ctx.metaDescription || "",
        telephone: "",
        email: "",
        url: ctx.publicUrl || ctx.previewUrl || "",
        logo: ctx.logoUrl || "",
        image: ctx.ogImage || "",
        priceRange: "",
        currency: "ILS",
        streetAddress: "",
        addressLocality: "",
        addressRegion: "",
        postalCode: "",
        addressCountry: "IL",
        areaServed: "",
        latitude: "",
        longitude: "",
        sameAs: [],
        openingHours: [],
        openAllHours: false,
        services: [],
      } as LocalBusinessFormData as unknown as Record<string, unknown>;
    case "Service":
      return {
        name: ctx.pageTitle || "",
        description: ctx.metaDescription || "",
        url: ctx.previewUrl || "",
        image: ctx.ogImage || "",
        serviceType: "",
        providerName: ctx.siteName || "",
        providerType: "Organization",
        areaServed: "IL",
        audienceType: "",
        priceFrom: "",
        priceTo: "",
        currency: "ILS",
        priceUnit: "",
        availability: "InStock",
        telephone: "",
      } as ServiceFormData as unknown as Record<string, unknown>;
    case "FAQPage":
      return {
        items: [{ id: newLocalId("faq"), question: "", answer: "" }],
      } as FaqFormData as unknown as Record<string, unknown>;
    case "Product":
      return {
        name: ctx.pageTitle || "",
        description: ctx.metaDescription || "",
        sku: "",
        gtin: "",
        mpn: "",
        brand: ctx.siteName || "",
        images: ctx.ogImage ? [ctx.ogImage] : [],
        url: ctx.previewUrl || "",
        price: "",
        salePrice: "",
        currency: "ILS",
        availability: "InStock",
        condition: "NewCondition",
        sellerName: ctx.siteName || "",
        ratingValue: "",
        reviewCount: "",
      } as ProductFormData as unknown as Record<string, unknown>;
    case "Organization":
      return {
        name: ctx.siteName || "",
        alternateName: "",
        description: ctx.metaDescription || "",
        url: ctx.publicUrl || ctx.previewUrl || "",
        logo: ctx.logoUrl || "",
        image: ctx.ogImage || "",
        email: "",
        telephone: "",
        streetAddress: "",
        addressLocality: "",
        addressRegion: "",
        postalCode: "",
        addressCountry: "IL",
        sameAs: [],
        foundingDate: "",
      } as OrganizationFormData as unknown as Record<string, unknown>;
    case "WebSite":
      return {
        name: ctx.siteName || "",
        url: ctx.publicUrl || ctx.previewUrl || "",
        alternateName: "",
        inLanguage: "he-IL",
        publisher: ctx.siteName || "",
        enableSearch: false,
        searchUrlTemplate: ctx.publicUrl
          ? `${ctx.publicUrl.replace(/\/+$/, "")}/?q={search_term_string}`
          : "",
        availableLanguages: ["he-IL"],
        defaultLanguage: "he-IL",
        localizedPages: {},
      } as WebsiteFormData as unknown as Record<string, unknown>;
    case "BreadcrumbList": {
      const items = [] as Array<{ id: string; name: string; url: string }>;
      items.push({
        id: newLocalId("bc"),
        name: "דף הבית",
        url: ctx.homeUrl || ctx.publicUrl || "",
      });
      if (ctx.parentPageTitle && ctx.parentPageUrl) {
        items.push({
          id: newLocalId("bc"),
          name: ctx.parentPageTitle,
          url: ctx.parentPageUrl,
        });
      }
      items.push({
        id: newLocalId("bc"),
        name: ctx.pageTitle || "עמוד",
        url: ctx.previewUrl || "",
      });
      return { items } as BreadcrumbFormData as unknown as Record<
        string,
        unknown
      >;
    }
    default:
      return {};
  }
}

/* ============ formData -> plain schema object ============ */

function buildLocalBusiness(f: LocalBusinessFormData) {
  const openingHoursSpecification = f.openAllHours
    ? [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
      ]
    : (f.openingHours || [])
        .filter((row) => !row.closed && row.opens && row.closes)
        .map((row) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: row.day,
          opens: row.opens,
          closes: row.closes,
        }));

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": s(f.businessType) || "LocalBusiness",
    name: s(f.name),
    alternateName: s(f.alternateName),
    description: s(f.description),
    url: s(f.url),
    telephone: s(f.telephone),
    email: s(f.email),
    image: s(f.image),
    logo: s(f.logo),
    priceRange: s(f.priceRange),
    address: {
      "@type": "PostalAddress",
      streetAddress: s(f.streetAddress),
      addressLocality: s(f.addressLocality),
      addressRegion: s(f.addressRegion),
      postalCode: s(f.postalCode),
      addressCountry: s(f.addressCountry) || "IL",
    },
    geo:
      s(f.latitude) && s(f.longitude)
        ? {
            "@type": "GeoCoordinates",
            latitude: s(f.latitude),
            longitude: s(f.longitude),
          }
        : undefined,
    areaServed: s(f.areaServed),
    makesOffer: (f.services || [])
      .map((name) => s(name))
      .filter(Boolean)
      .map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    openingHoursSpecification,
    sameAs: (f.sameAs || []).map((v) => s(v)).filter(Boolean),
  };
}

function buildService(f: ServiceFormData) {
  const hasPrice = s(f.priceFrom) || s(f.priceTo);
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Service",
    name: s(f.name),
    description: s(f.description),
    url: s(f.url),
    image: s(f.image),
    serviceType: s(f.serviceType),
    provider: s(f.providerName)
      ? { "@type": s(f.providerType) || "Organization", name: s(f.providerName) }
      : undefined,
    areaServed: s(f.areaServed),
    audience: s(f.audienceType)
      ? { "@type": "Audience", audienceType: s(f.audienceType) }
      : undefined,
    offers: hasPrice
      ? {
          "@type": s(f.priceTo) ? "AggregateOffer" : "Offer",
          ...(s(f.priceTo)
            ? { lowPrice: s(f.priceFrom), highPrice: s(f.priceTo) }
            : { price: s(f.priceFrom) }),
          priceCurrency: s(f.currency) || "ILS",
          availability: `https://schema.org/${s(f.availability) || "InStock"}`,
        }
      : undefined,
    telephone: s(f.telephone),
  };
}

function buildFaq(f: FaqFormData) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    mainEntity: (f.items || [])
      .filter((item) => s(item.question) && s(item.answer))
      .map((item) => ({
        "@type": "Question",
        name: s(item.question),
        acceptedAnswer: { "@type": "Answer", text: s(item.answer) },
      })),
  };
}

function buildProduct(f: ProductFormData) {
  const price = s(f.salePrice) || s(f.price);
  const hasRating = s(f.ratingValue) && s(f.reviewCount);
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Product",
    name: s(f.name),
    description: s(f.description),
    image: (f.images || []).map((v) => s(v)).filter(Boolean),
    sku: s(f.sku),
    gtin: s(f.gtin),
    mpn: s(f.mpn),
    brand: s(f.brand) ? { "@type": "Brand", name: s(f.brand) } : undefined,
    offers: price
      ? {
          "@type": "Offer",
          url: s(f.url),
          price,
          priceCurrency: s(f.currency) || "ILS",
          availability: `https://schema.org/${s(f.availability) || "InStock"}`,
          itemCondition: `https://schema.org/${s(f.condition) || "NewCondition"}`,
          seller: s(f.sellerName)
            ? { "@type": "Organization", name: s(f.sellerName) }
            : undefined,
        }
      : undefined,
    aggregateRating: hasRating
      ? {
          "@type": "AggregateRating",
          ratingValue: s(f.ratingValue),
          reviewCount: s(f.reviewCount),
        }
      : undefined,
  };
}

function buildOrganization(f: OrganizationFormData) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Organization",
    name: s(f.name),
    alternateName: s(f.alternateName),
    description: s(f.description),
    url: s(f.url),
    logo: s(f.logo),
    image: s(f.image),
    email: s(f.email),
    telephone: s(f.telephone),
    address:
      s(f.streetAddress) || s(f.addressLocality)
        ? {
            "@type": "PostalAddress",
            streetAddress: s(f.streetAddress),
            addressLocality: s(f.addressLocality),
            addressRegion: s(f.addressRegion),
            postalCode: s(f.postalCode),
            addressCountry: s(f.addressCountry) || "IL",
          }
        : undefined,
    sameAs: (f.sameAs || []).map((v) => s(v)).filter(Boolean),
    foundingDate: s(f.foundingDate),
  };
}

function buildWebsite(f: WebsiteFormData) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite",
    name: s(f.name),
    alternateName: s(f.alternateName),
    url: s(f.url),
    inLanguage: s(f.inLanguage) || "he-IL",
    publisher: s(f.publisher)
      ? { "@type": "Organization", name: s(f.publisher) }
      : undefined,
    potentialAction:
      f.enableSearch && s(f.searchUrlTemplate)
        ? {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: s(f.searchUrlTemplate),
            },
            "query-input": "required name=search_term_string",
          }
        : undefined,
  };
}

function buildBreadcrumb(f: BreadcrumbFormData) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: (f.items || [])
      .filter((item) => s(item.name))
      .map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: s(item.name),
        item: s(item.url) || undefined,
      })),
  };
}

export function buildSchemaObject(
  type: SeoSchemaType,
  formData: Record<string, unknown>,
): Record<string, any> {
  switch (type) {
    case "LocalBusiness":
      return buildLocalBusiness(formData as unknown as LocalBusinessFormData);
    case "Service":
      return buildService(formData as unknown as ServiceFormData);
    case "FAQPage":
      return buildFaq(formData as unknown as FaqFormData);
    case "Product":
      return buildProduct(formData as unknown as ProductFormData);
    case "Organization":
      return buildOrganization(formData as unknown as OrganizationFormData);
    case "WebSite":
      return buildWebsite(formData as unknown as WebsiteFormData);
    case "BreadcrumbList":
      return buildBreadcrumb(formData as unknown as BreadcrumbFormData);
    default:
      return {};
  }
}

/**
 * Build the JSON string for a schema entry. Prunes empty values and, when an
 * existing JSON is supplied, merges the generated known fields into it so that
 * unknown custom fields the user added are preserved.
 */
export function buildSchemaJson(
  type: SeoSchemaType,
  formData: Record<string, unknown>,
  existingJson?: string,
): string {
  const generated = pruneEmpty(buildSchemaObject(type, formData)) || {};

  let base: Record<string, any> = {};
  if (existingJson) {
    try {
      const parsed = JSON.parse(existingJson);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        base = parsed;
      }
    } catch {
      base = {};
    }
  }

  const merged = { ...base, ...generated };
  return JSON.stringify(merged, null, 2);
}
