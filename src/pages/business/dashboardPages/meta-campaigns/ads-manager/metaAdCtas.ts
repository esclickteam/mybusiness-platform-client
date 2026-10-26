/** Meta Ads Manager CTA values. Labels come from i18n — never show raw enums. */
export const META_AD_CTA_VALUES = [
  "OPEN_LINK",
  "LEARN_MORE",
  "SUBSCRIBE",
  "BOOK_TRAVEL",
  "SIGN_UP",
  "APPLY_NOW",
  "DOWNLOAD",
  "GET_OFFER",
  "GET_QUOTE",
  "CONTACT_US",
  "SHOP_NOW",
  "CALL_NOW",
  "SEND_MESSAGE",
  "WHATSAPP_MESSAGE",
  "WATCH_MORE",
  "ORDER_NOW",
] as const;

/**
 * Instant Form creatives (Marketing API lead-ads create guide).
 * OPEN_LINK + lead_gen_form_id is rejected (error 100 / 1856030).
 */
export const INSTANT_FORM_CTA_VALUES = [
  "APPLY_NOW",
  "DOWNLOAD",
  "GET_QUOTE",
  "LEARN_MORE",
  "SIGN_UP",
  "SUBSCRIBE",
] as const;

export const DEFAULT_INSTANT_FORM_CTA = "SIGN_UP";
export const DEFAULT_WEBSITE_CTA = "LEARN_MORE";

export type MetaAdCtaValue = (typeof META_AD_CTA_VALUES)[number];

const EN_FALLBACK: Record<string, string> = {
  OPEN_LINK: "See details",
  LEARN_MORE: "Learn more",
  SUBSCRIBE: "Subscribe",
  BOOK_TRAVEL: "Book now",
  SIGN_UP: "Sign up",
  APPLY_NOW: "Apply now",
  DOWNLOAD: "Download",
  GET_OFFER: "Get offer",
  GET_QUOTE: "Get quote",
  CONTACT_US: "Contact us",
  SHOP_NOW: "Shop now",
  CALL_NOW: "Call now",
  SEND_MESSAGE: "Send message",
  WHATSAPP_MESSAGE: "WhatsApp",
  WATCH_MORE: "Watch more",
  ORDER_NOW: "Order now",
};

export function metaCtaLabel(
  value: string,
  t?: (key: string, options?: Record<string, unknown>) => string
): string {
  const key = String(value || "").trim();
  if (!key) return "";
  if (t) {
    const translated = t(`metaCampaigns.cta.${key}`, { defaultValue: "" });
    if (translated) return translated;
  }
  return EN_FALLBACK[key] || key;
}

export function metaCtaOptions(
  t?: (key: string, options?: Record<string, unknown>) => string
): Array<{ value: string; label: string }> {
  return META_AD_CTA_VALUES.map((value) => ({
    value,
    label: metaCtaLabel(value, t),
  }));
}

export function isInstantFormCta(value: string): boolean {
  return (INSTANT_FORM_CTA_VALUES as readonly string[]).includes(
    String(value || "").trim().toUpperCase()
  );
}

export function usesInstantFormDestination(conversionLocation?: string): boolean {
  return /instant/i.test(String(conversionLocation || ""));
}

export function resolveCtaForAdContext(
  current: string,
  context: { usesInstantForms?: boolean; usesWhatsApp?: boolean }
): string {
  const cta = String(current || "").trim().toUpperCase();
  if (context.usesWhatsApp) return "WHATSAPP_MESSAGE";
  if (context.usesInstantForms) {
    return isInstantFormCta(cta) ? cta : DEFAULT_INSTANT_FORM_CTA;
  }
  if (cta === "WHATSAPP_MESSAGE") return DEFAULT_WEBSITE_CTA;
  return cta || DEFAULT_WEBSITE_CTA;
}

export function metaCtaOptionsForContext(
  context: { usesInstantForms?: boolean; usesWhatsApp?: boolean },
  t?: (key: string, options?: Record<string, unknown>) => string
): Array<{ value: string; label: string }> {
  if (context.usesWhatsApp) {
    return [{ value: "WHATSAPP_MESSAGE", label: metaCtaLabel("WHATSAPP_MESSAGE", t) }];
  }
  const values = context.usesInstantForms
    ? INSTANT_FORM_CTA_VALUES
    : META_AD_CTA_VALUES.filter((value) => value !== "WHATSAPP_MESSAGE");
  return values.map((value) => ({
    value,
    label: metaCtaLabel(value, t),
  }));
}

/** @deprecated Use metaCtaOptions(t) so labels follow the active language. */
export const META_AD_CTAS = metaCtaOptions();
