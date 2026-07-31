/** Meta Instant Form `locale` values (Graph API enum). */
export const META_LEAD_FORM_LOCALES = [
  { value: "he_IL", label: "עברית" },
  { value: "ar_AR", label: "العربية" },
  { value: "cs_CZ", label: "Čeština" },
  { value: "da_DK", label: "Dansk" },
  { value: "de_DE", label: "Deutsch" },
  { value: "el_GR", label: "Ελληνικά" },
  { value: "en_GB", label: "English (UK)" },
  { value: "en_US", label: "English (US)" },
  { value: "es_ES", label: "Español (España)" },
  { value: "es_LA", label: "Español" },
  { value: "fi_FI", label: "Suomi" },
  { value: "fr_FR", label: "Français (France)" },
  { value: "hi_IN", label: "हिन्दी" },
  { value: "hu_HU", label: "Magyar" },
  { value: "id_ID", label: "Bahasa Indonesia" },
  { value: "it_IT", label: "Italiano" },
  { value: "ja_JP", label: "日本語" },
  { value: "ko_KR", label: "한국어" },
  { value: "nb_NO", label: "Norsk (bokmål)" },
  { value: "nl_NL", label: "Nederlands" },
  { value: "pl_PL", label: "Polski" },
  { value: "pt_BR", label: "Português (Brasil)" },
  { value: "pt_PT", label: "Português (Portugal)" },
  { value: "ro_RO", label: "Română" },
  { value: "ru_RU", label: "Русский" },
  { value: "sv_SE", label: "Svenska" },
  { value: "th_TH", label: "ภาษาไทย" },
  { value: "tr_TR", label: "Türkçe" },
  { value: "vi_VN", label: "Tiếng Việt" },
  { value: "zh_CN", label: "中文(简体)" },
  { value: "zh_HK", label: "中文(香港)" },
  { value: "zh_TW", label: "中文(台灣)" },
] as const;

export type MetaLeadFormLocale =
  (typeof META_LEAD_FORM_LOCALES)[number]["value"];

export function metaLeadFormLocaleLabel(locale: string) {
  const match = META_LEAD_FORM_LOCALES.find((item) => item.value === locale);
  return match?.label || locale;
}

export function isRtlLeadFormLocale(locale: string) {
  const code = String(locale || "").toLowerCase();
  return code.startsWith("he") || code.startsWith("ar");
}

export function leadFormContactLabel(
  type: string,
  locale: string,
  fields: Array<{ type: string; labelHe: string; labelEn: string }>
) {
  const field = fields.find((item) => item.type === type);
  if (!field) return type;
  return String(locale || "").toLowerCase().startsWith("he")
    ? field.labelHe
    : field.labelEn;
}
