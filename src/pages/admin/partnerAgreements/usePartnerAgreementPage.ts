import { useTranslation } from "react-i18next";
import { partnerAgreementPageCopy } from "./partnerAgreementPageCopy.js";

/** Page chrome follows the site language switcher, not the agreement contract locale. */
export function usePartnerAgreementPage() {
  const { i18n } = useTranslation();
  return partnerAgreementPageCopy(i18n.language);
}
