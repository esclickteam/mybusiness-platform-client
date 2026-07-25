import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import GroomoraPages, { groomoraPages } from "./pages";
import GroomoraPreview from "./preview";
import GroomoraThumbnail from "./thumbnail";
import { groomoraEditorCss } from "./editorCss";
import { groomoraSchema } from "./schema";
import { groomoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#65A30D",
  secondary: "#F7FEE7",
  accent: "#BEF264",
  background: "#0C1208",
  surface: "#151F10",
  text: "#F7FEE7",
  muted: "#AAB894",
  dark: "#050805",
};

const blocks = [
  { type: "header", variant: "menGroom-header", title: "header" },
  { type: "hero", variant: "menGroom-hero", title: "hero" },
  { type: "servicesPreview", variant: "menGroom-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "menGroom-ritual", title: "ritual" },
  { type: "gallery", variant: "menGroom-gallery", title: "gallery" },
  { type: "team", variant: "menGroom-team", title: "team" },
  { type: "testimonials", variant: "menGroom-testimonials", title: "testimonials" },
  { type: "packages", variant: "menGroom-packages", title: "packages" },
  { type: "whyUs", variant: "menGroom-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "menGroom-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "menGroom-footer", title: "footer" },
  { type: "aboutHero", variant: "menGroom-aboutHero", title: "aboutHero" },
  { type: "story", variant: "menGroom-story", title: "story" },
  { type: "spaceTour", variant: "menGroom-spaceTour", title: "spaceTour" },
  { type: "values", variant: "menGroom-values", title: "values" },
  { type: "specialistsDeep", variant: "menGroom-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "menGroom-certifications", title: "certifications" },
  { type: "timeline", variant: "menGroom-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "menGroom-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "menGroom-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "menGroom-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "menGroom-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "menGroom-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "menGroom-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "menGroom-addons", title: "addons" },
  { type: "beforeAfter", variant: "menGroom-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "menGroom-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "menGroom-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "menGroom-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "menGroom-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "menGroom-booking", title: "booking" },
  { type: "servicePicker", variant: "menGroom-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "menGroom-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "menGroom-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "menGroom-policies", title: "policies" },
  { type: "confirmationForm", variant: "menGroom-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "menGroom-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "menGroom-bookingFaq", title: "bookingFaq" },
];

export const groomoraSeed = {
  id: "groomora",
  key: "groomora",
  name: "Groomora",
  title: "Groomora",
  description: "טיפוח גברים: עור, זקן, גבות ושגרת טיפול קצרה ומדויקת.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "men-grooming",
  layout: "full",
  image: (groomoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (groomoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (groomoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `groomora-${index + 1}-${block.type}`, ...block })),
  pages: groomoraPages,
  editor: { pages: groomoraPages, css: groomoraEditorCss },
  css: groomoraEditorCss,
  data: groomoraDefaultData,
  defaultData: groomoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const groomoraTemplate = {
  id: "groomora",
  key: "groomora",
  name: "Groomora",
  title: "Groomora",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "חדש",
  description: "טיפוח גברים: עור, זקן, גבות ושגרת טיפול קצרה ומדויקת.",
  thumbnail: React.createElement(GroomoraThumbnail),
  preview: React.createElement(GroomoraPreview),
  component: GroomoraPages,
  Component: GroomoraPages,
  seed: groomoraSeed,
  pages: groomoraPages,
  editorCss: groomoraEditorCss,
  schema: groomoraSchema,
  defaultData: groomoraDefaultData,
  renderer: {
    key: "groomora",
    name: "Groomora",
    Component: GroomoraPages,
    component: GroomoraPages,
    pages: groomoraPages,
    editorMode: "visual-react",
    editorCss: groomoraEditorCss,
    schema: groomoraSchema,
    defaultData: groomoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default groomoraTemplate;
