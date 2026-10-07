export type SaasScreenshot = {
  key: string;
  label: string;
  imageUrl?: string;
  caption?: string;
  audience?: "admin" | "customer" | "both" | string;
  tab?: string;
  gallery?: string;
};

export type SaasQuote = {
  paymentType: "full" | "deposit";
  amountUsd: number;
  amountMinor: number;
  currency: string;
};

export type SaasProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryLabel: string;
  headline: string;
  tagline?: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  priceUsd: number;
  estimatedDevCostLabel: string;
  mainImageUrl?: string;
  coverImage?: string;
  cardScreenshot?: string;
  mobileScreenshots?: SaasScreenshot[];
  promoVideoUrl?: string;
  promoVideoPosterUrl?: string;
  accent: string;
  accentSecondary: string;
  screenshots: SaasScreenshot[];
  features: string[];
  included: string[];
  demoUrl: string;
  status: "draft" | "published" | "sold_out" | "coming_soon" | string;
  badge: string;
  seoTitle: string;
  seoDescription: string;
  whatsappBlurb: string;
  whatsappMessage: string;
  purchasable: boolean;
  quotes?: {
    full: SaasQuote;
    deposit: SaasQuote;
  };
  kind?: "catalog" | "template" | string;
  screenshotUrl?: string;
  interactiveDemoEnabled?: boolean;
  supportsAdminDemo?: boolean;
  supportsCustomerDemo?: boolean;
  demoSelectorUrl?: string;
  adminDemoUrl?: string;
  customerDemoUrl?: string;
  frontendUrl?: string;
  whiteLabel?: boolean;
  partnerModel?: boolean;
  exclusiveCountry?: boolean;
};

export function isSaasTemplate(product: { kind?: string } | null | undefined) {
  return product?.kind === "template";
}

export type TemplateDemoLink = {
  id: "admin" | "customer" | "explore";
  href: string;
};

export function isPublicDemoUrl(value?: string) {
  const url = String(value || "").trim();
  if (!/^https:\/\//i.test(url)) return false;
  let parsed: URL;
  try {
    parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (!host || host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" || host === "::1" || host.endsWith(".local")) {
      return false;
    }
    const path = `${parsed.pathname}${parsed.search}`;
    const bizuply = host === "bizuply.com" || host.endsWith(".bizuply.com");
    if (bizuply && parsed.pathname.startsWith("/saas-media/")) return false;
    if (/^\/saas\/[a-z0-9-]+\/demo(?:\?|$)/i.test(path)) return false;
    return true;
  } catch {
    return false;
  }
}

function httpUrl(value?: string) {
  return isPublicDemoUrl(value) ? String(value).trim() : "";
}

const DEMO_LOCALES = new Set(["en", "he", "ar", "es", "pt-BR"]);

export function localizePublicDemoUrl(value?: string, lang?: string) {
  const url = httpUrl(value);
  if (!url) return "";
  const raw = String(lang || "en");
  const locale = raw === "pt" || raw.startsWith("pt-") ? "pt-BR" : DEMO_LOCALES.has(raw) ? raw : "en";
  try {
    const parsed = new URL(url);
    parsed.pathname = parsed.pathname.replace(/^\/en(?=\/|$)/, `/${locale}`);
    return parsed.toString();
  } catch {
    return url;
  }
}

export function templateExperienceHref(slug: string, mode: "admin" | "customer" | "full") {
  return `/saas/${slug}/demo?mode=${mode}`;
}

export function templateShots(product: { screenshots?: SaasScreenshot[] }) {
  return (product.screenshots || []).filter((shot) => isPublicDemoUrl(shot.imageUrl));
}

export function cardFilm(product: {
  name?: string;
  screenshots?: SaasScreenshot[];
  cardScreenshot?: string;
  coverImage?: string;
  screenshotUrl?: string;
  mainImageUrl?: string;
}) {
  const shots = templateShots(product);
  if (shots.length) return shots.slice(0, 6);
  const image = [product.cardScreenshot, product.coverImage, product.screenshotUrl, product.mainImageUrl].find((item) =>
    isPublicDemoUrl(item)
  );
  return image ? [{ key: "cover", label: product.name || "", imageUrl: image }] : [];
}

export function isInAppDemo(url?: string) {
  const value = String(url || "").trim();
  return !value || value.startsWith("/saas/");
}

export function templateDemoLinks(
  product: {
    supportsAdminDemo?: boolean;
    supportsCustomerDemo?: boolean;
    demoSelectorUrl?: string;
    adminDemoUrl?: string;
    customerDemoUrl?: string;
  },
  lang?: string
) {
  const links: TemplateDemoLink[] = [];
  const admin = localizePublicDemoUrl(product.adminDemoUrl, lang);
  const customer = localizePublicDemoUrl(product.customerDemoUrl, lang);
  const explore = localizePublicDemoUrl(product.demoSelectorUrl, lang);
  if (product.supportsAdminDemo && admin) links.push({ id: "admin", href: admin });
  if (product.supportsCustomerDemo && customer) links.push({ id: "customer", href: customer });
  if (explore) links.push({ id: "explore", href: explore });
  return links;
}

export type SaasCategory = { id: string; label: string };

export const MARKETPLACE_CATEGORIES: SaasCategory[] = [
  { id: "home_services", label: "Home Services" },
  { id: "sales_marketing", label: "Sales & Marketing" },
  { id: "booking", label: "Booking & Appointments" },
  { id: "beauty_wellness", label: "Beauty & Wellness" },
  { id: "education", label: "Education" },
  { id: "real_estate", label: "Real Estate" },
  { id: "hospitality", label: "Hospitality & Travel" },
  { id: "restaurants", label: "Restaurants" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "productivity", label: "Productivity" },
  { id: "other", label: "Other" },
];

export const REVENUE_DISCLAIMER =
  "Revenue examples are illustrative only and are not guarantees of future earnings.";

export const EXAMPLE_PLANS = [
  { id: "starter", name: "Starter", price: 49 },
  { id: "professional", name: "Professional", price: 99 },
  { id: "business", name: "Business", price: 199 },
] as const;

export function filterProducts<T extends { category: string }>(
  products: T[],
  category: string
) {
  if (!category || category === "all") return products;
  return products.filter((item) => item.category === category);
}

export function formatUsd(amount: number) {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 ? 2 : 0,
  }).format(value);
}

export function illustrativeMrr(customers: number, monthlyPrice: number) {
  const count = Math.max(0, Math.round(Number(customers) || 0));
  const price = Math.max(0, Number(monthlyPrice) || 0);
  return Math.round(count * price);
}

export const SAAS_MODELS = ["partner", "white_label", "exclusive_country"] as const;
export type SaasModelId = (typeof SAAS_MODELS)[number];

export function partnerEntryUsd(priceUsd: number) {
  const price = Number(priceUsd) || 0;
  return Math.round(price / 2);
}

export function isSaasModel(value: string): value is SaasModelId {
  return (SAAS_MODELS as readonly string[]).includes(value);
}

export function whatsappHref(e164: string, message: string) {
  const digits = String(e164 || "").replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function demoTarget(product: { demoUrl?: string; slug?: string }) {
  const url = String(product.demoUrl || "").trim();
  if (/^https?:\/\//i.test(url)) {
    return { href: url, external: true };
  }
  return { href: `/saas/${product.slug || ""}#gallery`, external: false };
}

const TRACTION_PATTERNS = [
  /existing customers/i,
  /active subscribers/i,
  /current mrr/i,
  /\barr\b/i,
  /profitable saas/i,
];

export function findTractionClaims(text: string) {
  return TRACTION_PATTERNS.filter((pattern) => pattern.test(text)).map(String);
}
