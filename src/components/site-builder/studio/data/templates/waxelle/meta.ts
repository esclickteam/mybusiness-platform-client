import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import WaxellePages, { waxellePages } from "./pages";
import WaxellePreview from "./preview";
import WaxelleThumbnail from "./thumbnail";
import { waxelleEditorCss } from "./editorCss";
import { waxelleSchema } from "./schema";
import { waxelleDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#EA580C",
  secondary: "#FFF7ED",
  accent: "#FB923C",
  background: "#FFFBF5",
  surface: "#FFFFFF",
  text: "#431407",
  muted: "#9A6B4F",
  dark: "#1C0A04",
};

const blocks = [
  { type: "header", variant: "sandBloom-header", title: "header" },
  { type: "hero", variant: "sandBloom-hero", title: "hero" },
  { type: "servicesPreview", variant: "sandBloom-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "sandBloom-ritual", title: "ritual" },
  { type: "gallery", variant: "sandBloom-gallery", title: "gallery" },
  { type: "team", variant: "sandBloom-team", title: "team" },
  { type: "testimonials", variant: "sandBloom-testimonials", title: "testimonials" },
  { type: "packages", variant: "sandBloom-packages", title: "packages" },
  { type: "whyUs", variant: "sandBloom-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "sandBloom-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "sandBloom-footer", title: "footer" },
  { type: "aboutHero", variant: "sandBloom-aboutHero", title: "aboutHero" },
  { type: "story", variant: "sandBloom-story", title: "story" },
  { type: "spaceTour", variant: "sandBloom-spaceTour", title: "spaceTour" },
  { type: "values", variant: "sandBloom-values", title: "values" },
  { type: "specialistsDeep", variant: "sandBloom-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "sandBloom-certifications", title: "certifications" },
  { type: "timeline", variant: "sandBloom-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "sandBloom-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "sandBloom-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "sandBloom-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "sandBloom-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "sandBloom-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "sandBloom-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "sandBloom-addons", title: "addons" },
  { type: "beforeAfter", variant: "sandBloom-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "sandBloom-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "sandBloom-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "sandBloom-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "sandBloom-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "sandBloom-booking", title: "booking" },
  { type: "servicePicker", variant: "sandBloom-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "sandBloom-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "sandBloom-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "sandBloom-policies", title: "policies" },
  { type: "confirmationForm", variant: "sandBloom-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "sandBloom-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "sandBloom-bookingFaq", title: "bookingFaq" },
];

export const waxelleSeed = {
  id: "waxelle",
  key: "waxelle",
  name: "Waxelle",
  title: "Waxelle",
  description: "סטודיו שעווה נקי וידידותי: מחירון ברור, מדריך משך, ומערכת תורים.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "waxing-studio",
  layout: "full",
  image: (waxelleDefaultData as Record<string, any>).heroImage,
  heroTitle: (waxelleDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (waxelleDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `waxelle-${index + 1}-${block.type}`, ...block })),
  pages: waxellePages,
  editor: { pages: waxellePages, css: waxelleEditorCss },
  css: waxelleEditorCss,
  data: waxelleDefaultData,
  defaultData: waxelleDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const waxelleTemplate = {
  id: "waxelle",
  key: "waxelle",
  name: "Waxelle",
  title: "Waxelle",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "חדש",
  description: "סטודיו שעווה נקי וידידותי: מחירון ברור, מדריך משך, ומערכת תורים.",
  thumbnail: React.createElement(WaxelleThumbnail),
  preview: React.createElement(WaxellePreview),
  component: WaxellePages,
  Component: WaxellePages,
  seed: waxelleSeed,
  pages: waxellePages,
  editorCss: waxelleEditorCss,
  schema: waxelleSchema,
  defaultData: waxelleDefaultData,
  renderer: {
    key: "waxelle",
    name: "Waxelle",
    Component: WaxellePages,
    component: WaxellePages,
    pages: waxellePages,
    editorMode: "visual-react",
    editorCss: waxelleEditorCss,
    schema: waxelleSchema,
    defaultData: waxelleDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default waxelleTemplate;
