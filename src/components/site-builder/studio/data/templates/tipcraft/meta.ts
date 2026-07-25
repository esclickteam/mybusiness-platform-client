import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import TipcraftPages, { tipcraftPages } from "./pages";
import TipcraftPreview from "./preview";
import TipcraftThumbnail from "./thumbnail";
import { tipcraftEditorCss } from "./editorCss";
import { tipcraftSchema } from "./schema";
import { tipcraftDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#7C3AED",
  secondary: "#F5F3FF",
  accent: "#C4B5FD",
  background: "#FAF8FF",
  surface: "#FFFFFF",
  text: "#2E1065",
  muted: "#76639B",
  dark: "#160A35",
};

const blocks = [
  { type: "header", variant: "architectNails-header", title: "header" },
  { type: "hero", variant: "architectNails-hero", title: "hero" },
  { type: "servicesPreview", variant: "architectNails-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "architectNails-ritual", title: "ritual" },
  { type: "gallery", variant: "architectNails-gallery", title: "gallery" },
  { type: "team", variant: "architectNails-team", title: "team" },
  { type: "testimonials", variant: "architectNails-testimonials", title: "testimonials" },
  { type: "packages", variant: "architectNails-packages", title: "packages" },
  { type: "whyUs", variant: "architectNails-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "architectNails-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "architectNails-footer", title: "footer" },
  { type: "aboutHero", variant: "architectNails-aboutHero", title: "aboutHero" },
  { type: "story", variant: "architectNails-story", title: "story" },
  { type: "spaceTour", variant: "architectNails-spaceTour", title: "spaceTour" },
  { type: "values", variant: "architectNails-values", title: "values" },
  { type: "specialistsDeep", variant: "architectNails-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "architectNails-certifications", title: "certifications" },
  { type: "timeline", variant: "architectNails-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "architectNails-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "architectNails-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "architectNails-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "architectNails-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "architectNails-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "architectNails-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "architectNails-addons", title: "addons" },
  { type: "beforeAfter", variant: "architectNails-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "architectNails-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "architectNails-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "architectNails-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "architectNails-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "architectNails-booking", title: "booking" },
  { type: "servicePicker", variant: "architectNails-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "architectNails-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "architectNails-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "architectNails-policies", title: "policies" },
  { type: "confirmationForm", variant: "architectNails-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "architectNails-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "architectNails-bookingFaq", title: "bookingFaq" },
];

export const tipcraftSeed = {
  id: "tipcraft",
  key: "tipcraft",
  name: "Tipcraft",
  title: "Tipcraft",
  description: "בונת ציפורניים מקצועית: מבנה אנטומי, מילוי, תיקונים וגלריית עבודות.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "nail-builder",
  layout: "full",
  image: (tipcraftDefaultData as Record<string, any>).heroImage,
  heroTitle: (tipcraftDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (tipcraftDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `tipcraft-${index + 1}-${block.type}`, ...block })),
  pages: tipcraftPages,
  editor: { pages: tipcraftPages, css: tipcraftEditorCss },
  css: tipcraftEditorCss,
  data: tipcraftDefaultData,
  defaultData: tipcraftDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const tipcraftTemplate = {
  id: "tipcraft",
  key: "tipcraft",
  name: "Tipcraft",
  title: "Tipcraft",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "Premium",
  description: "בונת ציפורניים מקצועית: מבנה אנטומי, מילוי, תיקונים וגלריית עבודות.",
  thumbnail: React.createElement(TipcraftThumbnail),
  preview: React.createElement(TipcraftPreview),
  component: TipcraftPages,
  Component: TipcraftPages,
  seed: tipcraftSeed,
  pages: tipcraftPages,
  editorCss: tipcraftEditorCss,
  schema: tipcraftSchema,
  defaultData: tipcraftDefaultData,
  renderer: {
    key: "tipcraft",
    name: "Tipcraft",
    Component: TipcraftPages,
    component: TipcraftPages,
    pages: tipcraftPages,
    editorMode: "visual-react",
    editorCss: tipcraftEditorCss,
    schema: tipcraftSchema,
    defaultData: tipcraftDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default tipcraftTemplate;
