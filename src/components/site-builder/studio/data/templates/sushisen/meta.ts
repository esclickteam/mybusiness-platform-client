import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SushisenPages, { sushisenPages } from "./pages";
import SushisenPreview from "./preview";
import SushisenThumbnail from "./thumbnail";
import { sushisenEditorCss } from "./editorCss";
import { sushisenSchema } from "./schema";
import { sushisenDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#d4af37", secondary: "#9a958c", accent: "#d4af37",
  background: "#0b0b0b", surface: "#161616", text: "#f2f0ea", muted: "#9a958c", dark: "#050505",
};

export const sushisenSeed = {
  id: "sushisen", key: "sushisen", name: "Sushisen", title: "Sushisen",
  description: "תבנית סושי: הירו כמסוע נע עם ניגירי, מסילת מנות snap, מוני ספירה עם פעימת וואסבי וטופס לכה שחורה עם קו זהב — מינימליזם יפני עם תנועה.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "סושי · אומאקאסה", layout: "full",
  image: (sushisenDefaultData as any).heroImage,
  heroTitle: (sushisenDefaultData as any).heroTitle,
  heroSubtitle: (sushisenDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "minimal-thin-bar", title: "Minimal thin bar nav" },
    { type: "hero", variant: "conveyor-belt-scroll", title: "Conveyor belt hero" },
    { type: "nigiri", variant: "nigiri-snap-rail", title: "Nigiri snap rail" },
    { type: "process", variant: "zen-process", title: "Zen process" },
    { type: "gallery", variant: "zen-gallery", title: "Zen gallery" },
    { type: "reviews", variant: "zen-reviews", title: "Zen reviews" },
    { type: "stats", variant: "wasabi-pulse-stats", title: "Wasabi pulse stats" },
    { type: "cta", variant: "zen-home-cta", title: "Home CTA teaser" },
    { type: "omakasePage", variant: "omakase-full-menu", title: "Omakase full menu page" },
    { type: "nigiriPage", variant: "nigiri-story", title: "Nigiri story page" },
    { type: "about", variant: "zen-timeline-portrait", title: "Zen timeline + portrait" },
    { type: "contact", variant: "lacquer-reserve-faq", title: "Lacquer reserve + FAQ" },
    { type: "footer", variant: "thin-gold-line", title: "Thin gold footer" },
  ].map((b, i) => ({ id: `sushisen-${i+1}-${b.type}`, ...b })),
  pages: sushisenPages,
  editor: { pages: sushisenPages, css: sushisenEditorCss },
  css: sushisenEditorCss, data: sushisenDefaultData, defaultData: sushisenDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const sushisenTemplate = {
  id: "sushisen", key: "sushisen", name: "Sushisen", title: "Sushisen", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית סושי: הירו כמסוע נע עם ניגירי, מסילת מנות snap, מוני ספירה עם פעימת וואסבי וטופס לכה שחורה עם קו זהב — מינימליזם יפני עם תנועה.",
  thumbnail: React.createElement(SushisenThumbnail),
  preview: React.createElement(SushisenPreview),
  component: SushisenPages, Component: SushisenPages,
  seed: sushisenSeed, pages: sushisenPages, editorCss: sushisenEditorCss, schema: sushisenSchema, defaultData: sushisenDefaultData,
  renderer: {
    key: "sushisen", name: "Sushisen", Component: SushisenPages, component: SushisenPages, pages: sushisenPages,
    editorMode: "visual-react", editorCss: sushisenEditorCss, schema: sushisenSchema, defaultData: sushisenDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default sushisenTemplate;
