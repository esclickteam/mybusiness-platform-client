import { HOME_ANSWERS } from "./homeAnswers.mjs";
import { STORY } from "./homepageStory.mjs";

export const HOME_FAQ_TITLE = Object.fromEntries(
  Object.entries(STORY).map(([locale, story]) => [locale, story.faqTitle]),
);

export const HOME_FAQ = Object.fromEntries(
  Object.entries(STORY).map(([locale, story]) => [
    locale,
    [...story.faq, ...(HOME_ANSWERS[locale] || HOME_ANSWERS.en)],
  ]),
);
