import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import MicroarchPages, { microarchPages } from "./pages";
import MicroarchPreview from "./preview";
import MicroarchThumbnail from "./thumbnail";
import { microarchEditorCss } from "./editorCss";
import { microarchSchema } from "./schema";
import { microarchDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#92400E",
  secondary: "#FEF3C7",
  accent: "#FCD34D",
  background: "#FFFBEB",
  surface: "#FFFFFF",
  text: "#451A03",
  muted: "#8B6B43",
  dark: "#261204",
};

const blocks = [
  { type: "header", variant: "microFeather-header", title: "header" },
  { type: "hero", variant: "microFeather-hero", title: "hero" },
  { type: "servicesPreview", variant: "microFeather-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "microFeather-ritual", title: "ritual" },
  { type: "gallery", variant: "microFeather-gallery", title: "gallery" },
  { type: "team", variant: "microFeather-team", title: "team" },
  { type: "testimonials", variant: "microFeather-testimonials", title: "testimonials" },
  { type: "packages", variant: "microFeather-packages", title: "packages" },
  { type: "whyUs", variant: "microFeather-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "microFeather-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "microFeather-footer", title: "footer" },
  { type: "aboutHero", variant: "microFeather-aboutHero", title: "aboutHero" },
  { type: "story", variant: "microFeather-story", title: "story" },
  { type: "spaceTour", variant: "microFeather-spaceTour", title: "spaceTour" },
  { type: "values", variant: "microFeather-values", title: "values" },
  { type: "specialistsDeep", variant: "microFeather-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "microFeather-certifications", title: "certifications" },
  { type: "timeline", variant: "microFeather-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "microFeather-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "microFeather-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "microFeather-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "microFeather-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "microFeather-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "microFeather-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "microFeather-addons", title: "addons" },
  { type: "beforeAfter", variant: "microFeather-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "microFeather-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "microFeather-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "microFeather-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "microFeather-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "microFeather-booking", title: "booking" },
  { type: "servicePicker", variant: "microFeather-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "microFeather-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "microFeather-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "microFeather-policies", title: "policies" },
  { type: "confirmationForm", variant: "microFeather-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "microFeather-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "microFeather-bookingFaq", title: "bookingFaq" },
];

export const microarchSeed = {
  id: "microarch",
  key: "microarch",
  name: "Microarch",
  title: "Microarch",
  description: "מיקרובליידינג טבעי: שערה-שערה, התאמת פיגמנט וביקורת החלמה.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "microblading",
  layout: "full",
  image: (microarchDefaultData as Record<string, any>).heroImage,
  heroTitle: (microarchDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (microarchDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `microarch-${index + 1}-${block.type}`, ...block })),
  pages: microarchPages,
  editor: { pages: microarchPages, css: microarchEditorCss },
  css: microarchEditorCss,
  data: microarchDefaultData,
  defaultData: microarchDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const microarchTemplate = {
  id: "microarch",
  key: "microarch",
  name: "Microarch",
  title: "Microarch",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "Premium",
  description: "מיקרובליידינג טבעי: שערה-שערה, התאמת פיגמנט וביקורת החלמה.",
  thumbnail: React.createElement(MicroarchThumbnail),
  preview: React.createElement(MicroarchPreview),
  component: MicroarchPages,
  Component: MicroarchPages,
  seed: microarchSeed,
  pages: microarchPages,
  editorCss: microarchEditorCss,
  schema: microarchSchema,
  defaultData: microarchDefaultData,
  renderer: {
    key: "microarch",
    name: "Microarch",
    Component: MicroarchPages,
    component: MicroarchPages,
    pages: microarchPages,
    editorMode: "visual-react",
    editorCss: microarchEditorCss,
    schema: microarchSchema,
    defaultData: microarchDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default microarchTemplate;
