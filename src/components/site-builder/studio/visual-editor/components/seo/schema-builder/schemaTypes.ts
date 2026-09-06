import i18n from "../../../../../../../i18n/i18n";
import type { SeoSchemaType } from "../../../../types";

export type SchemaBuilderContext = {
  siteName: string;
  pageTitle: string;
  previewUrl: string;
  publicUrl: string;
  ogImage?: string;
  metaDescription?: string;
  logoUrl?: string;
  parentPageId?: string;
  parentPageTitle?: string;
  parentPageUrl?: string;
  homeUrl?: string;
};

export type SchemaTypeDef = {
  id: Exclude<SeoSchemaType, "Custom">;
  label: string;
  description: string;
  /** Only one instance of this type is expected per page. */
  singletonPerPage: boolean;
  /** Recommended at the site level rather than per page. */
  siteLevel?: boolean;
};

const SCHEMA_TYPE_META: Array<Omit<SchemaTypeDef, "label" | "description"> & {
  labelKey: string;
  descriptionKey: string;
}> = [
  {
    id: "LocalBusiness",
    labelKey: "studio.schema.localBusiness",
    descriptionKey: "studio.schema.localBusinessDesc",
    singletonPerPage: true,
  },
  {
    id: "Service",
    labelKey: "studio.schema.service",
    descriptionKey: "studio.schema.serviceDesc",
    singletonPerPage: false,
  },
  {
    id: "FAQPage",
    labelKey: "studio.schema.faq",
    descriptionKey: "studio.schema.faqDesc",
    singletonPerPage: true,
  },
  {
    id: "Product",
    labelKey: "studio.schema.product",
    descriptionKey: "studio.schema.productDesc",
    singletonPerPage: false,
  },
  {
    id: "Organization",
    labelKey: "studio.schema.organization",
    descriptionKey: "studio.schema.organizationDesc",
    singletonPerPage: true,
    siteLevel: true,
  },
  {
    id: "WebSite",
    labelKey: "studio.schema.website",
    descriptionKey: "studio.schema.websiteDesc",
    singletonPerPage: true,
    siteLevel: true,
  },
  {
    id: "BreadcrumbList",
    labelKey: "studio.schema.breadcrumb",
    descriptionKey: "studio.schema.breadcrumbDesc",
    singletonPerPage: true,
  },
];

export function getSchemaTypeDefs(): SchemaTypeDef[] {
  return SCHEMA_TYPE_META.map((def) => ({
    id: def.id,
    label: String(i18n.t(def.labelKey)),
    description: String(i18n.t(def.descriptionKey)),
    singletonPerPage: def.singletonPerPage,
    siteLevel: def.siteLevel,
  }));
}

export const SCHEMA_TYPE_DEFS: SchemaTypeDef[] = SCHEMA_TYPE_META.map((def) => ({
  id: def.id,
  label: def.id,
  description: "",
  singletonPerPage: def.singletonPerPage,
  siteLevel: def.siteLevel,
}));

export function getSchemaTypeDef(type?: string) {
  return getSchemaTypeDefs().find((def) => def.id === type) || null;
}

export function getSchemaTypeLabel(type?: string) {
  return getSchemaTypeDef(type)?.label || String(i18n.t("studio.schema.custom"));
}

export const LOCAL_BUSINESS_TYPES = [
  "LocalBusiness",
  "ProfessionalService",
  "Store",
  "Restaurant",
  "BeautySalon",
  "HairSalon",
  "HealthAndBeautyBusiness",
  "HomeAndConstructionBusiness",
  "LegalService",
  "FinancialService",
  "RealEstateAgent",
  "Dentist",
  "MedicalBusiness",
  "AutomotiveBusiness",
  "TravelAgency",
];

export const PRODUCT_AVAILABILITY = [
  "InStock",
  "OutOfStock",
  "PreOrder",
  "BackOrder",
  "LimitedAvailability",
  "Discontinued",
];

export const PRODUCT_CONDITION = [
  "NewCondition",
  "UsedCondition",
  "RefurbishedCondition",
  "DamagedCondition",
];

const WEEK_DAY_IDS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function getWeekDays(): Array<{ id: string; label: string }> {
  return WEEK_DAY_IDS.map((id) => ({
    id,
    label: String(i18n.t(`studio.seo.${id.toLowerCase()}`)),
  }));
}

export const WEEK_DAYS: Array<{ id: string; label: string }> = WEEK_DAY_IDS.map(
  (id) => ({ id, label: id }),
);

/* ============ Form data shapes ============ */

export type OpeningHoursRow = {
  id: string;
  day: string;
  closed: boolean;
  opens: string;
  closes: string;
};

export type LocalBusinessFormData = {
  businessType: string;
  name: string;
  alternateName: string;
  description: string;
  telephone: string;
  email: string;
  url: string;
  logo: string;
  image: string;
  priceRange: string;
  currency: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  areaServed: string;
  latitude: string;
  longitude: string;
  sameAs: string[];
  openingHours: OpeningHoursRow[];
  openAllHours: boolean;
  services: string[];
};

export type ServiceFormData = {
  name: string;
  description: string;
  url: string;
  image: string;
  serviceType: string;
  providerName: string;
  providerType: string;
  areaServed: string;
  audienceType: string;
  priceFrom: string;
  priceTo: string;
  currency: string;
  priceUnit: string;
  availability: string;
  telephone: string;
};

export type FaqItem = { id: string; question: string; answer: string };
export type FaqFormData = { items: FaqItem[] };

export type ProductFormData = {
  name: string;
  description: string;
  sku: string;
  gtin: string;
  mpn: string;
  brand: string;
  images: string[];
  url: string;
  price: string;
  salePrice: string;
  currency: string;
  availability: string;
  condition: string;
  sellerName: string;
  ratingValue: string;
  reviewCount: string;
};

export type OrganizationFormData = {
  name: string;
  alternateName: string;
  description: string;
  url: string;
  logo: string;
  image: string;
  email: string;
  telephone: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  sameAs: string[];
  foundingDate: string;
};

export type WebsiteFormData = {
  name: string;
  url: string;
  alternateName: string;
  inLanguage: string;
  publisher: string;
  enableSearch: boolean;
  searchUrlTemplate: string;
  /** Prepared for future multi-language support (not surfaced yet). */
  availableLanguages?: string[];
  defaultLanguage?: string;
  localizedPages?: Record<string, string>;
};

export type BreadcrumbItem = {
  id: string;
  name: string;
  url: string;
};
export type BreadcrumbFormData = { items: BreadcrumbItem[] };
