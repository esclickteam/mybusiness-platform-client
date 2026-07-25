import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ClearskinPages, { clearskinPages } from "./pages";
import ClearskinPreview from "./preview";
import ClearskinThumbnail from "./thumbnail";
import { clearskinEditorCss } from "./editorCss";
import { clearskinSchema } from "./schema";
import { clearskinDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0891B2",
  secondary: "#ECFEFF",
  accent: "#67E8F9",
  background: "#F3FEFF",
  surface: "#FFFFFF",
  text: "#164E63",
  muted: "#5E8790",
  dark: "#083344",
};

const blocks = [
  { type: "header", variant: "acneClinic-header", title: "header" },
  { type: "hero", variant: "acneClinic-hero", title: "hero" },
  { type: "servicesPreview", variant: "acneClinic-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "acneClinic-ritual", title: "ritual" },
  { type: "gallery", variant: "acneClinic-gallery", title: "gallery" },
  { type: "team", variant: "acneClinic-team", title: "team" },
  { type: "testimonials", variant: "acneClinic-testimonials", title: "testimonials" },
  { type: "packages", variant: "acneClinic-packages", title: "packages" },
  { type: "whyUs", variant: "acneClinic-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "acneClinic-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "acneClinic-footer", title: "footer" },
  { type: "aboutHero", variant: "acneClinic-aboutHero", title: "aboutHero" },
  { type: "story", variant: "acneClinic-story", title: "story" },
  { type: "spaceTour", variant: "acneClinic-spaceTour", title: "spaceTour" },
  { type: "values", variant: "acneClinic-values", title: "values" },
  { type: "specialistsDeep", variant: "acneClinic-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "acneClinic-certifications", title: "certifications" },
  { type: "timeline", variant: "acneClinic-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "acneClinic-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "acneClinic-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "acneClinic-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "acneClinic-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "acneClinic-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "acneClinic-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "acneClinic-addons", title: "addons" },
  { type: "beforeAfter", variant: "acneClinic-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "acneClinic-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "acneClinic-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "acneClinic-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "acneClinic-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "acneClinic-booking", title: "booking" },
  { type: "servicePicker", variant: "acneClinic-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "acneClinic-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "acneClinic-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "acneClinic-policies", title: "policies" },
  { type: "confirmationForm", variant: "acneClinic-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "acneClinic-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "acneClinic-bookingFaq", title: "bookingFaq" },
];

export const clearskinSeed = {
  id: "clearskin",
  key: "clearskin",
  name: "Clearskin",
  title: "Clearskin",
  description: "קליניקה לאקנה וקוסמטיקה רפואית: אבחון, סדרות ומעקב.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "medical-acne-skincare",
  layout: "full",
  image: (clearskinDefaultData as Record<string, any>).heroImage,
  heroTitle: (clearskinDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (clearskinDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `clearskin-${index + 1}-${block.type}`, ...block })),
  pages: clearskinPages,
  editor: { pages: clearskinPages, css: clearskinEditorCss },
  css: clearskinEditorCss,
  data: clearskinDefaultData,
  defaultData: clearskinDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const clearskinTemplate = {
  id: "clearskin",
  key: "clearskin",
  name: "Clearskin",
  title: "Clearskin",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "Premium",
  description: "קליניקה לאקנה וקוסמטיקה רפואית: אבחון, סדרות ומעקב.",
  thumbnail: React.createElement(ClearskinThumbnail),
  preview: React.createElement(ClearskinPreview),
  component: ClearskinPages,
  Component: ClearskinPages,
  seed: clearskinSeed,
  pages: clearskinPages,
  editorCss: clearskinEditorCss,
  schema: clearskinSchema,
  defaultData: clearskinDefaultData,
  renderer: {
    key: "clearskin",
    name: "Clearskin",
    Component: ClearskinPages,
    component: ClearskinPages,
    pages: clearskinPages,
    editorMode: "visual-react",
    editorCss: clearskinEditorCss,
    schema: clearskinSchema,
    defaultData: clearskinDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default clearskinTemplate;
