import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import TacoflarePages, { tacoflarePages } from "./pages";
import TacoflarePreview from "./preview";
import TacoflareThumbnail from "./thumbnail";
import { tacoflareEditorCss } from "./editorCss";
import { tacoflareSchema } from "./schema";
import { tacoflareDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#e85d04", secondary: "#c49a7a", accent: "#e85d04",
  background: "#1a0e0a", surface: "#251610", text: "#fff3e8", muted: "#c49a7a", dark: "#0d0705",
};

export const tacoflareSeed = {
  id: "tacoflare", key: "tacoflare", name: "Tacoflare", title: "Tacoflare",
  description: "תבנית טאקוס: נייר צלופן מרפרף, מדף טאקו אופקי, צבעי צ׳ילי וטופס הזמנה בסגנון פתק שוק — אנרגיה רחוב לוהטת.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "מקסיקני · טאקו", layout: "full",
  image: (tacoflareDefaultData as any).heroImage,
  heroTitle: (tacoflareDefaultData as any).heroTitle,
  heroSubtitle: (tacoflareDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "papel-sticker-nav", title: "Papel sticker nav" },
    { type: "hero", variant: "papel-flutter-hero", title: "Papel flutter taco hero" },
    { type: "menu", variant: "flutter-taco-cards", title: "Flutter taco cards" },
    { type: "process", variant: "salsa-process", title: "Salsa process" },
    { type: "gallery", variant: "taco-gallery", title: "Taco gallery" },
    { type: "reviews", variant: "taco-reviews", title: "Taco reviews" },
    { type: "stats", variant: "chili-stats", title: "Chili stats + hours" },
    { type: "cta", variant: "taco-home-cta", title: "Home CTA teaser" },
    { type: "tacosPage", variant: "full-taco-menu", title: "Full taco menu page" },
    { type: "salsaPage", variant: "salsa-story", title: "Salsa story page" },
    { type: "about", variant: "plancha-timeline", title: "Plancha timeline" },
    { type: "contact", variant: "market-note-faq", title: "Market note reserve + FAQ" },
    { type: "footer", variant: "papel-tear", title: "Papel tear footer" },
  ].map((b, i) => ({ id: `tacoflare-${i+1}-${b.type}`, ...b })),
  pages: tacoflarePages,
  editor: { pages: tacoflarePages, css: tacoflareEditorCss },
  css: tacoflareEditorCss, data: tacoflareDefaultData, defaultData: tacoflareDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const tacoflareTemplate = {
  id: "tacoflare", key: "tacoflare", name: "Tacoflare", title: "Tacoflare", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית טאקוס: נייר צלופן מרפרף, מדף טאקו אופקי, צבעי צ׳ילי וטופס הזמנה בסגנון פתק שוק — אנרגיה רחוב לוהטת.",
  thumbnail: React.createElement(TacoflareThumbnail),
  preview: React.createElement(TacoflarePreview),
  component: TacoflarePages, Component: TacoflarePages,
  seed: tacoflareSeed, pages: tacoflarePages, editorCss: tacoflareEditorCss, schema: tacoflareSchema, defaultData: tacoflareDefaultData,
  renderer: {
    key: "tacoflare", name: "Tacoflare", Component: TacoflarePages, component: TacoflarePages, pages: tacoflarePages,
    editorMode: "visual-react", editorCss: tacoflareEditorCss, schema: tacoflareSchema, defaultData: tacoflareDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default tacoflareTemplate;
