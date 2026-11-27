import { useTranslation } from "react-i18next";
import { normalizeMarketingLocale, splitMarketingLocale } from "../lib/localePath.mjs";
import HowItWorksExperience from "./public/HowItWorksExperience";

export default function HowItWorks() {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(
    splitMarketingLocale(typeof window !== "undefined" ? window.location.pathname : "").locale || i18n.language,
  );
  return <HowItWorksExperience language={locale} />;
}
