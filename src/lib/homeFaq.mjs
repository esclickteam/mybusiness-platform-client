import { STORY } from "./homepageStory.mjs";

export const HOME_FAQ_TITLE = Object.fromEntries(
  Object.entries(STORY).map(([locale, story]) => [locale, story.faqTitle]),
);

export const HOME_FAQ = Object.fromEntries(
  Object.entries(STORY).map(([locale, story]) => [locale, story.faq]),
);
