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

export const SCHEMA_TYPE_DEFS: SchemaTypeDef[] = [
  {
    id: "LocalBusiness",
    label: "עסק מקומי",
    description: "כתובת, טלפון ושעות — מפעיל את כרטיס העסק בגוגל.",
    singletonPerPage: true,
  },
  {
    id: "Service",
    label: "שירות",
    description: "שירות שהעסק מספק, כולל מחיר ואזור שירות.",
    singletonPerPage: false,
  },
  {
    id: "FAQPage",
    label: "שאלות ותשובות",
    description: "בלוק שו״ת שיכול להופיע ישירות בתוצאות החיפוש.",
    singletonPerPage: true,
  },
  {
    id: "Product",
    label: "מוצר",
    description: "מוצר עם מחיר וזמינות — תוצאות עשירות.",
    singletonPerPage: false,
  },
  {
    id: "Organization",
    label: "ארגון",
    description: "זהות העסק, לוגו וקישורים. מומלץ ברמת האתר.",
    singletonPerPage: true,
    siteLevel: true,
  },
  {
    id: "WebSite",
    label: "אתר אינטרנט",
    description: "שם האתר ותיבת חיפוש. מומלץ ברמת האתר.",
    singletonPerPage: true,
    siteLevel: true,
  },
  {
    id: "BreadcrumbList",
    label: "פירורי לחם",
    description: "היררכיית ניווט שמופיעה בתוצאות החיפוש.",
    singletonPerPage: true,
  },
];

export function getSchemaTypeDef(type?: string) {
  return SCHEMA_TYPE_DEFS.find((def) => def.id === type) || null;
}

export function getSchemaTypeLabel(type?: string) {
  return getSchemaTypeDef(type)?.label || "מותאם אישית";
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

export const WEEK_DAYS: Array<{ id: string; label: string }> = [
  { id: "Sunday", label: "ראשון" },
  { id: "Monday", label: "שני" },
  { id: "Tuesday", label: "שלישי" },
  { id: "Wednesday", label: "רביעי" },
  { id: "Thursday", label: "חמישי" },
  { id: "Friday", label: "שישי" },
  { id: "Saturday", label: "שבת" },
];

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
