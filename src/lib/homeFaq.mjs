import { SHOWCASE } from "./homeShowcase.mjs";

export const HOME_FAQ_TITLE = Object.fromEntries(
  Object.entries(SHOWCASE).map(([locale, story]) => [locale, story.faqTitle]),
);

export const HOME_FAQ = Object.fromEntries(
  Object.entries(SHOWCASE).map(([locale, story]) => [locale, story.faq]),
);
