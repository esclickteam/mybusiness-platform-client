import i18n from "./i18n";
import { getTextDirection } from "./localeUtils";

let languageOverride: string | undefined;

/** Embed/preview can pin built-in template copy to a URL language without writing i18n storage. */
export function setTemplateLanguageOverride(language?: string | null) {
  languageOverride = language || undefined;
}

export function getTemplateLanguageOverride(): string | undefined {
  return languageOverride;
}

export function resolveTemplateLanguage(language?: string): string {
  return language || languageOverride || i18n.language;
}

/** Direction for bundled template chrome. Follows dashboard/embed language, not saved site copy. */
export function templateDir(language?: string) {
  return getTextDirection(resolveTemplateLanguage(language));
}
