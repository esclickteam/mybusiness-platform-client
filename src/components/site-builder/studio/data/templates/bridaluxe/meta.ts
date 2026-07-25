import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import BridaluxePages, { bridaluxePages } from "./pages";
import BridaluxePreview from "./preview";
import BridaluxeThumbnail from "./thumbnail";
import { bridaluxeEditorCss } from "./editorCss";
import { bridaluxeSchema } from "./schema";
import { bridaluxeDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#BE123C",
  secondary: "#FFF1F2",
  accent: "#FDA4AF",
  background: "#FFF7F8",
  surface: "#FFFFFF",
  text: "#4C0519",
  muted: "#9A6671",
  dark: "#28020B",
};

const blocks = [
  { type: "header", variant: "brideGlow-header", title: "header" },
  { type: "hero", variant: "brideGlow-hero", title: "hero" },
  { type: "servicesPreview", variant: "brideGlow-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "brideGlow-ritual", title: "ritual" },
  { type: "gallery", variant: "brideGlow-gallery", title: "gallery" },
  { type: "team", variant: "brideGlow-team", title: "team" },
  { type: "testimonials", variant: "brideGlow-testimonials", title: "testimonials" },
  { type: "packages", variant: "brideGlow-packages", title: "packages" },
  { type: "whyUs", variant: "brideGlow-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "brideGlow-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "brideGlow-footer", title: "footer" },
  { type: "aboutHero", variant: "brideGlow-aboutHero", title: "aboutHero" },
  { type: "story", variant: "brideGlow-story", title: "story" },
  { type: "spaceTour", variant: "brideGlow-spaceTour", title: "spaceTour" },
  { type: "values", variant: "brideGlow-values", title: "values" },
  { type: "specialistsDeep", variant: "brideGlow-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "brideGlow-certifications", title: "certifications" },
  { type: "timeline", variant: "brideGlow-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "brideGlow-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "brideGlow-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "brideGlow-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "brideGlow-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "brideGlow-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "brideGlow-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "brideGlow-addons", title: "addons" },
  { type: "beforeAfter", variant: "brideGlow-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "brideGlow-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "brideGlow-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "brideGlow-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "brideGlow-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "brideGlow-booking", title: "booking" },
  { type: "servicePicker", variant: "brideGlow-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "brideGlow-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "brideGlow-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "brideGlow-policies", title: "policies" },
  { type: "confirmationForm", variant: "brideGlow-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "brideGlow-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "brideGlow-bookingFaq", title: "bookingFaq" },
];

export const bridaluxeSeed = {
  id: "bridaluxe",
  key: "bridaluxe",
  name: "Bridaluxe",
  title: "Bridaluxe",
  description: "איפור כלות יוקרתי: ניסיון, יום אירוע, מלוות ותיק טאצ׳־אפ.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "bridal-makeup",
  layout: "full",
  image: (bridaluxeDefaultData as Record<string, any>).heroImage,
  heroTitle: (bridaluxeDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (bridaluxeDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `bridaluxe-${index + 1}-${block.type}`, ...block })),
  pages: bridaluxePages,
  editor: { pages: bridaluxePages, css: bridaluxeEditorCss },
  css: bridaluxeEditorCss,
  data: bridaluxeDefaultData,
  defaultData: bridaluxeDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const bridaluxeTemplate = {
  id: "bridaluxe",
  key: "bridaluxe",
  name: "Bridaluxe",
  title: "Bridaluxe",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "Premium",
  description: "איפור כלות יוקרתי: ניסיון, יום אירוע, מלוות ותיק טאצ׳־אפ.",
  thumbnail: React.createElement(BridaluxeThumbnail),
  preview: React.createElement(BridaluxePreview),
  component: BridaluxePages,
  Component: BridaluxePages,
  seed: bridaluxeSeed,
  pages: bridaluxePages,
  editorCss: bridaluxeEditorCss,
  schema: bridaluxeSchema,
  defaultData: bridaluxeDefaultData,
  renderer: {
    key: "bridaluxe",
    name: "Bridaluxe",
    Component: BridaluxePages,
    component: BridaluxePages,
    pages: bridaluxePages,
    editorMode: "visual-react",
    editorCss: bridaluxeEditorCss,
    schema: bridaluxeSchema,
    defaultData: bridaluxeDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default bridaluxeTemplate;
