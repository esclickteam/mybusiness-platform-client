import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "he", "fr", "de", "es", "nl", "it"],
  defaultLocale: "en",
  localePrefix: "always"
});