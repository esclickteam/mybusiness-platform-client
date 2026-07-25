import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SugarosePages, { sugarosePages } from "./pages";
import SugarosePreview from "./preview";
import SugaroseThumbnail from "./thumbnail";
import { sugaroseEditorCss } from "./editorCss";
import { sugaroseSchema } from "./schema";
import { sugaroseDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#D97706",
  secondary: "#FFFBEB",
  accent: "#FDE68A",
  background: "#FFF8E6",
  surface: "#FFFFFF",
  text: "#4B2202",
  muted: "#936B35",
  dark: "#241003",
};

const blocks = [
  { type: "header", variant: "sugarWax-header", title: "header" },
  { type: "hero", variant: "sugarWax-hero", title: "hero" },
  { type: "servicesPreview", variant: "sugarWax-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "sugarWax-ritual", title: "ritual" },
  { type: "gallery", variant: "sugarWax-gallery", title: "gallery" },
  { type: "team", variant: "sugarWax-team", title: "team" },
  { type: "testimonials", variant: "sugarWax-testimonials", title: "testimonials" },
  { type: "packages", variant: "sugarWax-packages", title: "packages" },
  { type: "whyUs", variant: "sugarWax-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "sugarWax-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "sugarWax-footer", title: "footer" },
  { type: "aboutHero", variant: "sugarWax-aboutHero", title: "aboutHero" },
  { type: "story", variant: "sugarWax-story", title: "story" },
  { type: "spaceTour", variant: "sugarWax-spaceTour", title: "spaceTour" },
  { type: "values", variant: "sugarWax-values", title: "values" },
  { type: "specialistsDeep", variant: "sugarWax-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "sugarWax-certifications", title: "certifications" },
  { type: "timeline", variant: "sugarWax-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "sugarWax-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "sugarWax-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "sugarWax-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "sugarWax-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "sugarWax-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "sugarWax-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "sugarWax-addons", title: "addons" },
  { type: "beforeAfter", variant: "sugarWax-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "sugarWax-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "sugarWax-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "sugarWax-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "sugarWax-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "sugarWax-booking", title: "booking" },
  { type: "servicePicker", variant: "sugarWax-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "sugarWax-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "sugarWax-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "sugarWax-policies", title: "policies" },
  { type: "confirmationForm", variant: "sugarWax-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "sugarWax-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "sugarWax-bookingFaq", title: "bookingFaq" },
];

export const sugaroseSeed = {
  id: "sugarose",
  key: "sugarose",
  name: "Sugarose",
  title: "Sugarose",
  description: "הסרת שיער בסוכר ושעווה: טכניקה עדינה, סטריליות וקצב מהיר.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "sugaring-waxing",
  layout: "full",
  image: (sugaroseDefaultData as Record<string, any>).heroImage,
  heroTitle: (sugaroseDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (sugaroseDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `sugarose-${index + 1}-${block.type}`, ...block })),
  pages: sugarosePages,
  editor: { pages: sugarosePages, css: sugaroseEditorCss },
  css: sugaroseEditorCss,
  data: sugaroseDefaultData,
  defaultData: sugaroseDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const sugaroseTemplate = {
  id: "sugarose",
  key: "sugarose",
  name: "Sugarose",
  title: "Sugarose",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "חדש",
  description: "הסרת שיער בסוכר ושעווה: טכניקה עדינה, סטריליות וקצב מהיר.",
  thumbnail: React.createElement(SugaroseThumbnail),
  preview: React.createElement(SugarosePreview),
  component: SugarosePages,
  Component: SugarosePages,
  seed: sugaroseSeed,
  pages: sugarosePages,
  editorCss: sugaroseEditorCss,
  schema: sugaroseSchema,
  defaultData: sugaroseDefaultData,
  renderer: {
    key: "sugarose",
    name: "Sugarose",
    Component: SugarosePages,
    component: SugarosePages,
    pages: sugarosePages,
    editorMode: "visual-react",
    editorCss: sugaroseEditorCss,
    schema: sugaroseSchema,
    defaultData: sugaroseDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default sugaroseTemplate;
