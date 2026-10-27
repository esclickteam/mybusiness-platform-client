/** Meta Ads Manager CTA values. Labels come from i18n — never show raw enums. */
export const META_AD_CTA_VALUES = [
  "APPLY_NOW",
  "DOWNLOAD",
  "GET_OFFER",
  "GET_QUOTE",
  "OPEN_LINK",
  "LEARN_MORE",
  "SIGN_UP",
  "ORDER_NOW",
  "SUBSCRIBE",
  "CONTACT_US",
  "BOOK_TRAVEL",
  "SHOP_NOW",
  "CALL_NOW",
  "SEND_MESSAGE",
  "WHATSAPP_MESSAGE",
  "WATCH_MORE",
  "GET_STARTED",
  "VISIT_WEBSITE",
  "BOOK_NOW",
] as const;

/**
 * Instant Form + lead_gen_form_id.
 * Documented Marketing API lead-ads create guide, plus Ads Manager extras
 * that Graph accepts. OPEN_LINK is shown in Ads Manager but rejected (1856030).
 */
export const DOCUMENTED_INSTANT_FORM_CTA_VALUES = [
  "APPLY_NOW",
  "DOWNLOAD",
  "GET_QUOTE",
  "LEARN_MORE",
  "SIGN_UP",
  "SUBSCRIBE",
] as const;

export const INSTANT_FORM_CTA_VALUES = [
  ...DOCUMENTED_INSTANT_FORM_CTA_VALUES,
  "GET_OFFER",
  "ORDER_NOW",
  "CONTACT_US",
] as const;

/** Ads Manager Instant Form order, including API-incompatible OPEN_LINK. */
export const INSTANT_FORM_ADS_MANAGER_ORDER = [
  "APPLY_NOW",
  "DOWNLOAD",
  "GET_OFFER",
  "GET_QUOTE",
  "OPEN_LINK",
  "LEARN_MORE",
  "SIGN_UP",
  "ORDER_NOW",
  "SUBSCRIBE",
  "CONTACT_US",
] as const;

export const DEFAULT_INSTANT_FORM_CTA = "SIGN_UP";
export const DEFAULT_WEBSITE_CTA = "LEARN_MORE";

export type MetaAdCtaValue = (typeof META_AD_CTA_VALUES)[number];

export type CtaContext = {
  usesInstantForms?: boolean;
  usesWhatsApp?: boolean;
  usesMessenger?: boolean;
  usesPhone?: boolean;
};

export type CtaMenuOption = {
  value: string;
  label: string;
  compatible: boolean;
  reasonKey?: string;
};

const EN_FALLBACK: Record<string, string> = {
  OPEN_LINK: "See details",
  LEARN_MORE: "Learn more",
  SUBSCRIBE: "Subscribe",
  BOOK_TRAVEL: "Book now",
  BOOK_NOW: "Book now",
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
  GET_STARTED: "Get started",
  VISIT_WEBSITE: "Visit website",
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

export function usesMessengerDestination(conversionLocation?: string): boolean {
  return /messenger/i.test(String(conversionLocation || ""));
}

export function usesPhoneDestination(conversionLocation?: string): boolean {
  return /^phone$/i.test(String(conversionLocation || "").trim());
}

export function isCtaCompatible(cta: string, context: CtaContext): boolean {
  const value = String(cta || "").trim().toUpperCase();
  if (!value) return false;
  if (context.usesWhatsApp) return value === "WHATSAPP_MESSAGE";
  if (context.usesPhone) return value === "CALL_NOW";
  if (context.usesMessenger) {
    return value === "SEND_MESSAGE" || value === "LEARN_MORE" || value === "CONTACT_US";
  }
  if (context.usesInstantForms) return isInstantFormCta(value);
  return value !== "WHATSAPP_MESSAGE";
}

export function suggestedCtaForContext(context: CtaContext): string {
  if (context.usesWhatsApp) return "WHATSAPP_MESSAGE";
  if (context.usesPhone) return "CALL_NOW";
  if (context.usesMessenger) return "SEND_MESSAGE";
  if (context.usesInstantForms) return DEFAULT_INSTANT_FORM_CTA;
  return DEFAULT_WEBSITE_CTA;
}

export function inspectCtaForContext(
  current: string,
  context: CtaContext
): { current: string; compatible: boolean; suggested: string } {
  const cta = String(current || "").trim().toUpperCase();
  const suggested = suggestedCtaForContext(context);
  return {
    current: cta,
    compatible: isCtaCompatible(cta, context),
    suggested,
  };
}

/** @deprecated Prefer inspectCtaForContext — do not silently replace user CTAs. */
export function resolveCtaForAdContext(
  current: string,
  context: CtaContext
): string {
  const inspected = inspectCtaForContext(current, context);
  return inspected.compatible ? inspected.current : inspected.suggested;
}

export function metaCtaOptionsForContext(
  context: CtaContext,
  t?: (key: string, options?: Record<string, unknown>) => string
): CtaMenuOption[] {
  if (context.usesWhatsApp) {
    return [
      {
        value: "WHATSAPP_MESSAGE",
        label: metaCtaLabel("WHATSAPP_MESSAGE", t),
        compatible: true,
      },
    ];
  }
  if (context.usesPhone) {
    return [
      {
        value: "CALL_NOW",
        label: metaCtaLabel("CALL_NOW", t),
        compatible: true,
      },
    ];
  }

  const values = context.usesInstantForms
    ? INSTANT_FORM_CTA_VALUES
    : META_AD_CTA_VALUES.filter((value) => value !== "WHATSAPP_MESSAGE");

  return values.map((value) => {
    const compatible = isCtaCompatible(value, context);
    return {
      value,
      label: metaCtaLabel(value, t),
      compatible,
      reasonKey: compatible ? undefined : "ctaIncompatibleLeadForm",
    };
  });
}

export function conversionLocationsForObjective(objective?: string): string[] {
  const key = String(objective || "").toUpperCase();
  if (key === "OUTCOME_LEADS") {
    return [
      "Instant forms",
      "Website",
      "Website and instant forms",
      "Messenger",
      "WhatsApp",
      "Phone",
    ];
  }
  if (key === "OUTCOME_ENGAGEMENT") return ["WhatsApp", "Messenger"];
  if (key === "OUTCOME_TRAFFIC" || key === "OUTCOME_SALES") return ["Website"];
  if (key === "OUTCOME_APP_PROMOTION") return ["Website"];
  return ["Website"];
}

/** @deprecated Use metaCtaOptions(t) so labels follow the active language. */
export const META_AD_CTAS = metaCtaOptions();
