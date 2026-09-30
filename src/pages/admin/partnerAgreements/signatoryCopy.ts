import { agreementStatusLabel, partnerAgreementPageCopy } from "./partnerAgreementPageCopy.js";

export type SignatoryLocale = "en" | "he" | "es" | "pt-BR" | "ar";

/** Signing-flow strings for a locale. Prefer usePartnerAgreementPage() in pages so the site language wins. */
export function signatoryCopy(locale?: string) {
  const page = partnerAgreementPageCopy(locale);
  return {
    locale: page.locale as SignatoryLocale,
    dir: page.dir as "rtl" | "ltr",
    text: page.text.sign,
  };
}

export function signatureStatusText(code: string | undefined, locale?: string) {
  if (!code) return "";
  return agreementStatusLabel(code, partnerAgreementPageCopy(locale).text);
}
