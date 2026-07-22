import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";

/** Current document text direction based on active i18n language. */
export function useLocaleDir(): "rtl" | "ltr" {
  const { i18n } = useTranslation();
  return getTextDirection(i18n.language);
}
