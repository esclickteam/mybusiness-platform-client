/** Full guide articles. Prices and product limits match the shipped marketing facts. */

import { installRemainingGuides } from "./guidesRichRest.mjs";
import { installMoreGuides } from "./guidesRichMore.mjs";
import { installFinalGuides } from "./guidesRichFinal.mjs";
import { installLastGuides } from "./guidesRichLast.mjs";
import { applyGuideDepth } from "./guidesRichDepth.mjs";

const LOCALES = ["en", "he", "es", "pt-BR", "ar"];

function t(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function article(spec) {
  const byLocale = {};
  for (const locale of LOCALES) {
    byLocale[locale] = {
      title: spec.title[locale],
      description: spec.description[locale],
      h1: spec.h1[locale],
      lede: spec.lede[locale],
      updated: "2026-10-24",
      related: spec.related,
      faq: spec.faq.map(([question, answer]) => [question[locale], answer[locale]]),
      sections: spec.sections.map((section) => ({
        id: section.id,
        heading: section.heading[locale],
        paragraphs: (section.paragraphs || []).map((paragraph) => paragraph[locale]),
        steps: section.steps?.map((step) => step[locale]),
        example: section.example
          ? { title: section.example.title[locale], body: section.example.body[locale] }
          : undefined,
        mistakes: section.mistakes?.map((item) => ({ problem: item.problem[locale], fix: item.fix[locale] })),
        table: section.table
          ? {
              columns: section.table.columns.map((column) => column[locale]),
              rows: section.table.rows.map((row) => row.map((cell) => cell[locale])),
            }
          : undefined,
        figure: section.figure,
        video: section.video,
        videoNote: section.videoNote?.[locale],
      })),
    };
  }
  return byLocale;
}

const ARTICLES = {};

function add(slug, spec) {
  ARTICLES[slug] = article(spec);
}

installRemainingGuides(add, t);
installMoreGuides(add, t);
installFinalGuides(add, t);
installLastGuides(add, t);
applyGuideDepth(ARTICLES);

export function getRichGuide(slug, locale) {
  const pack = ARTICLES[slug];
  if (!pack) return null;
  return pack[locale] || pack.en;
}

export const RICH_GUIDE_SLUGS = Object.keys(ARTICLES);
