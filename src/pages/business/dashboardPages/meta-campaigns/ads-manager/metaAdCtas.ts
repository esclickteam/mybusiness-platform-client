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

/** @deprecated Use metaCtaOptions(t) so labels follow the active language. */
export const META_AD_CTAS = metaCtaOptions();
