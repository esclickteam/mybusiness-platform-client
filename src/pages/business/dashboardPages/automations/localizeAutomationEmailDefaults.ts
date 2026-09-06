import { localizeBuiltInText } from "../../../../i18n/localizeBuiltInTemplateSeed";

type EmailDefaults = {
  subject?: string;
  html?: string;
  body?: string;
  text?: string;
};

/** Localize built-in automation email defaults for a new insert. Saved HTML wins later. */
export function localizeAutomationEmailDefaults<T extends EmailDefaults>(
  defaults: T,
  language?: string,
): T {
  return {
    ...defaults,
    ...(defaults.subject
      ? { subject: localizeBuiltInText(defaults.subject, language) }
      : {}),
    ...(defaults.html ? { html: localizeBuiltInText(defaults.html, language) } : {}),
    ...(defaults.body ? { body: localizeBuiltInText(defaults.body, language) } : {}),
    ...(defaults.text ? { text: localizeBuiltInText(defaults.text, language) } : {}),
  };
}
